import axios from "axios";

const baseURL = "http://localhost:8080/esti";
const levelURL = `${baseURL}/level`;

const getAuthToken = () => localStorage.getItem("token");

export const getAllLevels = async (setLevels) => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.log("No hay token de autenticación");
            setLevels([]);
            return;
        }

        const response = await axios.get(`${levelURL}/getAll`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setLevels(response.data);
    } catch (error) {
        console.error("Error al obtener niveles:", error);
        setLevels([]);
    }
};

export const addLevel = async (level) => {
    try {
        const response = await axios.post(`${levelURL}/create-level`, level, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Nivel agregado:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al agregar nivel:", error);
        throw error;
    }
};

export const updateLevel = async (level) => {
    try {
        const response = await axios.patch(`${levelURL}/${level.idLevel}`, level, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Nivel actualizado:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar nivel:", error);
        throw error;
    }
};

export const deleteLevel = async (idLevel) => {
    try {
        const response = await axios.delete(`${levelURL}/${idLevel}`, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Nivel eliminado:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar nivel:", error);
        throw error;
    }
};

export const getLevelById = async (idLevel) => {
    try {
        const response = await axios.get(`${levelURL}/${idLevel}`, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Nivel obtenido:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener nivel por ID:", error);
        throw error;
    }
};