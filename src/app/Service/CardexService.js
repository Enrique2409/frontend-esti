import axios from "axios";

const baseURL = "http://localhost:8080/esti";
const cardexURL = `${baseURL}/cardex`;

const getAuthToken = () => localStorage.getItem("token");

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${baseURL}/auth/login`, credentials);
        const { token } = response.data;
        localStorage.setItem("token", token);
        return token;
    } catch (error) {
        console.error("Error en el login:", error);
        throw error;
    }
};


export const getAllCardex = async (setCardex) => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.log("No hay token de autenticación");
            setCardex([]);
            return;
        }

        const response = await axios.get(`${cardexURL}/getAll`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setCardex(response.data);
    } catch (error) {
        console.error("Error al obtener cardex:", error);
        setCardex([]);
    }
};

export const addCardex = async (cardex) => {
    try {
        const response = await axios.post(`${cardexURL}/create-cardex`, cardex, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Cardex agregado:", response.data);
    } catch (error) {
        console.error("Error al agregar cardex:", error);
    }
};

export const updateCardex = async (cardex) => {
    try {
        const response = await axios.patch(`${cardexURL}/${cardex.idCardex}`, cardex, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Cardex actualizado:", response.data);
    } catch (error) {
        console.error("Error al actualizar cardex:", error);
    }
};

export const deleteCardex = async (idCardex) => {
    console.log("cardexId:", idCardex);

    try {
        const response = await axios.delete(`${cardexURL}/${idCardex}`, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Cardex eliminado:", response.data);
    } catch (error) {
        console.error("Error al eliminar cardex:", error);
    }
};

export const getCardexByGroup = async (groupId, setCardex) => {
    try {
        const token = getAuthToken();
        if (!token) {
            setCardex([]);
            return;
        }
        const response = await axios.get(`${cardexURL}/by-group/${groupId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setCardex(response.data);
    } catch (error) {
        console.error("Error al obtener cardex por grupo:", error);
        setCardex([]);
    }
};

export const getCardexByStudent = async (studentId, setCardex) => {
    try {
        const token = getAuthToken();
        if (!token) {
            setCardex([]);
            return;
        }
        const response = await axios.get(`${cardexURL}/by-student/${studentId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setCardex(response.data);
    } catch (error) {
        console.error("Error al obtener cardex por estudiante:", error);
        setCardex([]);
    }
};

export const getCardexByTeacher = async (teacherId, setCardex) => {
    try {
        const token = getAuthToken();
        if (!token) {
            setCardex([]);
            return;
        }
        const response = await axios.get(`${cardexURL}/by-teacher/${teacherId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setCardex(response.data);
    } catch (error) {
        console.error("Error al obtener cardex por profesor:", error);
        setCardex([]);
    }
};

export const getCardexBySubject = async (subjectId, setCardex) => {
    try {
        const token = getAuthToken();
        if (!token) {
            setCardex([]);
            return;
        }
        const response = await axios.get(`${cardexURL}/by-subject/${subjectId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setCardex(response.data);
    } catch (error) {
        console.error("Error al obtener cardex por materia:", error);
        setCardex([]);
    }
};

