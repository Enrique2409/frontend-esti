// Nuevo componente para la barra de búsqueda
export default function SearchBar({ onSearch }) {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm"
        placeholder="Buscar..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
    
  );
} 