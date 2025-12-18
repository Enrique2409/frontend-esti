# Arquitectura del Sistema

Este documento describe la arquitectura de alto nivel del frontend de la Escuela Secundaria Técnica Industrial No. 70.

## Tecnologías Principales

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Lenguaje**: JavaScript
- **Estilos**: Tailwind CSS & CSS Modules
- **Cliente HTTP**: Axios
- **Fuentes**: Montserrat (Principal), Geist

## Componentes de la Arquitectura

### 1. Capa de Aplicación (`src/app`)
Utiliza el App Router de Next.js. Las rutas están organizadas por roles y funcionalidades:
- `/admin`: Funcionalidades administrativas.
- `/profesor`: Funcionalidades para docentes.
- `/webpage`: Contenido público de la escuela.

### 2. Capa de Servicios (`src/app/Service`)
Centraliza todas las peticiones a la API. Cada entidad (Alumno, Profesor, Grupo, etc.) tiene su propia clase de servicio que utiliza la instancia configurada de Axios en `lib/axios.js`.

### 3. Seguridad y Autenticación
- **Middleware**: Controla el acceso a rutas protegidas.
- **AuthGuard**: Componente que envuelve el layout principal para verificar la sesión del usuario.
- **JWT**: Los tokens se almacenan en `localStorage` y se adjuntan automáticamente a las peticiones mediante un interceptor de Axios.

### 4. Gestión de Estado
Se utiliza principalmente el estado local de React (`useState`, `useEffect`) y, en algunos casos, el paso de datos a través de props. La persistencia de la sesión se maneja vía `localStorage`.

## Flujo de Datos

1. El usuario interactúa con una página en `src/app`.
2. La página llama a un método en `src/app/Service`.
3. El servicio utiliza `lib/axios.js` para realizar la petición HTTP.
4. El interceptor de Axios añade el token JWT si está disponible.
5. Los datos recibidos se devuelven a la página y se actualiza el estado local de la UI.
