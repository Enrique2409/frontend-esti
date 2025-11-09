// TeacherSubjectService.js
import axios from "axios";

const baseURL = "http://localhost:8080/esti";
const teacherSubjectURL = `${baseURL}/tsg`;

// Igual que en TeacherService
const getAuthToken = () => localStorage.getItem("token");
console.log("Token de autenticación (TSG):", getAuthToken());

const getAuthHeaders = () => ({
  "Authorization": `Bearer ${getAuthToken()}`,
  "Content-Type": "application/json",
});

// Obtener materias/grupos por profesor
export const getSubjectsByTeacher = async (idTeacher) => {
  try {
    const response = await axios.get(
      `${teacherSubjectURL}/by-teacher/${idTeacher}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener materias del profesor:", error);
    throw error;
  }
};

// Crear relación Teacher-Subject-Group
export const createTeacherSubject = async (teacherSubjectData) => {
  console.log("Payload createTeacherSubject:", teacherSubjectData);
  try {
    const response = await axios.post(
      `${teacherSubjectURL}/create-tsg`,
      teacherSubjectData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear teacherSubjectGroup:", error);
    throw error;
  }
};

// Eliminar relación Teacher-Subject-Group
export const deleteTeacherSubject = async (idTeacherSubject) => {
  try {
    const response = await axios.delete(
      `${teacherSubjectURL}/${idTeacherSubject}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar teacherSubjectGroup:", error);
    throw error;
  }
};
