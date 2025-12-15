'use client';

import TituloDescripcion from "@components/TituloDescripcion/TituloDescripcion";
import GestionarVehiculos from "@components/GestionarVehiculos/GestionarVehiculos";

export default function GestionarAutos() {
  const datos = {
    titulo: "Gestionar Vehículos",
    descripcion: "Administra el estado de tus vehículos."
  };

  return (
    <div>
      <TituloDescripcion
        titulo={datos.titulo}
        descripcion={datos.descripcion}
      />

      {/* Barra de filtros estática */}
      

      <GestionarVehiculos />
    </div>
  );
}



