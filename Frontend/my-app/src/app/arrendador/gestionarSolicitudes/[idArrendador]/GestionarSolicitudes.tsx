'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import FiltersBarAutos from '@/app/components/filters/FiltersBarAutos';
import ListadoDeAutos from "@components/listadoDeAutos/ListadoDeAutos";
import styles from "./GestionarSolicitudes.module.css";
import { API_URL } from '@config/api';

interface SolicitudPendiente {
  idReserva: string;
  nombreSolicitante: string;
  fechas: string;
}

interface Auto {
  idAuto: string;
  nombre: string;
  placa: string;
  precioPorDia: number;
  imagen: string | null;
  solicitudesPendientes: SolicitudPendiente[];
  estaRentado: boolean;
}

interface SolicitudesData {
  autos: Auto[];
  cantidad: number;
}

export default function GestionarSolicitudes() {
  const params = useParams();
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [solicitudesData, setSolicitudesData] = useState<SolicitudesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        setLoading(true);
        const idArrendador = params.idArrendador;
        
        if (!idArrendador) {
          throw new Error('ID de arrendador no encontrado');
        }
        
        // Realizar la petición al backend
        const response = await fetch(`${API_URL}/reservas/propietario/${idArrendador}`);
        
        if (!response.ok) {
          throw new Error(`Error al obtener datos: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Asegurarse de que la respuesta tenga la estructura correcta
        if (!data || !Array.isArray(data.autos)) {
          // Si no tiene la estructura esperada, crear una estructura vacía pero compatible
          setSolicitudesData({
            autos: [],
            cantidad: 0
          });
        } else {
          setSolicitudesData(data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al obtener las solicitudes de reserva:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar las solicitudes de reserva');
      } finally {
        setLoading(false);
      }
    };

    obtenerSolicitudes();
  }, [params.idArrendador]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-semibold mb-4">Cargando información de las reservas...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  // Si no hay datos de solicitudes, mostrar mensaje apropiado
  if (!solicitudesData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-semibold mb-4">No se encontraron datos del arrendador</h2>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <header className={styles.headerFilters}>
        <div className={styles.body}>
          <FiltersBarAutos 
            onFilterChange={handleFilterChange} 
            activeFilter={activeFilter} 
          />
        </div>
      </header>

      <main className={styles.body}>
        <div className={styles.scrollContent}>
          <ListadoDeAutos 
            activeFilter={activeFilter}
            autos={solicitudesData.autos || []} // Asegurar que siempre pasamos un array
          />
        </div>
      </main>
    </div>
  );
}