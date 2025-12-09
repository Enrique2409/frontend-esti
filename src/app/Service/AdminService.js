import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const adminURL = `${baseURL}/admin`;

const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

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

export const getAdminsPaginated = async (page = 0, size = 10, setAdmins, setPagination) => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.log("No hay token de autenticación");
            setAdmins([]);
            setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
            return;
        }

        const response = await axios.get(`${adminURL}/`, {
            params: { page, size },
            headers: { "Authorization": `Bearer ${token}` }
        });

        const admins = response.data.content || [];
        setAdmins(admins);

        const pagination = {
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements,
            currentPage: response.data.number,
            pageSize: response.data.size,
            numberOfElements: response.data.numberOfElements,
            first: response.data.first,
            last: response.data.last
        };
        setPagination(pagination);

    } catch (error) {
        console.error("Error al obtener administradores paginados:", error);
        setAdmins([]);
        setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
    }
};

export const searchAdmins = async (keyword, page = 0, size = 10, setAdmins, setPagination) => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.log("No hay token de autenticación");
            setAdmins([]);
            setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
            return;
        }

        const response = await axios.get(`${adminURL}/search`, {
            params: { keyword, page, size },
            headers: { "Authorization": `Bearer ${token}` }
        });

        const admins = response.data.content || [];
        setAdmins(admins);

        const pagination = {
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements,
            currentPage: response.data.number,
            pageSize: response.data.size,
            numberOfElements: response.data.numberOfElements,
            first: response.data.first,
            last: response.data.last
        };
        setPagination(pagination);

    } catch (error) {
        console.error("Error al buscar administradores:", error);
        setAdmins([]);
        setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
    }
};

export const addAdmin = async (admin) => {
    try {
        console.log(getAuthToken());
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

