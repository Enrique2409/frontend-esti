"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../app/Styles/Login.css";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
    setError("");
    if (email === "" || password === "") {
      setError("Por favor, completa todos los campos.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/esti/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, role } = data;
        localStorage.setItem("token", token);
        console.log("Token de autenticación para iniciar seison:", token);

        if (role === "ADMIN") {
          router.push("/admin");
        } else if (role === "TEACHER") {
          router.push("/profesor");
        } else {
          setError("Rol no reconocido.");
          setIsLoading(false);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al iniciar sesión.");
        setIsLoading(false);
      }
    } catch (error) {
      setError("Error, corrreo o contraseña incorrectos.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative flex items-center justify-center p-6 overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white"></div>
      <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-75 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-75 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-75 animate-blob animation-delay-4000"></div>
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      
      {/* Contenedor del login */}
      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-2xl shadow-lg">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="text-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-24 h-24 mx-auto mb-4 transform transition-transform hover:scale-105"
              />
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Bienvenido!
              </h1>
              <p className="mt-2 text-gray-600">
                Accede a tu cuenta para continuar
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                      placeholder="ejemplo@escuela.edu.mx"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="absolute right-3 top-3 text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute right-3 top-3 text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Recordarme
                  </label>
                </div>
                <a
                  href="/password/forgot-password"
                  className="text-sm font-medium text-blue-500 hover:text-blue-600"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              {error && (
                <div className="mt-4 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
            <p className="text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <a href="#" className="font-medium text-blue-500 hover:text-blue-600">
                Contacta al administrador
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
