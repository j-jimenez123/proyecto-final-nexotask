# NexoTask

Proyecto final de Juan Francisco Jiménez Bautista, alumno de 2.º DAW.

NexoTask es un gestor de tareas pensado para organizar prácticas, entregas y trabajo del curso. La aplicación permite crear una cuenta, iniciar sesión y gestionar tareas desde un dashboard privado.

## Funcionalidades

- Registro, login y cierre de sesión.
- Dashboard protegido, solo visible con sesión iniciada.
- Política de privacidad antes del registro.
- Crear tareas con título, descripción, prioridad, fecha y hora.
- Listar tareas del usuario en distintas vistas.
- Vistas laterales: bandeja, hoy, próximas, urgentes, vencidas y hechas.
- Buscador por título o descripción.
- Marcar tareas como completadas.
- Editar tareas.
- Borrar tareas.
- Filtrar por todas, pendientes o completadas dentro del panel de tareas.
- Panel principal con acceso separado para ver tareas o crear una tarea nueva.
- Modo enfoque para destacar la tarea más importante.
- Plantillas rápidas para crear tareas frecuentes.
- Calendario desplegable para seleccionar fecha y ver tareas pendientes de cada día.
- Frase motivadora cargada desde una API pública con alternativa local si falla.

## Tecnologías

- Next.js con App Router.
- Route Handlers para la API propia.
- SQLite como base de datos.
- Drizzle ORM para trabajar con la tabla de tareas.
- better-auth para autenticación.
- API pública de frases usando DummyJSON.
- Despliegue preparado para Vercel.

## Cómo arrancarlo

Instalar dependencias:

```bash
npm install
```

Crear el archivo `.env.local` tomando como referencia `.env.example`:

```text
DATABASE_URL=data/nexotask.db
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=una_clave_larga_para_desarrollo
```

Crear la base de datos local:

```bash
npm run db:migrate
npx auth@latest migrate --yes --config ./lib/auth.js
```

Arrancar el proyecto:

```bash
npm run dev
```

Abrir en el navegador:

```text
http://localhost:3000
```

## Cómo probarlo

Para probar la aplicación desde cero:

1. Entrar en `/registro` y crear una cuenta nueva.
2. Aceptar la política de privacidad para poder registrarse.
3. Iniciar sesión desde `/login`.
4. Entrar al dashboard privado.
5. Crear una tarea con título, prioridad, fecha y hora.
6. Comprobar que aparece en el listado de tareas.
7. Marcar una tarea como completada.
8. Probar los filtros de pendientes, hechas, urgentes o vencidas.
9. Borrar una tarea y comprobar que desaparece también del calendario.
10. Cerrar sesión y comprobar que el dashboard vuelve a pedir login.

No se incluye un usuario demo fijo. Cada persona que pruebe el proyecto puede crear su propia cuenta desde la página de registro.

## Rutas principales

- `/` página de inicio.
- `/login` inicio de sesión.
- `/registro` registro de usuario.
- `/privacidad` política de privacidad.
- `/dashboard` panel protegido.
- `/api/tasks` API para listar y crear tareas.
- `/api/tasks/[id]` API para actualizar o borrar tareas.
- `/api/quote` API interna que consume una API pública.
- `/api/auth/[...all]` rutas de better-auth.

## Decisiones técnicas

He usado Next.js porque permite tener frontend y backend en el mismo proyecto. Para el backend he usado Route Handlers, así la app tiene una API propia para trabajar con las tareas.

La base de datos es SQLite porque encaja bien con un proyecto de clase y no necesita un servidor externo para desarrollo local. Para acceder a la tabla de tareas he usado Drizzle ORM, que deja las consultas más ordenadas que escribir SQL directamente en cada endpoint.

En local se usa `data/nexotask.db`. Para una demo académica en Vercel la aplicación puede usar `/tmp/nexotask.db`, que es temporal. Esto mantiene SQLite como pedía la práctica, aunque en un proyecto real convendría usar una base persistente compatible, por ejemplo Turso/libSQL.

La autenticación está hecha con better-auth. Las contraseñas no se guardan en texto plano. Better Auth crea sus tablas de usuario, cuenta y sesión, y gestiona el login y las sesiones.

El dashboard está protegido. Si un usuario no tiene sesión, se redirige al login. Además, las tareas se filtran por el usuario autenticado para que cada cuenta vea solo sus propias tareas.

Para la API externa he usado DummyJSON Quotes. La app llama a esa API desde `/api/quote` y muestra una frase en el dashboard. Como algunas frases vienen en inglés, la aplicación elige una frase local en español usando la respuesta externa como referencia. Si la API falla, hay una frase por defecto para que la página no se rompa.

## Seguridad básica

- `.env.local` no se sube al repositorio.
- `.env.example` solo muestra las variables necesarias, sin valores reales.
- Las tareas se consultan usando el usuario de la sesión.
- No se permite crear tareas sin login.
- No se permite editar o borrar tareas de otro usuario.
- La contraseña mínima es de 8 caracteres.
- La API valida título, prioridad, fecha y hora antes de guardar una tarea.

## Uso de IA

Durante el proyecto he usado ChatGPT como herramienta de apoyo, igual que podría usar documentación, ejemplos o apuntes de clase cuando aparece una duda concreta.

Principalmente lo consulté para orientarme en partes del desarrollo donde quería asegurarme de que iba por buen camino: estructura del proyecto, organización de los Route Handlers, variables de entorno, pruebas básicas y preparación de la entrega. También me sirvió para revisar si el README explicaba bien cómo arrancar la aplicación y si el proyecto cumplía los mínimos técnicos pedidos.

### Consultas realizadas

Algunas preguntas que hice fueron:

- "Estoy haciendo un gestor de tareas con Next.js App Router. ¿Cómo podría organizar las carpetas para que quede claro?"
- "¿Cómo puedo crear Route Handlers para listar, crear, editar y borrar tareas?"
- "¿Qué campos tendría sentido guardar en una tabla de tareas para este proyecto?"
- "¿Cómo puedo hacer que cada usuario vea solo sus propias tareas?"
- "¿Qué debo tener en cuenta al usar SQLite con Drizzle ORM?"
- "¿Cómo puedo proteger el dashboard para que solo entre un usuario con sesión?"
- "¿Qué variables debería poner en el `.env.example` sin subir datos privados?"
- "¿Qué pruebas básicas debería hacer antes de entregar o desplegar el proyecto?"
- "Revisa si este README explica bien qué es el proyecto y cómo arrancarlo."
- "Comprueba si NexoTask cumple los mínimos técnicos pedidos en el proyecto final."
- "¿Cómo puedo explicar de forma sencilla las decisiones técnicas del proyecto?"

### Para qué me sirvió

Me sirvió para ordenar mejor el trabajo y dividirlo en partes: primero la estructura del proyecto, después la base de datos, luego la API, la autenticación y por último la interfaz y la documentación.

En la parte de backend lo usé para repasar la forma de plantear los endpoints de tareas y las validaciones básicas antes de guardar datos. También revisé cómo controlar que cada usuario solo pudiera acceder a sus propias tareas.

En la documentación lo usé para comprobar que no faltaran apartados importantes: instalación, variables de entorno, comandos para arrancar, explicación de tecnologías y despliegue en Vercel.

Antes de dar el proyecto por terminado también lo usé como apoyo para preparar una lista de pruebas manuales: registro, inicio de sesión, cierre de sesión, creación de tareas, edición, borrado, filtros y protección del dashboard.

En resumen, ChatGPT me sirvió para resolver dudas concretas, revisar documentación y comprobar requisitos.

## Despliegue

El proyecto está preparado para desplegarse en Vercel. Antes de subirlo conviene comprobar:

```bash
npm run lint
npm run build
```

En Vercel hay que configurar estas variables:

```text
BETTER_AUTH_SECRET
BETTER_AUTH_URL
DATABASE_URL
```

`BETTER_AUTH_URL` debe cambiar de `http://localhost:3000` a la URL real del despliegue, por ejemplo:

```text
BETTER_AUTH_URL=https://nexotask.vercel.app
```

`BETTER_AUTH_SECRET` debe ser una clave larga y privada. No debe subirse al repositorio.

Para una demo académica en Vercel se puede dejar `DATABASE_URL` vacía y la aplicación usará `/tmp/nexotask.db`. Esto permite probar la app con SQLite, pero la base es temporal: Vercel puede borrar esos datos al reiniciar la función o hacer un nuevo despliegue.

Para un proyecto real sería mejor conectar una base persistente compatible con SQLite, por ejemplo Turso/libSQL. En ese caso habría que adaptar la conexión de base de datos.

Archivos que no deben subirse:

- `.env.local`
- `data/`
- `*.db`
- `.next/`
- `node_modules/`
