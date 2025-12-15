'use client';

import { useState } from 'react';
import NavbarSecundario from '@/app/components/navbar/NavbarSecundario';
import ReservaExpirada from '@/app/components/detalleReserva/ReservaExpirada';

export default function Page() {
  const [activeBtn, setActiveBtn] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Barra de menú superior */}
      <header className="border-b border-gray-200 shadow-md">
        <NavbarSecundario
          activeBtn={activeBtn}
          setActiveBtn={setActiveBtn}
          onBecomeHost={() => {}}
          onBecomeDriver={() => {}}
        />
      </header>

      {/* ✅ Contenido principal */}
      <main className="flex-grow">
        <ReservaExpirada />
      </main>
    </div>
  );
}
