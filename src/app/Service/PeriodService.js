// src/services/PeriodService.js
import axios from "../../../lib/axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const periodURL = `${baseURL}/period`;



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
    const response = await axios.get(`${periodURL}/`, {
      params: { page, size },
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
    const response = await axios.get(`${periodURL}/all`);

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
    const response = await axios.get(`${periodURL}/active`);

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
    const response = await axios.post(`${periodURL}/create-period`, payload, {
      headers: {
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
    const response = await axios.patch(`${periodURL}/${idPeriod}`, payload, {
      headers: {
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
    const response = await axios.delete(`${periodURL}/${idPeriod}`, {
      headers: {
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
    const response = await axios.delete(`${periodURL}/${idPeriod}/hard`, {
      headers: {
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
    const response = await axios.get(`${periodURL}/${idPeriod}`);

    return response.data;
  } catch (error) {
    console.error("Error al obtener el periodo por ID:", error);
    throw error;
  }
};
