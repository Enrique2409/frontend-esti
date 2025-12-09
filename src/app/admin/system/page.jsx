"use client"

import Navbar from "../components/navbar"
import LockGrades from "../components/LockGrades"

export default function AdminSystemPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="flex min-h-[calc(100vh-64px)] justify-center items-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Administración del Sistema</h1>
                    <p className="text-gray-600 mt-2">
                        Gestiona la configuración general del sistema escolar.
                    </p>

                    <div className="mt-6">
                        <LockGrades />
                    </div>
                </div>
            </div>

        </div>
    );
}
