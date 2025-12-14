import axios from "../../../lib/axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const studentURL = `${baseURL}/student`;



//Borrar
/*
export const getAllStudents = async (setStudents) => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.log("No hay token de autenticación");
            setStudents([]);
            return;
        }

        const response = await axios.get(`${studentURL}/active`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setStudents(response.data);
    } catch (error) {
        console.error("Error al obtener estudiantes:", error);
        setStudents([]);
    }
};
*/

export const getStudentsPaginated = async (page = 0, size = 10, setStudents, setPagination) => {
    try {
        const response = await axios.get(`${studentURL}/`, {
            params: { page, size }
        });

        const students = response.data.content || [];
        setStudents(students);

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
        console.error("Error al obtener estudiantes paginados:", error);
        setStudents([]);
        setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
    }
};

export const searchStudents = async (keyword, page = 0, size = 10, setStudents, setPagination) => {
    try {
        const response = await axios.get(`${studentURL}/search`, {
            params: { keyword, page, size }
        });

        const students = response.data.content || [];
        setStudents(students);

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
        console.error("Error al buscar estudiantes:", error);
        setStudents([]);
        setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
    }
};


export const getStudentsByGroup = async (groupId, setStudents) => {
    try {
        const response = await axios.get(`${studentURL}/group/${groupId}`);

        setStudents(response.data);
    } catch (error) {
        console.error("Error al obtener alumnos por grupo:", error);
        setStudents([]);
    }
};

export const createStudent = async (student) => {
    try {
        const response = await axios.post(`${studentURL}/create-student`, student, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("Estudiante creado exitosamente:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al crear estudiante:", error.response?.data || error.message);
        throw error;
    }
};

export const updateStudent = async (student) => {
    try {
        const response = await axios.patch(`${studentURL}/${student.idStudent}`, student, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("Estudiante actualizado exitosamente:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar estudiante:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteStudent = async (idStudent) => {
    try {
        const response = await axios.delete(`${studentURL}/${idStudent}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("Estudiante eliminado lógicamente:", response.status);
    } catch (error) {
        console.error("Error al eliminar estudiante lógicamente:", error);
    }
};

export const getStudentById = async (idStudent, setStudent) => {
    try {
        const response = await axios.get(`${studentURL}/${idStudent}`);
        setStudent(response.data);
    } catch (error) {
        console.error("Error al obtener estudiante por ID:", error);
        setStudent(null);
    }
};
