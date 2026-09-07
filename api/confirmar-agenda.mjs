const SUPABASE_URL = 'https://ylcekcftspapmjfshxpj.supabase.co';
const CONFIRMED_STATUS = 'Confirmada';
const MAX_FOLIO_ATTEMPTS = 5;

class SupabaseRequestError extends Error {
  constructor(status, details) {
    super('Supabase request failed');
    this.status = status;
    this.details = details;
  }
}

async function supabaseRequest(path, serviceKey, options = {}) {
  const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const result = await supabaseResponse.json().catch(() => null);

  if (!supabaseResponse.ok) {
    throw new SupabaseRequestError(supabaseResponse.status, result);
  }

  return result;
}

async function getEvent(eventId, serviceKey) {
  const fields = [
    'id',
    'nombre_evento',
    'fecha_evento',
    'lugar_evento',
    'nombre_responsable',
    'folio',
    'estado',
    'confirmado_en'
  ].join(',');
  const events = await supabaseRequest(
    `eventos?select=${fields}&id=eq.${eventId}&limit=1`,
    serviceKey
  );

  return events?.[0] ?? null;
}

async function getActivityCount(eventId, serviceKey) {
  const activities = await supabaseRequest(
    `actividades?select=id&evento_id=eq.${eventId}`,
    serviceKey
  );

  return Array.isArray(activities) ? activities.length : 0;
}

async function generateFolio(serviceKey) {
  const year = new Date().getUTCFullYear();
  const prefix = `AGP-${year}-`;
  const folios = await supabaseRequest(
    `eventos?select=folio&folio=like.${encodeURIComponent(`${prefix}*`)}&order=folio.desc&limit=1`,
    serviceKey
  );
  const lastFolio = folios?.[0]?.folio;
  const lastNumber = typeof lastFolio === 'string'
    ? Number.parseInt(lastFolio.slice(prefix.length), 10)
    : 0;
  const nextNumber = Number.isSafeInteger(lastNumber) ? lastNumber + 1 : 1;

  return `${prefix}${String(nextNumber).padStart(4, '0')}`;
}

async function saveConfirmation(eventId, folio, confirmedAt, serviceKey) {
  return supabaseRequest(
    `eventos?id=eq.${eventId}&folio=is.null`,
    serviceKey,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        folio,
        estado: CONFIRMED_STATUS,
        confirmado_en: confirmedAt
      })
    }
  );
}

async function finishExistingFolio(event, serviceKey) {
  if (event.estado === CONFIRMED_STATUS) return event;

  const confirmedAt = event.confirmado_en || new Date().toISOString();
  const updatedEvents = await supabaseRequest(
    `eventos?id=eq.${event.id}&folio=eq.${encodeURIComponent(event.folio)}`,
    serviceKey,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        estado: CONFIRMED_STATUS,
        confirmado_en: confirmedAt
      })
    }
  );

  return updatedEvents?.[0] ?? getEvent(event.id, serviceKey);
}

function buildResponse(event, activityCount) {
  return {
    event_id: event.id,
    nombre_evento: event.nombre_evento,
    fecha_evento: event.fecha_evento,
    lugar_evento: event.lugar_evento,
    nombre_responsable: event.nombre_responsable,
    numero_actividades: activityCount,
    folio: event.folio,
    estado: event.estado,
    confirmado_en: event.confirmado_en
  };
}

function parseEventId(body) {
  const rawEventId = body?.event_id ?? body?.id;

  if (typeof rawEventId === 'number') {
    return Number.isSafeInteger(rawEventId) && rawEventId > 0
      ? rawEventId
      : null;
  }

  if (typeof rawEventId === 'string' && /^[1-9]\d*$/.test(rawEventId.trim())) {
    const parsedEventId = Number(rawEventId.trim());
    return Number.isSafeInteger(parsedEventId) ? parsedEventId : null;
  }

  return null;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!serviceKey) {
    return response.status(500).json({
      error: 'SUPABASE_SERVICE_KEY is not configured'
    });
  }

  let body;
  try {
    body = typeof request.body === 'string'
      ? JSON.parse(request.body)
      : request.body;
  } catch {
    return response.status(400).json({ error: 'Invalid JSON body' });
  }

  const eventId = parseEventId(body);
  if (!eventId) {
    return response.status(400).json({
      error: 'event_id must be a positive integer'
    });
  }

  try {
    let event = await getEvent(eventId, serviceKey);

    if (!event) {
      return response.status(404).json({ error: 'Event not found' });
    }

    const activityCount = await getActivityCount(eventId, serviceKey);

    // An existing confirmation is returned unchanged, making retries idempotent.
    if (event.folio && event.estado === CONFIRMED_STATUS) {
      return response.status(200).json(buildResponse(event, activityCount));
    }

    if (activityCount < 1) {
      return response.status(422).json({
        error: 'The event must have at least one activity before confirmation'
      });
    }

    // Preserve an existing folio if a previous attempt assigned it but did not
    // finish setting the confirmation status.
    if (event.folio) {
      event = await finishExistingFolio(event, serviceKey);
      return response.status(200).json(buildResponse(event, activityCount));
    }

    for (let attempt = 0; attempt < MAX_FOLIO_ATTEMPTS; attempt += 1) {
      const folio = await generateFolio(serviceKey);

      try {
        const updatedEvents = await saveConfirmation(
          eventId,
          folio,
          new Date().toISOString(),
          serviceKey
        );

        if (updatedEvents?.[0]) {
          return response.status(200).json(
            buildResponse(updatedEvents[0], activityCount)
          );
        }

        // Another request may have confirmed this same event first.
        event = await getEvent(eventId, serviceKey);
        if (event?.folio && event.estado === CONFIRMED_STATUS) {
          return response.status(200).json(buildResponse(event, activityCount));
        }
      } catch (error) {
        // A concurrent confirmation for another event may claim the candidate
        // folio first. The unique index rejects it and a fresh folio is tried.
        if (!(error instanceof SupabaseRequestError) || error.status !== 409) {
          throw error;
        }
      }
    }

    return response.status(409).json({
      error: 'A unique folio could not be assigned; please try again'
    });
  } catch (error) {
    if (error instanceof SupabaseRequestError) {
      return response.status(502).json({
        error: 'Supabase request failed',
        details: error.details
      });
    }

    return response.status(500).json({
      error: 'Unexpected confirmation error'
    });
  }
}
