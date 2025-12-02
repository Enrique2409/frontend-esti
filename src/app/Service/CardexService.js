// CardexService.js
import axios from "axios";
import { verifyLockGrades } from "./SystemConfigService";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const cardexURL = `${baseURL}/cardex`;

const getAuthToken = () => localStorage.getItem("token");

const isTeacher = () => {
  const role = localStorage.getItem("role");
  return role === "TEACHER";
};

export const canModifyGrades = async () => {
  if (!isTeacher()) {
    return true; // Los admins siempre pueden modificar
  }

  try {
    const isLocked = await verifyLockGrades();
    return !isLocked; // Retorna true si NO está bloqueado
  } catch (error) {
    console.error("Error verificando bloqueo:", error);
    return false; // Por seguridad, no permitir si hay error
  }
};


/**
 * Obtener cardex paginado
 * GET /esti/cardex/?page=&size=
 */
export const getCardexPaginated = async (
  page = 0,
  size = 10,
  setCardex,
  setPagination
) => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      setCardex?.([]);
      setPagination?.({
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        pageSize: size,
        numberOfElements: 0,
        first: true,
        last: true,
      });
      return;
    }

    const response = await axios.get(`${cardexURL}/`, {
      params: { page, size },
      headers: { Authorization: `Bearer ${token}` },
    });

    const cardexList = response.data.content || [];
    setCardex?.(cardexList);

    const pagination = {
      totalPages: response.data.totalPages,
      totalElements: response.data.totalElements,
      currentPage: response.data.number,
      pageSize: response.data.size,
      numberOfElements: response.data.numberOfElements,
      first: response.data.first,
      last: response.data.last,
    };

    setPagination?.(pagination);
  } catch (error) {
    console.error("Error al obtener cardex paginado:", error);
    setCardex?.([]);
    setPagination?.({
      totalPages: 0,
      totalElements: 0,
      currentPage: 0,
      pageSize: size,
      numberOfElements: 0,
      first: true,
      last: true,
    });
  }
};

/**
 * Buscar cardex por keyword (nombre alumno, grupo, materia, etc.)
 * GET /esti/cardex/search?keyword=&page=&size=
 */
export const searchCardex = async (
  keyword,
  page = 0,
  size = 10,
  setCardex,
  setPagination
) => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      setCardex?.([]);
      setPagination?.({
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        pageSize: size,
        numberOfElements: 0,
        first: true,
        last: true,
      });
      return;
    }

    const response = await axios.get(`${cardexURL}/search`, {
      params: { keyword, page, size },
      headers: { Authorization: `Bearer ${token}` },
    });

    const cardexList = response.data.content || [];
    setCardex?.(cardexList);

    const pagination = {
      totalPages: response.data.totalPages,
      totalElements: response.data.totalElements,
      currentPage: response.data.number,
      pageSize: response.data.size,
      numberOfElements: response.data.numberOfElements,
      first: response.data.first,
      last: response.data.last,
    };

    setPagination?.(pagination);
  } catch (error) {
    console.error("Error al buscar cardex:", error);
    setCardex?.([]);
    setPagination?.({
      totalPages: 0,
      totalElements: 0,
      currentPage: 0,
      pageSize: size,
      numberOfElements: 0,
      first: true,
      last: true,
    });
  }
};

/**
 * Buscar alumnos de un maestro con filtros (para vistas de profesor)
 * GET /esti/cardex/searchbyTeacher?teacherId=&subjectId=&groupName=&grade=&keyword=&page=&size=
 */
export const searchStudentsByTeacher = async (
  teacherId,
  subjectId,
  groupName,
  grade,
  keyword,
  page = 0,
  size = 10,
  setCardex,
  setPagination
) => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      setCardex?.([]);
      setPagination?.({
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        pageSize: size,
        numberOfElements: 0,
        first: true,
        last: true,
      });
      return;
    }

    const response = await axios.get(`${cardexURL}/searchbyTeacher`, {
      params: {
        teacherId,      // obligatorio en el backend
        subjectId,      // opcional
        groupName,      // opcional
        grade,          // opcional
        keyword,        // opcional
        page,
        size,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    const cardexList = response.data.content || [];
    setCardex?.(cardexList);

    const pagination = {
      totalPages: response.data.totalPages,
      totalElements: response.data.totalElements,
      currentPage: response.data.number,
      pageSize: response.data.size,
      numberOfElements: response.data.numberOfElements,
      first: response.data.first,
      last: response.data.last,
    };

    setPagination?.(pagination);
  } catch (error) {
    console.error("Error al buscar alumnos del maestro en cardex:", error);
    setCardex?.([]);
    setPagination?.({
      totalPages: 0,
      totalElements: 0,
      currentPage: 0,
      pageSize: size,
      numberOfElements: 0,
      first: true,
      last: true,
    });
  }
};

/**
 * Crear un registro de cardex
 * POST /esti/cardex/create-cardex
 * Body = CardexForm:
 * {
 *   studentId,
 *   teacherSubjectId,
 *   periodId,
 *   firstPartial,
 *   secondPartial,
 *   thirdPartial,
 *   finalGrade
 * }
 */
export const createCardex = async (cardexForm) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${cardexURL}/create-cardex`,
      cardexForm,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Cardex creado:", response.data);
    return response.data; // CardexDTO
  } catch (error) {
    console.error("Error al crear cardex:", error);
    throw error;
  }
};

/**
 * Actualizar un registro de cardex
 * PATCH /esti/cardex/{cardexId}
 * Body = CardexForm (mismas propiedades que create)
 */
export const updateCardex = async (cardexId, cardexForm) => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(
      `${cardexURL}/${cardexId}`,
      cardexForm,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Cardex actualizado:", response.data);
    return response.data; // CardexDTO
  } catch (error) {
    console.error("Error al actualizar cardex:", error);
    throw error;
  }
};

/**
 * Borrado lógico de cardex
 * DELETE /esti/cardex/{cardexId}
 */
export const deleteCardex = async (cardexId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${cardexURL}/${cardexId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Cardex eliminado (lógico):", response.data);
  } catch (error) {
    console.error("Error al eliminar cardex (lógico):", error);
    throw error;
  }
};

/**
 * Borrado físico de cardex
 * DELETE /esti/cardex/{cardexId}/hard
 */
export const deleteCardexHard = async (cardexId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${cardexURL}/${cardexId}/hard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Cardex eliminado (hard):", response.data);
  } catch (error) {
    console.error("Error al eliminar cardex (hard):", error);
    throw error;
  }
};

/**
 * Obtener cardex por ID
 * GET /esti/cardex/{cardexId}
 */
export const getCardexById = async (cardexId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${cardexURL}/${cardexId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // CardexDTO
  } catch (error) {
    console.error("Error al obtener cardex por ID:", error);
    throw error;
  }
};

/**
 * Obtener TODOS los cardex (no paginado)
 * GET /esti/cardex/getAll
 */
export const getAllCardex = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${cardexURL}/getAll`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // List<CardexDTO>
  } catch (error) {
    console.error("Error al obtener todos los cardex:", error);
    throw error;
  }
};

/**
 * Filtrar por grupo
 * GET /esti/cardex/by-group/{groupId}
 */
export const getCardexByGroup = async (groupId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${cardexURL}/by-group/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // List<CardexDTO>
  } catch (error) {
    console.error("Error al obtener cardex por grupo:", error);
    throw error;
  }
};

/**
 * Filtrar por alumno
 * GET /esti/cardex/by-student/{studentId}
 */
export const getCardexByStudent = async (studentId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${cardexURL}/by-student/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // List<CardexDTO>
  } catch (error) {
    console.error("Error al obtener cardex por alumno:", error);
    throw error;
  }
};

/**
 * Filtrar por maestro
 * GET /esti/cardex/by-teacher/{teacherId}
 */
export const getCardexByTeacher = async (teacherId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${cardexURL}/by-teacher/${teacherId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // List<CardexDTO>
  } catch (error) {
    console.error("Error al obtener cardex por maestro:", error);
    throw error;
  }
};

/**
 * Filtrar por materia
 * GET /esti/cardex/by-subject/{subjectId}
 */
export const getCardexBySubject = async (subjectId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${cardexURL}/by-subject/${subjectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // List<CardexDTO>
  } catch (error) {
    console.error("Error al obtener cardex por materia:", error);
    throw error;
  }
};
