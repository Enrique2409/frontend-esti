"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getSubjectsByTeacher,
  createTeacherSubject,
  deleteTeacherSubject,
} from "@/app/Service/TeacherSubjectService";
import { getSubjectsPaginated, searchSubjects } from "@/app/Service/SubjectService";

export default function TeacherSubjectsModal({ teacher, onClose }) {
  const [assigned, setAssigned] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [catalogPagination, setCatalogPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
  });
  const [catalogPageSize, setCatalogPageSize] = useState(10);
  const [catalogSearch, setCatalogSearch] = useState("");

  useEffect(() => {
    if (!teacher) return;
    loadAssigned();
    loadCatalog(0, catalogSearch);
  }, [teacher, catalogPageSize]);

  const loadAssigned = async () => {
    try {
      const data = await getSubjectsByTeacher(teacher.idTeacher);
      setAssigned(Array.isArray(data) ? data : []);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las materias asignadas", "error");
    }
  };

  const loadCatalog = async (page = 0, keyword = "") => {
    try {
      if (keyword.trim() !== "" && typeof searchSubjects === "function") {
        await searchSubjects(keyword, page, catalogPageSize, setCatalog, setCatalogPagination);
      } else {
        await getSubjectsPaginated(page, catalogPageSize, setCatalog, setCatalogPagination);
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar el catálogo de materias", "error");
    }
  };

  const handleAssign = async (idSubject, subjectName) => {
    try {
      const teacherSubjectData = {
        idTeacher: teacher.idTeacher,
        idSubject: idSubject,
      };

      await createTeacherSubject(teacherSubjectData);
      Swal.fire("Éxito", `Materia "${subjectName}" asignada correctamente`, "success");
      await loadAssigned();
    } catch (error) {
      if (error.response?.status === 409) {
        Swal.fire("Aviso", "La materia ya estaba asignada a este profesor.", "info");
      } else {
        Swal.fire("Error", "No se pudo asignar la materia", "error");
      }
    }
  };

  const handleRemove = async (idTeacherSubject, subjectName) => {
    const result = await Swal.fire({
      title: "¿Quitar materia?",
      text: `Se eliminará la asignación "${subjectName}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTeacherSubject(idTeacherSubject);
      Swal.fire("Eliminado", "Materia quitada correctamente", "success");
      await loadAssigned();
    } catch {
      Swal.fire("Error", "No se pudo eliminar la materia", "error");
    }
  };

  const handleCatalogPrev = () => {
    if (catalogPagination.currentPage > 0) {
      loadCatalog(catalogPagination.currentPage - 1, catalogSearch);
    }
  };

  const handleCatalogNext = () => {
    if (catalogPagination.currentPage + 1 < catalogPagination.totalPages) {
      loadCatalog(catalogPagination.currentPage + 1, catalogSearch);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setCatalogSearch(val);
    loadCatalog(0, val);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[92vw] max-w-5xl p-6 max-h-[85vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Materias de {teacher.name} {teacher.lastName}
        </h2>

        {/* Materias asignadas */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Asignadas</h3>
          <table className="min-w-full border divide-y divide-gray-200 mb-3">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID TSG</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Materia</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assigned.map((s) => (
                <tr key={s.idTeacherSubject}>
                  <td className="px-4 py-2">{s.idTeacherSubject}</td>
                  <td className="px-4 py-2">{s.subjectName}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleRemove(s.idTeacherSubject, s.subjectName)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
              {assigned.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-3 text-gray-500">
                    No hay materias asignadas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Catálogo paginado */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Catálogo</h3>
            <div className="flex items-center space-x-2">
              <label className="text-sm">Registros por página:</label>
              <select
                value={catalogPageSize}
                onChange={(e) => setCatalogPageSize(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={30}>30</option>
              </select>
              <input
                type="text"
                value={catalogSearch}
                onChange={handleSearch}
                placeholder="Buscar materia..."
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              />
            </div>
          </div>

          <table className="min-w-full border divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {catalog.map((sub) => {
                const yaAsignada = assigned.some((a) => a.idSubject === sub.idSubject);
                return (
                  <tr key={sub.idSubject}>
                    <td className="px-4 py-2">{sub.idSubject}</td>
                    <td className="px-4 py-2">{sub.name}</td>
                    <td className="px-4 py-2">
                      <button
                        disabled={yaAsignada}
                        onClick={() => handleAssign(sub.idSubject, sub.name)}
                        className={`px-3 py-1 rounded ${
                          yaAsignada
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {yaAsignada ? "Asignada" : "Asignar"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {catalog.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-3 text-gray-500">Sin resultados</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-3">
            <button
              onClick={handleCatalogPrev}
              disabled={catalogPagination.currentPage === 0}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm">
              Página {catalogPagination.currentPage + 1} de {catalogPagination.totalPages}
            </span>
            <button
              onClick={handleCatalogNext}
              disabled={catalogPagination.currentPage + 1 >= catalogPagination.totalPages}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
