"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Navbar from "../components/navbar";
import Modal from "../components/Modal";
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";

import {
  getCardexPaginated,
  searchCardex,
  createCardex,
  updateCardex,
  deleteCardex,
  getCardexByGroup,
  getCardexByStudent,
  getCardexByTeacher,
  getCardexBySubject,
  searchStudentsByTeacher,
} from "@/app/Service/CardexService";

import {
  getStudentsPaginated,
  searchStudents,
} from "@/app/Service/StudentService";

import {
  getTeachersPaginated,
  searchTeachers,
  getTeacherById,
} from "@/app/Service/TeacherService";

import { getAllGroups } from "@/app/Service/GroupService";
import { searchSubjects } from "@/app/Service/SubjectService";

import { getSystemConfig, verifyLockGrades, canModifyGrades } from "@/app/Service/SystemConfigService";

import { getSubjectsByTeacher } from "@/app/Service/TeacherSubjectService";
import { getPeriodsPaginated } from "@/app/Service/PeriodService";

export default function PageCardex() {
  // ------------------ Estado principal (tabla de cardex) ------------------
  const [cardexList, setCardexList] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
  });
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [systemConfig, setSystemConfig] = useState(null);

  // ------------------ Filtros Avanzados ------------------
  const [filterMode, setFilterMode] = useState("all"); // all, teacher, student, group, subject
  const [filterTeacher, setFilterTeacher] = useState(null);
  const [filterStudent, setFilterStudent] = useState(null);
  const [filterGroup, setFilterGroup] = useState(null); // Objeto grupo o ID
  const [filterSubject, setFilterSubject] = useState(null);

  // Filtros específicos para "Por Profesor"
  const [filterTeacherSubject, setFilterTeacherSubject] = useState(null); // Materia del profesor
  const [filterTeacherSubjects, setFilterTeacherSubjects] = useState([]); // Lista de materias/grupos del profesor para el filtro
  const [filterTeacherGroup, setFilterTeacherGroup] = useState(""); // Nombre del grupo (string)
  const [filterTeacherGrade, setFilterTeacherGrade] = useState("");
  const [filterTeacherKeyword, setFilterTeacherKeyword] = useState("");

  // Listas para selectores de filtro
  const [allGroups, setAllGroups] = useState([]);

  // Selector de Materias (para filtro)
  const [isSubjectFilterSelectorOpen, setIsSubjectFilterSelectorOpen] = useState(false);
  const [subjectsFilter, setSubjectsFilter] = useState([]);
  const [subjectsFilterPagination, setSubjectsFilterPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
  });
  const [subjectsFilterPageSize] = useState(10);
  const [subjectsFilterSearchTerm, setSubjectsFilterSearchTerm] = useState("");

  // ------------------ Formulario de Cardex ------------------
  const initialFormState = {
    idCardex: null,

    // IDs que se envían al backend
    studentId: "",
    teacherSubjectId: "",
    periodId: "",

    // Datos mostrados solo para lectura
    studentName: "",
    studentLastNamePaternal: "",
    studentLastNameMaternal: "",
    groupName: "",
    grade: "",

    idTeacher: "",
    teacherName: "",
    teacherLastName: "",
    subjectName: "",

    periodCve: "",

    // Calificaciones (0–10)
    firstPartial: 0,
    secondPartial: 0,
    thirdPartial: 0,
    finalGrade: 0,
  };

  const [isSelectingForFilter, setIsSelectingForFilter] = useState(false);

  const [formData, setFormData] = useState(initialFormState);

  // ------------------ Selectores: alumnos ------------------
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsPagination, setStudentsPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
  });
  const [studentsPageSize] = useState(10);
  const [studentsSearchTerm, setStudentsSearchTerm] = useState("");

  // ------------------ Selectores: profesores ------------------
  const [isTeacherSelectorOpen, setIsTeacherSelectorOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [teachersPagination, setTeachersPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
  });
  const [teachersPageSize] = useState(10);
  const [teachersSearchTerm, setTeachersSearchTerm] = useState("");

  // ------------------ Selectores: materias (TeacherSubject) ------------------
  const [isSubjectSelectorOpen, setIsSubjectSelectorOpen] = useState(false);
  const [teacherSubjects, setTeacherSubjects] = useState([]);

  // ------------------ Selectores: periodos ------------------
  const [isPeriodSelectorOpen, setIsPeriodSelectorOpen] = useState(false);
  const [periods, setPeriods] = useState([]);
  const [periodsPagination, setPeriodsPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
  });
  const [periodsPageSize] = useState(10);

  const [gradesLocked, setGradesLocked] = useState(false);
  const [showLockOverlay, setShowLockOverlay] = useState(false);
  const [checkingLock, setCheckingLock] = useState(false);

  useEffect(() => {
    checkIfLocked();
    getAllGroups(setAllGroups);
  }, []);

  const checkIfLocked = async () => {
    setCheckingLock(true);
    try {
      const canModify = await canModifyGrades();
      const isLocked = !canModify;
      setGradesLocked(isLocked);
      setShowLockOverlay(isLocked);
      console.log("¿Puede modificar calificaciones?", canModify);
    } catch (error) {
      console.error("Error verificando bloqueo", error);
      setGradesLocked(false);
      setShowLockOverlay(false);
    } finally {
      setCheckingLock(false);
    }
  }

  // ================== CARGA PRINCIPAL DE CARDEX ==================
  // ================== CARGA PRINCIPAL DE CARDEX ==================
  const fetchCardex = async (page = 0, keyword = "") => {
    try {
      if (filterMode === "all") {
        if (keyword.trim() !== "") {
          await searchCardex(
            keyword,
            page,
            pageSize,
            setCardexList,
            setPagination
          );
        } else {
          await getCardexPaginated(page, pageSize, setCardexList, setPagination);
        }
      } else if (filterMode === "teacher" && filterTeacher) {
        // Filtro por profesor (y sus sub-filtros)
        // searchStudentsByTeacher espera: teacherId, subjectId, groupName, grade, keyword, page, size
        const subjectId = filterTeacherSubject?.subject?.idSubject || filterTeacherSubject?.idSubject || null;

        await searchStudentsByTeacher(
          filterTeacher.idTeacher,
          subjectId,
          filterTeacherGroup || null,
          filterTeacherGrade || null,
          filterTeacherKeyword || null,
          page,
          pageSize,
          setCardexList,
          setPagination
        );
      } else if (filterMode === "student" && filterStudent) {
        const list = await getCardexByStudent(filterStudent.idStudent);
        setCardexList(list);
        // Simular paginación para lista completa
        setPagination({ totalPages: 1, totalElements: list.length, currentPage: 0 });
      } else if (filterMode === "group" && filterGroup) {
        // filterGroup puede ser el objeto entero o ID, asumimos objeto por el selector
        const groupId = filterGroup.idGroup || filterGroup;
        const list = await getCardexByGroup(groupId);
        setCardexList(list);
        setPagination({ totalPages: 1, totalElements: list.length, currentPage: 0 });
      } else if (filterMode === "subject" && filterSubject) {
        const list = await getCardexBySubject(filterSubject.idSubject);
        setCardexList(list);
        setPagination({ totalPages: 1, totalElements: list.length, currentPage: 0 });
      } else {
        // Fallback: si hay modo seleccionado pero no entidad, mostramos todo o vacío?
        // Mostramos todo paginado por defecto
        await getCardexPaginated(page, pageSize, setCardexList, setPagination);
      }
    } catch (error) {
      console.error("Error al obtener cardex:", error);
      setCardexList([]);
      setPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
    }
  };

  useEffect(() => {
    fetchCardex(0, searchTerm);
    verifyStatusSystem();
  }, [pageSize, searchTerm, filterMode, filterTeacher, filterStudent, filterGroup, filterSubject]); // Agregamos dependencias de filtros principales

  const verifyStatusSystem = async () => {
    try {
      const config = await getSystemConfig();
      setSystemConfig(config);
    } catch (error) {
      console.error("Error al obtener configuración del sistema:", error);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage + 1 < pagination.totalPages) {
      fetchCardex(pagination.currentPage + 1, searchTerm);
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 0) {
      fetchCardex(pagination.currentPage - 1, searchTerm);
    }
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
  };

  // ================== FORMULARIO PRINCIPAL (CREAR / EDITAR) ==================
  const resetForm = () => {
    setFormData({
      ...initialFormState,
      firstPartial: 0,
      secondPartial: 0,
      thirdPartial: 0,
      finalGrade: 0,
    });
  };

  const handleOpenModal = async (cardex = null) => {
    const canModify = await canModifyGrades();
    if (gradesLocked) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        html: `
        <p class= "text-gray-700 mb-2">El periodo de calificaciones ha sido cerrado por administración.</p>
        <p class= "text-sm text-gray-500">No puedes crear ni modificar calificaciones en este momento.</p>
      `,
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Entendido",
      });
      return;
    }


    if (cardex) {
      // Editar
      const newForm = {
        ...initialFormState,
        idCardex: cardex.idCardex,

        studentId: cardex.idStudent,
        studentName: cardex.studentName,
        studentLastNamePaternal: cardex.studentLastNamePaternal,
        studentLastNameMaternal: cardex.studentLastNameMaternal,
        groupName: cardex.groupName,
        grade: cardex.grade,

        idTeacher: cardex.idTeacher,
        teacherName: cardex.teacherName,
        teacherLastName: cardex.teacherLastName,
        subjectName: cardex.subjectName,

        periodId: cardex.idPeriod,
        periodCve: cardex.period,

        firstPartial: cardex.firstPartial ?? 0,
        secondPartial: cardex.secondPartial ?? 0,
        thirdPartial: cardex.thirdPartial ?? 0,
        finalGrade: cardex.finalGrade ?? 0,

        teacherSubjectId: "", // lo intentamos resolver abajo
      };

      setFormData(newForm);

      // Intentar pre-resolver el idTeacherSubject en base al maestro y materia actuales
      if (cardex.idTeacher) {
        try {
          const list = await getSubjectsByTeacher(cardex.idTeacher);
          setTeacherSubjects(list || []);

          const match = (list || []).find((ts) => {
            const subjectLabel =
              ts.subjectName || (ts.subject && ts.subject.name) || "";
            const groupLabel =
              ts.groupName || (ts.group && ts.group.groupName) || "";

            return (
              subjectLabel === cardex.subjectName &&
              groupLabel === cardex.groupName
            );
          });

          if (match && match.idTeacherSubject) {
            setFormData((prev) => ({
              ...prev,
              teacherSubjectId: match.idTeacherSubject,
            }));
          }
        } catch (error) {
          console.error(
            "No se pudo pre-cargar la relación TeacherSubject para este cardex:",
            error
          );
        }
      }
    } else {
      // Nuevo
      resetForm();
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  // Manejar cambios SOLO de calificaciones (0–10)
  const handleGradeChange = (e) => {
    const { name, value } = e.target;

    // Solo dejamos cambiar los 3 parciales
    if (!["firstPartial", "secondPartial", "thirdPartial"].includes(name)) {
      return;
    }

    const num = value === "" ? 0 : Number(value);
    if (Number.isNaN(num) || num < 0 || num > 10) return;

    setFormData((prev) => {
      const updated = { ...prev, [name]: num };

      const p1 = Number(updated.firstPartial) || 0;
      const p2 = Number(updated.secondPartial) || 0;
      const p3 = Number(updated.thirdPartial) || 0;

      // Promedio redondeado 0–10
      const final = Math.round((p1 + p2 + p3) / 3);
      updated.finalGrade = final;

      return updated;
    });
  };

  const validateGrades = () => {
    const gradeFields = [
      { key: "firstPartial", label: "Primer parcial" },
      { key: "secondPartial", label: "Segundo parcial" },
      { key: "thirdPartial", label: "Tercer parcial" },
      { key: "finalGrade", label: "Calificación final" },
    ];

    for (const { key, label } of gradeFields) {
      const val = Number(formData[key]);
      if (Number.isNaN(val) || val < 0 || val > 10) {
        Swal.fire("Error", `${label} debe estar entre 0 y 10.`, "error");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (gradesLocked) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        html: `
        <p class= "text-gray-700 mb-2">El peridoo de calificaciones ha sido cerrado por administración.</p>
        <p class= "text-sm text-gray-500">No puedes crear ni modificar calificaciones en este momento.</p>
      `,
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Entendido",
      });
      return;
    }

    if (!formData.studentId) {
      Swal.fire("Error", "Debes seleccionar un alumno.", "error");
      return;
    }

    if (!formData.idTeacher) {
      Swal.fire("Error", "Debes seleccionar un profesor.", "error");
      return;
    }

    if (!formData.teacherSubjectId) {
      Swal.fire(
        "Error",
        "Debes seleccionar una materia (relación maestro-materia).",
        "error"
      );
      return;
    }

    if (!formData.periodId) {
      Swal.fire("Error", "Debes seleccionar un periodo.", "error");
      return;
    }

    if (!validateGrades()) return;

    const payload = {
      studentId: formData.studentId,
      teacherSubjectId: formData.teacherSubjectId,
      periodId: formData.periodId,
      firstPartial: Number(formData.firstPartial),
      secondPartial: Number(formData.secondPartial),
      thirdPartial: Number(formData.thirdPartial),
      finalGrade: Number(formData.finalGrade),
    };

    try {
      if (formData.idCardex) {
        // editar
        await updateCardex(payload, formData.idCardex);
      } else {
        // nuevo
        await createCardex(payload);
      }

      await fetchCardex(pagination.currentPage, searchTerm);
      handleCloseModal();
      Swal.fire(
        "Éxito",
        "Registro de cardex guardado correctamente",
        "success"
      );
    } catch (error) {
      console.error("Error al guardar el cardex:", error);

      if (error.response?.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Acceso denegado",
          text: error.response?.data?.error || "El periodo de calificaciones ha sido cerrado por administración.",
        });
      } else {
        Swal.fire("Error", "No se pudo guardar el registro de cardex", "error");
      }
    }
  };

  const handleDeleteCardex = async (idCardex) => {

    if (gradesLocked) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "El periodo de calificaciones ha sido cerrado por administración.",
      });
      return;
    }

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

    if (!result.isConfirmed) return;

    try {
      await deleteCardex(idCardex); // según tu servicio, puede ser delete lógico
      await fetchCardex(pagination.currentPage, searchTerm);
      Swal.fire(
        "Eliminado",
        "El registro de cardex ha sido eliminado.",
        "success"
      );
    } catch (error) {
      console.error("Error eliminando cardex:", error);
      Swal.fire("Error", "No se pudo eliminar el registro de cardex.", "error");
    }
  };

  // ================== SELECTOR DE ALUMNOS ==================
  const fetchStudents = async (page = 0, keyword = "") => {
    try {
      if (keyword.trim() !== "") {
        await searchStudents(
          keyword,
          page,
          studentsPageSize,
          setStudents,
          setStudentsPagination
        );
      } else {
        await getStudentsPaginated(
          page,
          studentsPageSize,
          setStudents,
          setStudentsPagination
        );
      }
    } catch (error) {
      console.error("Error al obtener alumnos:", error);
      setStudents([]);
      setStudentsPagination({
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
      });
    }
  };

  useEffect(() => {
    if (isStudentSelectorOpen) {
      fetchStudents(0, studentsSearchTerm);
    }
  }, [isStudentSelectorOpen, studentsSearchTerm, studentsPageSize]);

  const handleStudentsNextPage = () => {
    if (studentsPagination.currentPage + 1 < studentsPagination.totalPages) {
      fetchStudents(studentsPagination.currentPage + 1, studentsSearchTerm);
    }
  };

  const handleStudentsPrevPage = () => {
    if (studentsPagination.currentPage > 0) {
      fetchStudents(studentsPagination.currentPage - 1, studentsSearchTerm);
    }
  };

  const handleSelectStudent = (student) => {
    if (isSelectingForFilter) {
      setFilterStudent(student);
      setIsSelectingForFilter(false);
      setIsStudentSelectorOpen(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        studentId: student.idStudent,
        studentName: student.name,
        studentLastNamePaternal: student.lastNamePaternal,
        studentLastNameMaternal: student.lastNameMaternal,
        groupName: student.groupName ?? "",
        grade: student.grade ?? "",
      }));
      setIsStudentSelectorOpen(false);
    }
  };

  // ================== SELECTOR DE PROFESORES ==================
  const fetchTeachers = async (page = 0, keyword = "") => {
    try {
      if (keyword.trim() !== "") {
        await searchTeachers(
          keyword,
          page,
          teachersPageSize,
          setTeachers,
          setTeachersPagination
        );
      } else {
        await getTeachersPaginated(
          page,
          teachersPageSize,
          setTeachers,
          setTeachersPagination
        );
      }
    } catch (error) {
      console.error("Error al obtener profesores:", error);
      setTeachers([]);
      setTeachersPagination({
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
      });
    }
  };

  useEffect(() => {
    if (isTeacherSelectorOpen) {
      fetchTeachers(0, teachersSearchTerm);
    }
  }, [isTeacherSelectorOpen, teachersSearchTerm, teachersPageSize]);

  const handleTeachersNextPage = () => {
    if (teachersPagination.currentPage + 1 < teachersPagination.totalPages) {
      fetchTeachers(teachersPagination.currentPage + 1, teachersSearchTerm);
    }
  };

  const handleTeachersPrevPage = () => {
    if (teachersPagination.currentPage > 0) {
      fetchTeachers(teachersPagination.currentPage - 1, teachersSearchTerm);
    }
  };

  const handleSelectTeacher = async (teacher) => {
    if (isSelectingForFilter) {
      setFilterTeacher(teacher);
      // Reset sub-filters
      setFilterTeacherSubject(null);
      setFilterTeacherGroup("");
      setFilterTeacherGrade("");
      setFilterTeacherKeyword("");

      // Fetch subjects for this teacher to populate dropdowns
      try {
        const list = await getSubjectsByTeacher(teacher.idTeacher);
        setFilterTeacherSubjects(list || []);
      } catch (error) {
        console.error("Error al cargar materias del profesor para filtro:", error);
        setFilterTeacherSubjects([]);
      }

      setIsSelectingForFilter(false);
      setIsTeacherSelectorOpen(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        idTeacher: teacher.idTeacher,
        teacherName: teacher.name,
        teacherLastName: teacher.lastName,
        teacherSubjectId: "",
        subjectName: "",
      }));
      setTeacherSubjects([]);
      setIsTeacherSelectorOpen(false);
    }
  };

  // ================== SELECTOR DE MATERIAS (POR PROFESOR) ==================
  const openSubjectSelector = async () => {
    if (!formData.idTeacher) {
      Swal.fire(
        "Atención",
        "Primero debes seleccionar un profesor.",
        "warning"
      );
      return;
    }

    try {
      const list = await getSubjectsByTeacher(formData.idTeacher);
      setTeacherSubjects(list || []);
      setIsSubjectSelectorOpen(true);
    } catch (error) {
      console.error("Error al obtener materias del profesor:", error);
      Swal.fire(
        "Error",
        "No se pudieron obtener las materias del profesor.",
        "error"
      );
    }
  };

  const openFilterSubjectSelector = async () => {
    if (!filterTeacher) {
      Swal.fire("Atención", "Primero debes seleccionar un profesor para el filtro.", "warning");
      return;
    }
    // Usamos la lista ya cargada en filterTeacherSubjects
    setTeacherSubjects(filterTeacherSubjects);
    setIsSubjectSelectorOpen(true);
    setIsSelectingForFilter(true);
  };

  const handleSelectSubject = (ts) => {
    if (isSelectingForFilter) {
      setFilterTeacherSubject(ts);
      setIsSubjectSelectorOpen(false);
      setIsSelectingForFilter(false);
    } else {
      const subjectLabel =
        ts.subjectName || (ts.subject && ts.subject.name) || "";

      setFormData((prev) => ({
        ...prev,
        teacherSubjectId: ts.idTeacherSubject,
        subjectName: subjectLabel,
      }));

      setIsSubjectSelectorOpen(false);
    }
  };

  // ================== SELECTOR DE PERIODOS ==================
  const fetchPeriods = async (page = 0) => {
    try {
      await getPeriodsPaginated(
        page,
        periodsPageSize,
        setPeriods,
        setPeriodsPagination
      );
    } catch (error) {
      console.error("Error al obtener periodos:", error);
      setPeriods([]);
      setPeriodsPagination({ totalPages: 0, totalElements: 0, currentPage: 0 });
    }
  };

  useEffect(() => {
    if (isPeriodSelectorOpen) {
      fetchPeriods(0);
    }
  }, [isPeriodSelectorOpen, periodsPageSize]);

  const handlePeriodsNextPage = () => {
    if (periodsPagination.currentPage + 1 < periodsPagination.totalPages) {
      fetchPeriods(periodsPagination.currentPage + 1);
    }
  };

  const handlePeriodsPrevPage = () => {
    if (periodsPagination.currentPage > 0) {
      fetchPeriods(periodsPagination.currentPage - 1);
    }
  };

  const handleSelectPeriod = (period) => {
    setFormData((prev) => ({
      ...prev,
      periodId: period.idPeriod,
      periodCve: period.cve,
    }));
    setIsPeriodSelectorOpen(false);
  };

  // ================== SELECTOR DE MATERIAS (FILTRO) ==================
  const fetchSubjectsFilter = async (page = 0, keyword = "") => {
    try {
      await searchSubjects(
        keyword,
        page,
        subjectsFilterPageSize,
        setSubjectsFilter,
        setSubjectsFilterPagination
      );
    } catch (error) {
      console.error("Error al buscar materias:", error);
      setSubjectsFilter([]);
    }
  };

  useEffect(() => {
    if (isSubjectFilterSelectorOpen) {
      fetchSubjectsFilter(0, subjectsFilterSearchTerm);
    }
  }, [isSubjectFilterSelectorOpen, subjectsFilterSearchTerm, subjectsFilterPageSize]);

  const handleSubjectsFilterNextPage = () => {
    if (subjectsFilterPagination.currentPage + 1 < subjectsFilterPagination.totalPages) {
      fetchSubjectsFilter(subjectsFilterPagination.currentPage + 1, subjectsFilterSearchTerm);
    }
  };

  const handleSubjectsFilterPrevPage = () => {
    if (subjectsFilterPagination.currentPage > 0) {
      fetchSubjectsFilter(subjectsFilterPagination.currentPage - 1, subjectsFilterSearchTerm);
    }
  };

  const handleSelectSubjectFilter = (subject) => {
    setFilterSubject(subject);
    setIsSubjectFilterSelectorOpen(false);
  };

  // ================== RENDER ==================
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {gradesLocked && showLockOverlay && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-4">
              Calificaciones bloqueadas
            </p>
            <p className="text-gray-600 mb-4">
              Las calificaciones están bloqueadas. No se pueden modificar.
            </p>
            <button
              onClick={() => setShowLockOverlay(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <main className="ml-64 min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8">
        <TableHeader
          title="Cardex"
          onAdd={() => handleOpenModal()}
          buttonLabel="Nuevo registro"
        />

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            {/* Barra de Filtros */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-wrap gap-4 items-center mb-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Modo de Filtrado</label>
                  <select
                    value={filterMode}
                    onChange={(e) => {
                      setFilterMode(e.target.value);
                      setFilterTeacher(null);
                      setFilterStudent(null);
                      setFilterGroup(null);
                      setFilterSubject(null);
                      setSearchTerm("");
                    }}
                    className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">General (Todos)</option>
                    <option value="teacher">Por Profesor (Avanzado)</option>
                    <option value="student">Por Alumno</option>
                    <option value="group">Por Grupo</option>
                    <option value="subject">Por Materia</option>
                  </select>
                </div>

                {filterMode === "teacher" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end w-full">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">Profesor</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={filterTeacher ? `${filterTeacher.name} ${filterTeacher.lastName}` : ""}
                          placeholder="Seleccionar profesor..."
                          className="border border-gray-300 rounded-md px-3 py-2 bg-white w-full"
                        />
                        <button
                          onClick={() => {
                            setIsSelectingForFilter(true);
                            setIsTeacherSelectorOpen(true);
                          }}
                          className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 shrink-0"
                        >
                          Buscar
                        </button>
                      </div>
                    </div>

                    {filterTeacher && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-1">Materia</label>
                          <button
                            onClick={openFilterSubjectSelector}
                            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-left w-full truncate"
                          >
                            {filterTeacherSubject ? (filterTeacherSubject.subjectName || filterTeacherSubject.subject?.name) : "Todas"}
                          </button>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-1">Grado y Grupo</label>
                          <select
                            value={filterTeacherGroup && filterTeacherGrade ? `${filterTeacherGrade}-${filterTeacherGroup}` : ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val) {
                                const [g, gr] = val.split("-");
                                setFilterTeacherGrade(g);
                                setFilterTeacherGroup(gr);
                              } else {
                                setFilterTeacherGrade("");
                                setFilterTeacherGroup("");
                              }
                            }}
                            className="border border-gray-300 rounded-md px-3 py-2 bg-white w-full"
                          >
                            <option value="">Todos</option>
                            {[...new Set(filterTeacherSubjects.map(ts => {
                              const grade = ts.grade || (ts.group && ts.group.grade) || "";
                              const group = ts.groupName || (ts.group && ts.group.groupName) || "";
                              return (grade && group) ? `${grade}-${group}` : "";
                            }).filter(Boolean))].sort().map(gg => {
                              const [grade, group] = gg.split("-");
                              return <option key={gg} value={gg}>{grade}° {group}</option>
                            })}
                          </select>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-1">Palabra Clave</label>
                          <input
                            type="text"
                            value={filterTeacherKeyword}
                            onChange={(e) => setFilterTeacherKeyword(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            placeholder="Nombre alumno..."
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => fetchCardex(0)}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full"
                          >
                            Aplicar Filtros
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {filterMode === "student" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Alumno</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={filterStudent ? `${filterStudent.name} ${filterStudent.lastNamePaternal}` : ""}
                        placeholder="Seleccionar alumno..."
                        className="border border-gray-300 rounded-md px-3 py-2 bg-white w-64"
                      />
                      <button
                        onClick={() => {
                          setIsSelectingForFilter(true);
                          setIsStudentSelectorOpen(true);
                        }}
                        className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700"
                      >
                        Buscar
                      </button>
                    </div>
                  </div>
                )}

                {filterMode === "group" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Grupo</label>
                    <select
                      value={filterGroup ? filterGroup.idGroup : ""}
                      onChange={(e) => {
                        const g = allGroups.find(x => x.idGroup === Number(e.target.value));
                        setFilterGroup(g);
                      }}
                      className="border border-gray-300 rounded-md px-3 py-2 bg-white w-64"
                    >
                      <option value="">Seleccionar grupo...</option>
                      {allGroups.map(g => (
                        <option key={g.idGroup} value={g.idGroup}>{g.groupName}</option>
                      ))}
                    </select>
                  </div>
                )}

                {filterMode === "subject" && (
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Materia</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={filterSubject ? filterSubject.name : ""}
                        placeholder="Seleccionar materia..."
                        className="border border-gray-300 rounded-md px-3 py-2 bg-white w-64"
                      />
                      <button
                        onClick={() => setIsSubjectFilterSelectorOpen(true)}
                        className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700"
                      >
                        Buscar
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
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

            {/* Tabla principal de Cardex */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto divide-y divide-gray-200 whitespace-nowrap">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "ID",
                      "Alumno",
                      "Grupo",
                      "Grado",
                      "Profesor",
                      "Materia",
                      "Periodo",
                      "P1",
                      "P2",
                      "P3",
                      "Final",
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
                  {cardexList.map((c) => (
                    <tr
                      key={c.idCardex}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.idCardex}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.studentName} {c.studentLastNamePaternal}{" "}
                        {c.studentLastNameMaternal}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.groupName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.grade}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.teacherName} {c.teacherLastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.subjectName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.period}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.firstPartial ?? 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.secondPartial ?? 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.thirdPartial ?? 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {c.finalGrade ?? 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenModal(c)}
                            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteCardex(c.idCardex)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {cardexList.length === 0 && (
                    <tr>
                      <td
                        colSpan={12}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No hay registros de cardex.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación principal */}
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

      {/* ================== MODAL PRINCIPAL CARDEx ================== */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          formData.idCardex
            ? "Editar registro de Cardex"
            : "Nuevo registro de Cardex"
        }
      >
        {systemConfig?.lockGrades && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <div className="flex-items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <p className="font-semibold text-red-800">Periodo de calificaciones bloqueado</p>
                <p>El periodo de calificaciones ha sido cerrado por Administración</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alumno */}
          <div className="space-y-2 border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">Alumno</h3>
              <button
                type="button"
                onClick={() => setIsStudentSelectorOpen(true)}
                className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
              >
                Seleccionar alumno
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID Alumno
                </label>
                <input
                  type="text"
                  value={formData.studentId || ""}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={
                    formData.studentName
                      ? `${formData.studentName} ${formData.studentLastNamePaternal} ${formData.studentLastNameMaternal}`
                      : ""
                  }
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grupo
                </label>
                <input
                  type="text"
                  value={formData.groupName || ""}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grado
                </label>
                <input
                  type="text"
                  value={formData.grade || ""}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Profesor y materia */}
          <div className="space-y-2 border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">
                Profesor y materia
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profesor
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsTeacherSelectorOpen(true)}
                    className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                  >
                    Seleccionar profesor
                  </button>
                </div>
                <input
                  type="text"
                  value={
                    formData.teacherName
                      ? `${formData.teacherName} ${formData.teacherLastName}`
                      : ""
                  }
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm sm:text-sm"
                />
                <input
                  type="text"
                  value={formData.idTeacher || ""}
                  readOnly
                  className="mt-2 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm sm:text-sm"
                  placeholder="ID Profesor"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Materia (relación TSG)
                  </label>
                  <button
                    type="button"
                    onClick={openSubjectSelector}
                    className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                  >
                    Seleccionar materia
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.subjectName || ""}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm sm:text-sm"
                />
                <input
                  type="text"
                  value={formData.teacherSubjectId || ""}
                  readOnly
                  className="mt-2 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm sm:text-sm"
                  placeholder="ID TeacherSubject"
                />
              </div>
            </div>
          </div>

          {/* Periodo */}
          <div className="space-y-2 border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Periodo</h3>
              <button
                type="button"
                onClick={() => setIsPeriodSelectorOpen(true)}
                className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
              >
                Seleccionar periodo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID Periodo
                </label>
                <input
                  type="text"
                  value={formData.periodId || ""}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Clave de periodo
                </label>
                <input
                  type="text"
                  value={formData.periodCve || ""}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Calificaciones (0 a 10)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="firstPartial"
                  className="block text-sm font-medium text-gray-700"
                >
                  Primer parcial
                </label>
                <input
                  id="firstPartial"
                  name="firstPartial"
                  type="number"
                  min={0}
                  max={10}
                  value={formData.firstPartial}
                  onChange={handleGradeChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="secondPartial"
                  className="block text-sm font-medium text-gray-700"
                >
                  Segundo parcial
                </label>
                <input
                  id="secondPartial"
                  name="secondPartial"
                  type="number"
                  min={0}
                  max={10}
                  value={formData.secondPartial}
                  onChange={handleGradeChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="thirdPartial"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tercer parcial
                </label>
                <input
                  id="thirdPartial"
                  name="thirdPartial"
                  type="number"
                  min={0}
                  max={10}
                  value={formData.thirdPartial}
                  onChange={handleGradeChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="finalGrade"
                  className="block text-sm font-medium text-gray-700"
                >
                  Calificación final (automática)
                </label>
                <input
                  id="finalGrade"
                  name="finalGrade"
                  type="number"
                  min={0}
                  max={10}
                  value={formData.finalGrade}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              {formData.idCardex ? "Guardar cambios" : "Crear registro"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================== MODAL SELECTOR ALUMNOS ================== */}
      <Modal
        isOpen={isStudentSelectorOpen}
        onClose={() => setIsStudentSelectorOpen(false)}
        title="Seleccionar alumno"
      >
        <div className="w-[90vw] max-w-6xl">
          <SearchBar onSearch={setStudentsSearchTerm} />
          <div className="overflow-x-auto max-h-96">
            <table className="w-full table-auto divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "ID",
                    "Nombre",
                    "Apellido Paterno",
                    "Apellido Materno",
                    "CURP",
                    "Grupo",
                    "Grado",
                    "Acciones",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((s) => (
                  <tr key={s.idStudent} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {s.idStudent}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {s.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {s.lastNamePaternal}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {s.lastNameMaternal}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {s.curp}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {s.groupName ?? (s.group ? s.group.groupName : "")}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {s.grade ?? (s.group ? s.group.grade : "")}
                    </td>

                    <td className="px-4 py-2 text-sm text-gray-900">
                      <button
                        type="button"
                        onClick={() => handleSelectStudent(s)}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium"
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-2 text-center text-sm text-gray-500"
                    >
                      No se encontraron alumnos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={handleStudentsPrevPage}
              disabled={studentsPagination.currentPage === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {studentsPagination.currentPage + 1} de{" "}
              {studentsPagination.totalPages}
            </span>
            <button
              type="button"
              onClick={handleStudentsNextPage}
              disabled={
                studentsPagination.currentPage + 1 >=
                studentsPagination.totalPages
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </Modal>

      {/* ================== MODAL SELECTOR PROFESORES ================== */}
      <Modal
        isOpen={isTeacherSelectorOpen}
        onClose={() => setIsTeacherSelectorOpen(false)}
        title="Seleccionar profesor"
      >
        <div className="w-[90vw] max-w-6xl">
          <SearchBar onSearch={setTeachersSearchTerm} />
          <div className="overflow-x-auto max-h-96">
            <table className="w-full table-auto divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "ID",
                    "Nombre",
                    "Apellido",
                    "Teléfono",
                    "Email",
                    "Acciones",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teachers.map((t) => (
                  <tr key={t.idTeacher} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {t.idTeacher}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {t.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {t.lastName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {t.phoneNumber}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {t.email}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      <button
                        type="button"
                        onClick={() => handleSelectTeacher(t)}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium"
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
                {teachers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-2 text-center text-sm text-gray-500"
                    >
                      No se encontraron profesores.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={handleTeachersPrevPage}
              disabled={teachersPagination.currentPage === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {teachersPagination.currentPage + 1} de{" "}
              {teachersPagination.totalPages}
            </span>
            <button
              type="button"
              onClick={handleTeachersNextPage}
              disabled={
                teachersPagination.currentPage + 1 >=
                teachersPagination.totalPages
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </Modal>

      {/* ================== MODAL SELECTOR MATERIAS (TSG) ================== */}
      <Modal
        isOpen={isSubjectSelectorOpen}
        onClose={() => setIsSubjectSelectorOpen(false)}
        title="Seleccionar materia del profesor"
      >
        <div className="w-[90vw] max-w-6xl">
          <div className="overflow-x-auto max-h-96">
            <table className="w-full table-auto divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr>
                  {["ID TSG", "Materia", "Grupo", "Acciones"].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teacherSubjects.map((ts) => {
                  const subjectLabel =
                    ts.subjectName || (ts.subject && ts.subject.name) || "";
                  const groupLabel =
                    ts.groupName || (ts.group && ts.group.groupName) || "";

                  return (
                    <tr key={ts.idTeacherSubject} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {ts.idTeacherSubject}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {subjectLabel}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {groupLabel}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        <button
                          type="button"
                          onClick={() => handleSelectSubject(ts)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium"
                        >
                          Seleccionar
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {teacherSubjects.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-2 text-center text-sm text-gray-500"
                    >
                      No se encontraron materias para este profesor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* ================== MODAL SELECTOR PERIODOS ================== */}
      <Modal
        isOpen={isPeriodSelectorOpen}
        onClose={() => setIsPeriodSelectorOpen(false)}
        title="Seleccionar periodo"
      >
        <div className="w-[90vw] max-w-6xl">
          <div className="overflow-x-auto max-h-96">
            <table className="w-full table-auto divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Clave", "Descripción", "Acciones"].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {periods.map((p) => (
                  <tr key={p.idPeriod} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {p.idPeriod}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">{p.cve}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {p.description}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      <button
                        type="button"
                        onClick={() => handleSelectPeriod(p)}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium"
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
                {periods.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-2 text-center text-sm text-gray-500"
                    >
                      No se encontraron periodos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={handlePeriodsPrevPage}
              disabled={periodsPagination.currentPage === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {periodsPagination.currentPage + 1} de{" "}
              {periodsPagination.totalPages}
            </span>
            <button
              type="button"
              onClick={handlePeriodsNextPage}
              disabled={
                periodsPagination.currentPage + 1 >=
                periodsPagination.totalPages
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </Modal>

      {/* ================== MODAL SELECTOR MATERIAS (FILTRO) ================== */}
      <Modal
        isOpen={isSubjectFilterSelectorOpen}
        onClose={() => setIsSubjectFilterSelectorOpen(false)}
        title="Seleccionar materia (Filtro)"
      >
        <div className="w-[90vw] max-w-6xl">
          <SearchBar onSearch={setSubjectsFilterSearchTerm} />
          <div className="overflow-x-auto max-h-96">
            <table className="w-full table-auto divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Nombre", "Semestre", "Créditos", "Acciones"].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjectsFilter.map((s) => (
                  <tr key={s.idSubject} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{s.idSubject}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{s.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{s.semester}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{s.credits}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      <button
                        type="button"
                        onClick={() => handleSelectSubjectFilter(s)}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium"
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
                {subjectsFilter.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-2 text-center text-sm text-gray-500">
                      No se encontraron materias.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={handleSubjectsFilterPrevPage}
              disabled={subjectsFilterPagination.currentPage === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {subjectsFilterPagination.currentPage + 1} de {subjectsFilterPagination.totalPages}
            </span>
            <button
              type="button"
              onClick={handleSubjectsFilterNextPage}
              disabled={subjectsFilterPagination.currentPage + 1 >= subjectsFilterPagination.totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


