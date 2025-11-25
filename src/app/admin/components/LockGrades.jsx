"use client"

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getSystemConfig, changeStatusGrades } from "@/app/Service/SystemConfigService";

export default function LockGrades() {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState("");
    const [loadingConfig, setLoadingConfig] = useState(true);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setLoadingConfig(true);
        try {
            const data = await getSystemConfig();
            setConfig(data);
        } catch (error) {
            console.error("Error al cargar configuración: ", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo cargar la configuración del sistema.",
            });
        } finally {
            setLoadingConfig(false);
        }
    };

    const handleLockUnlock = async (lock) => {
        const result = await Swal.fire({
            title: lock
            ? "Bloquear calificaciones"
            : "Desbloquear calificaciones",
            text: lock
            ? "Los docentes no podrán modificar las calificaciones una vez bloqueadas."
            : "Los docentes podrán modificar las calificaciones una vez desbloqueadas.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: lock ? "#d33" : "#28a745",
            cancelButtonColor: "#6c757d",
            confirmButtonText: lock ? "Sí, bloquear" : "Sí, desbloquear",
            cancelButtonText: "Cancelar",
            input: lock ? "textarea" : undefined,
            inputPlaceholder: lock
            ? "Notas (opcional): Ej. Cierre del primer periodo 2025..."
            : undefined,
            inputValue: notes,
        });

        if (!result.isConfirmed) return;

        setLoading(true);
        try {
            const notesInput = result.value || notes;
            const response = await changeStatusGrades(lock, notesInput);


            await loadConfig();
            setNotes("");

            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: response.message,
            });
        } catch (error) {
            console.error("Error al cambiar el estado de calificaciones: ", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 
                error.response?.data?.error ||
                "No se pudo cambiar el estado de las calificaciones.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loadingConfig) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!config){
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                No se pudo cargar la configuración del sistema.
            </div>
        );
    }

    const areLocked = config.lockedGrades;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Control de calificaciones
            </h2>

            <div className={`p-5 rounded-lg mb-6 border-2 ${
                areLocked
                ? "bg-red-50 border-red-400 text-red-800"
                : "bg-green-50 border-green-400 text-green-800"
            }`}>
                <div className="flex items-start gap-3">
                    <span className="text-3xl">{areLocked ? "🔒" : "🔓"}</span>
                    <div className="flex-1">
                        <p className="text-xl font-semibold mb-1">
                            Status: {" "}
                            <span className={areLocked ? "text-red-600" : "text-green-600"}>
                                {areLocked ? "BLOQUEADO" : "ABIERTO"}
                            </span>
                        </p>
                        <p className="text-sm text-gray-600">
                            {areLocked
                            ? "Los profesores NO pueden modificar las calificaciones."
                            : "Los profesores PUEDEN modificar las calificaciones."}
                        </p>

                        {config.dateLock && (
                            <p className="text-sm text-gray-500 mt-2">
                                <strong>Último cambio:</strong> {" "}
                                {new Date(config.dateLock).toLocaleString("es-MX",{
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            
            {config.notes && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                        Notas del último cambio:
                    </p>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                        {config.notes}
                    </p>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                    <strong>Información:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-blue-800 mt-2">
                    <li>
                        Al <strong>bloquear</strong> las calificaciones, los docentes no podrán
                        realizar modificaciones hasta que se desbloqueen nuevamente.
                    </li>
                    <li>
                        Al <strong>desbloquear</strong> las calificaciones, los docentes podrán
                        realizar modificaciones libremente.
                    </li>
                </ul>
            </div>

            <div className="flex gap-3">
                {!areLocked ? (
                    <button
                        onClick={() => handleLockUnlock(true)}
                        disabled={loading}
                        className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                    {loading ? (
                        <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Procesando...
                        </>
                    ) : (
                        <>
                        Bloquear calificaciones
                        </>
                    )}
                    </button>
                ) : (
                    <button
                        onClick={() => handleLockUnlock(false)}
                        disabled={loading}
                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Procesando...
                                </>
                            ) : (
                                <>
                                Desbloquear calificaciones
                                </>
                            )}
                    </button>
                )}
            </div>
            <button
                onClick={loadConfig}
                disabled={loadingConfig}
                className="mt-4 text-sm text-gray-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loadingConfig ? "Actualizando..." : "Actualizar estado"}
            </button>
        </div>
    );
}