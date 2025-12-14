import axios from "../../../lib/axios";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/tsg`;



export const getTSGByGroup = async (groupId) => {
    try {
        const response = await axios.get(`${baseURL}/by-group/${groupId}`);
        console.log("TSG data:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error al obtener TSG por grupo:", error);
        return [];
    }
};
