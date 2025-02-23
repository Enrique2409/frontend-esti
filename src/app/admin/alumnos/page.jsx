"use client";

import Navbar from "../components/navbar";
import { useState } from "react";
import Modal from "../components/Modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";

export default function PageListStudents() {
    const [students, setStudents] = useState([
        { id: 1, nombre: "Juan", apellido: "Pérez", fechaNacimiento: "2000-01-01", curp: "PEJU000101HDFRRR01" },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpenModal = (student = null) => {
        setCurrentStudent(student);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentStudent(null);
        setIsModalOpen(false);
    };

    const handleSaveStudent = (student) => {
        if (student.id) {
            setStudents(students.map((s) => (s.id === student.id ? student : s)));
        } else {
            student.id = students.length + 1;
            setStudents([...students, student]);
        }
        handleCloseModal();
    };

    const filteredStudents = students.filter(student => 
        student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.curp.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <TableHeader 
                    title="Alumnos" 
                    onAdd={() => handleOpenModal()} 
                    buttonLabel="Nuevo Alumno"
                />

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-6">
                        <SearchBar onSearch={setSearchTerm} />
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {["ID", "Nombre", "Apellido", "Fecha de nacimiento", "CURP", "Acciones"].map((header) => (
                                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.nombre}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.apellido}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.fechaNacimiento}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.curp}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleOpenModal(student)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors duration-200"
                                                    >
                                                        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => setStudents(students.filter((s) => s.id !== student.id))}
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
                title={currentStudent ? "Editar Alumno" : "Nuevo Alumno"}
            >
                <StudentForm
                    student={currentStudent}
                    onSave={handleSaveStudent}
                    onClose={handleCloseModal}
                />
            </Modal>
        </div>
    );
}

function StudentForm({ student, onSave, onClose }) {
    const [formData, setFormData] = useState(
        student || { 
            nombre: "", 
            apellido: "", 
            fechaNacimiento: "", 
            curp: "",
            grado: "",
            grupo: "",
            telefono: "",
            correo: "",
            direccion: ""
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
        { name: "nombre", label: "Nombre", type: "text" },
        { name: "apellido", label: "Apellido", type: "text" },
        { name: "fechaNacimiento", label: "Fecha de Nacimiento", type: "date" },
        { name: "curp", label: "CURP", type: "text" },
        { name: "grado", label: "Grado", type: "select", options: ["1°", "2°", "3°"] },
        { name: "grupo", label: "Grupo", type: "select", options: ["A", "B", "C"] },
        { name: "telefono", label: "Teléfono", type: "tel" },
        { name: "correo", label: "Correo Electrónico", type: "email" },
        { name: "direccion", label: "Dirección", type: "textarea" }
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
