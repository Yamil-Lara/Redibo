'use client';

import React from 'react';

interface Props {
  titulo: string;
  descripcion: string;
}

export default function TituloDescripcion({ titulo, descripcion }: Props) {
  return (
      <div className="px-6 mt-6">
        <h1 className="text-2xl font-bold text-[#002E6E] mb-1">{titulo}</h1>
        <p className="text-base text-gray-700">{descripcion}</p>
      </div>
  );
}


  