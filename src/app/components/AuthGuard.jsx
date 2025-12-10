"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const publicPaths = [
    "/",
    "/password/forgot-password",
    "/password/reset-password",
];

export default function AuthGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Función para verificar autenticación
        const checkAuth = () => {
            const token = localStorage.getItem("token");

            // Verificar si la ruta actual es pública (o empieza con una ruta pública para subrutas)
            const isPublicPath = publicPaths.some(path =>
                pathname === path || pathname.startsWith(path + "/")
            );

            if (!token && !isPublicPath) {
                // Si no hay token y la ruta NO es pública, redirigir al login
                setAuthorized(false);
                router.push("/");
            } else {
                // En cualquier otro caso (hay token O es ruta pública), permitir acceso
                setAuthorized(true);
            }
        };

        checkAuth();
    }, [router, pathname]);

    // Si estamos en una ruta protegida y aún no estamos autorizados, mostramos nada o un loader
    // Para rutas públicas, mostramos el contenido inmediatamente para evitar parpadeos
    const isPublicPath = publicPaths.some(path =>
        pathname === path || pathname.startsWith(path + "/")
    );

    if (!authorized && !isPublicPath) {
        return null; // O un componente de Loading
    }

    return <>{children}</>;
}
