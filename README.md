# EMMO App

EMMO es una app tipo diario emocional para registrar como te sientes dia a dia.  
Permite navegar por un calendario mensual, abrir cada fecha y guardar informacion como:

- estado de animo con emoji
- nota personal del dia
- cancion asociada a la fecha
- actividades realizadas

La app esta pensada para usuarios autenticados y guarda la informacion por cuenta.

## Caracteristicas

- Calendario mensual con navegacion por scroll, touch y botones.
- Vista diaria por fecha.
- Registro de mood por dia.
- Notas editables con guardado automatico.
- Busqueda y seleccion de cancion del dia.
- Lista de actividades con color personalizado.
- Autenticacion con Clerk.
- Persistencia de datos con Convex.
- Tema claro/oscuro con `next-themes`.

## Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Convex](https://convex.dev/)
- [Clerk](https://clerk.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Requisitos

- Node.js 20 o superior
- npm
- Cuenta de Clerk y proyecto en Convex

## Instalacion

1. Instala dependencias:

```bash
npm install
```

2. Configura las variables de entorno.

3. Inicia el backend de Convex y la app web.

## Variables de entorno

Configura al menos estas variables en tu archivo `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
```

Si conectas el proyecto a tu propio entorno de Clerk y Convex, asegurate de actualizar tambien la configuracion de autenticacion en `convex/auth.config.ts`.

## Desarrollo

Ejecuta los servicios necesarios en dos terminales:

```bash
npx convex dev
```

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Estructura principal

- `app/` contiene las rutas de Next.js.
- `components/` contiene UI reutilizable.
- `convex/` contiene el esquema y las funciones de backend.
- `public/` contiene assets estaticos.
- `utils/` contiene helpers compartidos.

## Flujo de uso

1. Inicia sesion con Clerk.
2. Desde el calendario, selecciona una fecha.
3. Agrega tu mood, escribe una nota y opcionalmente asigna una cancion o actividades.
4. Vuelve al calendario para seguir navegando por otros dias.

## Notas

- La navegacion del calendario esta limitada al presente y no permite avanzar a fechas futuras.
- El proyecto maneja fechas desde enero de 2026 en adelante.
- La busqueda de canciones usa un servicio externo dentro de `components/spotify.tsx`.

## Licencia

Este proyecto no tiene una licencia definida todavia.
