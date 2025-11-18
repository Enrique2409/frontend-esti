// src/services/PeriodService.js
import axios from "axios";

const baseURL = "http://localhost:8080/esti";
const periodURL = `${baseURL}/period`;

const getAuthToken = () => localStorage.getItem("token");
console.log("Token de autenticación:", getAuthToken());

/**
 * Obtiene periodos paginados
 */
export const getPeriodsPaginated = async (
  page = 0,
  size = 10,
  setPeriods,
  setPagination
) => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      setPeriods([]);
      setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
      return;
    }

    const response = await axios.get(`${periodURL}/`, {
      params: { page, size },
      headers: { Authorization: `Bearer ${token}` },
    });

    const periods = response.data.content || [];
    setPeriods(periods);

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
    console.error("Error al obtener periodos paginados:", error);
    setPeriods([]);
    setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
  }
};

/**
 * Obtiene todos los periodos (sin paginar)
 * GET /esti/period/all
 */
export const getAllPeriods = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      return [];
    }

    const response = await axios.get(`${periodURL}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data || [];
  } catch (error) {
    console.error("Error al obtener todos los periodos:", error);
    return [];
  }
};

/**
 * Obtiene todos los periodos activos (sin paginar)
 * GET /esti/period/active
 */
export const getAllActivePeriods = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      return [];
    }

    const response = await axios.get(`${periodURL}/active`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data || [];
  } catch (error) {
    console.error("Error al obtener periodos activos:", error);
    return [];
  }
};

/**
 * Crea un nuevo periodo
 * POST /esti/period/create-period
 * body: { cve, description }
 */
export const addPeriod = async (period) => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      return null;
    }

    // Solo mandamos lo que espera el PeriodForm
    const payload = {
      cve: period.cve,
      description: period.description,
    };

    const response = await axios.post(`${periodURL}/create-period`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Periodo agregado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al agregar periodo:", error);
    throw error;
  }
};

/**
 * Actualiza un periodo existente
 * PATCH /esti/period/{idPeriod}
 * body: { cve, description }
 */
export const updatePeriod = async (period) => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      return null;
    }

    const { idPeriod, cve, description } = period;

    const payload = {
      cve,
      description,
    };

    const response = await axios.patch(`${periodURL}/${idPeriod}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Periodo actualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar periodo:", error);
    throw error;
  }
};

/**
 * Eliminación lógica de un periodo
 * DELETE /esti/period/{periodId}
 */
export const deletePeriod = async (idPeriod) => {
  console.log("periodId (delete lógico):", idPeriod);

  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      return;
    }

    const response = await axios.delete(`${periodURL}/${idPeriod}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Periodo eliminado lógicamente:", response.data);
  } catch (error) {
    console.error("Error al eliminar periodo (lógico):", error);
    throw error;
  }
};

/**
 * Eliminación física de un periodo
 * DELETE /esti/period/{periodId}/hard
 */
export const deletePeriodHard = async (idPeriod) => {
  console.log("periodId (delete físico):", idPeriod);

  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      return;
    }

    const response = await axios.delete(`${periodURL}/${idPeriod}/hard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Periodo eliminado físicamente:", response.data);
  } catch (error) {
    console.error("Error al eliminar periodo (hard):", error);
    throw error;
  }
};

/**
 * Obtiene un periodo por ID
 * GET /esti/period/{periodId}
 */
export const getPeriodById = async (idPeriod) => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No hay token de autenticación");
      return null;
    }

    const response = await axios.get(`${periodURL}/${idPeriod}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener el periodo por ID:", error);
    throw error;
  }
};
