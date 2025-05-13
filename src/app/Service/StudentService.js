import axios from "axios";

const baseURL = "http://localhost:8080/esti";
const adminURL = `${baseURL}/admin`;

const getAuthToken = () => localStorage.getItem("token");
console.log("Token de autenticación:", getAuthToken());

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


export const getAllAdmin = async (setAdmins) => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.log("No hay token de autenticación");
            setAdmins([]);
            return;
        }

        const response = await axios.get(`${adminURL}/getAll`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setAdmins(response.data);
    } catch (error) {
        console.error("Error al obtener administradores:", error);
        setAdmins([]);
    }
};

export const addAdmin = async (admin) => {
    try {
        const response = await axios.post(`${adminURL}/`, admin, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Administrador agregado:", response.data);
    } catch (error) {
        console.error("Error al agregar administrador:", error);
    }
};

export const updateAdmin = async (admin) => {
    try {
        const response = await axios.patch(`${adminURL}/${admin.idAdmin}`, admin, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Administrador actualizado:", response.data);
    } catch (error) {
        console.error("Error al actualizar administrador:", error);
    }
};

export const deleteAdmin = async (idAdmin) => {
    console.log("adminId:", idAdmin);

    try {
        const response = await axios.delete(`${adminURL}/${idAdmin}`, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Administrador eliminado:", response.data);
    } catch (error) {
        console.error("Error al eliminar administrador:", error);
    }
};

