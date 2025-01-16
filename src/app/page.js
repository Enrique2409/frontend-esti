import "../app/Styles/Login.css";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-custom p-6">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-20 h-20 mx-auto rounded-full mb-4 shadow-md"
          />
          <h3 className="text-2xl font-bold text-gray-900">¡Bienvenido!</h3>
          <p className="text-gray-600 text-sm">Inicia sesión para continuar</p>
        </div>
        <form className="space-y-6">
          <div className="space-y-4">
            {/* Correo Electrónico */}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Correo Electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Correo Electrónico"
              />
            </div>
            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>
          {/* Botón de Inicio de Sesión */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
        {/* Pie del Formulario */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <a
              href="#"
              className="text-indigo-500 hover:text-indigo-600 font-medium"
            >
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
