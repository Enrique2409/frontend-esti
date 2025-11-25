"use client";

import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/authenticate/forgot-password?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        setMessage("Se ha enviado un correo con instrucciones para restablecer tu contraseña.");
      } else {
        setMessage("Error: no se pudo enviar el correo.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error en la conexión con el servidor.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Recuperar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Enviar
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
