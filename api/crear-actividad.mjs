const SUPABASE_URL = 'https://ylcekcftspapmjfshxpj.supabase.co';

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

function parseEventId(value) {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }

  if (typeof value === 'string' && /^[1-9]\d*$/.test(value.trim())) {
    const parsedValue = Number(value.trim());
    return Number.isSafeInteger(parsedValue) ? parsedValue : null;
  }

  return null;
}

function requiredText(value) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null;
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

  const eventId = parseEventId(body?.evento_id);
  const hora = requiredText(body?.hora);
  const description = requiredText(body?.descripcion_actividad);
  const responsible = requiredText(body?.responsable);
  const missingFields = [];

  if (body?.evento_id === undefined || body?.evento_id === null || body?.evento_id === '') {
    missingFields.push('evento_id');
  }
  if (!hora) missingFields.push('hora');
  if (!description) missingFields.push('descripcion_actividad');
  if (!responsible) missingFields.push('responsable');

  if (missingFields.length > 0) {
    return response.status(400).json({
      error: 'Missing required fields',
      fields: missingFields
    });
  }

  if (!eventId) {
    return response.status(400).json({
      error: 'evento_id must be a positive integer'
    });
  }

  try {
    const events = await supabaseRequest(
      `eventos?select=id&id=eq.${eventId}&limit=1`,
      serviceKey
    );

    if (!events?.[0]) {
      return response.status(404).json({ error: 'Event not found' });
    }

    const newActivity = {
      evento_id: eventId,
      hora,
      descripcion_actividad: description,
      responsable: responsible
    };
    const activities = await supabaseRequest(
      'actividades',
      serviceKey,
      {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(newActivity)
      }
    );
    const activity = activities?.[0];

    if (!activity) {
      return response.status(502).json({
        error: 'Supabase did not return the created activity'
      });
    }

    return response.status(201).json({
      message: 'Actividad guardada correctamente',
      activity
    });
  } catch (error) {
    if (error instanceof SupabaseRequestError) {
      return response.status(502).json({
        error: 'Supabase request failed',
        details: error.details
      });
    }

    return response.status(500).json({
      error: 'Unexpected activity creation error'
    });
  }
}
