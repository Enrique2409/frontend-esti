import axios from "axios";

const baseURL = "http://localhost:8080/esti";
const studentURL = `${baseURL}/student`;

const getAuthToken = () => localStorage.getItem("token");

export const getAllStudents = async (setStudents) => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.log("No hay token de autenticación");
            setStudents([]);
            return;
        }

        const response = await axios.get(`${studentURL}/all`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setStudents(response.data);
    } catch (error) {
        console.error("Error al obtener estudiantes:", error);
        setStudents([]);
    }
};

export const createStudent = async (student) => {
    try {

    } catch (error) {
        console.error("Error al crear estudiante:", error);
    }
};

export const updateStudent = async (student) => {
    try {

    } catch (error) {
        console.error("Error al actualizar estudiante:", error);
    }
};

export const deleteStudent = async (idStudent) => {
    try {

    } catch (error) {
        console.error("Error al eliminar estudiante permanentemente:", error);
    }
};

export const getStudentById = async (idStudent, setStudent) => {
    try {
        const response = await axios.get(`${studentURL}/${idStudent}`, {
            headers: {
                "Authorization": `Bearer ${getAuthToken()}`
            }
        });
        setStudent(response.data);
    } catch (error) {
        console.error("Error al obtener estudiante por ID:", error);
        setStudent(null);
    }
};
