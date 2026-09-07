# AgendaPro

AgendaPro es una aplicación web para crear, organizar y confirmar agendas de
eventos. Centraliza la información general de cada evento y sus actividades,
permite revisar el orden del programa y genera un folio al confirmar la agenda.

## Público objetivo

- Organizadores de eventos que necesitan estructurar programas con rapidez.
- Encargados de protocolo que requieren horarios y responsables claros.
- Coordinadores que necesitan consultar quién está a cargo de cada actividad.

## Producto público

AgendaPro está disponible en:

<https://agendapro-pearl.vercel.app>

## Flujo principal

```text
Mis eventos
→ crear un evento o seleccionar uno existente
→ agregar actividades
→ revisar la agenda
→ confirmar
→ recibir un folio y un estado
```

Los eventos utilizan el ID real generado por Supabase. Cada actividad queda
asociada a su evento y la agenda debe tener al menos una actividad antes de
poder confirmarse.

## Funciones disponibles

- Consultar los eventos reales guardados en Supabase.
- Crear un evento con nombre, fecha, lugar, responsable y teléfono.
- Abrir el detalle de un evento mediante su ID.
- Agregar actividades con hora, descripción y responsable.
- Mostrar las actividades ordenadas por hora.
- Revisar y confirmar una agenda.
- Generar un folio único con un formato como `AGP-2026-0001`.
- Guardar el estado y la fecha/hora de confirmación.
- Mostrar una pantalla final con el folio, el estado y el resumen del evento.
- Consultar un chatbot grounded sobre el uso y las funciones actuales de
  AgendaPro.

## Arquitectura actual

El frontend utiliza HTML, CSS y JavaScript simples, con Bootstrap 5 cargado
desde CDN. No requiere framework, npm ni proceso de compilación.

Las operaciones con datos y la llamada al modelo de IA pasan por funciones
serverless del propio repositorio:

- `api/listar-eventos.mjs`
- `api/crear-evento.mjs`
- `api/obtener-evento.mjs`
- `api/crear-actividad.mjs`
- `api/confirmar-agenda.mjs`
- `api/chat-agendapro.mjs`

Supabase almacena los eventos y las actividades. El navegador no accede
directamente con credenciales privilegiadas.

El chatbot usa Google Gemini desde el backend y recibe una base de conocimiento
curada de AgendaPro. Está disponible como widget de ayuda en las pantallas
públicas y no utiliza búsqueda web, memoria persistente ni acceso a Supabase.

## Variables de entorno

Las claves secretas se configuran únicamente como variables de entorno del
servidor en Vercel:

- `SUPABASE_SERVICE_KEY`
- `GEMINI_API_KEY`

Sus valores no deben incluirse en los archivos HTML, el JavaScript del
navegador, el repositorio ni las respuestas de las funciones.

## Pantallas

- `index.html`: Mis eventos.
- `crear-evento.html`: creación de eventos.
- `detalle-evento.html`: detalle, actividades y revisión de agenda.
- `confirmacion.html`: resultado de la confirmación.

## Datos y estados

Las actividades pertenecen a un evento mediante `actividades.evento_id`. Los
estados reconocidos son `Borrador`, `Confirmada`, `Publicada` y `Finalizada`.
El flujo público actual confirma la agenda con el estado `Confirmada`.

## Limitaciones actuales

- No hay autenticación ni cuentas de usuario.
- No hay pagos.
- No hay integración operativa con Google Calendar.
- No se pueden editar ni eliminar actividades desde la interfaz pública.
- No existe un panel administrativo público.
- No existe una acción pública para cambiar manualmente una agenda a
  `Publicada` o `Finalizada`.

## Documentación

- [Requisitos del producto](docs/PRD.md)
- [Requisitos funcionales](docs/FRD.md)
- [Flujo de navegación](docs/FLOW.md)
- [Identidad de marca](docs/BRAND.md)
