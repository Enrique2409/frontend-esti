"use client";

import Navbar from "../components/navbar";
import { useState } from "react";
import Modal from "../components/modal";
import "../../styles/grades.css";

export default function PageCalificaciones() {

    const [calificaciones, setCalificaciones] = useState([
        { id: 1, nombre: "Juan", apellido: "Pérez", grado: "1", grupo: "A", materia: "Matemáticas", calificacion: 10, observaciones: "" },
        // Más calificaciones si es necesario
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCalificacion, setCurrentCalificacion] = useState(null);

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

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Calificaciones</h1>
                <div className="mt-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Nueva calificación
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
                                        <th className="px-4 py-2">Grado</th>
                                        <th className="px-4 py-2">Grupo</th>
                                        <th className="px-4 py-2">Materia</th>
                                        <th className="px-4 py-2">Calificación</th>
                                        <th className="px-4 py-2">Observaciones</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {calificaciones.map((calificacion) => (
                                        <tr key={calificacion.id}>
                                            <td className="border px-4 py-2">{calificacion.id}</td>
                                            <td className="border px-4 py-2">{calificacion.nombre}</td>
                                            <td className="border px-4 py-2">{calificacion.apellido}</td>
                                            <td className="border px-4 py-2">{calificacion.grado}</td>
                                            <td className="border px-4 py-2">{calificacion.grupo}</td>
                                            <td className="border px-4 py-2">{calificacion.materia}</td>
                                            <td className="border px-4 py-2">{calificacion.calificacion}</td>
                                            <td className="border px-4 py-2">{calificacion.observaciones}</td>
                                            <td className="border px-4 py-2">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => handleOpenModal(calificacion)}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => setAdministrators(calificaciones.filter((s) => s.id !== calificacion.id))}
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
                title={currentCalificacion ? "Editar calificación" : "Nueva calificación"}
            >
                <CalificacionForm
                    calificacion={currentCalificacion}
                    onSave={handleSaveCalificacion}
                    onClose={handleCloseModal}
                />
            </Modal>
        </>
    );
}

function CalificacionForm({ calificacion, onSave, onClose }) {
    const [form, setForm] = useState(
        calificacion || { nombre: "", apellido: "", grado: "", grupo: "", materia: "", calificacion: "" }
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
            <div className="grid grid-cols-2 gap-6">
                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                    <input
                        type="text"
                        name="apellido"
                        id="apellido"
                        value={form.apellido}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="grado" className="block text-sm font-medium text-gray-700">Grado</label>
                    <input
                        type="text"
                        name="grado"
                        id="grado"
                        value={form.grado}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="grupo" className="block text-sm font-medium text-gray-700">Grupo</label>
                    <input
                        type="text"
                        name="grupo"
                        id="grupo"
                        value={form.grupo}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="materia" className="block text-sm font-medium text-gray-700">Disciplina</label>
                    <input
                        type="text"
                        name="materia"
                        id="materia"
                        value={form.materia}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="calificacion" className="block text-sm font-medium text-gray-700">Calificación</label>
                    <input
                        type="number"
                        name="calificacion"
                        id="calificacion"
                        value={form.calificacion}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4 col-span-2">
                    <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">Observaciones</label>
                    <textarea
                        name="observaciones"
                        id="observaciones"
                        value={form.observaciones}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4 col-span-2">
                    <div className="container-buttons flex justify-end">
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
            </div>
        </form>
    );
}
