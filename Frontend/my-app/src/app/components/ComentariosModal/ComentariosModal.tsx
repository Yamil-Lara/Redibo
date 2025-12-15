"use client";

import React, { useState } from "react";
import Modal from "@components/modal/Modal";

interface Comentario {
  autor: string;
  fecha: string;
  puntuacion: number;
  contenido: string;
}

interface ComentariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  comentarios: Comentario[];
  vehiculoInfo?: {
    marca: string;
    modelo: string;
    anio: string;
  };
}

export const VerComentarios: React.FC<ComentariosModalProps> = ({
  isOpen,
  onClose,
  comentarios,
  vehiculoInfo,
}) => {
  const [orden, setOrden] = useState<"recientes" | "antiguos" | "mayor" | "menor">("recientes");
  const [paginaActual, setPaginaActual] = useState(1);
  const comentariosPorPagina = 2;

  const ordenarComentarios = (comentarios: Comentario[]) => {
    return [...comentarios].sort((a, b) => {
      switch (orden) {
        case "recientes":
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        case "antiguos":
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        case "mayor":
          return b.puntuacion - a.puntuacion;
        case "menor":
          return a.puntuacion - b.puntuacion;
        default:
          return 0;
      }
    });
  };

  const comentariosOrdenados = ordenarComentarios(comentarios);
  const totalPaginas = Math.ceil(comentariosOrdenados.length / comentariosPorPagina);
  const indiceInicio = (paginaActual - 1) * comentariosPorPagina;
  const comentariosPaginados = comentariosOrdenados.slice(indiceInicio, indiceInicio + comentariosPorPagina);

  const renderEstrellas = (puntuacion: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < puntuacion ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const botones = [
    { label: "Recientes", value: "recientes" },
    { label: "Antiguos", value: "antiguos" },
    { label: "Mayor Puntuación", value: "mayor" },
    { label: "Menor Puntuación", value: "menor" },
  ];

  const cambiarPagina = (direccion: "anterior" | "siguiente") => {
    if (direccion === "anterior" && paginaActual > 1) {
      setPaginaActual((prev) => prev - 1);
    }
    if (direccion === "siguiente" && paginaActual < totalPaginas) {
      setPaginaActual((prev) => prev + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Comentarios del vehículo${vehiculoInfo ? `: ${vehiculoInfo.marca} ${vehiculoInfo.modelo}` : ""}`}
        width="xl"
      >
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {botones.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => {
                  setOrden(value as typeof orden);
                  setPaginaActual(1); // reset page
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${orden === value ? "bg-[#e69300] text-white" : "bg-[#11295B] text-white hover:opacity-90 active:bg-[#e69300]"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* CONTENIDO */}
          {comentariosOrdenados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay comentarios disponibles para este vehículo.
            </div>
          ) : (
            <div className="space-y-6">
              {comentariosPaginados.map((comentario, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-[#11295B]">{comentario.autor}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(comentario.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="mb-3">
                    {renderEstrellas(comentario.puntuacion)}
                  </div>
                  <p className="text-gray-700">{comentario.contenido}</p>
                </div>
              ))}
            </div>
          )}

          {/* PAGINACIÓN SOLO SI HAY COMENTARIOS */}
          {comentariosOrdenados.length > 0 && (
            <div className="flex items-center justify-center gap-6 mt-6">
              <button
                onClick={() => cambiarPagina("anterior")}
                disabled={paginaActual === 1}
                className={`rounded-full w-8 h-8 flex items-center justify-center transition ${
                  paginaActual === 1
                    ? "bg-gray-300 text-white opacity-50"
                    : "bg-[#11295B] text-white hover:opacity-90"
                }`}
                style={{ cursor: paginaActual === 1 ? "default" : "pointer" }}
              >
                &lt;
              </button>
              <span className="text-[#11295B] font-medium">
                {paginaActual} / {totalPaginas}
              </span>
              <button
                onClick={() => cambiarPagina("siguiente")}
                disabled={paginaActual === totalPaginas}
                className={`rounded-full w-8 h-8 flex items-center justify-center transition ${
                  paginaActual === totalPaginas
                    ? "bg-gray-300 text-white opacity-50"
                    : "bg-[#11295B] text-white hover:opacity-90"
                }`}
                style={{ cursor: paginaActual === totalPaginas ? "default" : "pointer" }}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
