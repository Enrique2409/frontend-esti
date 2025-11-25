import axios from "axios";

const systemConfigURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/system`;

const getAuthToken = () => localStorage.getItem("token");

export const getSystemConfig = async () => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.log("No hay token de autenticación");
            throw new Error("No hay token de autenticación");
        }

        const response = await axios.get(`${systemConfigURL}/config`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener configuración del sistema: ", error);
        throw error;
    }
};

export const changeStatusGrades = async (lock, notes = "") => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.log("No hay token de autenticación");
            throw new Error("No hay token de autenticación");
        }
        const response = await axios.post(
            `${systemConfigURL}/cardex/lock`, {
            lock: lock,
            notes: notes,
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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
        const config = await getSystemConfig();
        return config.lockedGrades;
    } catch (error) {
        console.error("Error al verificar el bloqueo: ", error);
        return false;
    }
};