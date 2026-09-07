const SUPABASE_URL = 'https://ylcekcftspapmjfshxpj.supabase.co';

class SupabaseRequestError extends Error {
  constructor(status) {
    super('Supabase request failed');
    this.status = status;
  }
}

async function getEvents(serviceKey) {
  const fields = [
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
  const supabaseResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/eventos?select=${fields}&order=fecha_evento.asc.nullslast,id.asc`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const result = await supabaseResponse.json().catch(() => null);

  if (!supabaseResponse.ok) {
    throw new SupabaseRequestError(supabaseResponse.status);
  }

  if (!Array.isArray(result)) {
    throw new Error('Invalid Supabase response');
  }

  return result;
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!serviceKey) {
    return response.status(500).json({
      error: 'Server configuration error'
    });
  }

  try {
    const events = await getEvents(serviceKey);
    return response.status(200).json({ events });
  } catch (error) {
    if (error instanceof SupabaseRequestError) {
      return response.status(502).json({
        error: 'Events service is temporarily unavailable'
      });
    }

    return response.status(500).json({
      error: 'Unexpected event listing error'
    });
  }
}
