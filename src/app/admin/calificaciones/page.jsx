"use client";

import Swal from 'sweetalert2';
import { getAllCardex, addCardex, updateCardex, deleteCardex } from "@/app/Service/CardexService";
import { getAllGroups } from '@/app/Service/GroupService';
import { getAllStudents, getStudentsByGroup } from "@/app/Service/StudentService";
import { getAllSubjects } from "@/app/Service/SubjectService";
import { getAllTeachersAsAdmin } from "@/app/Service/TeacherService";
import { getTSGByGroup } from '@/app/Service/TSGService';
import Navbar from "../components/navbar";
import TableHeader from "../components/TableHeader";
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import FormField from '../components/FormField';
import Modal from "../components/Modal";

export default function PageCalificaciones() {
    const [grades, setGrades] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAuth, setIsAuth] = useState(false);

    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [tsgList, setTsgList] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        idCardex: "",
        groupId: "",
        teacherId: "",
        studentId: "",
        subjectId: "",
        firstPartial: "",
        secondPartial: "",
        thirdPartial: "",
        finalGrade: ""
    });

    const [formErrors, setFormErrors] = useState({
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

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "groupName":
                if (!value.trim()) error = "El nombre del grupo es requerido";
                else if (value.length < 3) error = "Debe tener al menos 3 caracteres";
                break;
            case "grade":
                if (!value || isNaN(value) || value < 1 || value > 12) {
                    error = "El grado debe ser un número entre 1 y 12";
                }
                break;
            case "period":
                if (!value.trim()) error = "El periodo es requerido";
                break;
            case "teacherName":
                if (!value.trim()) error = "El nombre del profesor es requerido";
                else if (value.length < 3) error = "Debe tener al menos 3 caracteres";
                break;
            case "teacherLastName":
                if (!value.trim()) error = "El apellido del profesor es requerido";
                else if (value.length < 3) error = "Debe tener al menos 3 caracteres";
                break;
            case "studentName":
                if (!value.trim()) error = "El nombre del estudiante es requerido";
                else if (value.length < 3) error = "Debe tener al menos 3 caracteres";
                break;
            case "studentLastNamePaternal":
                if (!value.trim()) error = "El apellido paterno del estudiante es requerido";
                else if (value.length < 3) error = "Debe tener al menos 3 caracteres";
                break;
            case "studentLastNameMaternal":
                if (!value.trim()) error = "El apellido materno del estudiante es requerido";
                else if (value.length < 3) error = "Debe tener al menos 3 caracteres";
                break;
            case "subjectName":
                if (!value.trim()) error = "El nombre de la materia es requerido";
                else if (value.length < 3) error = "Debe tener al menos 3 caracteres";
                break;
            case "firstPartial":
            case "secondPartial":
            case "thirdPartial":
                if (!value || isNaN(value) || value < 0 || value > 100) {
                    error = "La calificación debe ser un número entre 0 y 100";
                }
                break;
            case "finalGrade":
                if (!value || isNaN(value) || value < 0 || value > 100) {
                    error = "La calificación final debe ser un número entre 0 y 100";
                }
                break;
            default:
                break;
        }
        setFormErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    useEffect(() => {
        checkAuthentication();
    }, []);


    const checkAuthentication = () => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuth(true);
            fetchCardex();
            fetchGroups();
            fetchStudents();
            fetchSubjects();
            fetchTeachers();
            fetchTSGByGroup();
        } else {
            setIsAuth(false);
        }
    };

    const fetchTSGByGroup = async (groupId) => {
        if (!groupId) {
            setTsgList([]);
            return;
        }
        try {
            const data = await getTSGByGroup(groupId);
            setTsgList(data);
        } catch (error) {
            console.error("Error al obtener TSG por grupo:", error);
            setTsgList([]);
        }
    };


    const fetchCardex = async () => {
        await getAllCardex(setGrades);
    };

    const fetchGroups = async () => {
        await getAllGroups(setGroups);
    };

    const fetchStudents = async () => {
        await getAllStudents(setStudents);
    };

    const fetchSubjects = async () => {
        await getAllSubjects(setSubjects);
    };

    const fetchTeachers = async () => {
        await getAllTeachersAsAdmin(setTeachers);
    };

    const fetchStudentsByGroup = async (groupId) => {
        if (!groupId) {
            fetchStudents();
            return;
        }
        await getStudentsByGroup(groupId, setStudents);
    };

    const handleOpenModal = async (grade = null) => {
        if (grade) {
            // Obtener TSG directamente
            const tsgData = await getTSGByGroup(grade.idGroup);
            setTsgList(tsgData);

            // Filtrar materias disponibles
            const subjectsForGroup = [...new Set(tsgData.map(tsg => tsg.subjectId))].map(subjectId => {
                const subject = tsgData.find(t => t.subjectId === subjectId);
                return {
                    idSubject: subject.subjectId,
                    subjectName: subject.subjectName
                };
            });
            console.log("materias", subjectsForGroup);
            setFilteredSubjects(subjectsForGroup);

            // Filtrar profesores según la materia
            const teachersForSubject = tsgData
                .filter(tsg => tsg.idSubject === grade.idSubject)
                .map(tsg => ({
                    idTeacher: tsg.idTeacher,
                    teacherName: tsg.teacherName,
                    teacherLastName: tsg.teacherLastName
                }));
            setFilteredTeachers(tsgData);
            console.log("Filtered Teachers:", tsgData);



            setFormData({
                idCardex: grade.idCardex,
                groupId: grade.idGroup,
                teacherId: grade.idTeacher,
                studentId: grade.idStudent,
                subjectId: grade.idSubject,
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
            groupId: "",
            teacherId: "",
            studentId: "",
            subjectId: "",
            firstPartial: "",
            secondPartial: "",
            thirdPartial: "",
            finalGrade: ""
        });
    };

    const handleGroupChange = async (e) => {
        const groupId = e.target.value;
        handleChange(e);

        if (groupId) {
            const tsgData = await getTSGByGroup(groupId);
            setTsgList(tsgData);
            fetchStudentsByGroup(groupId);
        } else {
            setTsgList([]);
            setFilteredSubjects([]);
            setFilteredTeachers([]);
            setStudents([]);
        }
    };

    const handleSubjectChange = (e) => {
        const subjectId = parseInt(e.target.value); // Asegurarse de que sea número
        handleChange(e);

        if (subjectId) {
            const teachersForSubject = tsgList
                .filter(tsg => tsg.idSubject === subjectId)
                .map(tsg => ({
                    idTeacher: tsg.idTeacher,
                    teacherName: tsg.teacherName,
                    teacherLastName: tsg.teacherLastName
                }));

            setFilteredTeachers(teachersForSubject);
        } else {
            setFilteredTeachers([]);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!formData.idCardex) {
                const payload = {
                    Group: { idGroup: formData.groupId },
                    Student: { idStudent: formData.studentId },
                    TeacherSubjectGroup: { idTeacherSubjectGroup: formData.teacherId },
                    firstPartial: formData.firstPartial,
                    secondPartial: formData.secondPartial,
                    thirdPartial: formData.thirdPartial,
                    finalGrade: formData.finalGrade
                };
                await addCardex(payload);
                Swal.fire("Calificación agregada con éxito", "", "success");
            } else {
                const payload = {
                    firstPartial: formData.firstPartial,
                    secondPartial: formData.secondPartial,
                    thirdPartial: formData.thirdPartial,
                    finalGrade: formData.finalGrade
                };
                await updateCardex({ ...payload, idCardex: formData.idCardex });
                Swal.fire("Calificación actualizada con éxito", "", "success");
                console.log("Payload de actualización:", { ...payload, idCardex: formData.idCardex });
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
        (cal.Student?.studentName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Student?.studentLastNamePaternal?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Student?.studentLastNameMaternal?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Group?.groupName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Group?.grade?.toString() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Group?.period?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Teacher?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cal.Teacher?.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
                                                {calificacion.idCardex}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.grade}° {calificacion.groupName} - {calificacion.period}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.teacherName} {calificacion.teacherLastName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {calificacion.studentName} {calificacion.studentLastNamePaternal} {calificacion.studentLastNameMaternal}
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
                title={formData.idCardex ? "Editar Calificación" : "Nueva Calificación"}
            >
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Grupo</label>
                            <select
                                name="groupId"
                                value={formData.groupId || ""}
                                onChange={handleGroupChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                required
                                disabled={!!formData.idCardex}

                            >
                                <option value="">Seleccione un grupo</option>
                                {groups.map(group => (
                                    <option key={group.idGroup} value={group.idGroup}>
                                        {group.grade}° {group.groupName} - {group.period?.periodName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Materia</label>
                            <select
                                name="subjectId"
                                value={formData.subjectId || ""}
                                onChange={handleSubjectChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                required
                                disabled={!!formData.idCardex}
                            >
                                <option value="">Seleccione una materia</option>
                                {[...new Set(tsgList.map(tsg => tsg.idSubject))]
                                    .map((idSubject, index) => {
                                        const subject = tsgList.find(t => t.idSubject === idSubject);
                                        if (!subject) return null; // evita undefined
                                        return (
                                            <option key={`subject-${idSubject}-${index}`} value={idSubject}>
                                                {subject.subjectName}
                                            </option>
                                        );
                                    })}

                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Profesor</label>
                            <select
                                name="teacherId"
                                value={formData.teacherId || ""}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                required
                                disabled={!!formData.idCardex}
                            >
                                <option value="">Seleccione un profesor</option>
                                {[...new Set(tsgList.map(tsg => tsg.idTeacher))]
                                    .map((idTeacher, index) => {
                                        const teacher = tsgList.find(t => t.idTeacher === idTeacher);
                                        if (!teacher) return null; // evita undefined
                                        return (
                                            <option key={`teacher-${idTeacher}-${index}`} value={idTeacher}>
                                                {teacher.teacherName} {teacher.teacherLastName}
                                            </option>
                                        );
                                    })}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alumno</label>
                            <select
                                name="studentId"
                                value={formData.studentId || ""}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                                required
                                disabled={!!formData.idCardex} // true si estamos editando
                            >
                                <option value="">Seleccione un alumno</option>
                                {students.map(student => (
                                    <option key={student.idStudent} value={student.idStudent}>
                                        {student.firstName} {student.lastNamePaternal} {student.lastNameMaternal}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700">Primer Parcial</label>
                            <FormField
                                type="number"
                                name="firstPartial"
                                value={formData.firstPartial}
                                onChange={handleChange}
                                error={formErrors.firstPartial}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Segundo Parcial</label>
                            <FormField
                                type="number"
                                name="secondPartial"
                                value={formData.secondPartial}
                                onChange={handleChange}
                                error={formErrors.secondPartial}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tercer Parcial</label>
                            <FormField
                                type="number"
                                name="thirdPartial"
                                value={formData.thirdPartial}
                                onChange={handleChange}
                                error={formErrors.thirdPartial}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Calificación Final</label>
                            <FormField
                                type="number"
                                name="finalGrade"
                                value={formData.finalGrade}
                                onChange={handleChange}
                                error={formErrors.finalGrade}
                                required
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
                                {/*isEditing ? "Actualizar Calificación" : "Crear Calificación"}*/}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div >
    );
}