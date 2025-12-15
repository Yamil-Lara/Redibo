'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import VistaPago from '@/app/components/metodosPago/VistaPago';
import NavbarSecundario from '@/app/components/navbar/NavbarSecundario'; // Asegúrate que el import sea correcto

export default function Page() {
  const [activeBtn, setActiveBtn] = useState(0); // Requerido por NavbarSecundario

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

      {/* ✅ Contenido principal con fallback de carga */}
      <main className="flex-grow">
        <Suspense fallback={<div className="p-4">Cargando información de pago...</div>}>
          <PagoContent />
        </Suspense>
      </main>
    </div>
  );
}

function PagoContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const monto = searchParams.get('monto');

  return <VistaPago id={id} monto={monto} />;
}
