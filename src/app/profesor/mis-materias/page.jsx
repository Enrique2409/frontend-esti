"use client";

import Navbar from "../components/navbar";
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import {
  getSubjectsByTeacher,
} from "@/app/Service/TeacherSubjectService";

export default function PageTeacherSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
  });
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const teacherId = 1; // Simulado (debería venir del token en producción)

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, subjects]);

  const fetchSubjects = async () => {
    try {
      const data = await getSubjectsByTeacher(teacherId);
      const subjectsArray = Array.isArray(data) ? data : [];
      setSubjects(subjectsArray);
      updatePagination(subjectsArray, 0);
    } catch (error) {
      console.error("Error al obtener materias del profesor:", error);
    }
  };

  const updatePagination = (data, page) => {
    const totalElements = data.length;
    const totalPages = Math.ceil(totalElements / pageSize);
    setPagination({ totalPages, totalElements, currentPage: page });
    setFilteredSubjects(
      data.slice(page * pageSize, (page + 1) * pageSize)
    );
  };

  const handleNextPage = () => {
    if (pagination.currentPage + 1 < pagination.totalPages) {
      const newPage = pagination.currentPage + 1;
      updatePagination(subjects, newPage);
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 0) {
      const newPage = pagination.currentPage - 1;
      updatePagination(subjects, newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    updatePagination(subjects, 0);
  };

  const handleSearch = (keyword) => {
    if (keyword.trim() === "") {
      updatePagination(subjects, 0);
      return;
    }
    const filtered = subjects.filter((s) =>
      s.subjectName?.toLowerCase().includes(keyword.toLowerCase())
    );
    updatePagination(filtered, 0);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="ml-64 min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Mis Materias Asignadas
        </h1>

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

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Materia
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject) => (
                      <tr
                        key={subject.idTeacherSubject}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {subject.idTeacherSubject}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {subject.subjectName}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No se encontraron materias asignadas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

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
    </div>
  );
}
