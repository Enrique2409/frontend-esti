"use client";

import Navbar from "../components/navbar";
import { useState } from "react";
import Modal from "../components/Modal";
import "../../Styles/admin.css";

export default function PageAdministrators() {

    const [administrators, setAdministrators] = useState([
        { id: 1, nombre: "Juan", apellido: "Pérez", correo: "example@example.com", contrasenia:"", telefono: "2711234567" },
        // Más administradores si es necesario
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAdministrator, setCurrentAdministrator] = useState(null);

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

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Administradores</h1>
                <div className="mt-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Nuevo administrador
                        </button>
                    </div>
                    <div className="mt-4">
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">ID</th>
                                        <th className="px-4 py-2">Nombre</th>
                                        <th className="px-4 py-2">Apellido</th>
                                        <th className="px-4 py-2">Correo electrónico</th>
                                        <th className="px-4 py-2">Teléfono</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {administrators.map((administrator) => (
                                        <tr key={administrator.id}>
                                            <td className="border px-4 py-2">{administrator.id}</td>
                                            <td className="border px-4 py-2">{administrator.nombre}</td>
                                            <td className="border px-4 py-2">{administrator.apellido}</td>
                                            <td className="border px-4 py-2">{administrator.correo}</td>
                                            <td className="border px-4 py-2">{administrator.telefono}</td>
                                            <td className="border px-4 py-2">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => handleOpenModal(administrator)}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => setAdministrators(administrators.filter((s) => s.id !== administrator.id))}
                                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md ml-2"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="border px-4 py-2">{administrator.contrasenia}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
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
        </>
    );
}

function AdminForm({ administrator, onSave, onClose }) {
    const [form, setForm] = useState(
        administrator || { nombre: "", apellido: "", correo: "", contrasenia:"", telefono: "" }
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
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">

                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-semibold text-gray-900">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="apellido" className="block text-sm font-semibold text-gray-900">Apellido</label>
                    <input
                        type="text"
                        name="apellido"
                        id="apellido"
                        value={form.apellido}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="correo" className="block text-sm font-semibold text-gray-900">Correo electrónico</label>
                    <input
                        type="email"
                        name="correo"
                        id="correo"
                        value={form.correo}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="contraseña" className="block text-sm font-semibold text-gray-900">Contraseña</label>
                    <input
                        type="password"
                        name="contraseña"
                        id="contraseña"
                        value={form.contrasenia}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="telefono" className="block text-sm font-semibold text-gray-900">Teléfono</label>
                    <input
                        type="tel"
                        name="telefono"
                        id="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md ml-2"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </form>
    );
}