import axios from "axios";

const baseURL = "http://localhost:8080/esti";
const contentURL = `${baseURL}/content`;

const getAuthToken = () => localStorage.getItem("token");

/* ✅ OBTENER TODOS */
export const getAllContent = async (setContent) => {
  try {
    const response = await axios.get(`${contentURL}/all`);
    setContent(response.data);
  } catch (error) {
    console.error("Error al obtener contenido:", error);
    setContent([]);
  }
};

/* ✅ OBTENER SOLO ACTIVOS */
export const getActiveContent = async (setContent) => {
  try {
    const response = await axios.get(`${contentURL}/active`);
    setContent(response.data);
  } catch (error) {
    console.error("Error al obtener contenido activo:", error);
    setContent([]);
  }
};

/* ✅ OBTENER POR CATEGORÍA */
export const getContentByCategory = async (category, setContent) => {
  try {
    const response = await axios.get(`${contentURL}/category/${category}`);
    setContent(response.data);
  } catch (error) {
    console.error("Error al obtener por categoría:", error);
    setContent([]);
  }
};

/* ✅ CREAR CONTENIDO (CON IMAGEN) */
export const createContent = async (formData) => {
  try {
    const response = await axios.post(`${contentURL}/`, formData, {
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`,
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error al crear contenido:", error);
    throw error;
  }
};

/* ✅ ACTUALIZAR CONTENIDO */
export const updateContent = async (id, formData) => {
  try {
    const response = await axios.put(`${contentURL}/update/${id}`, formData, {
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`,
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error al actualizar contenido:", error);
    throw error;
  }
};

/* ✅ OBTENER POR ID */
export const getContentById = async (id) => {
  try {
    const response = await axios.get(`${contentURL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener contenido por ID:", error);
    throw error;
  }
};
