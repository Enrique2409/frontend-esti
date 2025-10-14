"use client";

import Navbar from "../components/navbar";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";
import "../../Styles/admin.css";
import Swal from 'sweetalert2';
import FormField from "../components/FormField";
import { getAllAdmin, addAdmin, updateAdmin, deleteAdmin, login } from "@/app/Service/AdminService";

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
  const [formData, setFormData] = useState({
    idAdmin: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

    const [formErrors, setFormErrors] = useState({
        name: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
    });


    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "name":
                if (!value.trim()) error = "El nombre es requerido";
                else if (value.length < 3) error = "Debe tener al menos 3 caracteres";
                break;

            case "lastName":
                if (!value.trim()) error = "El apellido es requerido";
                break;

            case "phoneNumber":
                if (!value.trim()) error = "El teléfono es requerido";
                else if (!/^\d{10}$/.test(value)) error = "Debe tener 10 dígitos";
                break;

            case "email":
                if (!value.trim()) error = "El correo es requerido";
                else if (!/\S+@\S+\.\S+/.test(value)) error = "Formato inválido";
                break;

            case "password":
                if (!formData.idAdmin && !value.trim()) error = "La contraseña es requerida";
                else if (value && value.length < 6) error = "Debe tener al menos 6 caracteres";
                break;
            default:
                break;
        }

        setFormErrors(prev => ({ ...prev, [name]: error }));
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

  const fetchAdmins = async (page, keyword = "") => {
    if (keyword.trim() !== ""){
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
      setFormData({ ...admin });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

    {/*const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };*/}

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = { ...formData };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={formData.idAdmin ? "Editar administrador" : "Nuevo administrador"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <FormField
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={formErrors.name}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido</label>
                        <FormField
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={formErrors.lastName}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <FormField
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 10) {
                                    setFormData((prev) => ({ ...prev, phoneNumber: value }));
                                }
                            }}
                            error={formErrors.phoneNumber}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                        <FormField
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={formErrors.email}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="password block text-sm font-medium text-gray-700">
                            Contraseña {formData.idAdmin ? "(opcional al editar)" : ""}
                        </label>
                        <FormField
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={formErrors.password}
                            required={!formData.idAdmin}
                        />
                    </div>

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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admin.idAdmin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admin.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admin.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admin.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenModal(admin)}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors duration-200"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.idAdmin)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={formData.idAdmin ? "Editar Administrador" : "Nuevo Administrador"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Nombre", name: "name", type: "text" },
            { label: "Apellido", name: "lastName", type: "text" },
            { label: "Teléfono", name: "phoneNumber", type: "text" },
            { label: "Email", name: "email", type: "email" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
              >
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
              {formData.idAdmin ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
