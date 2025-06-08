"use client";

import Navbar from "../components/navbar";
import { useState } from "react";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";

export default function PageReportes() {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Datos de ejemplo
    const students = [
        {
            id: 1,
            nombre: "Juan",
            apellido: "Pérez",
            grado: "1°",
            grupo: "A",
            calificaciones: [
                { materia: "Matemáticas", bimestre1: 8.5, bimestre2: 9.0, bimestre3: 8.0, bimestre4: 9.5, bimestre5: 8.8 },
                { materia: "Español", bimestre1: 9.0, bimestre2: 8.5, bimestre3: 9.0, bimestre4: 8.5, bimestre5: 9.0 },
                { materia: "Ciencias", bimestre1: 8.0, bimestre2: 8.0, bimestre3: 8.5, bimestre4: 8.0, bimestre5: 8.2 },
                // Añade más materias según necesites
            ],
            observaciones: "Excelente desempeño en el área de matemáticas. Necesita mejorar en trabajo en equipo."
        },
        // Añade más estudiantes según necesites
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="print:hidden">
                <Navbar />
            </div>
            <main className="ml-64 min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8">
                <div className="print:hidden">
                    <TableHeader 
                        title="Reportes y Boletas" 
                        onAdd={handlePrint} 
                        buttonLabel="Imprimir Boleta"
                    />
                    <div className="mb-6">
                        <SearchBar onSearch={setSearchTerm} />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                    {/* Encabezado de la Boleta */}
                    <div className="text-center mb-4">
                        <div className="flex items-center justify-center mb-2">
                            <img src="/logo.png" alt="Logo Escuela" className="h-12 w-auto mr-4 print:h-16" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">E.S.T.I N° 70</h1>
                                <p className="text-gray-600 text-sm">Escuela Secundaria Técnica Industrial</p>
                                <p className="text-gray-600 text-sm">Ciclo Escolar 2023-2024</p>
                            </div>
                        </div>
                    </div>

                    {/* Información del Alumno */}
                    <div className="mb-4">
                        <div className="grid grid-cols-4 gap-4 border-b pb-2">
                            <div>
                                <p className="text-xs text-gray-600">Nombre del Alumno:</p>
                                <p className="font-medium text-sm">{`${students[0].nombre} ${students[0].apellido}`}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Grado y Grupo:</p>
                                <p className="font-medium text-sm">{`${students[0].grado} "${students[0].grupo}"`}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Periodo:</p>
                                <p className="font-medium text-sm">2023-2024</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Fecha de emisión:</p>
                                <p className="font-medium text-sm">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Calificaciones - Ajustada para modo horizontal */}
                    <div className="mb-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Materia</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">1er Bim</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">2do Bim</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">3er Bim</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">4to Bim</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">5to Bim</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Promedio</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students[0].calificaciones.map((materia, index) => {
                                    const promedio = (
                                        (materia.bimestre1 + materia.bimestre2 + materia.bimestre3 + materia.bimestre4 + materia.bimestre5) / 5
                                    ).toFixed(1);
                                    
                                    return (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {materia.materia}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                {materia.bimestre1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                {materia.bimestre2}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                {materia.bimestre3}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                {materia.bimestre4}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                                                {materia.bimestre5}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    parseFloat(promedio) >= 8 ? 'bg-green-100 text-green-800' :
                                                    parseFloat(promedio) >= 6 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {promedio}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Observaciones - Más compactas para modo horizontal */}
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">Observaciones</h3>
                        <div className="bg-gray-50 p-2 rounded-lg">
                            <p className="text-sm text-gray-700">{students[0].observaciones}</p>
                        </div>
                    </div>

                    {/* Firmas - Ajustadas para modo horizontal */}
                    <div className="grid grid-cols-3 gap-8 mt-8 print:mt-4">
                        <div className="text-center">
                            <div className="border-t border-gray-300 pt-1">
                                <p className="text-xs text-gray-600">Director(a)</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="border-t border-gray-300 pt-1">
                                <p className="text-xs text-gray-600">Profesor(a)</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="border-t border-gray-300 pt-1">
                                <p className="text-xs text-gray-600">Padre o Tutor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 