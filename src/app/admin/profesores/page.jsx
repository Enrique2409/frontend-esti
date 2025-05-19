"use client";
import Navbar from "../components/navbar";
import { useState, useEffect } from "react";
import Modal from "../components/modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";
import Swal from 'sweetalert2';
import { getAllTeachersAsAdmin, addTeacher, updateTeacher, deleteTeacher } from "@/app/Service/TeacherService";
import { getAllLevels } from "@/app/Service/LevelService";
import { getAllGroups } from "@/app/Service/GroupService";
import "../../Styles/professors.css";


export default function PageProfessors() {
    const [teachers, setTeachers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAuth, setIsAuth] = useState(false);
    const [groups, setGroups] = useState([]);
    const [levels, setLevels] = useState([]);
    const [formData, setFormData] = useState({
        idTeacher: "",
        name: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        level: "",
        group: "",
        role: "TEACHER"
    });

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                await getAllGroups(setGroups);
            } catch (error) {
                console.error("Error al obtener grupos:", error);
            }
        };

        const fetchLevels = async () => {
            try {
                await getAllLevels(setLevels);
            } catch (error) {
                console.error("Error al obtener niveles:", error);
            }
        };

        fetchGroups();
        fetchLevels();
        checkAuthentication();
    }, []);

    const validateForm = () => {
        const { name, lastName, phoneNumber, email, password, level, group } = formData;
        if (!name || !lastName || !phoneNumber || !email || !password || !level || !group) {
            Swal.fire("Error", "Todos los campos son obligatorios", "error");
            return false;
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            Swal.fire("Error", "El correo electrónico no es válido", "error");
            return false;
        }

        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phoneNumber)) {
            Swal.fire("Error", "El número de teléfono no es válido", "error");
            return false;
        }

        return true;
    };


    const checkAuthentication = () => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuth(true);
            fetchTeachers();
        } else {
            setIsAuth(false);
        }
    };

    const fetchTeachers = async () => {
        await getAllTeachersAsAdmin(setTeachers);
    };

    const handleOpenModal = (teacher = null) => {
        if (teacher) {
            setFormData({
                idTeacher: teacher.idTeacher,
                name: teacher.name,
                lastName: teacher.lastName,
                phoneNumber: teacher.phoneNumber,
                email: teacher.email,
                password: teacher.password,
                level: teacher.level?.idLevel || "",
                group: teacher.group?.idGroup ?? "",
                role: teacher.role
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
            name: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            password: "",
            level: "",
            group: "",
            role: "TEACHER"
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
                ...formData,
                level: formData.level ? { idLevel: formData.level } : null,
                group: formData.group?.groupName
            };
            if (formData.idTeacher) {
                await updateTeacher(payload);
                Swal.fire("Profesor actualizado con éxito", "", "success");
            } else {
                await addTeacher(payload);
                Swal.fire("Profesor agregado con éxito", "", "success");
            }
            await fetchTeachers();
            handleCloseModal();
        } catch (error) {
            console.error("Error al guardar el profesor:", error);
            Swal.fire("Error al guardar el profesor", "", "error");
        }
    };

    const handleDelete = async (idTeacher) => {
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
                await deleteTeacher(idTeacher);
                await fetchTeachers();
                Swal.fire("Profesor eliminado con éxito", "", "success");
            } catch (error) {
                console.error("Error al eliminar el profesor:", error);
                Swal.fire("Error al eliminar el profesor", "", "error");
            }
        }
    };

    const filteredProfessors = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                                        {["ID", "Nombre", "Apellido", "Correo electrónico", "Teléfono", "Grado", "Grupo", "Acciones"].map((header) => (
                                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProfessors.map((teacher) => (
                                        <tr key={teacher.idTeacher} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {teacher.idTeacher}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {teacher.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {teacher.lastName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {teacher.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {teacher.phoneNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {teacher.level?.level ?? ""}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {teacher.group?.groupName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleOpenModal(teacher)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors duration-200"
                                                    >
                                                        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(teacher.idTeacher)}
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
                title={formData.idTeacher ? "Editar profesor" : "Nuevo profesor"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido</label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                            style={{
                                appearance: "none",
                                border: "1px solid #ccc",
                                padding: "10px",
                                width: "100%",
                                fontSize: "16px",
                                borderRadius: "4px",
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="password block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                            style={{
                                appearance: "none",
                                border: "1px solid #ccc",
                                padding: "10px",
                                width: "100%",
                                fontSize: "16px",
                                borderRadius: "6px",
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="level" className="block text-sm font-medium text-gray-700">Grado</label>
                        <select
                            name="level"
                            id="level"
                            value={formData.level}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">Seleccionar grado</option>
                            {levels.map((level) => (
                                <option key={level.idLevel} value={level.idLevel}>
                                    {level.level}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="group" className="block text-sm font-medium text-gray-700">Grupo</label>
                        <select
                            name="group"
                            id="group"
                            value={formData.group}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">Seleccionar grupo</option>
                            {groups.map((group, index) => (
                                <option key={group.idGroup ?? index} value={group.idGroup}>
                                    {group.groupName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
                        <select
                            name="role"
                            id="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="ADMIN">Administrador</option>
                            <option value="TEACHER">Profesor</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {formData.idAdmin ? "Actualizar" : "Crear"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}