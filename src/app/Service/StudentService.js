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

        const response = await axios.get(`${studentURL}/active`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        setStudents(response.data);
    } catch (error) {
        console.error("Error al obtener estudiantes:", error);
        setStudents([]);
    }
};

export const getStudentsByGroup = async (groupId, setStudents) => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      setStudents([]);
      return;
    }

    const response = await axios.get(`${studentURL}/group/${groupId}`, {
      headers: { "Authorization": `Bearer ${token}` },
    });

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
                "Authorization": `Bearer ${getAuthToken()}`,
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
                "Authorization": `Bearer ${getAuthToken()}`,
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
                "Authorization": `Bearer ${getAuthToken()}`,
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
