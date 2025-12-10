import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const baseFiles = baseURL.replace("/esti", "");
const contentURL = `${baseURL}/content`;

const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

export const getAllContent = async (setContent) => {
  try {
    const response = await axios.get(`${contentURL}/all`);

    const data = response.data.map(item => ({
      ...item,
      imageURL: item.imageURL?.startsWith("http")
        ? item.imageURL
        : `${baseFiles}${item.imageURL}`
    }));

    setContent(data);
  } catch (error) {
    console.error("Error al obtener contenido:", error);
    setContent([]);
  }
};

export const getActiveContent = async (setContent) => {
  try {
    const response = await axios.get(`${contentURL}/active`);
    setContent(response.data);
  } catch (error) {
    console.error("Error al obtener contenido activo:", error);
    setContent([]);
  }
};

export const getContentByCategory = async (category, setContent) => {
  try {
    const response = await axios.get(`${contentURL}/category/${category}`);
    setContent(response.data);
  } catch (error) {
    console.error("Error al obtener por categoría:", error);
    setContent([]);
  }
};

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

export const getContentById = async (id) => {
  try {
    const response = await axios.get(`${contentURL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener contenido por ID:", error);
    throw error;
  }
};


export const getActiveContentByCategory = async (category, setContent) => {
  try {
    const response = await axios.get(
      `${contentURL}/category/${category}/active`
    );

    const data = response.data.map((item) => ({
      ...item,
      imageURL: item.imageURL?.startsWith("http")
        ? item.imageURL
        : `${baseFiles}${item.imageURL}`,
    }));

    setContent(data);
  } catch (error) {
    console.error("Error al obtener contenido activo por categoría:", error);
    setContent([]);
  }
};



