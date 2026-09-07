# AgendaPro — Flujo de navegación actual

## Flujo principal

```text
Inicio / Mis eventos
├── Crear nuevo evento
│   └── Guardar en Supabase
│       └── Abrir Detalle con el ID real
└── Seleccionar evento existente
    └── Abrir Detalle con el ID real

Detalle del evento
└── Consultar evento y actividades
    └── Agregar actividades
        └── Revisar agenda ordenada por hora
            └── Confirmar agenda
                └── Backend actualiza Supabase
                    └── Backend devuelve folio y estado
                        └── Pantalla de confirmación
```

## Navegación y operaciones

| Pantalla | Entrada | Acción principal | Backend | Salida |
|---|---|---|---|---|
| Mis eventos | URL pública | Crear o seleccionar evento | `GET /api/listar-eventos` | Crear evento o abrir detalle |
| Crear evento | Botón “Crear nuevo evento” | Completar y guardar formulario | `POST /api/crear-evento` | Detalle con el ID devuelto |
| Detalle | `detalle-evento.html?id=<id>` | Consultar y agregar actividades | `GET /api/obtener-evento`, `POST /api/crear-actividad` | Agenda actualizada |
| Revisión | Detalle con actividades | Confirmar agenda | `POST /api/confirmar-agenda` | Respuesta con folio y estado |
| Confirmación | Respuesta temporal del backend | Consultar resultado | Sin segunda consulta | Volver a eventos o al detalle |

## Transferencia de la confirmación

```text
POST /api/confirmar-agenda
→ Supabase guarda folio, estado Confirmada y confirmado_en
→ el backend devuelve el resultado
→ detalle-evento.html guarda temporalmente esa respuesta en sessionStorage
→ confirmacion.html muestra esa misma respuesta
```

La pantalla final no consulta nuevamente Supabase ni otro endpoint para obtener
el folio o el estado.

## Estados alternativos

- Sin eventos: se ofrece crear el primero.
- ID inválido o evento inexistente: se ofrece volver a Mis eventos.
- Sin actividades: se permite agregar la primera y no se habilita la
  confirmación.
- Evento confirmado: se muestran folio y estado, y no se confirma
  automáticamente otra vez.
- Confirmación no disponible en la sesión: la pantalla final ofrece volver a
  Mis eventos.
- Error de red o backend: se muestra un mensaje amigable sin detalles internos.

## Chatbot de ayuda

El widget “¿Necesitas ayuda?” está disponible en todas las pantallas públicas:

- `index.html`
- `crear-evento.html`
- `detalle-evento.html`
- `confirmacion.html`

El widget se abre sin abandonar el flujo actual y consulta únicamente
`POST /api/chat-agendapro`. Sus respuestas se basan en conocimiento curado de
AgendaPro y su historial dura solamente mientras la página permanece abierta.
