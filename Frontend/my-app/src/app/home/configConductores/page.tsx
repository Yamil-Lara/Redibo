'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NavbarSecundario from '@/app/components/navbar/NavbarSecundario';
import ConfigConductores from '@/app/components/detalleReserva/configConductores';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar superior */}
      <header className="border-b shadow-md">
        <NavbarSecundario
          activeBtn={0}
          setActiveBtn={() => {}}
          onBecomeHost={() => {}}
          onBecomeDriver={() => {}}
        />
      </header>

      {/* Contenido principal */}
      <main className="flex-grow p-4">
        <Suspense fallback={<div>Cargando configuración de conductores...</div>}>
          <ConfigConductoresContent />
        </Suspense>
      </main>
    </div>
  );
}

function ConfigConductoresContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('idReserva');
  const idReserva = idParam ? parseInt(idParam) : null;

  return <ConfigConductores idReserva={idReserva} />;
}
