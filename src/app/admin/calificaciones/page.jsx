"use client";

import Navbar from "../components/navbar";
import { useState } from "react";
import Modal from "../components/Modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";

export default function PageCalificaciones() {
    const [calificaciones, setCalificaciones] = useState([
        { 
            id: 1, 
            nombre: "Juan", 
            apellido: "Pérez", 
            grado: "1°", 
            grupo: "A", 
            materia: "Matemáticas", 
            calificacion: 10, 
            periodo: "1er Bimestre",
            observaciones: "" 
        },
        { 
            id: 2, 
            nombre: "María", 
            apellido: "García", 
            grado: "2°", 
            grupo: "B", 
            materia: "Español", 
            calificacion: 9, 
            periodo: "1er Bimestre",
            observaciones: "" 
        },
        // Más calificaciones de ejemplo...
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCalificacion, setCurrentCalificacion] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroGrado, setFiltroGrado] = useState("");
    const [filtroGrupo, setFiltroGrupo] = useState("");

    // Obtener grados y grupos únicos
    const grados = [...new Set(calificaciones.map(cal => cal.grado))].sort();
    const grupos = [...new Set(calificaciones.map(cal => cal.grupo))].sort();

    const handleOpenModal = (calificacion = null) => {
        setCurrentCalificacion(calificacion);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentCalificacion(null);
        setIsModalOpen(false);
    };

    const handleSaveCalificacion = (calificacion) => {
        if (calificacion.id) {
            setCalificaciones(calificaciones.map((s) => (s.id === calificacion.id ? calificacion : s)));
        } else {
            calificacion.id = calificaciones.length + 1;
            setCalificaciones([...calificaciones, calificacion]);
        }
        handleCloseModal();
    };

    const filteredCalificaciones = calificaciones.filter(cal => {
        const matchesSearch = 
            cal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cal.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cal.materia.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesGrado = filtroGrado === "" || cal.grado === filtroGrado;
        const matchesGrupo = filtroGrupo === "" || cal.grupo === filtroGrupo;

        return matchesSearch && matchesGrado && matchesGrupo;
    });

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="ml-64 min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8">
                <TableHeader 
                    title="Calificaciones" 
                    onAdd={() => handleOpenModal()} 
                    buttonLabel="Nueva Calificación"
                />

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
                            <div className="flex-1 mb-4 md:mb-0">
                                <SearchBar onSearch={setSearchTerm} />
                            </div>
                            <div className="flex space-x-4">
                                <div className="w-40">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Grado
                                    </label>
                                    <select
                                        value={filtroGrado}
                                        onChange={(e) => setFiltroGrado(e.target.value)}
                                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">Todos</option>
                                        {grados.map(grado => (
                                            <option key={grado} value={grado}>{grado}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-40">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Grupo
                                    </label>
                                    <select
                                        value={filtroGrupo}
                                        onChange={(e) => setFiltroGrupo(e.target.value)}
                                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">Todos</option>
                                        {grupos.map(grupo => (
                                            <option key={grupo} value={grupo}>{grupo}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {["ID", "Nombre", "Apellido", "Grado", "Grupo", "Materia", "Calificación", "Periodo", "Acciones"].map((header) => (
                                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCalificaciones.map((calificacion) => (
                                        <tr key={calificacion.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.nombre}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.apellido}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.grado}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.grupo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.materia}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    calificacion.calificacion >= 8 ? 'bg-green-100 text-green-800' :
                                                    calificacion.calificacion >= 6 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {calificacion.calificacion}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.periodo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleOpenModal(calificacion)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors duration-200"
                                                    >
                                                        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => setCalificaciones(calificaciones.filter((s) => s.id !== calificacion.id))}
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
                title={currentCalificacion ? "Editar Calificación" : "Nueva Calificación"}
            >
                <CalificacionForm
                    calificacion={currentCalificacion}
                    onSave={handleSaveCalificacion}
                    onClose={handleCloseModal}
                />
            </Modal>
        </div>
    );
}

function CalificacionForm({ calificacion, onSave, onClose }) {
    const [formData, setFormData] = useState(
        calificacion || { 
            nombre: "", 
            apellido: "", 
            grado: "", 
            grupo: "", 
            materia: "",
            calificacion: "",
            periodo: "",
            observaciones: "" 
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const fields = [
        { name: "nombre", label: "Nombre del Alumno", type: "text" },
        { name: "apellido", label: "Apellido del Alumno", type: "text" },
        { name: "grado", label: "Grado", type: "select", options: ["1°", "2°", "3°"] },
        { name: "grupo", label: "Grupo", type: "select", options: ["A", "B", "C"] },
        { name: "materia", label: "Materia", type: "select", options: [
            "Matemáticas",
            "Español",
            "Ciencias",
            "Historia",
            "Geografía",
            "Inglés",
            "Educación Física"
        ]},
        { name: "calificacion", label: "Calificación", type: "number", min: 0, max: 10, step: 0.1 },
        { name: "periodo", label: "Periodo", type: "select", options: [
            "1er Bimestre",
            "2do Bimestre",
            "3er Bimestre",
            "4to Bimestre",
            "5to Bimestre"
        ]},
        { name: "observaciones", label: "Observaciones", type: "textarea" }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {fields.map((field) => (
                    <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                            {field.label}
                        </label>
                        {field.type === "select" ? (
                            <select
                                name={field.name}
                                id={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {field.options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        ) : field.type === "textarea" ? (
                            <textarea
                                name={field.name}
                                id={field.name}
                                rows={3}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                id={field.name}
                                min={field.min}
                                max={field.max}
                                step={field.step}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        )}
                    </div>
                ))}
            </div>

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
