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

# Pantalla 2 – Detalles del Evento

## Propósito
Registrar la información básica del evento.

### Lo que el usuario ve
- Campos: Nombre del evento, Fecha y Lugar.
- Botones **Guardar** y **Continuar**.

### Lo que el usuario hace
- Ingresa la información y guarda el evento.

### Datos de entrada
- Nombre del evento.
- Fecha.
- Lugar.

### Datos de salida
- El evento queda registrado.
- Se muestra un mensaje de confirmación.
- Se habilita la creación de la agenda.

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
