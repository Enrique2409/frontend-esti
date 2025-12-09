// components/Modal.jsx
import React from "react";

const Modal = ({ isOpen, onClose, title, children, wide = false }) => {
  if (!isOpen) return null;

  // Clases de ancho según el tipo de modal
  const widthClasses = wide
    ? "w-[95vw] max-w-6xl" // modal casi a todo lo ancho de la pantalla, ideal para tablas
    : "w-full max-w-md";   // modal pequeño, como el que ya usabas

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Contenedor del modal */}
      <div
        className={`${widthClasses} bg-white rounded-lg shadow-lg z-10 mx-4 max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Contenido con scroll vertical si se pasa de alto */}
        <div className="px-6 py-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
