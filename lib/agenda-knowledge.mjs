export const AGENDA_PRO_KNOWLEDGE = `
# AgendaPro

## Qué es AgendaPro

AgendaPro es una herramienta para organizadores de eventos, encargados de
protocolo y coordinadores que necesitan estructurar y organizar la agenda de un
evento de forma clara.

## Flujo disponible actualmente

El flujo público actual es:

1. Abrir "Mis eventos".
2. Crear un evento nuevo o seleccionar un evento existente.
3. Agregar actividades al evento.
4. Revisar la agenda y sus actividades ordenadas por hora.
5. Confirmar la agenda.
6. Recibir un folio, un estado y una pantalla final de confirmación.

## Eventos

Un evento contiene:

- nombre;
- fecha;
- lugar;
- nombre del responsable;
- teléfono del responsable.

Los eventos guardados aparecen en la pantalla "Mis eventos". Desde esa
pantalla se puede seleccionar un evento para abrir su detalle.

## Actividades

Cada actividad pertenece a un evento específico y contiene:

- hora;
- descripción de la actividad;
- responsable.

Las actividades se presentan ordenadas por hora en el detalle del evento. El
usuario puede agregar actividades. La versión actual no permite editarlas ni
eliminarlas desde la interfaz pública.

Una agenda debe tener al menos una actividad para poder confirmarse.

## Confirmación

Al confirmar una agenda:

- la transacción pasa por el backend de AgendaPro;
- se genera un folio único;
- se guarda el estado de la agenda;
- se registra la fecha y hora de confirmación;
- se muestra una pantalla final con el resultado.

Un ejemplo del formato de folio es AGP-2026-0001. El folio identifica la
confirmación del evento. Si un evento ya está confirmado, conserva el mismo
folio y no recibe uno diferente por repetir el envío.

## Estados reconocidos

AgendaPro reconoce estos estados:

- Borrador
- Confirmada
- Publicada
- Finalizada

Actualmente, Borrador representa visualmente un evento que todavía no ha sido
confirmado. El flujo público permite confirmar una agenda y dejarla con estado
Confirmada. Todavía no existe una acción pública para cambiar manualmente una
agenda a Publicada o Finalizada.

## Funciones que no existen actualmente

La versión actual de AgendaPro no tiene:

- autenticación ni cuentas de usuario;
- integración operativa con Google Calendar;
- pagos;
- edición de actividades;
- eliminación de actividades;
- panel administrativo;
- una acción pública para cambiar el estado a Publicada o Finalizada.

Si se pregunta por una de estas funciones, se debe aclarar que no forma parte
de la versión actual. No se deben presentar funciones planeadas, históricas o
futuras como si estuvieran disponibles.
`.trim();
