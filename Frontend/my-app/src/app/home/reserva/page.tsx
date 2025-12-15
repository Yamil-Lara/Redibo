'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NavbarSecundario from '@/app/components/navbar/NavbarSecundario';
import ReservaVehiculo from '@/app/components/detalleReserva/ReservaVehiculo';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Menú superior */}
      <header className="border-b shadow-md">
        <NavbarSecundario
          activeBtn={0}
          setActiveBtn={() => {}}
          onBecomeHost={() => {}}
          onBecomeDriver={() => {}}
        />
      </header>

      {/* Contenido principal con reserva */}
      <main className="flex-grow">
        <Suspense fallback={<div className="p-4">Cargando reserva...</div>}>
          <ReservaContent />
        </Suspense>
      </main>
    </div>
  );
}

function ReservaContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const id = idParam ? parseInt(idParam) : null;

  return <ReservaVehiculo id={id} />;
}
