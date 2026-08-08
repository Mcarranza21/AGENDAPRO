# Brand Brief — AgendaPro

## Esencia de marca

AgendaPro transforma agendas complejas en planes claros, coordinados y fáciles de ejecutar. La marca debe transmitir **orden, confianza y agilidad**, con una apariencia profesional que no se sienta rígida.

**Promesa:** Cada actividad, persona y horario en su lugar.

## Paleta de color

| Rol | Color | Hex | Uso recomendado |
|---|---|---|---|
| Primario | Azul agenda | `#2563EB` | Acciones principales, enlaces y elementos activos |
| Primario oscuro | Azul protocolo | `#1E3A8A` | Encabezados, navegación y estados hover |
| Acento | Turquesa coordinación | `#14B8A6` | Confirmaciones, sincronización y destacados |
| Fondo | Niebla | `#F8FAFC` | Fondo general de la aplicación |
| Superficie | Blanco | `#FFFFFF` | Tarjetas, formularios y modales |
| Texto principal | Grafito | `#0F172A` | Títulos y texto de alta jerarquía |
| Texto secundario | Pizarra | `#475569` | Descripciones, etiquetas y metadatos |
| Borde | Gris claro | `#CBD5E1` | Divisores, bordes y controles inactivos |
| Éxito | Verde | `#16A34A` | Guardado o sincronización exitosa |
| Advertencia | Ámbar | `#D97706` | Conflictos de horario y avisos |
| Error | Rojo | `#DC2626` | Errores, acciones destructivas y validación |

Usar el azul como color dominante y reservar el turquesa para momentos de progreso o coordinación. Mantener una relación de contraste mínima de **4.5:1** para texto normal y no depender únicamente del color para comunicar estados.

## Tipografía

- **Inter:** interfaz, títulos, botones, formularios y tablas. Es legible en tamaños pequeños y funciona bien en productos digitales con alta densidad de información.
- **Source Sans 3:** alternativa para textos extensos y documentación.
- **Fallback:** `Inter, "Source Sans 3", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

Jerarquía sugerida:

- Título de página: 32 px / 700.
- Encabezado de sección: 24 px / 600.
- Título de tarjeta: 18 px / 600.
- Texto base: 16 px / 400.
- Etiquetas y metadatos: 14 px / 500.

## Tono de voz

La voz de AgendaPro es **clara, serena, directa y resolutiva**. Habla como un coordinador experimentado: anticipa lo importante, indica el siguiente paso y evita tecnicismos innecesarios.

- Usar verbos de acción: “Crear evento”, “Agregar actividad”, “Sincronizar agenda”.
- Dar instrucciones breves y específicas.
- Confirmar qué ocurrió y qué sigue: “Agenda guardada. Ya puede sincronizarla”.
- Explicar errores con una solución concreta, sin culpar al usuario.
- Tratar al usuario de **usted** y mantener un español neutro.
- Evitar frases promocionales exageradas, humor en mensajes críticos y lenguaje ambiguo.

Ejemplos:

| Contexto | Recomendado | Evitar |
|---|---|---|
| Éxito | “Agenda sincronizada con Google Calendar.” | “¡Todo salió increíble!” |
| Validación | “Ingrese una hora de finalización posterior a la hora de inicio.” | “Horario inválido.” |
| Error | “No fue posible sincronizar. Revise su conexión e intente nuevamente.” | “Error 500.” |

## Stack recomendado para el MVP

| Capa | Tecnología | Motivo |
|---|---|---|
| Aplicación web | **Next.js + TypeScript** | Interfaz y API en un solo proyecto con tipado estático |
| UI | **Tailwind CSS + shadcn/ui** | Construcción rápida, accesible y consistente con los tokens de marca |
| Datos | **PostgreSQL + Prisma** | Modelo relacional adecuado para eventos, actividades y responsables |
| Autenticación | **Auth.js con Google OAuth** | Inicio de sesión con Google y base para autorizar Calendar |
| Integración | **Google Calendar API** | Creación y actualización de actividades en el calendario del usuario |
| Validación | **Zod** | Validación compartida entre formularios y API |
| Pruebas | **Vitest + Playwright** | Pruebas unitarias y de los flujos críticos de agenda y sincronización |
| Despliegue | **Vercel + PostgreSQL administrado** | Despliegue simple y escalable para el MVP |

La integración con Google debe solicitar únicamente los permisos necesarios, almacenar los tokens cifrados y registrar el estado de sincronización de cada actividad para evitar duplicados.
