import axios from "../../../lib/axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const teacherSubjectURL = `${baseURL}/tsg`;



// Obtener materias/grupos por profesor
export const getSubjectsByTeacher = async (idTeacher) => {
  try {
    const response = await axios.get(
      `${teacherSubjectURL}/by-teacher/${idTeacher}`
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
      { headers: { "Content-Type": "application/json" } }
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
      `${teacherSubjectURL}/${idTeacherSubject}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar teacherSubjectGroup:", error);
    throw error;
  }
};
