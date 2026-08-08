# AgendaPro — Brand Brief

## What it is
## What it is
AgendaPro is a web application for event organizers and protocol staff who need to create structured event agendas quickly and accurately. Users create an event, add activities with their time and responsible person, organize the agenda, and publish or synchronize it with Google Calendar.

## Palette
- Primary: #16324F
- - Accent: #087E8B — use for primary actions, highlighted times, active states and important agenda information.
- Background: #F7F9FC

## Fonts
- Headings: Montserrat
- Body: Inter

## Tone
Professional, welcoming, efficient. Not this: corporate, complicated or visually overwhelming.

## Screens
- ## Screens
- Inicio (home)
- Detalles del Evento
- Constructor de Agenda
- Sincronización con Google Calendar

## Stack, pinned
Plain HTML, CSS and JavaScript reading a local JSON file, styled with Bootstrap 5 loaded from a CDN. No framework, no npm, no build step.

Bootstrap 5 — two lines, both required:

```html
<!-- in <head> -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- just before </body> -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```