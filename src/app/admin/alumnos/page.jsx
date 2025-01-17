"use client";

import Navbar from "../components/navbar";
import { useState } from "react";
import Modal from "../components/Modal";
import "../../Styles/students.css";

export default function PageListStudents() {
    const [students, setStudents] = useState([
        { id: 1, nombre: "Juan", apellido: "Pérez", fechaNacimiento: "2000-01-01", curp: "PEJU000101HDFRRR01" },
        // Más estudiantes si es necesario
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);

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

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Alumnos</h1>
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
                            Nuevo alumno
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
                                        <th className="px-4 py-2">Fecha de nacimiento</th>
                                        <th className="px-4 py-2">CURP</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id}>
                                            <td className="border px-4 py-2">{student.id}</td>
                                            <td className="border px-4 py-2">{student.nombre}</td>
                                            <td className="border px-4 py-2">{student.apellido}</td>
                                            <td className="border px-4 py-2">{student.fechaNacimiento}</td>
                                            <td className="border px-4 py-2">{student.curp}</td>
                                            <td className="border px-4 py-2">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => handleOpenModal(student)}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md justify-space-between"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md ml-2"
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
                    </div>
                </div>
            </div>

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
        </>
    );
}

function StudentForm({ student, onSave, onClose }) {
    const [formData, setFormData] = useState(
        student || { matricula: "", nombre: "", apellido: "", fechaNacimiento: "" }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900">Apellido</label>
                    <input
                        type="text"
                        name="apellido"
                        placeholder="Apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900">Fecha de nacimiento</label>
                    <input
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900">CURP</label>
                    <input
                        type="text"
                        name="curp"
                        placeholder="CURP"
                        value={formData.curp}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-md"
                        required
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </form>
    );
}
