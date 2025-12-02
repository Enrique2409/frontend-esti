"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "../../Styles/navbar.css";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const menuItems = [
    {
      path: "/profesor/inicio",
      label: "Inicio",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      path: "/profesor/alumnos",
      label: "Alumnos",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
    {
      path: "/profesor/mis-materias",
      label: "Mis materias",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    },
    {
      path: "/profesor/calificaciones",
      label: "Calificaciones",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg dark:bg-gray-800 flex flex-col z-50">
      {/* Logo y título */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <img className="h-12 w-auto" src="/logo.png" alt="Logo Escuela" />
        <div className="ml-4">
          <h1 className="text-lg font-bold text-blue-800 dark:text-white">
            E.S.T.I N° 70
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Panel del Profesor
          </p>
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto bg-white dark:bg-gray-800">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(item.path)
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            <svg
              className={`w-5 h-5 mr-3 ${isActive(item.path)
                  ? "text-white"
                  : "text-gray-500 dark:text-gray-400"
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={item.icon}
              />
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Botón de cerrar sesión */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
