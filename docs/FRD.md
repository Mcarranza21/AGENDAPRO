# Documento de Requisitos Funcionales (FRD)

## Funcionalidad: Crear y gestionar una agenda de eventos

---

# Pantalla 1 – Inicio

## Propósito
Permitir al usuario crear un nuevo evento o acceder a uno existente.

### Lo que el usuario ve
- Botón **"Crear nuevo evento"**.
- Lista de eventos existentes (si los hay).

### Lo que el usuario hace
- Selecciona **"Crear nuevo evento"** o un evento existente.

### Datos de entrada
- Selección del botón o del evento.

### Datos de salida
- Se abre la pantalla de detalles del evento.
- Se muestra la información del evento seleccionado.

---

# Pantalla 2 – Detalle del Evento

## Propósito
Permitir al usuario consultar la información general de un evento y administrar las actividades que forman parte de su agenda.

### Lo que el usuario ve
- Nombre del evento.
- Estado del evento.
- Fecha.
- Horario general.
- Lugar.
- Sección de actividades de la agenda.
- Botón **"Agregar actividad"**.
- Opción **"Volver a eventos"**.
- Mensaje informativo cuando el evento todavía no tiene actividades.

### Lo que el usuario hace
- Consulta la información general del evento.
- Revisa las actividades que forman parte de la agenda.
- Selecciona **"Agregar actividad"** para incorporar una nueva actividad.
- Selecciona **"Volver a eventos"** para regresar a la pantalla de Inicio.

### Datos de entrada
- Evento seleccionado desde la pantalla de Inicio.
- Información de una nueva actividad cuando el usuario decide agregarla.

### Datos de salida
- Se muestra la información correspondiente al evento seleccionado.
- Se muestran las actividades asociadas al evento.
- Si el evento no tiene actividades, se muestra el mensaje:
  > Este evento todavía no tiene actividades. Agrega la primera actividad para comenzar a organizar la agenda.
- Al agregar una actividad, esta se incorpora a la agenda mostrada.
- Al seleccionar **"Volver a eventos"**, el usuario regresa a la pantalla de Inicio.

---

# Pantalla 3 – Constructor de Agenda

## Propósito
Crear y administrar las actividades del evento.

### Lo que el usuario ve
- Lista de actividades.
- Botón **Agregar actividad**.
- Opciones para editar y eliminar.

### Lo que el usuario hace
- Agrega, edita o elimina actividades.

### Datos de entrada
- Hora.
- Descripción de la actividad.
- Responsable.

### Datos de salida
- La agenda se actualiza en orden cronológico.
- Las actividades quedan almacenadas.

---

# Pantalla 4 – Sincronización con Google Calendar

## Propósito
Permitir al usuario publicar la agenda del evento y sincronizarla con Google Calendar.

### Lo que el usuario ve
- Vista previa de la agenda.
- Botón **"Sincronizar con Google Calendar"**.
- Mensaje de confirmación cuando la sincronización sea exitosa.

### Lo que el usuario hace
- Revisa la agenda.
- Selecciona **"Sincronizar con Google Calendar"**.
- Autoriza el acceso a su cuenta de Google (la primera vez).

### Datos de entrada
- Agenda del evento.
- Cuenta de Google autorizada por el usuario.

### Datos de salida
- La agenda queda publicada en Google Calendar.
- Se muestra un mensaje confirmando que la sincronización fue realizada correctamente.

---

# Casos límite (Edge Cases)

## 1. No hay conexión a Internet

**Respuesta del sistema:**
La sincronización se cancela.

**Mensaje al usuario:**
> No fue posible sincronizar la agenda. Verifique su conexión a Internet e intente nuevamente.

---

## 2. Permisos denegados

**Respuesta del sistema:**
No se puede acceder a Google Calendar.

**Mensaje al usuario:**
> Debe autorizar el acceso a Google Calendar para sincronizar la agenda.

---

## 3. Error al conectar con Google Calendar

**Respuesta del sistema:**
La agenda no se publica.

**Mensaje al usuario:**
> Ocurrió un error durante la sincronización. Intente nuevamente más tarde.
