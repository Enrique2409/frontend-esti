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

export default function PageAdministrators() {
    const [administrators, setAdministrators] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAuth, setIsAuth] = useState(false);
    const [formData, setFormData] = useState({
        idAdmin: "",
        name: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        role: "ADMIN",
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

    const checkAuthentication = () => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuth(true);
            fetchAdministrators();
        } else {
            setIsAuth(false);
        }
    };

    const fetchAdministrators = async () => {
        await getAllAdmin(setAdministrators);
    };

    const handleOpenModal = (administrator = null) => {
        if (administrator) {
            setFormData({
                idAdmin: administrator.idAdmin,
                name: administrator.name,
                lastName: administrator.lastName,
                phoneNumber: administrator.phoneNumber,
                email: administrator.email,
                password: "", // Dejar vacío al editar para no mostrar contraseña actual
                role: administrator.role,
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
            idAdmin: "",
            name: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            password: "",
            role: "ADMIN",
        });
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

            if (formData.idAdmin) {
                // Al editar, si password está vacío no lo enviamos para no modificarlo
                if (!formData.password.trim()) {
                    delete dataToSend.password;
                }
                await updateAdmin(dataToSend);
            } else {
                // Al crear, sí debe venir la contraseña (por eso required en input)
                await addAdmin(dataToSend);
            }

            await fetchAdministrators();
            handleCloseModal();
            Swal.fire('Éxito', 'Administrador guardado correctamente', 'success');
        } catch (error) {
            console.error("Error al guardar el administrador:", error);
            Swal.fire('Error', 'No se pudo guardar el administrador', 'error');
        }
    };

    const handleDeleteAdministrator = async (idAdmin) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await deleteAdmin(idAdmin);
                await fetchAdministrators();
                Swal.fire('Eliminado', 'El administrador ha sido eliminado.', 'success');
            } catch (error) {
                console.error("Error deleting administrator:", error);
                Swal.fire('Error', 'No se pudo eliminar el administrador.', 'error');
            }
        }
    };

    const filteredAdministrators = administrators.filter(admin =>
        (admin.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (admin.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (admin.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (!isAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">No tienes permiso para acceder a esta página</h1>
                    <p className="mt-4 text-gray-600">Por favor, inicia sesión con una cuenta de administrador.</p>
                    <div className="mt-6">
                        <button
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => (window.location.href = "/")}
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {["ID", "Nombre", "Apellido", "Correo electrónico", "Teléfono", "Acciones"].map((header) => (
                                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAdministrators.map((administrator) => (
                                        <tr key={administrator.idAdmin} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {administrator.idAdmin}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {administrator.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {administrator.lastName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {administrator.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {administrator.phoneNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleOpenModal(administrator)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors duration-200"
                                                    >
                                                        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAdministrator(administrator.idAdmin)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium transition-colors duration-200"
                                                    >
                                                        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

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
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
