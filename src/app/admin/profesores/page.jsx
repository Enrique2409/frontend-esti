"use client";

import Navbar from "../components/navbar";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";
import Swal from "sweetalert2";
import {
  getTeachersPaginated,
  searchTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
} from "@/app/Service/TeacherService";

export default function PageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
  });
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    idTeacher: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    fetchTeachers(0, searchTerm);
  }, [pageSize, searchTerm]);

  const fetchTeachers = async (page, keyword = "") => {
    if (keyword.trim() !== ""){
      await searchTeachers(keyword, page, pageSize, setTeachers, setPagination);
    } else {
      await getTeachersPaginated(page, pageSize, setTeachers, setPagination);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage + 1 < pagination.totalPages) {
      fetchTeachers(pagination.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 0) {
      fetchTeachers(pagination.currentPage - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleOpenModal = (teacher = null) => {
    if (teacher) {
      setFormData({ ...teacher });
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
      idTeacher: "",
      name: "",
      lastName: "",
      phoneNumber: "",
      email: "",
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
    if (!formToSend.idTeacher) delete formToSend.idTeacher;

    try {
      if (formData.idTeacher) {
        await updateTeacher(formToSend);
      } else {
        await addTeacher(formToSend);
      }
      await fetchTeachers(pagination.currentPage);
      handleCloseModal();
      Swal.fire("Éxito", "Profesor guardado correctamente", "success");
    } catch (error) {
      console.error("Error al guardar el profesor:", error);
      Swal.fire("Error", "No se pudo guardar el profesor", "error");
    }
  };

  const handleDeleteTeacher = async (idTeacher) => {
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
        await deleteTeacher(idTeacher);
        await fetchTeachers(pagination.currentPage);
        Swal.fire("Eliminado", "El profesor ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error deleting teacher:", error);
        Swal.fire("Error", "No se pudo eliminar el profesor.", "error");
      }
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="ml-64 min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8">
        <TableHeader
          title="Profesores"
          onAdd={() => handleOpenModal()}
          buttonLabel="Nuevo Profesor"
        />

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <SearchBar onSearch={setSearchTerm} />

            <div className="mb-4">
              <label className="mr-2 font-medium text-gray-700">Registros por página:</label>
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

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["ID", "Nombre", "Apellido", "Teléfono", "Email", "Acciones"].map((header) => (
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
                  {teachers.map((teacher) => (
                    <tr
                      key={teacher.idTeacher}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher.idTeacher}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenModal(teacher)}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors duration-200"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher.idTeacher)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium transition-colors duration-200"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrevPage}
                disabled={pagination.currentPage === 0}
                className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {pagination.currentPage + 1} de {pagination.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={pagination.currentPage + 1 >= pagination.totalPages}
                className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={formData.idTeacher ? "Editar profesor" : "Nuevo profesor"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Nombre", name: "name", type: "text" },
            { label: "Apellido", name: "lastName", type: "text" },
            { label: "Teléfono", name: "phoneNumber", type: "text" },
            { label: "Email", name: "email", type: "email" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                name={name}
                id={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          ))}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {formData.idTeacher ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
