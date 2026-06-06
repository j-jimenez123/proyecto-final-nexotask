# NexoTask

Proyecto final de Juan Francisco Jimenez Bautista, alumno de 2 DAW.

NexoTask es un gestor de tareas pensado para organizar practicas, entregas y trabajo del curso. La aplicacion permite crear una cuenta, iniciar sesion y gestionar tareas desde un dashboard privado.

## Funcionalidades

- Registro y login de usuarios.
- Dashboard protegido.
- Crear tareas con titulo, descripcion y prioridad.
- Listar tareas del usuario.
- Marcar tareas como completadas.
- Borrar tareas.
- Filtrar por todas, pendientes o completadas.
- Resumen visual de total, pendientes y completadas.
- Frase motivadora cargada desde una API publica.

## Tecnologias

- Next.js con App Router.
- Route Handlers para la API propia.
- SQLite como base de datos.
- Drizzle ORM para trabajar con la tabla de tareas.
- better-auth para autenticacion.
- API publica de frases usando DummyJSON.
- Despliegue preparado para Vercel.

## Como arrancarlo

Instalar dependencias:

```bash
npm install
```

Crear el archivo `.env.local` tomando como referencia `.env.example`:

```text
DATABASE_URL=data/nexotask.db
BETTER_AUTH_SECRET=una_clave_larga_para_desarrollo
BETTER_AUTH_URL=http://localhost:3000
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

## Rutas principales

- `/` pagina de inicio.
- `/login` inicio de sesion.
- `/registro` registro de usuario.
- `/dashboard` panel protegido.
- `/api/tasks` API para listar y crear tareas.
- `/api/tasks/[id]` API para actualizar o borrar tareas.
- `/api/quote` API interna que consume una API publica.
- `/api/auth/[...all]` rutas de better-auth.

## Decisiones tecnicas

He usado Next.js porque permite tener frontend y backend en el mismo proyecto. Para el backend he usado Route Handlers, asi la app tiene una API propia para trabajar con las tareas.

La base de datos es SQLite porque encaja bien con un proyecto de clase y no necesita un servidor externo para desarrollo local. Para acceder a la tabla de tareas he usado Drizzle ORM, que deja las consultas mas ordenadas que escribir SQL directamente en cada endpoint.

La autenticacion esta hecha con better-auth. Las contrasenas no se guardan en texto plano. Better Auth crea sus tablas de usuario, cuenta y sesion, y gestiona el login y las sesiones.

El dashboard esta protegido. Si un usuario no tiene sesion, se redirige al login. Ademas, las tareas se filtran por el usuario autenticado para que cada cuenta vea solo sus propias tareas.

Para la API externa he usado DummyJSON Quotes. La app llama a esa API desde `/api/quote` y muestra una frase en el dashboard. Si la API falla, hay una frase por defecto para que la pagina no se rompa.

## Seguridad basica

- `.env.local` no se sube al repositorio.
- `.env.example` solo muestra las variables necesarias, sin valores reales.
- Las tareas se consultan usando el usuario de la sesion.
- No se permite crear tareas sin login.
- No se permite editar o borrar tareas de otro usuario.
- La contrasena minima es de 8 caracteres.

## Uso de IA

Durante el desarrollo de NexoTask he utilizado ChatGPT como herramienta de apoyo tecnico. Su uso ha sido similar al de consultar documentacion, ejemplos o recursos externos cuando aparece una duda durante el desarrollo.

La IA no se ha utilizado para sustituir el trabajo del proyecto, sino para contrastar decisiones, revisar explicaciones y comprobar que la entrega cumplia los requisitos pedidos. El desarrollo, las pruebas y las decisiones finales se realizaron sobre el propio proyecto.

### Consultas realizadas

Algunas consultas que realice fueron:

- "Estoy desarrollando un gestor de tareas con Next.js App Router. Que estructura de carpetas seria adecuada?"
- "Como puedo organizar los Route Handlers para una API de tareas?"
- "Que campos basicos deberia tener una tabla de tareas?"
- "Como puedo relacionar las tareas con el usuario autenticado?"
- "Que debo tener en cuenta al usar SQLite con Drizzle ORM?"
- "Como se puede proteger una ruta /dashboard con better-auth?"
- "Que variables deberia incluir en un archivo .env.example?"
- "Que pruebas basicas deberia hacer antes de desplegar el proyecto?"
- "Revisa si el README explica correctamente que es el proyecto y como arrancarlo."
- "Comprueba si el proyecto cumple los minimos tecnicos de la practica."
- "Ayudame a mejorar la explicacion de las decisiones tecnicas del README."

### Uso durante el proyecto

La IA se utilizo principalmente para:

- Resolver dudas puntuales sobre Next.js, Drizzle y better-auth.
- Comparar opciones de estructura para el proyecto.
- Revisar si la API de tareas estaba planteada de forma clara.
- Comprobar que el README incluia la informacion necesaria.
- Revisar si el proyecto cumplia los minimos tecnicos.
- Mejorar la redaccion de algunas explicaciones.
- Pensar pruebas basicas antes de la entrega.
- Revisar posibles problemas antes del despliegue en Vercel.

### Revision personal

Despues de cada consulta, revise las respuestas y las adapte al proyecto. No todas las propuestas se usaron directamente.

Durante el desarrollo fui comprobando manualmente que:

- El registro y el login funcionaban correctamente.
- El dashboard quedaba protegido.
- Las tareas se podian crear, completar y borrar.
- Los datos se guardaban en la base de datos.
- Las rutas de API respondian correctamente.
- El README no explicaba funcionalidades que no estuvieran hechas.
- Los comandos de instalacion y arranque funcionaban.

En resumen, ChatGPT se uso como apoyo para resolver dudas, revisar documentacion y validar requisitos, pero el proyecto se desarrollo, probo y ajusto directamente sobre NexoTask.

## Despliegue

El proyecto esta preparado para desplegarse en Vercel. En produccion hay que configurar estas variables:

```text
BETTER_AUTH_SECRET
BETTER_AUTH_URL
DATABASE_URL
```

Para una demo sencilla en Vercel se puede dejar `DATABASE_URL` vacia y la aplicacion usara una base temporal. Para un uso real seria mejor conectar una base SQLite externa compatible, por ejemplo Turso.
