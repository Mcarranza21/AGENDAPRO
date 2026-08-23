# Documento de Requisitos Funcionales (FRD)

## AgendaPro - versión implementada para Delivery 3

AgendaPro es un producto web para organizadores y equipos de protocolo que necesitan consultar eventos, revisar sus actividades y registrar un nuevo evento. Esta versión conserva un alcance deliberadamente simple: HTML, CSS y JavaScript sin framework, datos de demostración en un archivo JSON y un formulario que escribe en una sola tabla de Supabase.

## Pantalla 1 - Inicio

**Estado:** Implementada.

**Propósito:** servir como punto de entrada y ofrecer acceso directo a los eventos y al formulario de creación.

**Contenido y acciones:**

- Identidad de AgendaPro, mensaje principal e ilustración local.
- Lista de eventos cargada desde `data/EVENTS.json`.
- Tarjetas con fecha, estado, nombre y lugar.
- Enlace **Ver evento** hacia la pantalla Detalle del evento.
- Botón **Crear nuevo evento** hacia la pantalla Crear evento.
- Mensajes para estado vacío o error de carga.

## Pantalla 2 - Detalle del evento

**Estado:** Implementada.

**Propósito:** consultar un evento y visualizar las actividades de su agenda.

**Contenido y acciones:**

- Nombre, estado, fecha, horario general y lugar del evento seleccionado.
- Lista de actividades con hora, descripción y responsable, cuando existan.
- Estado vacío cuando todavía no hay actividades.
- Botón **Agregar actividad**, que guarda la actividad en el almacenamiento local del navegador para conservarla al recargar la página. Esta acción no escribe en Supabase y no forma parte del formulario evaluado para la base de datos.
- Enlace **Volver a eventos** hacia Inicio.
- Estado de error si falta el identificador o no existe el evento solicitado.

## Pantalla 3 - Crear evento

**Estado:** Implementada y conectada a Supabase.

**Propósito:** recopilar la información mínima de un nuevo evento y guardarla en la tabla `eventos`.

**Campos obligatorios:**

- `nombre_evento`
- `fecha_evento`
- `lugar_evento`
- `nombre_responsable`
- `telefono_responsable`

**Comportamiento:**

1. El usuario accede desde el botón **Crear nuevo evento** en Inicio.
2. El navegador valida que todos los campos estén completos.
3. Al enviar, el botón cambia a estado de espera y se inserta una fila en `eventos` mediante el cliente público de Supabase.
4. Si la inserción funciona, el formulario se limpia y muestra una confirmación.
5. Si ocurre un error, se muestra el mensaje devuelto por el servicio y el usuario puede intentarlo nuevamente.
6. El enlace **Volver a eventos** regresa a Inicio.

## Navegación implementada

| Origen | Acción | Destino | Regreso |
|---|---|---|---|
| Inicio | Ver evento | Detalle del evento | Volver a eventos |
| Inicio | Crear nuevo evento | Crear evento | Volver a eventos |

## Datos e integraciones

- **Lectura:** `data/EVENTS.json`, usado únicamente para mostrar los eventos de demostración.
- **Escritura:** una fila por envío en la tabla `eventos` de Supabase.
- **Actividades del detalle:** se guardan por identificador de evento en `localStorage`, bajo la clave `agendapro.activities.v1`.
- **Permisos esperados:** inserción pública habilitada para la tabla; no se requiere lectura pública desde el producto.
- **Despliegue requerido:** Vercel. La URL debe registrarse en `README.md` y en el resumen cuando haya sido confirmada.

## Estados y casos límite

- Si el JSON no carga, Inicio muestra un mensaje claro sin romper la interfaz.
- Si el detalle no recibe un `id` válido, muestra un estado de evento no encontrado.
- Si Supabase rechaza la inserción o no hay conexión, el formulario informa el error y recupera el botón.
- Los campos obligatorios evitan envíos incompletos desde el navegador.

## Fuera del alcance de Delivery 3

- Autenticación y cuentas de usuario.
- Segunda tabla o backend propio.
- Sincronización de actividades entre navegadores o dispositivos; el almacenamiento de actividades es local a cada navegador.
- Edición o eliminación de eventos.
- Sincronización con Google Calendar.
- Chatbot.

## Evidencia pendiente de confirmación

- URL pública definitiva de Vercel probada en una ventana privada.
- Captura de la tabla `eventos` con al menos una fila creada desde el formulario y la fecha visible.
