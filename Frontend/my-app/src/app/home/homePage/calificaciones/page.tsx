'use client';

import { useState, useEffect } from 'react';
import CalificarInquilino from '@/app/components/modals/CalificarInquilino';
import NavbarInicioSesion from '@/app/components/navbar/NavbarSecundario';
import ComentariosRecibidos from '@/app/components/modals/comentariosRecibidos';

const CalificacionesPage = () => {
  const [activeTab, setActiveTab] = useState('comentarios');
  const [activeBtn, setActiveBtn] = useState(4);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <NavbarInicioSesion
        activeBtn={activeBtn}
        setActiveBtn={setActiveBtn}
        onBecomeHost={() => console.log('Quiero ser host')}
        onBecomeDriver={() => console.log('Quiero ser conductor')}
        className="fixed top-0 left-0 right-0 z-50"
      />

      {/* Contenedor general centrado y con scroll */}
      <main
  className="pt-6 pb-8 overflow-y-auto bg-white text-black"
  style={{ height: 'calc(100vh - 64px)' }}
>
  <div className="max-w-screen-xl mx-auto px-4"> {/* padding lateral aquí */}
    <h2 className="text-3xl font-bold mb-4">Calificaciones</h2>

    <div className="flex space-x-4 mb-6 border-b border-gray-300">
      {[
        { id: 'comentarios', label: 'Comentarios recibidos' },
        { id: 'calificar', label: 'Calificar inquilino' },
      ].map((tab) => (
        <button
          key={tab.id}
          className={`py-2 px-4 font-semibold border-b-2 transition-colors duration-200 ${
            activeTab === tab.id
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-600 hover:text-orange-500 cursor-pointer'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>

    {activeTab === 'comentarios' && <ComentariosRecibidos />}
    {activeTab === 'calificar' && <CalificarInquilino />}
  </div>
</main>
    </>
  );
};

export default CalificacionesPage;
