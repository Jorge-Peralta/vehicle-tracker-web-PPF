# Vehicle Tracker — Web

Frontend en React para registrar vehículos y llevar el control de sus entradas y salidas, con filtros por fecha, vehículo y conductor.

La API REST se encuentra en un repositorio aparte: **vehicle-tracker-api**.

## Tecnologías

- [Vite](https://vite.dev/) + React 19 + TypeScript
- Componentes de interfaz de [PrimeReact](https://primereact.org/)
- SCSS para el tema, la maquetación y el diseño responsivo
- React Router 8, TanStack Query, React Hook Form + Zod (se incorporan en fases posteriores)
- oxlint + Prettier

## Requisitos

- Node.js 24 o superior
- La API en ejecución, local o desplegada (ver vehicle-tracker-api)

## Puesta en marcha

```bash
npm install
cp .env.example .env   # luego ajuste VITE_API_URL si es necesario
npm run dev            # http://localhost:5173
```

## Variables de entorno

| Variable       | Descripción                         | Ejemplo                     |
| -------------- | ----------------------------------- | --------------------------- |
| `VITE_API_URL` | URL base de la API (incluye `/api`) | `http://localhost:3000/api` |

## Scripts

| Script                 | Descripción                                      |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Inicia el servidor de desarrollo                 |
| `npm run build`        | Verifica tipos y genera la versión de producción |
| `npm run preview`      | Previsualiza la versión de producción            |
| `npm run lint`         | Analiza el código con oxlint                     |
| `npm run typecheck`    | Ejecuta el compilador de TypeScript              |
| `npm run format`       | Formatea con Prettier                            |
| `npm run format:check` | Verifica el formato (usado en CI)                |

## Despliegue

Desplegado en Vercel. `vercel.json` redirige todas las rutas a `index.html` para que las rutas de React Router funcionen al recargar la página. Configure `VITE_API_URL` en los ajustes del proyecto en Vercel.
