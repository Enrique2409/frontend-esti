import axios from "../../../lib/axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const groupURL = `${baseURL}/group`;



export const getAllGroups = async (setGroups) => {
    try {
        const response = await axios.get(`${groupURL}/active`);
        setGroups(response.data);
    } catch (error) {
        console.error("Error al obtener grupos:", error);
        setGroups([]);
    }
};

export const addGroup = async (group) => {
    try {
        const response = await axios.post(`${groupURL}/create-group`, group, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("Grupo agregado:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al agregar grupo:", error);
        throw error;
    }
};

export const updateGroup = async (group) => {
    try {
        const response = await axios.patch(`${groupURL}/${group.idGroup}`, group, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("Grupo actualizado:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar grupo:", error);
        throw error;
    }
};

export const deleteGroup = async (idGroup) => {
    try {
        const response = await axios.delete(`${groupURL}/${idGroup}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("Grupo eliminado:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar grupo:", error);
        throw error;
    }
};

export const getGroupById = async (idGroup) => {
    try {
        const response = await axios.get(`${groupURL}/${idGroup}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("Grupo obtenido:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener grupo por ID:", error);
        throw error;
    }
};

export const getGroupsByLevel = async (idLevel, setGroups) => {
    try {
        const response = await axios.get(`${groupURL}/byLevel/${idLevel}`);
        setGroups(response.data);
    } catch (error) {
        console.error("Error al obtener grupos por nivel:", error);
        setGroups([]);
    }
};