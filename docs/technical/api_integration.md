# Integración con la API

Este documento explica cómo el frontend se comunica con el backend y cómo se maneja la seguridad.

## Configuración de Axios (`lib/axios.js`)

Se utiliza una instancia centralizada de Axios para asegurar que todas las peticiones sigan las mismas reglas.

### Interceptor de Peticiones
Antes de enviar cualquier petición, el interceptor verifica si existe un token en el `localStorage`. Si está presente, lo añade al encabezado `Authorization` como un `Bearer Token`.

```javascript
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

### Interceptor de Respuestas
Si la API devuelve un error `401 Unauthorized`, el interceptor limpia el `localStorage` y redirige al usuario a la página de inicio de sesión (`/`). Esto asegura que las sesiones expiradas se cierren correctamente.

## Definición de Servicios (`src/app/Service`)

Los servicios están organizados por entidad. Ejemplo de estructura de un servicio (`StudentService.js`):

- **GET**: Métodos para obtener listas o elementos individuales (soporta paginación).
- **POST**: Creación de nuevos registros.
- **PATCH/PUT**: Actualización de registros existentes.
- **DELETE**: Eliminación (generalmente lógica).

## Variables de Entorno

El sistema depende de la variable `NEXT_PUBLIC_API_URL` definida en los archivos `.env.local` o `.env.production`. Esta variable contiene la URL base de la API backend.
