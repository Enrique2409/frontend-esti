import axios from "axios";

const baseURL = "http://localhost:8080/esti";
const teacherURL = `${baseURL}/teacher`;

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
//Borrar
/*
export const getAllTeachersAsAdmin = async (setTeachers) => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.log("No hay token de autenticación");
            setTeachers([]);
            return;
        }

        const response = await axios.get(`${teacherURL}/active`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setTeachers(response.data);
    } catch (error) {
        console.error("Error al obtener profesores:", error);
        setTeachers([]);
    }
};
*/

export const getTeachersPaginated = async (page = 0, size = 10, setTeachers, setPagination) => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.log("No hay token de autenticación");
            setTeachers([]);
            setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
            return;
        }

        const response = await axios.get(`${teacherURL}/`, {
            params: { page, size },
            headers: { "Authorization": `Bearer ${token}` }
        });

        const teacher = response.data.content || [];
        setTeachers(teacher);

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
        console.error("Error al obtener profesores paginados:", error);
        setTeachers([]);
        setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
    }
};

export const addTeacher = async (teacher) => {
    try {
        const response = await axios.post(`${teacherURL}/create`, teacher, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Profesor agregado:", response.data);
    } catch (error) {
        console.error("Error al agregar profesor:", error);
    }
};

export const updateTeacher = async (teacher) => {
    try {
        const response = await axios.patch(`${teacherURL}/${teacher.idTeacher}`, teacher, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Profesor actualizado:", response.data);
    } catch (error) {
        console.error("Error al actualizar profesor:", error);
    }
};

export const deleteTeacher = async (idTeacher) => {
    console.log("teacherId:", idTeacher);

    try {
        const response = await axios.delete(`${teacherURL}/${idTeacher}`, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Profesor eliminado:", response.data);
    } catch (error) {
        console.error("Error al eliminar profesor:", error);
    }
};
