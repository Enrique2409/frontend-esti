"use client";

import Navbar from "../components/navbar";
import { useState } from "react";
import Modal from "../components/Modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";
import "../../Styles/admin.css";

export default function PageAdministrators() {
    const [administrators, setAdministrators] = useState([
        { id: 1, nombre: "Juan", apellido: "Pérez", correo: "example@example.com", contrasenia: "", telefono: "2711234567" },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAdministrator, setCurrentAdministrator] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpenModal = (administrator = null) => {
        setCurrentAdministrator(administrator);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentAdministrator(null);
        setIsModalOpen(false);
    };

    const handleSaveAdministrator = (administrator) => {
        if (administrator.id) {
            setAdministrators(administrators.map((s) => (s.id === administrator.id ? administrator : s)));
        } else {
            administrator.id = administrators.length + 1;
            setAdministrators([...administrators, administrator]);
        }
        handleCloseModal();
    };

    const filteredAdministrators = administrators.filter(admin => 
        admin.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                        <tr key={administrator.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {administrator.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {administrator.nombre}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {administrator.apellido}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {administrator.correo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {administrator.telefono}
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
                                                        onClick={() => setAdministrators(administrators.filter((s) => s.id !== administrator.id))}
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
                title={currentAdministrator ? "Editar administrador" : "Nuevo administrador"}
            >
                <AdminForm
                    administrator={currentAdministrator}
                    onSave={handleSaveAdministrator}
                    onClose={handleCloseModal}
                />
            </Modal>
        </div>
    );
}

function AdminForm({ administrator, onSave, onClose }) {
    const [form, setForm] = useState(
        administrator || { nombre: "", apellido: "", correo: "", contrasenia: "", telefono: "" }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {["nombre", "apellido", "correo", "contrasenia", "telefono"].map((field) => (
                <div key={field}>
                    <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                        {field === "contrasenia" ? "Contraseña" : field}
                    </label>
                    <input
                        type={field === "contrasenia" ? "password" : field === "correo" ? "email" : "text"}
                        name={field}
                        id={field}
                        value={form[field]}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>
            ))}

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}