import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    // 1. Protección de Rutas (Route Protection)
    // Definir rutas protegidas
    const protectedRoutes = ['/admin', '/profesor', '/student'];

    // Verificar si la ruta actual empieza con alguna de las protegidas
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
        if (!token) {
            // Si no hay token, redirigir al login
            const loginUrl = new URL('/', request.url);
            return NextResponse.redirect(loginUrl);
        }

        // Aquí podrías decodificar el token si quisieras validar roles (opcional pero recomendado en backend)
        // Por ahora, validamos solo presencia de sesión.
    }

    // 2. Cabeceras de Seguridad (Security Headers)
    const headers = new Headers(request.headers);
    const response = NextResponse.next({
        request: {
            headers: headers,
        },
    });

    // Strict-Transport-Security: Forzar HTTPS siempre (1 año)
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // X-Frame-Options: Evitar que la web sea embebida en un iframe (protección anti-clickjacking)
    response.headers.set('X-Frame-Options', 'DENY');

    // X-Content-Type-Options: Evitar que el navegador adivine el tipo MIME
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer-Policy: Controlar cuánta información de referencia se envía
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions-Policy: Deshabilitar características peligrosas o no usadas
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), browsing-topics=()'
    );

    // Content-Security-Policy (CSP): Prevenir XSS
    // Permitimos unsafe-inline y unsafe-eval porque Next.js los requiere a veces en desarrollo/producción para hydration
    // Ajustar según necesidades estrictas
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    connect-src 'self' https://api.esti70.org;
    img-src 'self' blob: data: https://api.esti70.org;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `;

    // Reemplazar saltos de línea con espacios para header válido
    response.headers.set(
        'Content-Security-Policy',
        cspHeader.replace(/\s{2,}/g, ' ').trim()
    );

    return response;
}

export const config = {
    matcher: [
        // Aplicar a todas las rutas excepto estáticos, api, imagenes
        '/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)',
    ],
};
