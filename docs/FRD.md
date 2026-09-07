# AgendaPro — Documento de Requisitos Funcionales

## Alcance actual

AgendaPro permite crear eventos, asociarles actividades, revisar su agenda y
confirmarla. La información se almacena en Supabase mediante funciones
serverless. El producto incluye además un chatbot grounded que responde sobre
las funciones reales de AgendaPro.

## 1. Mis eventos

### Objetivo

Servir como entrada al producto y permitir crear un evento o continuar con uno
existente.

### Datos mostrados

- Nombre del evento.
- Fecha.
- Lugar.
- Responsable.
- Estado; cuando no existe un valor persistido, se presenta visualmente como
  `Borrador`.

### Acciones

- Abrir `crear-evento.html`.
- Seleccionar un evento y abrir `detalle-evento.html?id=<id>` con su ID real.
- Abrir el chatbot de ayuda.

### Backend

- `GET /api/listar-eventos`

### Estados y errores

- Mientras carga se muestra “Cargando eventos…”.
- Si no hay eventos, se ofrece crear el primero.
- Si falla la consulta, se muestra un error amigable sin detalles de Supabase.

## 2. Crear evento

### Objetivo

Registrar un evento nuevo y continuar inmediatamente con la construcción de su
agenda.

### Datos solicitados

- Nombre del evento.
- Fecha.
- Lugar.
- Nombre del responsable.
- Teléfono del responsable.

### Acciones

- Enviar el formulario.
- Volver a Mis eventos.
- Abrir el chatbot de ayuda.

### Backend

- `POST /api/crear-evento`

El backend inserta el evento en Supabase y devuelve su representación, incluido
el ID generado. El navegador valida ese ID y redirige a
`detalle-evento.html?id=<id-real>`.

### Estados y errores

- El botón se deshabilita y muestra “Creando evento…” durante el envío.
- Se evitan envíos duplicados.
- Si la creación falla o la respuesta no incluye un ID válido, no se redirige y
  se muestra un mensaje amigable.

## 3. Detalle y revisión del evento

### Objetivo

Mostrar la información real del evento, administrar la incorporación de
actividades y permitir revisar la agenda antes de confirmarla.

### Datos mostrados

- Nombre, fecha y lugar del evento.
- Nombre y teléfono del responsable.
- Estado y folio, cuando existen.
- Actividades asociadas, ordenadas por hora.
- Hora, descripción y responsable de cada actividad.

### Acciones

- Agregar una actividad.
- Confirmar una agenda que tenga al menos una actividad.
- Volver a Mis eventos.
- Abrir el chatbot de ayuda.

### Backend

- `GET /api/obtener-evento?id=<id>` obtiene el evento y sus actividades.
- `POST /api/crear-actividad` guarda una actividad asociada mediante
  `evento_id`.
- `POST /api/confirmar-agenda` confirma la agenda.

### Estados y errores

- Se distinguen ID inválido, evento inexistente y error de consulta.
- Una agenda sin actividades muestra su estado vacío y mantiene deshabilitada
  la confirmación.
- Durante el alta de una actividad o la confirmación, el botón correspondiente
  queda deshabilitado para evitar dobles envíos.
- Los errores se presentan sin datos internos de Supabase.
- Si el evento ya tiene folio y estado `Confirmada`, ambos se muestran y el
  botón indica “Agenda confirmada” sin repetir automáticamente la operación.

## 4. Confirmación

### Objetivo

Mostrar el resultado de una confirmación completada.

### Flujo transaccional

```text
detalle-evento.html
→ POST /api/confirmar-agenda
→ actualización del evento en Supabase
→ respuesta con folio, estado y resumen
→ almacenamiento temporal de esa respuesta en sessionStorage
→ confirmacion.html
```

El backend comprueba que el evento exista y tenga al menos una actividad. Al
confirmar, guarda un folio único, el estado `Confirmada` y la fecha/hora de
confirmación. Si el evento ya estaba confirmado, devuelve la confirmación
existente sin generar otro folio.

### Datos mostrados

- Mensaje de éxito.
- Folio.
- Estado.
- Nombre, fecha, lugar y responsable del evento.
- Número de actividades.
- Fecha y hora de confirmación.

### Acciones

- Volver a Mis eventos.
- Volver al detalle del evento.
- Abrir el chatbot de ayuda.

### Fuente de los datos

`confirmacion.html` muestra exclusivamente la respuesta recibida de
`POST /api/confirmar-agenda`, transferida mediante `sessionStorage`. La pantalla
no vuelve a consultar Supabase ni llama a un endpoint para buscar el folio o el
estado.

### Estados y errores

- Si no existe una confirmación en la sesión, se muestra “No hay una
  confirmación disponible” y un enlace a Mis eventos.

## 5. Chatbot de ayuda

### Objetivo

Ayudar al usuario a entender las funciones disponibles de AgendaPro sin
presentar capacidades inexistentes.

### Datos mostrados

- Mensaje inicial.
- Preguntas sugeridas.
- Preguntas realizadas durante la página actual.
- Respuestas breves y grounded en la base curada de AgendaPro.

### Acciones

- Abrir y cerrar el widget.
- Seleccionar una pregunta sugerida.
- Escribir y enviar una pregunta.
- Enviar con Enter.

### Backend

- `POST /api/chat-agendapro`

El navegador envía únicamente la pregunta. La función serverless agrega las
instrucciones y la base curada, y llama a Gemini con una clave disponible solo
en el servidor.

### Estados y errores

- Durante la respuesta se muestra “Pensando…” y se bloquean envíos duplicados.
- Ante un error se muestra un mensaje amigable sin información del proveedor.
- El historial solo existe mientras permanece abierta la página; no se guarda
  en Supabase ni entre dispositivos.
- Si la base no contiene la respuesta, el asistente indica que no tiene esa
  información para la versión actual.

## Estados reconocidos

| Estado | Uso actual |
|---|---|
| `Borrador` | Representación visual de un evento todavía no confirmado. |
| `Confirmada` | Agenda confirmada con folio y fecha/hora de confirmación. |
| `Publicada` | Estado reconocido, sin acción pública actual para asignarlo. |
| `Finalizada` | Estado reconocido, sin acción pública actual para asignarlo. |

El flujo público de confirmación deja la agenda en estado `Confirmada`.

## Fuera del alcance actual

- Autenticación y cuentas.
- Pagos.
- Integración operativa con Google Calendar.
- Edición y eliminación de actividades.
- Panel administrativo público.
- Cambio público manual a `Publicada` o `Finalizada`.
