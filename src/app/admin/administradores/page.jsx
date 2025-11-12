"use client";

import Navbar from "../components/navbar";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";
import Swal from "sweetalert2";
import {
  getAdminsPaginated,
  searchAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
} from "@/app/Service/AdminService";

export default function PageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
  });
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [formData, setFormData] = useState({
    idAdmin: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchAdmins(0, searchTerm);
  }, [pageSize, searchTerm]);

  const fetchAdmins = async (page, keyword = "") => {
    if (keyword.trim() !== "") {
      await searchAdmins(keyword, page, pageSize, setAdmins, setPagination);
    } else {
      await getAdminsPaginated(page, pageSize, setAdmins, setPagination);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage + 1 < pagination.totalPages) {
      fetchAdmins(pagination.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 0) {
      fetchAdmins(pagination.currentPage - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleOpenModal = (admin = null) => {
    if (admin) {
      setFormData({ ...admin, password: "", confirmPassword: "" });
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
      idAdmin: "",
      name: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
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

    if (!formData.idAdmin) {
      if (formData.password !== formData.confirmPassword) {
        Swal.fire("Error", "Las contraseñas no coinciden", "error");
        return;
      }
    }

    const formToSend = { ...formData };
    if (!formToSend.idAdmin) delete formToSend.idAdmin;

    try {
      if (formData.idAdmin) {
        await updateAdmin(formToSend);
      } else {
        await addAdmin(formToSend);
      }
      await fetchAdmins(pagination.currentPage);
      handleCloseModal();
      Swal.fire("Éxito", "Administrador guardado correctamente", "success");
    } catch (error) {
      console.error("Error al guardar el administrador:", error);
      Swal.fire("Error", "No se pudo guardar el administrador", "error");
    }
  };

  const handleDeleteAdmin = async (idAdmin) => {
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
        await deleteAdmin(idAdmin);
        await fetchAdmins(pagination.currentPage);
        Swal.fire("Eliminado", "El administrador ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error eliminando administrador:", error);
        Swal.fire("Error", "No se pudo eliminar el administrador.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="ml-64 min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8">
        <TableHeader
          title="Administradores"
          onAdd={() => handleOpenModal()}
          buttonLabel="Nuevo Administrador"
        />

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <SearchBar onSearch={setSearchTerm} />

            {/* Selector de tamaño de página */}
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
                    {["ID", "Nombre", "Apellido", "Teléfono", "Email", "Acciones"].map(
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
                  {admins.map((admin) => (
                    <tr
                      key={admin.idAdmin}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{admin.idAdmin}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{admin.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{admin.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{admin.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{admin.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenModal(admin)}
                            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.idAdmin)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium"
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

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={formData.idAdmin ? "Editar Administrador" : "Nuevo Administrador"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos comunes */}
          {[
            { label: "Nombre", name: "name", type: "text" },
            { label: "Apellido", name: "lastName", type: "text" },
            { label: "Teléfono", name: "phoneNumber", type: "text" },
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

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              readOnly={!!formData.idAdmin}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                formData.idAdmin ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Contraseñas solo si es nuevo */}
          {!formData.idAdmin && (
            <>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Verificar Contraseña
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </>
          )}

          {/* Botones */}
          <div className="flex justify-between items-center">
            {!formData.idAdmin && (
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {showPasswords ? "Ocultar contraseña" : "Mostrar contraseñas"}
              </button>
            )}

            <div className="flex space-x-3 ml-auto">
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
                {formData.idAdmin ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
