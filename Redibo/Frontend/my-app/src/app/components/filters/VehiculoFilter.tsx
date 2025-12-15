'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Props {
  search: string;
  setSearch: (value: string) => void;
  setEstadoFilter?: (value: string) => void;
  setOrdenamiento?: (value: string) => void;
}

const ordenOptions = [
  'Ordenar por nombre',
  'Ordenar por placa',
  'Ordenar por estado',
  'Más recientes',
  'Más antiguos',
];

const estadoOptions = [
  'Todos los estados',
  'En renta',
  'Disponible',
  'Reservado',
  'No disponible',
];

const VehiculoFilter = ({
  search,
  setSearch,
  setEstadoFilter,
  setOrdenamiento,
}: Props) => {
  const [estado, setEstado] = useState('Todos los estados');
  const [orden, setOrden] = useState('Más antiguos');
  const [showEstado, setShowEstado] = useState(false);
  const [showOrden, setShowOrden] = useState(false);

  const estadoRef = useRef<HTMLDivElement>(null);
  const ordenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (estadoRef.current && !estadoRef.current.contains(event.target as Node)) {
        setShowEstado(false);
      }
      if (ordenRef.current && !ordenRef.current.contains(event.target as Node)) {
        setShowOrden(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleEstado = () => {
    setShowEstado((prev) => !prev);
    setShowOrden(false);
  };

  const toggleOrden = () => {
    setShowOrden((prev) => !prev);
    setShowEstado(false);
  };

  const handleEstadoSelect = (value: string) => {
    setEstado(value);
    setEstadoFilter?.(value);
    setShowEstado(false);
  };

  const handleOrdenSelect = (value: string) => {
    setOrden(value);
    setOrdenamiento?.(value);
    setShowOrden(false);
  };

  return (
    <div className="w-full relative z-10 mb-6">
      {/* para pantallas grandes */}
      <div className="hidden md:flex md:items-center md:justify-between gap-4 w-full">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre o placa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#FFA726] focus:border-transparent"
          />
          <div className="relative w-56" ref={estadoRef}>
            <button
              onClick={toggleEstado}
              className="bg-[#FFA726] text-white px-4 py-2 border border-[#FFA726] rounded-md w-full flex justify-between items-center hover:bg-[#FF9800] transition-colors"
              aria-haspopup="listbox"
              aria-expanded={showEstado}
            >
              {estado} <span className="ml-2 text-black">▼</span>
            </button>
            {showEstado && (
              <ul className="absolute top-full mt-1 w-full border border-gray-300 bg-white rounded-md shadow-lg z-20" role="listbox">
                {estadoOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleEstadoSelect(option)}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      option === estado ? 'bg-[#FFA726] text-white' : 'text-black'
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="relative w-56" ref={ordenRef}>
          <button
            onClick={toggleOrden}
            className="bg-[#FFA726] text-white px-4 py-2 border border-[#FFA726] rounded-md w-full flex justify-between items-center hover:bg-[#FF9800] transition-colors"
            aria-haspopup="listbox"
            aria-expanded={showOrden}
          >
            {orden} <span className="ml-2 text-black">▼</span>
          </button>
          {showOrden && (
            <ul className="absolute top-full mt-1 w-full border border-gray-300 bg-white rounded-md shadow-lg z-20" role="listbox">
              {ordenOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => handleOrdenSelect(option)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    option === orden ? 'bg-[#FFA726] text-white' : 'text-black'
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* para móviles */}
      <div className="flex flex-col gap-4 md:hidden">
        <input
          type="text"
          placeholder="Buscar por nombre o placa"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#FFA726] focus:border-transparent"
        />

        <div className="flex gap-2">
          <div className="relative flex-1" ref={estadoRef}>
            <button
              onClick={toggleEstado}
              className="bg-[#FFA726] text-white px-3 py-2 border border-[#FFA726] rounded-md w-full flex justify-between items-center text-sm hover:bg-[#FF9800] transition-colors"
              aria-haspopup="listbox"
              aria-expanded={showEstado}
            >
              <span className="truncate">{estado}</span>
              <span className="ml-2 text-black flex-shrink-0">▼</span>
            </button>
            {showEstado && (
              <ul
                className="absolute top-full mt-1 w-full border border-gray-300 bg-white rounded-md shadow-lg z-20 max-h-48 overflow-y-auto"
                role="listbox"
                tabIndex={-1}
              >
                {estadoOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleEstadoSelect(option)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleEstadoSelect(option);
                      }
                    }}
                    role="option"
                    aria-selected={option === estado}
                    tabIndex={0}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
                      option === estado ? 'bg-[#FFA726] text-white' : 'text-black'
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative flex-1" ref={ordenRef}>
            <button
              onClick={toggleOrden}
              className="bg-[#FFA726] text-white px-3 py-2 border border-[#FFA726] rounded-md w-full flex justify-between items-center text-sm hover:bg-[#FF9800] transition-colors"
              aria-haspopup="listbox"
              aria-expanded={showOrden}
            >
              <span className="truncate">{orden}</span>
              <span className="ml-2 text-black flex-shrink-0">▼</span>
            </button>
            {showOrden && (
              <ul
                className="absolute top-full mt-1 w-full border border-gray-300 bg-white rounded-md shadow-lg z-20 max-h-48 overflow-y-auto"
                role="listbox"
                tabIndex={-1}
              >
                {ordenOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleOrdenSelect(option)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleOrdenSelect(option);
                      }
                    }}
                    role="option"
                    aria-selected={option === orden}
                    tabIndex={0}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
                      option === orden ? 'bg-[#FFA726] text-white' : 'text-black'
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiculoFilter;
