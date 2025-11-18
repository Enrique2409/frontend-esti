"use client";

import Navbar from "../components/navbar";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";
import Swal from "sweetalert2";
import {
  getStudentsPaginated,
  searchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/app/Service/StudentService";
import { getAllGroups } from "@/app/Service/GroupService";

export default function PageStudents() {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
  });
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    idStudent: "",
    name: "",
    lastNamePaternal: "",
    lastNameMaternal: "",
    phoneNumber: "",
    curp: "",
    birthDate: "",
    groupId: "",
  });

  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchStudents(0, searchTerm);
  }, [pageSize, searchTerm]);

  const fetchStudents = async (page, keyword = "") => {
    if (keyword.trim() !== "") {
      await searchStudents(keyword, page, pageSize, setStudents, setPagination);
    } else {
      await getStudentsPaginated(page, pageSize, setStudents, setPagination);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage + 1 < pagination.totalPages) {
      fetchStudents(pagination.currentPage + 1, searchTerm);
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 0) {
      fetchStudents(pagination.currentPage - 1, searchTerm);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const resetForm = () => {
    setFormData({
      idStudent: "",
      name: "",
      lastNamePaternal: "",
      lastNameMaternal: "",
      phoneNumber: "",
      curp: "",
      birthDate: "",
      groupId: "",
    });
    setSelectedGroup(null);
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      const birthDate =
        student.birthDate != null
          ? String(student.birthDate).substring(0, 10)
          : "";

      const groupFromStudent = student.group || null;

      setFormData({
        idStudent: student.idStudent,
        name: student.name || "",
        lastNamePaternal: student.lastNamePaternal || "",
        lastNameMaternal: student.lastNameMaternal || "",
        phoneNumber: student.phoneNumber || "",
        curp: student.curp || "",
        birthDate: birthDate,
        groupId:
          (groupFromStudent && groupFromStudent.idGroup) ||
          student.groupId ||
          "",
      });

      setSelectedGroup(
        groupFromStudent || {
          idGroup: student.groupId || null,
          groupName: student.groupName || "",
          grade: student.grade ?? null,
        }
      );
    } else {
      resetForm();
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      { field: "name", label: "Nombre" },
      { field: "lastNamePaternal", label: "Apellido paterno" },
      { field: "lastNameMaternal", label: "Apellido materno" },
      { field: "phoneNumber", label: "Teléfono" },
      { field: "curp", label: "CURP" },
      { field: "birthDate", label: "Fecha de nacimiento" },
    ];

    for (const { field, label } of requiredFields) {
      if (!formData[field] || String(formData[field]).trim() === "") {
        Swal.fire("Error", `El campo "${label}" es obligatorio.`, "error");
        return false;
      }
    }

    // Teléfono de 10 dígitos
    if (!/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
      Swal.fire(
        "Error",
        "El número telefónico debe tener 10 dígitos.",
        "error"
      );
      return false;
    }

    // CURP: mínimo validar longitud y patrón general
    const curpUpper = formData.curp.trim().toUpperCase();

    // Patrón típico de CURP en México (puede variar según tu backend)
    const curpRegex =
      /^[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/;

    if (!curpRegex.test(curpUpper)) {
      Swal.fire(
        "Error",
        "CURP inválida. Verifica que tenga el formato correcto.",
        "error"
      );
      return false;
    }

    // Grupo obligatorio
    if (!formData.groupId) {
      Swal.fire("Error", "Debes seleccionar un grupo para el alumno.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const curpUpper = formData.curp.trim().toUpperCase();

    const payload = {
      name: formData.name.trim(),
      lastNamePaternal: formData.lastNamePaternal.trim(),
      lastNameMaternal: formData.lastNameMaternal.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      curp: curpUpper,
      birthDate: formData.birthDate, // formato YYYY-MM-DD para LocalDate
      groupId: formData.groupId,
    };

    if (formData.idStudent) {
      payload.idStudent = formData.idStudent;
    }

    try {
      if (formData.idStudent) {
        await updateStudent(payload);
      } else {
        await createStudent(payload);
      }

      await fetchStudents(pagination.currentPage, searchTerm);
      handleCloseModal();
      Swal.fire("Éxito", "Alumno guardado correctamente", "success");
    } catch (error) {
      console.error("Error al guardar el alumno:", error);

      let message = "No se pudo guardar el alumno";

      const backendMessage = error.response?.data?.message;

      // Si el backend trae el texto "CURP inválida", mostramos eso
      if (backendMessage && backendMessage.includes("CURP inválida")) {
        message = "CURP inválida. Verifica que tenga el formato correcto.";
      }

      Swal.fire("Error", message, "error");
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
        await fetchStudents(pagination.currentPage, searchTerm);
        Swal.fire("Eliminado", "El alumno ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error eliminando alumno:", error);
        Swal.fire("Error", "No se pudo eliminar el alumno.", "error");
      }
    }
  };

  const getGroupDisplay = (student) => {
    if (student.groupName && student.grade != null) {
      return `${student.groupName} - ${student.grade}`;
    }
    if (student.groupName) return student.groupName;
    if (student.grade != null) return `Grado ${student.grade}`;
    return "-";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    // Para evitar problemas de zona horaria, mostramos el string tal cual
    return String(date).substring(0, 10);
  };

  const selectedGroupLabel = selectedGroup
    ? `${selectedGroup.groupName ?? "Grupo"}${
        selectedGroup.grade != null ? ` (Grado ${selectedGroup.grade})` : ""
      }`
    : "Ningún grupo seleccionado";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="ml-64 min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8">
        <TableHeader
          title="Alumnos"
          onAdd={() => handleOpenModal()}
          buttonLabel="Nuevo Alumno"
        />

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <SearchBar onSearch={setSearchTerm} />

            <div className="mb-4">
              <label className="mr-2 font-medium text-gray-700">
                Registros por página:
              </label>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="border border-gray-300 rounded-md px-2 py-1"
              >
                <option value={1}>1</option>
                <option value={10}>10</option>
                <option value={30}>30</option>
              </select>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "ID",
                      "Nombre",
                      "Apellido Paterno",
                      "Apellido Materno",
                      "Teléfono",
                      "CURP",
                      "Fecha Nacimiento",
                      "Grupo",
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
                  {students.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No se encontraron alumnos.
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr
                        key={student.idStudent}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {student.idStudent}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {student.lastNamePaternal}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {student.lastNameMaternal}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {student.phoneNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {student.curp}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatDate(student.birthDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {getGroupDisplay(student)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenModal(student)}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteStudent(student.idStudent)
                              }
                              className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrevPage}
                disabled={pagination.currentPage === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {pagination.currentPage + 1} de {pagination.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={pagination.currentPage + 1 >= pagination.totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de creación/edición de alumno */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={formData.idStudent ? "Editar Alumno" : "Nuevo Alumno"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos de texto */}
          {[
            {
              label: "Nombre",
              name: "name",
              type: "text",
            },
            {
              label: "Apellido Paterno",
              name: "lastNamePaternal",
              type: "text",
            },
            {
              label: "Apellido Materno",
              name: "lastNameMaternal",
              type: "text",
            },
            {
              label: "Teléfono (10 dígitos)",
              name: "phoneNumber",
              type: "tel",
            },
            {
              label: "CURP",
              name: "curp",
              type: "text",
            },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </label>
              <input
                type={type}
                name={name}
                id={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          ))}

          {/* Fecha de nacimiento */}
          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha de nacimiento
            </label>
            <input
              type="date"
              name="birthDate"
              id="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Grupo asignado */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grupo asignado
            </label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="text"
                readOnly
                value={selectedGroupLabel}
                className="flex-1 rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setIsGroupModalOpen(true)}
                className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Seleccionar grupo
              </button>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {formData.idStudent ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal selector de grupo */}
      <GroupSelectorModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onSelect={(group) => {
          setSelectedGroup(group);
          setFormData((prev) => ({
            ...prev,
            groupId: group.idGroup,
          }));
          setIsGroupModalOpen(false);
        }}
      />
    </div>
  );
}

/**
 * Componente para seleccionar grupo con tabla
 */
function GroupSelectorModal({ isOpen, onClose, onSelect }) {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      getAllGroups(setGroups);
      setSearchTerm("");
    }
  }, [isOpen]);

  const filteredGroups = groups.filter((group) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch =
      group.groupName && group.groupName.toLowerCase().includes(term);
    const gradeMatch =
      group.grade !== null &&
      group.grade !== undefined &&
      String(group.grade).toLowerCase().includes(term);
    return nameMatch || gradeMatch;
  });

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Seleccionar Grupo">
      <div className="space-y-4">
        <SearchBar onSearch={setSearchTerm} />

        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["ID", "Nombre del Grupo", "Grado", "Acciones"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGroups.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No se encontraron grupos.
                  </td>
                </tr>
              ) : (
                filteredGroups.map((group) => (
                  <tr
                    key={group.idGroup}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {group.idGroup}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {group.groupName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {group.grade ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <button
                        onClick={() => onSelect(group)}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium"
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
