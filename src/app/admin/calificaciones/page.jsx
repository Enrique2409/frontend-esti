"use client";

import Swal from 'sweetalert2';
import { getAllCardex, addCardex, updateCardex, deleteCardex } from "@/app/Service/CardexService";
import { getAllGroups } from '@/app/Service/GroupService';
import { getAllStudents } from "@/app/Service/StudentService";
import { getAllSubjects } from "@/app/Service/SubjectService";
import { getAllTeachersAsAdmin } from "@/app/Service/TeacherService";
import Navbar from "../components/navbar";
import TableHeader from "../components/TableHeader";
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";

export default function PageCalificaciones() {
    const [grades, setGrades] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAuth, setIsAuth] = useState(false);
    const [formData, setFormData] = useState({
        idCardex: "",
        groupName: "",
        grade: "",
        period: "",
        teacherName: "",
        teacherLastName: "",
        studentName: "",
        studentLastNamePaternal: "",
        studentLastNameMaternal: "",
        subjectName: "",
        firstPartial: "",
        secondPartial: "",
        thirdPartial: "",
        finalGrade: ""
    });

    useEffect(() => {
        checkAuthentication();
    }, []);

    const validateForm = () => {
        const { groupName, grade, period, teacherName, teacherLastName, studentName, studentLastNamePaternal, studentLastNameMaternal, subjectName, firstPartial, secondPartial, thirdPartial } = formData;
        if (!groupName || !grade || !period || !teacherName || !teacherLastName || !studentName || !studentLastNamePaternal || !studentLastNameMaternal || !subjectName || !firstPartial || !secondPartial || !thirdPartial) {
            Swal.fire("Error", "Todos los campos son obligatorios", "error");
            return false;
        }
        return true;

    };

    const checkAuthentication = () => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuth(true);
            fetchCardex();
        } else {
            setIsAuth(false);
        }
    };

    const fetchCardex = async () => {
        await getAllCardex(setGrades);
    };

    const handleOpenModal = (grade = null) => {
        if (grade) {
            setFormData({
                idCardex: grade.idCardex,
                groupName: grade.groupName,
                grade: grade.grade,
                period: grade.period,
                teacherName: grade.teacherName,
                teacherLastName: grade.teacherLastName,
                studentName: grade.studentName,
                studentLastNamePaternal: grade.studentLastNamePaternal,
                studentLastNameMaternal: grade.studentLastNameMaternal,
                subjectName: grade.subjectName,
                firstPartial: grade.firstPartial,
                secondPartial: grade.secondPartial,
                thirdPartial: grade.thirdPartial,
                finalGrade: grade.finalGrade
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        resetForm();
        setIsModalOpen(false);
    };

    const resetForm = () => {
        setFormData({
            idCardex: "",
            groupName: "",
            grade: "",
            period: "",
            teacherName: "",
            teacherLastName: "",
            studentName: "",
            studentLastNamePaternal: "",
            studentLastNameMaternal: "",
            subjectName: "",
            firstPartial: "",
            secondPartial: "",
            thirdPartial: "",
            finalGrade: ""
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const payload = {
                idCardex: formData.idCardex,
                Group: {
                    groupName: formData.groupName,
                    grade: formData.grade,
                    period: formData.period
                },
                Teacher: {
                    name: formData.teacherName,
                    lastName: formData.teacherLastName
                },
                Student: {
                    name: formData.studentName,
                    lastNamePaternal: formData.studentLastNamePaternal,
                    lastNameMaternal: formData.studentLastNameMaternal
                },
                Subject: {
                    name: formData.subjectName
                },
                firstPartial: formData.firstPartial,
                secondPartial: formData.secondPartial,
                thirdPartial: formData.thirdPartial,
                finalGrade: formData.finalGrade

            };

            if (formData.idCardex) {
                await updateCardex(payload);
                Swal.fire("Calificación actualizada con éxito", "", "success");
            } else {
                await addCardex(payload);
                Swal.fire("Calificación agregada con éxito", "", "success");
            }

            await fetchCardex();
            handleCloseModal();
        } catch (error) {
            console.error("Error al guardar la calificación:", error);
            Swal.fire("Error al guardar la calificación", "", "error");
        }
    };

    const handleDelete = async (idCardex) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await deleteCardex(idCardex);
                await fetchCardex();
                Swal.fire("Calificación eliminada con éxito", "", "success");
            } catch (error) {
                console.error("Error al eliminar la calificación:", error);
                Swal.fire("Error al eliminar la calificación", "", "error");
            }
        }
    };

    const filteredCardex = grades.filter(cal =>
        (cal.Student?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Student.lastNamePaternal.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Student.lastNameMaternal.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Group.groupName.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Group.grade.toString() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Group.period.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Teacher.name.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Teacher.lastName.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (!isAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">No tienes permiso para acceder a esta página</h1>
                    <p className="mt-4 text-gray-600">Por favor, inicia sesión con una cuenta de administrador.</p>
                    <div className="mt-6">
                        <button
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => (window.location.href = "/")}
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                        <SearchBar onSearch={setSearchTerm} />

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {["ID", "Grupo", "Profesor", "Alumno", "Materia", "1er Parcial", "2do Parcial", "3er Parcial", "Calificación Final", "Acciones"].map((header) => (
                                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCardex.map((calificacion) => (
                                        <tr key={calificacion.idCardex} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.grade}° {calificacion.groupName} - {calificacion.period}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.teacherName} {calificacion.teacherLastName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.studentName} {calificacion.studentLastName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.subjectName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.firstPartial}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.secondPartial}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.thirdPartial}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${calificacion.finalGrade >= 8 ? 'bg-green-100 text-green-800' :
                                                    calificacion.finalGrade >= 6 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {calificacion.finalGrade}
                                                </span>
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
                                                        onClick={() => handleDelete(calificacion.id)}
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
            </main >

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={formData.id ? "Editar Calificación" : "Nueva Calificación"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Grupo</label>
                        <input
                            type="text"
                            name="Group.name"
                            value={formData.Group?.groupName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Profesor</label>
                        <input
                            type="text"
                            name="Teacher.name"
                            value={formData.Teacher?.teacherName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apellido del Profesor</label>
                        <input
                            type="text"
                            name="Teacher.lastName"
                            value={formData.Teacher?.teacherLastName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Alumno</label>
                        <input
                            type="text"
                            name="Student.name"
                            value={formData.Student?.studentName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apellido del Alumno</label>
                        <input
                            type="text"
                            name="Student.lastName"
                            value={formData.Student?.studentLastNamePaternal || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Materia</label>
                        <input
                            type="text"
                            name="Subject.name"
                            value={formData.Subject?.subjectName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Primer Parcial</label>
                        <input
                            type="number"
                            name="firstPartial"
                            value={formData.firstPartial}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Segundo Parcial</label>
                        <input
                            type="number"
                            name="secondPartial"
                            value={formData.secondPartial}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tercer Parcial</label>
                        <input
                            type="number"
                            name="thirdPartial"
                            value={formData.thirdPartial}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Calificación Final</label>
                        <input
                            type="number"
                            name="finalGrade"
                            value={formData.finalGrade}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {formData.id ? "Actualizar" : "Crear"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div >
    );
}