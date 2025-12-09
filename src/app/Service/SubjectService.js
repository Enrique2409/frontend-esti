import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const subjectURL = `${baseURL}/subject`;

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

export const getSubjectsPaginated = async (
  page = 0,
  size = 10,
  setSubjects,
  setPagination
) => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      setSubjects([]),
        setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
      return;
    }

    const response = await axios.get(`${subjectURL}/`, {
      params: { page, size },
      headers: { Authorization: `Bearer ${token}` },
    });

    const subjects = response.data.content || [];
    setSubjects(subjects);

    const pagination = {
      totalPages: response.data.totalPages,
      totalElements: response.data.totalElements,
      currentPage: response.data.number,
      pageSize: response.data.size,
      numberOfElements: response.data.numberOfElements,
      first: response.data.first,
      last: response.data.last,
    };
    setPagination(pagination);
  } catch (error) {
    console.log("Error al obtener las materias paginadas:", error);
    setSubjects([]);
    setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
  }
};

export const addSubject = async (subject) => {
  try {
    const response = await axios.post(`${subjectURL}/create`, subject, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Materia agregada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al agregar materia:", error);
    throw error;
  }
};

export const updateSubject = async (subject) => {
  try {
    const response = await axios.patch(
      `${subjectURL}/${subject.idSubject}`,
      subject,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Materia actualizada:", response.data);
  } catch (error) {
    console.error("Error al actualizar materia:", error);
  }
};

export const deleteSubject = async (idSubject) => {
  console.log("subjectId:", idSubject);

  try {
    const response = await axios.delete(`${subjectURL}/${idSubject}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Materia eliminada:", response.data);
  } catch (error) {
    console.error("Error al eliminar materia:", error);
  }
};

export const searchSubjects = async (
  keyword,
  page = 0,
  size = 10,
  setSubjects,
  setPagination
) => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      setSubjects([]);
      setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
      return;
    }

    const response = await axios.get(`${subjectURL}/search`, {
      params: { keyword, page, size },
      headers: { Authorization: `Bearer ${token}` },
    });

    const subjects = response.data.content || [];
    setSubjects(subjects);

    const pagination = {
      totalPages: response.data.totalPages,
      totalElements: response.data.totalElements,
      currentPage: response.data.number,
      pageSize: response.data.size,
      numberOfElements: response.data.numberOfElements,
      first: response.data.first,
      last: response.data.last,
    };
    setPagination(pagination);
  } catch (error) {
    console.error("Error al buscar materias:", error);
    setSubjects([]);
    setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
  }
};
