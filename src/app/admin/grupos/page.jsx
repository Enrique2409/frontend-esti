"use client";

import Navbar from "../components/navbar";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";
import Swal from "sweetalert2";
import {
  getAllGroups,
  addGroup,
  updateGroup,
  deleteGroup,
} from "@/app/Service/GroupService";

export default function PageGroups() {
  const [groups, setGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    idGroup: "",
    groupName: "",
    grade: "",
  });

  const fetchGroups = async () => {
    await getAllGroups(setGroups);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Reset página cuando cambie el tamaño o el término de búsqueda
  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize, searchTerm]);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleOpenModal = (group = null) => {
    if (group) {
      setFormData({
        idGroup: group.idGroup,
        groupName: group.groupName || "",
        grade: group.grade ?? "",
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
      idGroup: "",
      groupName: "",
      grade: "",
    });
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Aseguramos que grade sea numérico pero guardado como string en el input
    if (name === "grade") {
      if (value === "") {
        value = "";
      } else {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) return;
        value = parsed;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formToSend = {
      ...formData,
      // Nos aseguramos de que grade sea número o null
      grade:
        formData.grade === "" || formData.grade === null
          ? null
          : Number(formData.grade),
    };

    if (!formToSend.groupName || formToSend.groupName.trim() === "") {
      Swal.fire("Error", "El nombre del grupo es obligatorio", "error");
      return;
    }

    try {
      if (formData.idGroup) {
        await updateGroup(formToSend);
      } else {
        delete formToSend.idGroup;
        await addGroup(formToSend);
      }
      await fetchGroups();
      handleCloseModal();
      Swal.fire("Éxito", "Grupo guardado correctamente", "success");
    } catch (error) {
      console.error("Error al guardar el grupo:", error);
      Swal.fire("Error", "No se pudo guardar el grupo", "error");
    }
  };

  const handleDeleteGroup = async (idGroup) => {
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
        await deleteGroup(idGroup);
        await fetchGroups();
        Swal.fire("Eliminado", "El grupo ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error eliminando grupo:", error);
        Swal.fire("Error", "No se pudo eliminar el grupo.", "error");
      }
    }
  };

  // --- BÚSQUEDA Y PAGINACIÓN EN FRONT ---

  const filteredGroups = groups.filter((group) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();

    const nameMatch =
      group.groupName &&
      group.groupName.toLowerCase().includes(term);

    const gradeMatch =
      group.grade !== null &&
      group.grade !== undefined &&
      String(group.grade).toLowerCase().includes(term);

    return nameMatch || gradeMatch;
  });

  const totalElements = filteredGroups.length;
  const totalPages =
    totalElements > 0 ? Math.ceil(totalElements / pageSize) : 1;

  const currentPageSafe =
    currentPage >= totalPages ? totalPages - 1 : currentPage;

  const startIndex = currentPageSafe * pageSize;
  const paginatedGroups = filteredGroups.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleNextPage = () => {
    if (currentPageSafe + 1 < totalPages) {
      setCurrentPage(currentPageSafe + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageSafe > 0) {
      setCurrentPage(currentPageSafe - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="ml-64 min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8">
        <TableHeader
          title="Grupos"
          onAdd={() => handleOpenModal()}
          buttonLabel="Nuevo Grupo"
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
                    {["ID", "Nombre del Grupo", "Grado", "Acciones"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedGroups.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No se encontraron grupos.
                      </td>
                    </tr>
                  ) : (
                    paginatedGroups.map((group) => (
                      <tr
                        key={group.idGroup}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {group.idGroup}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {group.groupName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {group.grade ?? "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenModal(group)}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteGroup(group.idGroup)
                              }
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
                disabled={currentPageSafe === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {totalElements === 0 ? 0 : currentPageSafe + 1} de{" "}
                {totalElements === 0 ? 0 : totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPageSafe + 1 >= totalPages}
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
        title={formData.idGroup ? "Editar Grupo" : "Nuevo Grupo"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del grupo */}
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre del Grupo
            </label>
            <input
              type="text"
              name="groupName"
              id="groupName"
              value={formData.groupName}
              onChange={handleChange}
              required
              maxLength={100}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Grado */}
          <div>
            <label
              htmlFor="grade"
              className="block text-sm font-medium text-gray-700"
            >
              Grado
            </label>
            <input
              type="number"
              name="grade"
              id="grade"
              value={formData.grade}
              onChange={handleChange}
              min={1}
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
              {formData.idGroup ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
