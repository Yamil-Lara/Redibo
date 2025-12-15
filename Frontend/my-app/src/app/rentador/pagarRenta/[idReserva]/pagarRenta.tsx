'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Footer from '@components/footer/Footer';
import EncabezadoAuto from '@components/auto/EncabezadoAuto';
import GaleriaAuto from '@components/auto/GaleriaAuto';
import PropietarioAuto from '@components/auto/PropietarioAuto';
import DescripcionAuto from '@components/auto/DescripcionAuto';
import CaracteristicasAuto from '@components/auto/CaracteristicasAuto';
import PrecioAuto from '@components/auto/PrecioAuto';
import { API_URL } from '@config/api';

export default function PagarRenta() {
  const params = useParams();
  interface CarData {
    titulo: string;
    tipo: string;
    año: string;
    imagenes: { galeria: string[] };
    propietario: {nombreCompleto: string; calificacion: number; comentarios: number};
    calificacion: number;
    comentarios: string[];
    descripcion: string;
    asientos: number;
    transmision: string;
    caracteristicas: { nombre: string; activo: boolean }[];
    precio: number;
    reserva: {fechaInicio: string; fechaFin: string; dias: number};
    costes: { precio: number; dias: number; garantia: number; total: number };
  }

  const [carData, setCarData] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerDatosAuto = async () => {
      try {
        setLoading(true);
        const idReserva = params.idReserva;
        
        if (!idReserva) {
          throw new Error('ID de reserva no encontrado');
        }
        
        const response = await fetch(`${API_URL}/reservas/${idReserva}/detalles`);
        
        if (!response.ok) {
          // Intenta obtener el mensaje de error del cuerpo de la respuesta
          const errorData = await response.json().catch(() => null);
          if (errorData && errorData.error) {
            throw new Error(errorData.error);
          } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
        }
        
        const data = await response.json();
        
        // Adaptamos el formato de los datos recibidos al formato esperado por los componentes
        const datosFormateados = {
          ...data,
          propietario: {
            nombreCompleto: data.propietario,
            calificacion: data.calificacion,
            comentarios: data.comentarios
          },
          caracteristicas: [
            { nombre: 'Aire acondicionado', activo: true },
            { nombre: 'Cámara de reversa', activo: true },
            { nombre: 'Entrada USB', activo: true },
            { nombre: 'Sistema de audio premium', activo: true },
            { nombre: 'Bluetooth', activo: true },
            { nombre: 'Control de crucero', activo: true },
            { nombre: 'GPS', activo: true },
            { nombre: 'Asientos de cuero', activo: true },
          ]
        };
        
        setCarData(datosFormateados);
        setError(null);
      } catch (err: unknown) {
        console.error('Error al obtener detalles del auto:', err);
        
        // Manejar el unknown y devolver el mensaje formateado
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error al cargar los datos del auto');
        }
      } finally {
        setLoading(false);
      }
    };
  
    obtenerDatosAuto();
  }, [params.idReserva]);

  // Mostrar estados de carga o error
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-semibold mb-4">Cargando información del auto...</h2>
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

  if (!carData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-semibold mb-4">No se encontraron datos del auto</h2>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información del auto */}
          <div className="lg:col-span-2">
            <EncabezadoAuto titulo={carData.titulo} tipo={carData.tipo} año={carData.año} />
            <GaleriaAuto imagenes={carData.imagenes.galeria} />
            <PropietarioAuto propietario={carData.propietario} />
            <DescripcionAuto descripcion={carData.descripcion} />
            <CaracteristicasAuto 
              asientos={carData.asientos} 
              transmision={carData.transmision} 
            />
          </div>
          
          {/* Columna derecha - Precio y reserva */}
          <div className="lg:col-span-1">
            <PrecioAuto 
              precio={carData.precio} 
              vehiculo={carData.titulo}
              propietario={carData.propietario.nombreCompleto}
              reserva={carData.reserva} 
              costes={carData.costes} 
            />
          </div>
        </div>
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  );
}