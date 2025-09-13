"use client";

import Navbar from "../components/navbar";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";
import "../../Styles/admin.css";
import Swal from "sweetalert2";
import FormField from "../components/FormField";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/app/Service/StudentService";

export default function PageStudents() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    idStudent: "",
    name: "",
    lastNamePaternal: "",
    lastNameMaternal: "",
    curp: "",
    birthDate: "",
    phoneNumber: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "El nombre es requerido";
        else if (value.length < 3) error = "Debe tener al menos 3 caracteres";
        break;

      case "lastNamePaternal":
        if (!value.trim()) error = "El apellido paterno es requerido";
        break;

      case "lastNameMaternal":
        if (!value.trim()) error = "El apellido materno es requerido";
        break;

      case "curp":
        if (!value.trim()) error = "El CURP es requerido";
        else if (!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/.test(value)) error = "Formato de CURP inválido";
        break;

      case "birthDate":
        if (!value.trim()) error = "La fecha de nacimiento es requerida";
        break;

      case "phoneNumber":
        if (!value.trim()) error = "El teléfono es requerido";
        else if (!/^\d{10}$/.test(value)) error = "Debe tener 10 dígitos";
        break;
      default:
        break;
    }

    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    await getAllStudents(setStudents);
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setFormData({ ...student });
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
      idStudent: "",
      name: "",
      lastNamePaternal: "",
      lastNameMaternal: "",
      curp: "",
      birthDate: "",
      phoneNumber: "",
    });
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

    const formToSend = { ...formData };
    if (!formToSend.idStudent) delete formToSend.idStudent;

    try {
      if (formData.idStudent) {
        await updateStudent(formToSend);
      } else {
        await createStudent(formToSend);
      }
      await fetchStudents();
      handleCloseModal();
      Swal.fire("Éxito", "Estudiante guardado correctamente", "success");
    } catch (error) {
      console.error("Error al guardar el estudiante:", error);
      Swal.fire("Error", "No se pudo guardar el estudiante", "error");
    }
  };

  const handleDeleteStudent = async (idStudent) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteStudent(idStudent);
        await fetchStudents();
        Swal.fire("Eliminado", "El estudiante ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error deleting student:", error);
        Swal.fire("Error", "No se pudo eliminar el estudiante.", "error");
      }
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.lastNamePaternal} ${student.lastNameMaternal}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="ml-64 min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8">
        <TableHeader
          title="Estudiantes"
          onAdd={() => handleOpenModal()}
          buttonLabel="Nuevo Estudiante"
        />
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <SearchBar onSearch={setSearchTerm} />
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "ID",
                      "Nombre",
                      "Apellido Paterno",
                      "Apellido Materno",
                      "CURP",
                      "Nacimiento",
                      "Teléfono",
                      "Acciones",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.idStudent}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.idStudent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.lastNamePaternal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.lastNameMaternal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.curp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.birthDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenModal(student)}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors duration-200"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteStudent(student.idStudent)
                            }
                            className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium transition-colors duration-200"
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
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={formData.idStudent ? "Editar estudiante" : "Nuevo estudiante"}
      >
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: "Nombre", name: "name", type: "text" },
              { label: "Apellido paterno", name: "lastNamePaternal", type: "text" },
              { label: "Apellido materno", name: "lastNameMaternal", type: "text" },
              { label: "CURP", name: "curp", type: "text" },
              { label: "Fecha de nacimiento", name: "birthDate", type: "date" },
              { label: "Teléfono", name: "phoneNumber", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <FormField
                  error={formErrors[name]}
                  type={type}
                  name={name}
                  id={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
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
                {formData.idStudent ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
