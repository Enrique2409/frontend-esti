import React from 'react';
import Navbar from '../components/navbar';
import "../../Styles/Home.css";

const Dashboard = () => {
    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className='mt-4'>
                    <h1 className="text-4xl font-semibold">Inicio del administrador</h1>
                    <p className="text-lg text-gray-600">Bienvenido al panel de administración</p>
                </div>
                <div className='container-cards mt-4 flex flex-wrap justify-between'>
                    <div className="flex flex-col w-[30%] bg-[#ffffff] shadow-xl mb-4">
                        <div className="flex flex-col p-8">
                            <div className="text-2xl font-bold uppercase text-center text-[#374151] pb-6">Profesores</div>
                            <div className="text-xl text-center text-[#374151]">30</div>
                        </div>
                    </div>
                    <div className="flex flex-col w-[30%] bg-[#ffffff] shadow-xl mb-4">
                        <div className="flex flex-col p-8">
                            <div className="text-2xl font-bold uppercase text-center text-[#374151] pb-6">Alumnos</div>
                            <div className="text-xl text-center text-[#374151]">900</div>
                        </div>
                    </div>
                    <div className="flex flex-col w-[30%] bg-[#ffffff] shadow-xl mb-4">
                        <div className="flex flex-col p-8">
                            <div className="text-2xl font-bold uppercase text-center text-[#374151] pb-6">Administradores</div>
                            <div className="text-xl text-center text-[#374151]">10</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
