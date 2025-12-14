import axios from "../../../lib/axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const levelURL = `${baseURL}/level`;



export const getAllLevels = async (setLevels) => {
    try {
        const response = await axios.get(`${levelURL}/getAll`);
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