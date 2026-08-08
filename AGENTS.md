# AgendaPro — Brand Brief

## What it is
AgendaPro is a simple appointment-booking platform for independent professionals and service-based businesses. Customers come here to explore available services, check prices and book an appointment quickly.

## Palette
- Primary: #16324F
- Accent: #2EC4B6 — used for prices, availability indicators and the main booking button
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