const SUPABASE_URL = 'https://ylcekcftspapmjfshxpj.supabase.co';

class SupabaseRequestError extends Error {
  constructor(status, details) {
    super('Supabase request failed');
    this.status = status;
    this.details = details;
  }
}

async function supabaseRequest(path, serviceKey) {
  const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json'
    }
  });

  const result = await supabaseResponse.json().catch(() => null);

  if (!supabaseResponse.ok) {
    throw new SupabaseRequestError(supabaseResponse.status, result);
  }

  return result;
}

function parseEventId(value) {
  if (Array.isArray(value)) return null;

  if (typeof value === 'number') {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }

  if (typeof value === 'string' && /^[1-9]\d*$/.test(value.trim())) {
    const parsedValue = Number(value.trim());
    return Number.isSafeInteger(parsedValue) ? parsedValue : null;
  }

  return null;
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!serviceKey) {
    return response.status(500).json({
      error: 'SUPABASE_SERVICE_KEY is not configured'
    });
  }

  const eventId = parseEventId(request.query?.id);

  if (!eventId) {
    return response.status(400).json({
      error: 'id must be a positive integer'
    });
  }

  try {
    const eventFields = [
      'id',
      'nombre_evento',
      'fecha_evento',
      'lugar_evento',
      'nombre_responsable',
      'telefono_responsable',
      'folio',
      'estado',
      'confirmado_en'
    ].join(',');
    const events = await supabaseRequest(
      `eventos?select=${eventFields}&id=eq.${eventId}&limit=1`,
      serviceKey
    );
    const event = events?.[0];

    if (!event) {
      return response.status(404).json({ error: 'Event not found' });
    }

    const activityFields = [
      'id',
      'hora',
      'descripcion_actividad',
      'responsable',
      'evento_id'
    ].join(',');
    const activities = await supabaseRequest(
      `actividades?select=${activityFields}&evento_id=eq.${eventId}&order=hora.asc,id.asc`,
      serviceKey
    );

    return response.status(200).json({
      event,
      activities: Array.isArray(activities) ? activities : []
    });
  } catch (error) {
    if (error instanceof SupabaseRequestError) {
      return response.status(502).json({
        error: 'Supabase request failed',
        details: error.details
      });
    }

    return response.status(500).json({
      error: 'Unexpected event lookup error'
    });
  }
}
