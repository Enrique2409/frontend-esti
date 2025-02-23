// Nuevo componente para encabezados de tabla consistentes
export default function TableHeader({ title, onAdd, buttonLabel = "Nuevo" }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona la información de {title.toLowerCase()} del sistema
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors duration-200 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
} 