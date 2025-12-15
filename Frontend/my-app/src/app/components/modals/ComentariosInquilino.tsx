"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Comentario {
  id: number;
  autor: string;
  texto: string;
  fecha?: string;
  avatar?: string;
  calificacion: number;
}

interface Inquilino {
  id: number;
  nombre: string;
  img: string;
  promedio: number;
  totalReseñas: number;
  comentarios: Comentario[];
}

interface ComentariosInquilinoProps {
  inquilino: Inquilino;
  onClose: () => void;
  isOpen: boolean;
  perfilUrl?: string;
}

export default function ComentariosInquilino({
  inquilino,
  onClose,
  isOpen,
  perfilUrl
}: ComentariosInquilinoProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>(inquilino.comentarios);

  useEffect(() => {
    if (!isOpen) return;
    // Leer comentario guardado en localStorage
    const calificados = JSON.parse(localStorage.getItem('comentariosInquilinos') || '{}');
    const extra = calificados[inquilino.id];
    if (extra) {
      setComentarios([
        ...inquilino.comentarios,
        {
          id: Date.now(),
          autor: "Tú",
          texto: extra.comentario,
          fecha: new Date(extra.fecha).toLocaleDateString(),
          avatar: "/avatars/default.png",
          calificacion: extra.rating,
        }
      ]);
    } else {
      setComentarios(inquilino.comentarios);
    }
  }, [isOpen, inquilino]);

  // Calcula el promedio dinámico de las calificaciones
  const getPromedioDinamico = () => {
    if (comentarios.length === 0) return 0;
    const suma = comentarios.reduce((acc, c) => acc + c.calificacion, 0);
    return suma / comentarios.length;
  };

  const renderStars = (promedio: number) => {
    const fullStars = Math.floor(promedio);
    const partialFill = (promedio - fullStars) * 100;
    return Array.from({ length: 5 }).map((_, i) => {
      if (i < fullStars) {
        return <span key={i} className="text-yellow-400 text-sm">★</span>;
      }
      if (i === fullStars && partialFill > 0) {
        // Estrella parcialmente llena (puedes mejorar el diseño si quieres)
        return <span key={i} className="text-yellow-300 text-sm">★</span>;
      }
      return <span key={i} className="text-gray-300 text-sm">★</span>;
    });
  };

  if (!isOpen) return null;

  const promedioDinamico = getPromedioDinamico();

  return (
    <div className="fixed inset-0 bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border-2 border-orange-400">
        {/* Encabezado */}
        <div className="bg-white p-4 border-b border-gray-200 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold cursor-pointer transition-colors duration-300"
          >
            ×
          </button>

          <div className="flex items-center space-x-3 mb-3">
            {perfilUrl ? (
              <a href={perfilUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  src={inquilino.img}
                  alt={inquilino.nombre}
                  width={50}
                  height={50}
                  className="rounded-full aspect-square object-cover hover:opacity-80 transition-opacity"
                />
              </a>
            ) : (
              <Image
                src={inquilino.img}
                alt={inquilino.nombre}
                width={60}
                height={60}
                className="rounded-full object-cover aspect-square"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{inquilino.nombre}</h3>
              <div className="flex items-center space-x-1">
                <div className="flex">{renderStars(promedioDinamico)}</div>
                <span className="text-sm font-semibold text-gray-900 ml-1">
                  {promedioDinamico.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-700">Reseñas y comentarios</h4>
          </div>
        </div>

        {/* Comentarios */}
        <div className="overflow-y-auto max-h-96">
          {comentarios.length > 0 ? (
            comentarios.map((coment, index) => (
              <div
                key={coment.id}
                className={`p-4 ${index !== comentarios.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div className="flex items-start space-x-3">
                  <Image
                    src={coment.avatar || "/avatars/default.png"}
                    alt={coment.autor}
                    width={40}
                    height={40}
                    className="rounded-full object-cover aspect-square"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{coment.autor}</h4>
                      <span className="text-xs text-gray-500 ml-2">{coment.fecha || "Fecha desconocida"}</span>
                    </div>
                    <div className="flex items-center mb-2">{renderStars(coment.calificacion)}</div>
                    <p className="text-gray-700 text-xs leading-relaxed">{coment.texto}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 italic">No hay comentarios aún</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}