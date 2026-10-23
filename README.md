# Vehicle Tracker — Web

Frontend en React para registrar vehículos y llevar el control de sus entradas y salidas, con filtros por fecha, vehículo y conductor.

La API REST se encuentra en un repositorio aparte: **vehicle-tracker-api**.

## Tecnologías

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [PrimeReact 11](https://primereact.dev/) en modo con estilos (tema Aura) e iconos de PrimeIcons
- SCSS propio para la maquetación, el tema y el diseño responsivo (sin frameworks de CSS)
- React Router 8 (modo declarativo)
- TanStack Query 5 para el estado del servidor (carga, errores y caché)
- React Hook Form + Zod para los formularios
- Axios, con tipos generados desde la especificación OpenAPI de la API (`openapi-typescript`)
- oxlint + Prettier

## Requisitos

- Node.js 24 o superior
- La API en ejecución, local o desplegada (ver vehicle-tracker-api)
- Una licencia de PrimeUI (la licencia Community es gratuita para personas y proyectos pequeños)

## Puesta en marcha

```bash
npm install
cp .env.example .env   # luego configure VITE_API_URL y VITE_PRIMEREACT_LICENSE
npm run dev            # http://localhost:5173
```

## Variables de entorno

| Variable                  | Descripción                                                                       | Ejemplo                     |
| ------------------------- | --------------------------------------------------------------------------------- | --------------------------- |
| `VITE_API_URL`            | URL base de la API (incluye `/api`)                                               | `http://localhost:3000/api` |
| `VITE_PRIMEREACT_LICENSE` | Clave de licencia de PrimeUI. Sin ella aparece el aviso "Invalid PrimeUI License" | `eyJ...`                    |

Las variables `VITE_*` se incluyen en el código que se envía al navegador, por lo que no deben contener secretos.

## Scripts

| Script                 | Descripción                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run dev`          | Inicia el servidor de desarrollo                                     |
| `npm run build`        | Verifica tipos y genera la versión de producción                     |
| `npm run preview`      | Previsualiza la versión de producción                                |
| `npm run lint`         | Analiza el código con oxlint                                         |
| `npm run typecheck`    | Ejecuta el compilador de TypeScript                                  |
| `npm run format`       | Formatea con Prettier                                                |
| `npm run format:check` | Verifica el formato (usado en CI)                                    |
| `npm run api:types`    | Regenera `src/api/schema.d.ts` desde la API local (`/api/docs.json`) |

## Estructura

```
src/
  api/          cliente Axios, errores de la API, tipos generados y React Query
  components/   maquetación (barra lateral, encabezados) y avisos compartidos
  config/       variables de entorno y configuración de PrimeReact (tema, idioma, licencia)
  features/     páginas y lógica por funcionalidad (vehicles, movements)
  routes/       definición de rutas y página 404
  styles/       variables, mixins de breakpoints y estilos globales
```

### Tipos de la API

`src/api/schema.d.ts` se genera a partir de la especificación OpenAPI de la API y se versiona en el repositorio, así el proyecto compila sin necesidad de tener la API en ejecución. Cuando cambie el contrato de la API, levante la API localmente y ejecute `npm run api:types`.

### Servidor en reposo

La API está alojada en el plan gratuito de Render, que suspende el servidor tras un periodo de inactividad. Si una solicitud tarda más de 3 segundos, la aplicación muestra el aviso "Despertando el servidor…" hasta que responda.

## Despliegue

Desplegado en Vercel. `vercel.json` redirige todas las rutas a `index.html` para que las rutas de React Router funcionen al recargar la página. Configure `VITE_API_URL` y `VITE_PRIMEREACT_LICENSE` en los ajustes del proyecto en Vercel.
