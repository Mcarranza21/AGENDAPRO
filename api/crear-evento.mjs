const SUPABASE_URL = 'https://ylcekcftspapmjfshxpj.supabase.co';

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

  try {
    const body = typeof request.body === 'string'
      ? JSON.parse(request.body)
      : request.body;

    const fields = [
      'nombre_evento',
      'fecha_evento',
      'lugar_evento',
      'nombre_responsable',
      'telefono_responsable'
    ];
    const missingFields = fields.filter((field) => !body?.[field]);

    if (missingFields.length > 0) {
      return response.status(400).json({
        error: 'Missing required fields',
        fields: missingFields
      });
    }

    const newEvent = Object.fromEntries(
      fields.map((field) => [field, body[field]])
    );

    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/eventos`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(newEvent)
    });

    const result = await supabaseResponse.json().catch(() => null);

    if (!supabaseResponse.ok) {
      return response.status(supabaseResponse.status).json({
        error: result ?? 'Supabase write failed'
      });
    }

    return response.status(201).json({
      message: 'Evento guardado correctamente',
      event: result?.[0] ?? newEvent
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
