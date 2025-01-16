"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "../../Styles/navbar.css";

const Navbar = () => {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const isActive = (path) => pathname === path;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Botón con interruptor para el tema */}
          <label htmlFor="theme-toggle" className="inline-flex items-center cursor-pointer">
            <span className="mr-2">🌞</span>
            <div className="relative">
              <input
                type="checkbox"
                id="theme-toggle"
                className="hidden"
                checked={isDarkMode}
                onChange={toggleTheme}
              />
              <div className="toggle-path bg-gray-300 w-12 h-6 rounded-full"></div>
              <div className={`toggle-circle w-6 h-6 rounded-full bg-white absolute top-0.5 left-0.5 transition-all ${isDarkMode ? "transform translate-x-6" : ""}`}></div>
            </div>
            <span className="ml-2">🌑</span>
          </label>

          {/* Menú para dispositivos móviles */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Logo de la barra de navegación */}
          <div className="flex items-center">
            <img
              className="h-12 w-auto"
              src="/logo.png"
              alt="Logo"
            />
            <span className="ml-2 text-xl font-bold text-gray-900">E.S.T.I N° 70</span>
          </div>

          {/* Enlaces del menú para pantallas grandes */}
          <div className="hidden sm:block sm:ml-6">
            <div className="flex space-x-4">
              {[
                { path: "/admin/", label: "Inicio" },
                { path: "/admin/administradores", label: "Administradores" },
                { path: "/admin/profesores", label: "Profesores" },
                { path: "/admin/alumnos", label: "Alumnos" },
                { path: "/admin/calificaciones", label: "Calificaciones" },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  href={path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(path)
                      ? "bg-indigo-600 text-white"
                      : "text-gray-900 hover:bg-gray-100 hover:text-indigo-600"
                    }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Campo de búsqueda */}
          <div className="flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Buscar..."
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Menú del usuario */}
          <div className="ml-3 relative">
            <button
              type="button"
              className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Ver notificaciones</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
