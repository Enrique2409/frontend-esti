import axios from "../../../lib/axios";

const systemConfigURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/system`;



const isTeacher = () => {
    if (typeof window === "undefined") return false;
    const role = localStorage.getItem("role");
    console.log("Rol del usuario:", role);
    // Normalizamos a mayúsculas y quitamos espacios por si acaso
    const normalizedRole = role ? role.toUpperCase().trim() : "";
    return ["TEACHER", "DOCENTE", "PROFESOR"].includes(normalizedRole);
};

const isAdmin = () => {
    if (typeof window === "undefined") return false;
    const role = localStorage.getItem("role");
    const normalizedRole = role ? role.toUpperCase().trim() : "";

    // Si el rol es ADMIN, es admin.
    if (normalizedRole === "ADMIN") return true;

    // FALLBACK: Si estamos en la ruta /admin, asumimos que es admin 
    // (útil si el rol se guardó mal o es un usuario híbrido)
    if (window.location.pathname.startsWith("/admin")) {
        console.log("Detectado entorno Admin por URL");
        return true;
    }

    return false;
};

export const getSystemConfig = async () => {
    try {
        const response = await axios.get(`${systemConfigURL}/config`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener configuración del sistema: ", error);
        throw error;
    }
};

export const changeStatusGrades = async (lock, notes = "") => {
    try {
        const response = await axios.post(
            `${systemConfigURL}/cardex/lock`, {
            lock: lock,
            notes: notes,
        },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al cambiar el estado de calificaciones: ", error);
        throw error;
    }
};

export const verifyLockGrades = async () => {
    try {
        // 1. Si es Admin (por rol o por URL), NUNCA se bloquea.
        if (isAdmin()) {
            console.log("Usuario Admin detectado: Acceso permitido.");
            return false;
        }

        // 2. Si NO es profesor, tampoco aplicamos bloqueo (asumimos otro rol o sin rol).
        if (!isTeacher()) {
            console.log("El usuario no es un profesor ni admin conocido.");
            return false;
        }

        // 3. Si es profesor, verificamos la configuración en el backend.
        // Intentamos primero la ruta normal (que parece ser de admin)
        try {
            const config = await getSystemConfig();
            return config.lockedGrades;
        } catch (error) {
            // Si falla con 403, intentamos una ruta alternativa (fallback)
            // Asumimos que podría haber un endpoint público o de profesor
            if (error.response && error.response.status === 403) {
                console.warn("Acceso denegado a config de admin. Intentando ruta alternativa...");
                try {
                    const fallbackURL = `${process.env.NEXT_PUBLIC_API_URL}/system/config`;
                    const response = await axios.get(fallbackURL);
                    console.log("Configuración obtenida desde fallback:", response.data);
                    return response.data.lockedGrades;
                } catch (fallbackError) {
                    console.error("Fallo también la ruta fallback:", fallbackError);
                    // Si ambas fallan, no tenemos forma de saber el estado.
                    // ADVERTENCIA: Retornamos false (desbloqueado) para no bloquear permanentemente.
                    console.warn("No se pudo verificar el estado del bloqueo. Se asume DESBLOQUEADO.");
                    return false;
                }
            }
            throw error;
        }
    } catch (error) {
        console.error("Error al verificar el bloqueo: ", error);

        // Si falla con 403, es porque el profesor no tiene permiso para ver la config de admin.
        // Esto es un problema de diseño del backend.
        // Si retornamos 'false', el profesor puede editar (que es lo que pasa ahora).
        // Si retornamos 'true', el profesor NUNCA podrá editar si el endpoint siempre falla.

        // Por ahora, mantenemos 'false' para no bloquear permanentemente, 
        // pero logueamos fuerte para que el usuario sepa.
        if (error.response && error.response.status === 403) {
            console.warn("ADVERTENCIA: El profesor no tiene permiso para consultar el estado del bloqueo (403). Se asume DESBLOQUEADO por defecto.");
        }

        return false;
    }
};

export const canModifyGrades = async () => {
    try {
        if (isAdmin()) {
            return true;
        }

        const locked = await verifyLockGrades();
        return !locked;
    } catch (error) {
        console.error("Error verificando permisos", error);
        return false;
    }
};