"use client";
import Navbar from "../components/navbar";
import { useState } from "react";
import Modal from "../components/modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";
import "../../Styles/professors.css";

export default function PageProfessors() {
    const [professors, setProfessors] = useState([
        { id: 1, nombre: "Juan", apellido: "Pérez", correo: "juan@correo.com", contrasenia: "", telefono: "2711234567" },
        // Más profesores si es necesario
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProfessor, setCurrentProfessor] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredProfessors = professors.filter(prof => 
        prof.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <TableHeader 
                    title="Profesores" 
                    onAdd={() => handleOpenModal()} 
                    buttonLabel="Nuevo Profesor"
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
                                    {filteredProfessors.map((professor) => (
                                        <tr key={professor.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {professor.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {professor.nombre}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {professor.apellido}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {professor.correo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {professor.telefono}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleOpenModal(professor)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors duration-200"
                                                    >
                                                        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => setProfessors(professors.filter((s) => s.id !== professor.id))}
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
                title={currentProfessor ? "Editar profesor" : "Nuevo profesor"}
            >
                <ProfessorForm
                    professor={currentProfessor}
                    onSave={handleSaveProfessor}
                    onClose={handleCloseModal}
                />
            </Modal>
        </div>
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
                        value={formData[field]}
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