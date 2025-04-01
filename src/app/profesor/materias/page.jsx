"use client";

import { useState } from "react";
import Navbar from "../components/navbar";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";

export default function PageMaterias() {
    const [materias, setMaterias] = useState([
        { id: 1, nombre: "Matemáticas", grado: "1°", grupo: "A" },
        { id: 2, nombre: "Español", grado: "2°", grupo: "B" },
        { id: 3, nombre: "Ciencias", grado: "3°", grupo: "A" },
        // Add more subjects as needed
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filtroGrado, setFiltroGrado] = useState("");
    const [filtroGrupo, setFiltroGrupo] = useState("");

    // Get unique grades and groups
    const grados = [...new Set(materias.map(materia => materia.grado))].sort();
    const grupos = [...new Set(materias.map(materia => materia.grupo))].sort();

    const filteredMaterias = materias.filter(materia => {
        const matchesSearch = materia.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrado = filtroGrado === "" || materia.grado === filtroGrado;
        const matchesGrupo = filtroGrupo === "" || materia.grupo === filtroGrupo;

        return matchesSearch && matchesGrado && matchesGrupo;
    });

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <TableHeader 
                    title="Materias Asignadas" 
                    buttonLabel="Exportar"
                    onAdd={() => {/* Add export functionality here */}}
                />

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
                            <div className="flex-1 mb-4 md:mb-0">
                                <SearchBar onSearch={setSearchTerm} />
                            </div>
                            <div className="flex space-x-4">
                                <select
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={filtroGrado}
                                    onChange={(e) => setFiltroGrado(e.target.value)}
                                >
                                    <option value="">Todos los grados</option>
                                    {grados.map((grado) => (
                                        <option key={grado} value={grado}>{grado}</option>
                                    ))}
                                </select>
                                <select
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={filtroGrupo}
                                    onChange={(e) => setFiltroGrupo(e.target.value)}
                                >
                                    <option value="">Todos los grupos</option>
                                    {grupos.map((grupo) => (
                                        <option key={grupo} value={grupo}>{grupo}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {["ID", "Nombre de la Materia", "Grado", "Grupo", "Acciones"].map((header) => (
                                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredMaterias.map((materia) => (
                                        <tr key={materia.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {materia.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {materia.nombre}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {materia.grado}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {materia.grupo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <button
                                                    className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors duration-200"
                                                    onClick={() => {/* Add view details functionality */}}
                                                >
                                                    Ver detalles
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}