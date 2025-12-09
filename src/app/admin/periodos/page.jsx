"use client";

import Navbar from "../components/navbar";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";
import Swal from "sweetalert2";
import {
  getPeriodsPaginated,
  addPeriod,
  updatePeriod,
  deletePeriod,
} from "@/app/Service/PeriodService";

export default function PagePeriods() {
  const [periods, setPeriods] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
  });
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    idPeriod: "",
    cve: "",
    description: "",
  });

  useEffect(() => {
    fetchPeriods(0);
  }, [pageSize]);

  const fetchPeriods = async (page) => {
    await getPeriodsPaginated(page, pageSize, setPeriods, setPagination);
  };

  const handleNextPage = () => {
    if (pagination.currentPage + 1 < pagination.totalPages) {
      fetchPeriods(pagination.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 0) {
      fetchPeriods(pagination.currentPage - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleOpenModal = (period = null) => {
    if (period) {
      setFormData({
        idPeriod: period.idPeriod,
        cve: period.cve || "",
        description: period.description || "",
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      idPeriod: "",
      cve: "",
      description: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formToSend = { ...formData };
    if (!formToSend.idPeriod) delete formToSend.idPeriod;

    try {
      if (formData.idPeriod) {
        await updatePeriod(formToSend);
      } else {
        await addPeriod(formToSend);
      }
      await fetchPeriods(pagination.currentPage);
      handleCloseModal();
      Swal.fire("Éxito", "Periodo guardado correctamente", "success");
    } catch (error) {
      console.error("Error al guardar el periodo:", error);
      Swal.fire("Error", "No se pudo guardar el periodo", "error");
    }
  };

  const handleDeletePeriod = async (idPeriod) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deletePeriod(idPeriod);
        await fetchPeriods(pagination.currentPage);
        Swal.fire("Eliminado", "El periodo ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error eliminando periodo:", error);
        Swal.fire("Error", "No se pudo eliminar el periodo.", "error");
      }
    }
  };

  // Búsqueda en el front sobre la página actual
  const filteredPeriods = periods.filter((period) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (period.cve && period.cve.toLowerCase().includes(term)) ||
      (period.description &&
        period.description.toLowerCase().includes(term))
    );
  });

  const formatDateTime = (value) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleString();
    } catch (e) {
      return value;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="ml-64 min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8">
        <TableHeader
          title="Periodos"
          onAdd={() => handleOpenModal()}
          buttonLabel="Nuevo Periodo"
        />

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <SearchBar onSearch={setSearchTerm} />

            <div className="mb-4">
              <label className="mr-2 font-medium text-gray-700">
                Registros por página:
              </label>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="border border-gray-300 rounded-md px-2 py-1"
              >
                <option value={1}>1</option>
                <option value={10}>10</option>
                <option value={30}>30</option>
              </select>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "ID",
                      "Clave",
                      "Descripción",
                      "Acciones",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPeriods.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No se encontraron periodos.
                      </td>
                    </tr>
                  ) : (
                    filteredPeriods.map((period) => (
                      <tr
                        key={period.idPeriod}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {period.idPeriod}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {period.cve}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {period.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenModal(period)}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeletePeriod(period.idPeriod)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrevPage}
                disabled={pagination.currentPage === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {pagination.currentPage + 1} de {pagination.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={pagination.currentPage + 1 >= pagination.totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de creación/edición */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={formData.idPeriod ? "Editar Periodo" : "Nuevo Periodo"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="cve"
              className="block text-sm font-medium text-gray-700"
            >
              Clave
            </label>
            <input
              type="text"
              name="cve"
              id="cve"
              value={formData.cve}
              onChange={handleChange}
              required
              maxLength={20}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={100}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {formData.idPeriod ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
