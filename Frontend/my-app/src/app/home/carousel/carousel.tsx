'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Carousel.module.css';
import Image from 'next/image';

interface Vehicle {
  id: number;
  nombre: string;
  precio: number;
  calificacion: number;
  estado: string;
  latitud: number;
  longitud: number;
  imageUrl: string;
  brand: string;
  model: string;
  colour: string;
  plate: string;
  description: string;
  pricePerDay: number;
  averageRating?: number;
}

export default function Carousel() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const obtenerVehiculosTop = async () => {
    try {
      // RECOMENDACIÓN: Usa variable de entorno aquí también
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://vercel-back-speed-code.vercel.app/api";
      const response = await axios.get(`${apiUrl}/autos-top`);
      const data = response.data;

      type VehiculoApi = {
        idvehiculo: string;
        imagen: string;
        marca: string;
        modelo: string;
        color: string;
        placa: string;
        descripcion: string;
        tarifa: number;
        promedio_calificacion?: number;
      };

      const formattedData: Vehicle[] = data.map((vehiculo: VehiculoApi) => ({
        id: parseInt(vehiculo.idvehiculo), // Aseguramos que sea número si la interfaz lo pide así
        imageUrl: vehiculo.imagen,
        brand: vehiculo.marca,
        model: vehiculo.modelo,
        colour: vehiculo.color,
        plate: vehiculo.placa,
        description: vehiculo.descripcion,
        pricePerDay: vehiculo.tarifa,
        averageRating: vehiculo.promedio_calificacion,
        nombre: `${vehiculo.marca} ${vehiculo.modelo}`,
        precio: vehiculo.tarifa,
        calificacion: vehiculo.promedio_calificacion || 0,
        estado: 'Disponible',
        latitud: 0,
        longitud: 0
      }));

      setVehicles(formattedData);
    } catch (err) {
      console.error('Error al obtener vehículos:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerVehiculosTop();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % (vehicles.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [vehicles]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % vehicles.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + vehicles.length) % vehicles.length);
  };

  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.error}>Error al cargar vehículos</div>;

  return (
    <div id="carousel" className={styles.carouselContainer}>
      <button 
        onClick={handlePrev}
        className={styles.navButton}
        aria-label="Anterior"
      >
        &lt;
      </button>
      
      {vehicles.map((vehicle, index) => (
        <div
          key={vehicle.id}
          className={`${styles.slide} 
            ${index === currentIndex ? styles.active : ''}
            ${index === (currentIndex + 1) % vehicles.length ? styles.next : ''}
            ${index === (currentIndex - 1 + vehicles.length) % vehicles.length ? styles.prev : ''}
          `}
        >
          <div className={styles.imageContainer}>
            <Image
              src={vehicle.imageUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className={styles.image}
              width={400} 
              height={250} 
              style={{ objectFit: "cover" }} // Forma correcta en Next 13+
              unoptimized // Útil si las imágenes vienen de dominios externos no configurados
            />
          </div>
          <div className={styles.info}>
            <h3>{vehicle.brand} {vehicle.model}</h3>
            <h2>{vehicle.description}</h2>
            <div className={styles.details}>
              <p className={styles.price}>Bs. {vehicle.pricePerDay}/día</p>
              <p className={styles.rating}>
                ⭐ {vehicle.averageRating?.toFixed(2) || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      ))}

      <button 
        onClick={handleNext}
        className={styles.navButton}
        aria-label="Siguiente"
      >
        &gt;
      </button>
    </div>
  );
}