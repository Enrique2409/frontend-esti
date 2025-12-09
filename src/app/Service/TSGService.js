import axios from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/tsg`;

const getAuthToken = () => localStorage.getItem("token");

export const getTSGByGroup = async (groupId) => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.log("No hay token de autenticación");
            return [];
        }

        const response = await axios.get(`${baseURL}/by-group/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("TSG data:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error al obtener TSG por grupo:", error);
        return [];
    }
};
