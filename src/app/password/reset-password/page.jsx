"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authenticate/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (res.ok) {
        setMessage("Contraseña restablecida con éxito. Ahora puedes iniciar sesión.");
      } else {
        setMessage("Error: no se pudo restablecer la contraseña.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error en la conexión con el servidor.");
    }
  };

  if (!token) {
    return <p className="text-center mt-10">Token inválido o no encontrado.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Restablecer contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
          Cambiar contraseña
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
