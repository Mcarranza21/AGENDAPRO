# AgendaPro

**AgendaPro** ayuda a organizadores de eventos, encargados de protocolo y coordinadores a crear agendas de eventos de forma rápida y ordenada. Busca reducir el trabajo manual y evitar errores al organizar los horarios, las actividades y las personas responsables de cada momento del evento.

## The three Musts

- Crear y editar una agenda de evento.
- Organizar las actividades por horario y responsable.
- Sincronizar la agenda con Google Calendar.

## Core features at a glance

| Feature | Priority |
|---|---|
| Crear y editar agendas | Must |
| Organizar actividades y responsables | Must |
| Sincronizar con Google Calendar | Must |

## Documentación

- [Requisitos del producto](docs/PRD.md)
- [Requisitos funcionales](docs/FRD.md)
- [Brand brief](docs/BRAND.md)

## Prototipo en vivo

Dirección de Vercel:

https://agendapro-mo3r2u04z-mcarranza21s-projects.vercel.app/

## Pantallas implementadas

- **Inicio (`index.html`):** presenta los eventos disponibles y enlaza al detalle y al formulario.
- **Detalle del evento (`detalle-evento.html`):** muestra información general, conserva las actividades agregadas en el navegador y permite volver a Inicio.
- **Crear evento (`crear-evento.html`):** formulario accesible desde Inicio que guarda una fila en la tabla `eventos` de Supabase.

## Delivery 3

- Interfaz construida con HTML, CSS y JavaScript simples.
- Bootstrap 5, Bootstrap Icons, Montserrat e Inter cargados desde CDN.
- Imagen y favicon almacenados localmente en `assets/`.
- Datos de ejemplo leídos desde `data/EVENTS.json`.
- Formulario conectado a una única tabla de Supabase.
- Actividades del detalle guardadas por evento en `localStorage`, por lo que permanecen después de recargar en el mismo navegador.

Antes de entregar: abrir la URL de Vercel en una ventana privada para confirmar que no solicita inicio de sesión y comprobar que el instructor conserva acceso al repositorio. El resumen PDF ya incluye evidencia de Supabase con filas registradas y la fecha visible.
