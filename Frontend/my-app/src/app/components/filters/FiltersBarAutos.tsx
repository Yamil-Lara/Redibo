'use client';
import React from 'react';

interface FiltersBarAutosProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FiltersBarAutos: React.FC<FiltersBarAutosProps> = ({ activeFilter, onFilterChange }) => {
  // Opciones de filtros disponibles
  const botones = [
    { id: 'todos', label: 'Todos' },
    { id: 'solicitudes', label: 'Solicitudes pendientes' },
    { id: 'rentados', label: 'En renta' },
    { id: 'disponibles', label: 'Disponibles' }
  ];

  return (
    <>
      <div className="space-y-1 mb-4">
        <h1 className="text-2xl font-bold text-[#11295B]">Solicitudes de Renta</h1>
        <p className="text-[#11295B]">Aprueba o deniega las solicitudes de renta para tus autos</p>
      </div>
      
      <div className="p-4 bg-[#e7d7c3] rounded-lg inline-block w-full">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium w-full sm:w-auto">
            Filtrar por:
          </span>
          {botones.map((btn) => (
            <button
              key={btn.id}
              onClick={() => onFilterChange(btn.id)}  
              className={`px-4 py-1 rounded-full border text-sm font-medium transition
              ${
                activeFilter === btn.id
                ? "bg-blue-900 text-white shadow-sm"
                : "bg-white text-blue-900 border-blue-900 hover:bg-blue-900 hover:text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default FiltersBarAutos;