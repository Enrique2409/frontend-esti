"use client";
import Navbar from "../components/navbar";
import { useState } from "react";
import Modal from "../components/modal";
import "../../Styles/professors.css";

export default function PageProfessors() {

    const [professors, setProfessors] = useState([
        { id: 1, nombre: "Juan", apellido: "Pérez", correo: "juan@correo.com", contrasenia: "", telefono: "2711234567" },
        // Más profesores si es necesario
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProfessor, setCurrentProfessor] = useState(null);

    const handleOpenModal = (professor = null) => {
        setCurrentProfessor(professor);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setCurrentProfessor(null);
        setIsModalOpen(false);
    }

    const handleSaveProfessor = (professor) => {
        if (professor.id) {
            setProfessors(professors.map((s) => (s.id === professor.id ? professor : s)));
        } else {
            professor.id = professors.length + 1;
            setProfessors([...professors, professor]);
        }
        handleCloseModal();
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Profesores</h1>
                <div className="mt-4">
                    <div className="flex-1 max-w-xs">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Nuevo profesor
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
                                    {professors.map((professor) => (
                                        <tr key={professor.id} className="border-b">
                                            <td className="border px-4 py-2">{professor.id}</td>
                                            <td className="border px-4 py-2">{professor.nombre}</td>
                                            <td className="border px-4 py-2">{professor.apellido}</td>
                                            <td className="border px-4 py-2">{professor.correo}</td>
                                            <td className="border px-4 py-2">{professor.telefono}</td>
                                            <td className="border px-4 py-2">
                                                <div className="flex justify-center space-between">
                                                    <button
                                                        onClick={() => handleOpenModal(professor)}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md justify-space-between"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setProfessors(professors.filter((s) => s.id !== professor.id));
                                                        }}
                                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md ml-2"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="border px-4 py-2">{professor.contrasenia}</td>
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
                title={currentProfessor ? "Editar profesor" : "Nuevo profesor"}
            >
                <ProfessorForm
                    professor={currentProfessor}
                    onSave={handleSaveProfessor}
                    onClose={handleCloseModal}
                />
            </Modal>
        </>
    );
}

function ProfessorForm({ professor, onSave, onClose }) {
    const [formData, setFormData] = useState(
        professor || { nombre: "", apellido: "", correo: "", contrasenia: "", telefono: "" }
    );

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-semibold text-gray-900">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="apellido" className="block text-sm font-semibold text-gray-900">Apellido </label>
                    <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="correo" className="block text-sm font-semibold text-gray-900">Correo electrónico</label>
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
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
                        value={formData.contrasenia}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="telefono" className="block text-sm font-semibold text-gray-900">Teléfono</label>
                    <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
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