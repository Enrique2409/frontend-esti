"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import "../../Styles/navbar.css";
import { FaChalkboardTeacher } from "react-icons/fa";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const isActive = (path) => pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const menuItems = [
    { path: "/admin/inicio", label: "Inicio", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { path: "/admin/administradores", label: "Administradores", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { path: "/admin/profesores", label: "Profesores", icon: "bi bi-bar-chart-line" },
    { path: "/admin/alumnos", label: "Alumnos", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { path: "/admin/calificaciones", label: "Calificaciones", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { path: "/admin/reportes", label: "Reportes", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg dark:bg-gray-800 flex flex-col z-50">
      {/* Logo y título */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <img className="h-12 w-auto" src="/logo.png" alt="Logo Escuela" />
        <div className="ml-4">
          <h1 className="text-lg font-bold text-blue-800 dark:text-white">E.S.T.I N° 70</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Panel Administrativo</p>
        </div>
      </div>

      {/* Menú de navegación con fondo igual que zona logo y título */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto bg-white dark:bg-gray-800">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActive(item.path)
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <svg
              className={`w-5 h-5 mr-3 ${
                isActive(item.path) ? "text-white" : "text-gray-500 dark:text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Perfil y menú desplegable */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700" ref={profileMenuRef}>
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="w-full flex items-center space-x-3 p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <img
            className="h-8 w-8 rounded-full border-2 border-blue-500"
            src="/avatar-default.png"
            alt="Usuario"
          />
          <span className="font-medium">Admin</span>
        </button>

        {isProfileMenuOpen && (
          <div className="mt-2 rounded-md shadow-lg bg-white dark:bg-gray-800">
            <Link
              href="/admin/perfil"
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Mi Perfil
            </Link>
            <Link
              href="/admin/configuracion"
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Configuración
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Navbar;
