import axios from "axios";

const baseURL = "http://localhost:8080/esti/content/category";

export const getCarousel = async () => {
  try {
    const response = await axios.get(`${baseURL}/Carrusel`);
    return response.data.map(item => ({
      ...item,
      imageURL: `http://localhost:8080${item.imageURL}`
    }));
  } catch (error) {
    console.error("Error al obtener carrusel:", error);
    return [];
  }
};

export const getCards = async () => {
  try {
    const response = await axios.get(`${baseURL}/Card`);
    return response.data.map(item => ({
      ...item,
      imageURL: `http://localhost:8080${item.imageURL}`
    }));
  } catch (error) {
    console.error("Error al obtener cards:", error);
    return [];
  }
};

export const getNews = async () => {
  try {
    const response = await axios.get(`${baseURL}/News`);
    return response.data.map(item => ({
      ...item,
      imageURL: `http://localhost:8080${item.imageURL}`
    }));
  } catch (error) {
    console.error("Error al obtener noticias:", error);
    return [];
  };

  };

  export const getContact = async () => {
  try {
    const response = await axios.get(`${baseURL}/Contact`);
    return response.data.map(item => ({
      ...item,
      imageURL: `http://localhost:8080${item.imageURL}`,
    }));
  } catch (error) {
    console.error("Error al obtener Contact:", error);
    return [];
  }
};

export const getServicesByCategory = async (categoryName) => {
  try {
    const response = await axios.get(`${baseURL}/${categoryName}`);
    return response.data.map(item => ({
      ...item,
      image: item.image ? `http://localhost:8080${item.image}` : null,
      imageURL: item.imageURL ? `http://localhost:8080${item.imageURL}` : null,
    }));
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    return [];
  }
};