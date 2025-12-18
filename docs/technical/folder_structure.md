# Estructura de Carpetas

Detalle de la organización del código fuente en el proyecto `frontend-esti`.

## Raíz del Proyecto

- `docs/`: Documentación técnica y de usuario.
- `lib/`: Configuraciones de librerías externas (e.g., Axios).
- `public/`: Archivos estáticos como imágenes, iconos y fuentes.
- `src/`: Código fuente principal.

## Directorio `src/app`

Este es el núcleo de la aplicación Next.js.

- `admin/`: Páginas y componentes exclusivos para el rol de administrador.
- `profesor/`: Páginas y componentes para el rol de profesor.
- `webpage/`: Secciones públicas de la página web institucional.
- `Service/`: Lógica de comunicación con la API.
- `Styles/`: Archivos de estilo globales y específicos.
- `components/`: Componentes reutilizables de UI (botones, inputs, modales, etc.).
- `password/`: Funcionalidades relacionadas con la recuperación y cambio de contraseñas.
- `layout.js`: Layout raíz que define la estructura común de la app.
- `page.js`: Punto de entrada principal (generalmente el login).

## Directorio `lib`

- `axios.js`: Configuración global de Axios, incluyendo la `baseURL` y los interceptores de peticiones y respuestas.

## Convenciones de Nombres

- **Componentes**: PascalCase (e.g., `Navbar.jsx`).
- **Servicios**: PascalCase (e.g., `StudentService.js`).
- **Estilos**: Lowercase o kebab-case.
- **Rutas**: Lowercase (e.g., `admin/grupos`).
