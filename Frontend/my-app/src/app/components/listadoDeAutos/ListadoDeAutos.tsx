'use client';
import React, { useState } from 'react';
import styles from './ListadoDeAutos.module.css';
import ModalDeConfirmacion from '@components/modal/ModalDeConfirmacion';
import { API_URL } from '@config/api';

// Interfaces para las solicitudes y autos
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

interface ListadoDeAutosProps {
  activeFilter: string;
  autos: Auto[];
}

const ListadoDeAutos: React.FC<ListadoDeAutosProps> = ({ activeFilter, autos = [] }) => {
  // Estados para gestionar el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    confirmText: 'ACEPTAR',
    cancelText: 'CANCELAR',
    onConfirm: () => {},
    variant: 'confirmation' as 'confirmation' | 'success',
    showSuccess: false,
    isProcessing: false
  });
  
  // Estado para mantener el auto y solicitud seleccionados
  const [autoSeleccionado, setAutoSeleccionado] = useState<string | null>(null);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<string | null>(null);

  // Verificar que autos es un array antes de filtrar
  const autosArray = Array.isArray(autos) ? autos : [];
  
  // Filtrar los autos según el filtro activo
  const filtrarAutos = (autos: Auto[], filtro: string): Auto[] => {
    switch (filtro) {
      case 'solicitudes':
        return autos.filter(auto => auto.solicitudesPendientes && auto.solicitudesPendientes.length > 0);
      case 'rentados':
        return autos.filter(auto => auto.estaRentado === true);
      case 'disponibles':
        return autos.filter(auto => auto.estaRentado === false);
      case 'todos':
      default:
        return autos;
    }
  };

  const autosFiltrados = filtrarAutos(autosArray, activeFilter);

  // Función para mostrar el modal de aceptar solicitud
  const mostrarModalAceptar = (autoId: string, solicitudId: string, nombreSolicitante: string) => {
    setAutoSeleccionado(autoId);
    console.log(solicitudId);
    setSolicitudSeleccionada(solicitudId);
    setModalConfig({
      title: "Confirmar Aceptación",
      message: `¿Estás seguro de que deseas aceptar la solicitud de ${nombreSolicitante}?`,
      confirmText: "ACEPTAR",
      cancelText: "CANCELAR", 
      onConfirm: () => ejecutarAceptarSolicitud(autoId, solicitudId),
      variant: 'confirmation',
      showSuccess: false,
      isProcessing: false
    });
    setModalAbierto(true);
  };

  // Función para mostrar el modal de denegar solicitud
  const mostrarModalDenegar = (autoId: string, solicitudId: string, nombreSolicitante: string) => {
    setAutoSeleccionado(autoId);
    
    console.log(solicitudId);
    setSolicitudSeleccionada(solicitudId);
    setModalConfig({
      title: "Confirmar Rechazo",
      message: `¿Estás seguro de que deseas denegar la solicitud de ${nombreSolicitante}?`,
      confirmText: "DENEGAR",
      cancelText: "CANCELAR",
      onConfirm: () => ejecutarDenegarSolicitud(autoId, solicitudId),
      variant: 'confirmation',
      showSuccess: false,
      isProcessing: false
    });
    setModalAbierto(true);
  };

  // Funciones para ejecutar las acciones tras la confirmación
  const ejecutarAceptarSolicitud = async (autoId: string, solicitudId: string) => {
    try {
      // Actualizar el estado del modal para mostrar que está procesando
      setModalConfig(prev => ({ ...prev, isProcessing: true }));
      // Realizar la petición a la API para aceptar la solicitud
      const response = await fetch(`${API_URL}/reservas/${solicitudId}/aceptar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al aceptar la reserva: ${response.status}`);
      }
      
      // Esperar una respuesta exitosa
      const data = await response.json();
      console.log(data);
      
      // Cambiar el modal a variante de éxito
      setModalConfig({
        title: "Solicitud Aceptada",
        message: "La solicitud ha sido aceptada correctamente",
        confirmText: "CONTINUAR",
        cancelText: "CANCELAR",
        onConfirm: cerrarModalYActualizar,
        variant: 'success',
        showSuccess: true,
        isProcessing: false
      });
      
    } catch (error) {
      console.error("Error al aceptar la solicitud:", error);
      // En caso de error, mostrar un modal de error pero con variante 'success' para que tenga un solo botón
      setModalConfig({
        title: "Error",
        message: "Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.",
        confirmText: "ENTENDIDO",
        cancelText: "CANCELAR",
        onConfirm: cerrarModal,
        variant: 'success',
        showSuccess: false,
        isProcessing: false
      });
    }
  };

  const ejecutarDenegarSolicitud = async (autoId: string, solicitudId: string) => {
    try {
      // Actualizar el estado del modal para mostrar que está procesando
      setModalConfig(prev => ({ ...prev, isProcessing: true }));
      console.log(solicitudId);
      // Realizar la petición a la API para denegar la solicitud
      const response = await fetch(`${API_URL}/reservas/${solicitudId}/denegar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al denegar la reserva: ${response.status}`);
      }
      
      // Esperar una respuesta exitosa
      const data = await response.json();
      console.log(data);
      
      // Cambiar el modal a variante de éxito
      setModalConfig({
        title: "Solicitud Denegada",
        message: "La solicitud ha sido denegada correctamente",
        confirmText: "CONTINUAR",
        cancelText: "CANCELAR",
        onConfirm: cerrarModalYActualizar,
        variant: 'success',
        showSuccess: true,
        isProcessing: false
      });
      
    } catch (error) {
      console.error("Error al denegar la solicitud:", error);
      // En caso de error, mostrar un modal de error pero con variante 'success' para que tenga un solo botón
      setModalConfig({
        title: "Error",
        message: "Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.",
        confirmText: "ENTENDIDO",
        cancelText: "CANCELAR",
        onConfirm: cerrarModal,
        variant: 'success',
        showSuccess: false,
        isProcessing: false
      });
    }
  };

  // Función para cerrar el modal y limpiar estados
  const cerrarModal = () => {
    setModalAbierto(false);
    setAutoSeleccionado(null);
    setSolicitudSeleccionada(null);
  };

  // Función para cerrar el modal y actualizar datos (podría recargar los datos o modificar los datos locales)
  const cerrarModalYActualizar = () => {
    cerrarModal();
    
    // Por ejemplo, actualizar localmente (esto es una simulación):
    if (autoSeleccionado && solicitudSeleccionada) {
      // En un caso real, lo ideal sería notificar al componente padre para que recargue los datos
      console.log(`Solicitud ${solicitudSeleccionada} procesada para el auto ${autoSeleccionado}`);
    }
    window.location.reload();
  };

  // Si no hay autos disponibles en absoluto
  if (!autosArray.length) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">No hay autos disponibles para mostrar.</p>
      </div>
    );
  }

  return (
    <>

      <div className={styles.carsContainer}>
        {autosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No se encontraron autos que coincidan con el filtro actual.</p>
          </div>
        ) : (
          autosFiltrados.map(auto => (
            <div key={auto.idAuto} className={styles.carContainer}>
              <img 
                src={'https://cdn.motor1.com/images/mgl/6ZzvLZ/s1/2024-audi-rs7-performance-review.jpg'} 
                alt={auto.nombre} 
                className={styles.carImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-car.jpg'; // Imagen de respaldo si la original falla
                }} 
              />
              <div className={styles.carInfo}>
                <div>
                  <span className={styles.carName}>{auto.nombre}</span>
                  <div className={styles.pendingBadge}>
                    <span className={styles.licensePlate}>{auto.placa}</span>
                  </div>
                </div>
                <div className={styles.carPrice}>$ {auto.precioPorDia} /día</div>
              </div>
              
              <div className={styles.pendingContainer}>
                <div className={styles.pendingBadge}>
                  {auto.solicitudesPendientes?.length || 0} solicitudes pendientes
                  {auto.estaRentado && <span className={styles.rentedBadge}> • EN RENTA</span>}
                </div>
              </div>
              
              <div className={styles.requestsTitle}>Solicitudes de renta</div>
              
              {(!auto.solicitudesPendientes || auto.solicitudesPendientes.length === 0) ? (
                <div className={styles.noRequestsMessage}>No hay solicitudes pendientes</div>
              ) : (
                auto.solicitudesPendientes.map(solicitud => (
                  <div key={solicitud.idReserva} className={styles.requestItem}>
                    <div className={styles.requesterInfo}>
                      <div className={styles.requesterName}>{solicitud.nombreSolicitante}</div>
                      <div className={styles.requestDate}>{solicitud.fechas}</div>
                    </div>
                    <div className={styles.buttonContainer}>
                      <button 
                        className={`${styles.btn} ${styles.btnReject}`}
                        onClick={() => mostrarModalDenegar(auto.idAuto, solicitud.idReserva, solicitud.nombreSolicitante)}
                      >
                        Denegar
                      </button>
                      <button 
                        className={`${styles.btn} ${styles.btnAccept}`}
                        onClick={() => mostrarModalAceptar(auto.idAuto, solicitud.idReserva, solicitud.nombreSolicitante)}
                      >
                        Aceptar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))
        )}
      </div>
      
      <ModalDeConfirmacion
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        isProcessing={modalConfig.isProcessing}
        variant={modalConfig.variant}
        showSuccess={modalConfig.showSuccess}
      />
    </>
  );
};

export default ListadoDeAutos;