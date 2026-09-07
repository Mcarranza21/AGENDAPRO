# AgendaPro — Documento de Requisitos del Producto

## 1. Problema

La organización de eventos corporativos, académicos y protocolarios exige
coordinar horarios, actividades y responsables. Cuando esa información está
dispersa, aumentan los errores, los tiempos muertos y la falta de claridad
operativa.

AgendaPro ofrece un flujo centralizado para estructurar, revisar y confirmar la
agenda de un evento.

## 2. Público objetivo

- **Organizadores de eventos:** crean el evento y coordinan su agenda.
- **Encargados de protocolo:** revisan el orden y los horarios del programa.
- **Coordinadores:** consultan actividades y responsables asignados.

## 3. Propuesta de valor

AgendaPro convierte la información básica de un evento y sus actividades en una
agenda clara y confirmable. La confirmación produce un folio único, un estado y
un registro de fecha/hora.

## 4. Flujo disponible

```text
Mis eventos
→ crear o seleccionar un evento
→ agregar actividades
→ revisar la agenda
→ confirmar
→ recibir folio y estado
```

## 5. Historias de usuario implementadas

- Como organizador, quiero crear un evento con sus datos principales para
  comenzar su agenda.
- Como coordinador, quiero agregar actividades con hora, descripción y
  responsable para organizar el programa.
- Como encargado de protocolo, quiero visualizar las actividades ordenadas por
  hora para revisar la continuidad del evento.
- Como organizador, quiero confirmar una agenda con actividades para recibir un
  folio y dejar constancia de la confirmación.
- Como usuario, quiero consultar un asistente grounded para entender cómo usar
  las funciones actuales de AgendaPro.

## 6. Capacidades actuales

- Persistencia de eventos y actividades en Supabase.
- Relación de actividades con eventos.
- Listado y detalle de eventos reales.
- Creación de eventos y actividades.
- Revisión cronológica de la agenda.
- Confirmación idempotente con folio único, estado y fecha/hora.
- Pantalla final basada en la respuesta de la transacción.
- Chatbot grounded accesible desde las pantallas públicas.
- Funciones serverless para proteger las credenciales y centralizar las
  operaciones externas.

## 7. Estados

AgendaPro reconoce `Borrador`, `Confirmada`, `Publicada` y `Finalizada`. El
flujo público implementado actualmente cambia una agenda a `Confirmada`.

## 8. Alcance no implementado

Las siguientes ideas no forman parte de la versión pública actual:

- Autenticación y cuentas de usuario.
- Integración operativa con Google Calendar.
- Pagos.
- Edición o eliminación de actividades.
- Panel administrativo público.
- Cambio manual público a `Publicada` o `Finalizada`.
- Exportación de agendas a PDF.

La sincronización con Google Calendar se conserva como una posibilidad futura,
no como una función disponible en producción.

## 9. Criterios de éxito actuales

- El usuario puede completar el flujo desde la creación hasta la confirmación
  sin utilizar IDs locales.
- Las actividades se conservan en Supabase y aparecen ordenadas por hora.
- Una agenda vacía no puede confirmarse.
- Una confirmación repetida conserva el folio existente.
- La pantalla final presenta el folio y el estado devueltos por el backend sin
  una segunda consulta.
- El chatbot responde sobre AgendaPro sin presentar funciones inexistentes como
  disponibles.
