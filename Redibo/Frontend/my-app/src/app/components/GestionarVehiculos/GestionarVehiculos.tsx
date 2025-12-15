"use client";

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import ModalDeConfirmacion from "@components/modal/ModalDeConfirmacion";
import RegistrarMantenimientoModal from "@components/MantenimientoModal/RegistrarMantenimientoModal";
import { FiCheckCircle } from "react-icons/fi";
import { API_URL } from '@config/api';
import { VerKilometraje } from "../auto/VerKilometraje";
import VehiculoFilter from "@components/filters/VehiculoFilter";
import { VerComentarios } from "@components/ComentariosModal/ComentariosModal";

interface Kilometraje {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  kilometraje: number;
}

interface Comentario {
  autor: string;
  fecha: string;
  puntuacion: number;
  contenido: string;
}

interface Vehiculo {
  idAuto: number;
  marca: string;
  modelo: string;
  anio: string;
  placa: string;
  imagen?: string;
  estado?: string;
  fechaCreacion?: string;
  promedioCalificacion?: number; // Nuevo campo
  totalComentarios?: number; // Nuevo campo
  estadoActual: {
    tipo: string;
    datos: {
      estado: string;
      accionPosible: string;
      idReserva?: number;
      fechaInicio?: Date;
      fechaFin?: Date;
      cliente?: {
        nombreCompleto: string;
        email: string;
      };
      idHistorial?: number;
      fechaFinPrevista?: Date;
      tipoMantenimiento?: string;
      descripcion?: string;
    }
  }
}

interface MantenimientoData {
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  costo: string;
  tipoMantenimiento: string;
  kilometraje: string;
}

export default function GestionarVehiculos() {
  const params = useParams();
  const [mostrarModalKilometraje, setModalKilometraje] = useState(false);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mostrarModalMantenimiento, setMostrarModalMantenimiento] = useState(false);
  const [mostrarConfirmacionMantenimiento, setMostrarConfirmacionMantenimiento] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<number | null>(null);
  const [mantenimientoExitoso, setMantenimientoExitoso] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [accionActual, setAccionActual] = useState("");
  const [datosMantenimientoTemp, setDatosMantenimientoTemp] = useState<MantenimientoData | null>(null);
  const [mostrarModalComentarios, setMostrarModalComentarios] = useState(false);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  //Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const autosPorPagina = 5;

  // Función para cargar comentarios desde la API
  const fetchComentarios = async (idAuto: number) => {
    try {
      const response = await fetch(`${API_URL}/comentarios/auto/${idAuto}`);
      if (!response.ok) throw new Error("No se pudieron cargar los comentarios");
      const data = await response.json();
      console.log("Datos del vehículo:", vehiculos.find(v => v.idAuto === idAuto));
      setComentarios(data.comentarios || []);
      setVehiculoSeleccionado(idAuto);
      setMostrarModalComentarios(true);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    descripcion: "",
    costo: "",
    tipoMantenimiento: "Preventivo",
    kilometraje: "",
  });
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState('Todos los estados');
  const [ordenamiento, setOrdenamiento] = useState('Más antiguos');

  const kilometrajeActual = 45280;
  const historialKilometraje: Kilometraje[] = [
    // ...
  ];

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const renderPromedioCalificacion = (vehiculo: Vehiculo) => {
    if (!vehiculo.promedioCalificacion || vehiculo.promedioCalificacion === 0) {
      return null;
    }

    return (
      <div className="flex items-center mt-2">
        <div className="flex mr-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={i < Math.round(vehiculo.promedioCalificacion!) ? "text-yellow-400" : "text-gray-300"}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {vehiculo.promedioCalificacion.toFixed(1)}
          {vehiculo.totalComentarios && (
            <span className="text-gray-500">({vehiculo.totalComentarios})</span>
          )}
        </span>
      </div>
    );
  };

  const cargarVehiculos = async () => {
    setCargando(true);
    setError("");
    const idArrendador = params.idArrendador;

    try {
      const response = await fetch(`${API_URL}/autos/arrendador/${idArrendador}`);
      if (!response.ok) {
        throw new Error(`Error al cargar vehículos: ${response.status}`);
      }

      const data = await response.json();
      const vehiculosConCalificaciones = await Promise.all(
        data.autos.map(async (vehiculo: Vehiculo) => {
          try {
            const resComentarios = await fetch(`${API_URL}/comentarios/auto/${vehiculo.idAuto}`);
            if (resComentarios.ok) {
              const comentarios = await resComentarios.json();
              const promedio = comentarios.reduce((acc: number, curr: Comentario) => acc + curr.puntuacion, 0) / comentarios.length;
              return {
                ...vehiculo,
                promedioCalificacion: isNaN(promedio) ? 0 : parseFloat(promedio.toFixed(1)),
                totalComentarios: comentarios.length
              };
            }
            return vehiculo;
          } catch (error) {
            console.error(`Error al cargar comentarios para auto ${vehiculo.idAuto}:`, error);
            return vehiculo;
          }
        })
      );

      setVehiculos(vehiculosConCalificaciones);
    } catch (err) {
      console.error("Error al cargar los vehículos:", err);
      setError("No se pudieron cargar los vehículos. Por favor, intente nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  const getFilteredVehiculos = () => {
    let filtered = vehiculos.filter((v) =>
      v.placa.toLowerCase().includes(search.toLowerCase()) ||
      `${v.marca} ${v.modelo}`.toLowerCase().includes(search.toLowerCase())
    );

    if (estadoFilter !== 'Todos los estados') {
      filtered = filtered.filter((v) => {
        switch (estadoFilter) {
          case 'En renta':
            return v.estadoActual.tipo === 'RENTA_ACTIVA' && v.estadoActual.datos.estado === 'EN_CURSO';
          case 'Disponible':
            return v.estadoActual.tipo === 'DISPONIBLE';
          case 'Reservado':
            return v.estadoActual.tipo === 'RENTA_ACTIVA' && v.estadoActual.datos.estado !== 'EN_CURSO';
          case 'No disponible':
            return v.estadoActual.tipo === 'NO_DISPONIBLE' || v.estadoActual.tipo === 'EN_MANTENIMIENTO';
          default:
            return true;
        }
      });
    }

    filtered = [...filtered].sort((a, b) => {
      switch (ordenamiento) {
        case 'Ordenar por nombre':
          return `${a.marca} ${a.modelo}`.localeCompare(`${b.marca} ${b.modelo}`);
        case 'Ordenar por placa':
          return a.placa.localeCompare(b.placa);
        case 'Ordenar por estado':
          return a.estadoActual.tipo.localeCompare(b.estadoActual.tipo);
        case 'Más recientes':
          return new Date(b.fechaCreacion || 0).getTime() - new Date(a.fechaCreacion || 0).getTime();
        case 'Más antiguos':
        default:
          return new Date(a.fechaCreacion || 0).getTime() - new Date(b.fechaCreacion || 0).getTime();
      }
    });

    return filtered;
  };

  //Paginación
  const vehiculosFiltrados = getFilteredVehiculos();
  const totalPaginas = Math.ceil(vehiculosFiltrados.length / autosPorPagina);
  const indiceInicio = (paginaActual - 1) * autosPorPagina;
  const vehiculosPaginados = vehiculosFiltrados.slice(indiceInicio, indiceInicio + autosPorPagina);


  const handleLiberarRenta = (idAuto: number) => {
    setVehiculoSeleccionado(idAuto);
    setAccionActual("FINALIZAR_RENTA");
    setMostrarConfirmacion(true);
  };

  const confirmarAccion = async () => {
    if (!vehiculoSeleccionado) return;

    setIsProcessing(true);

    try {
      const vehiculo = vehiculos.find(v => v.idAuto === vehiculoSeleccionado);
      if (!vehiculo) throw new Error("Vehículo no encontrado");

      let endpoint = "";
      let metodo = "";

      if (accionActual === "FINALIZAR_RENTA" && vehiculo.estadoActual.datos.idReserva) {
        endpoint = `${API_URL}/reservas/${vehiculo.estadoActual.datos.idReserva}/liberar`;
        metodo = "PUT";
      } else if (accionActual === "CANCELAR_RESERVA" && vehiculo.estadoActual.datos.idReserva) {
        endpoint = `${API_URL}/reservas/cancelar/${vehiculo.estadoActual.datos.idReserva}`;
      } else if (accionActual === "FINALIZAR_MANTENIMIENTO" && vehiculo.estadoActual.datos.idHistorial) {
        endpoint = `${API_URL}/mantenimiento/${vehiculo.estadoActual.datos.idHistorial}/finalizar`;
        metodo = "POST";
      }

      if (endpoint) {
        const response = await fetch(endpoint, {
          method: metodo,
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Error al procesar la acción: ${response.status}`);
        }

        await cargarVehiculos();
        setMostrarExito(true);
      }
    } catch (err) {
      console.error("Error al procesar la acción:", err);
      setError("No se pudo completar la acción. Por favor, intente nuevamente.");
    } finally {
      setIsProcessing(false);
      setMostrarConfirmacion(false);
      setVehiculoSeleccionado(null);
    }
  };

  const handleMostrarModalMantenimiento = (idAuto: number) => {
    setVehiculoSeleccionado(idAuto);
    setFormData({
      fechaInicio: "",
      fechaFin: "",
      descripcion: "",
      costo: "",
      tipoMantenimiento: "PREVENTIVO",
      kilometraje: "",
    });
    setMostrarModalMantenimiento(true);
  };

  const parseFechaInicio = (fechaStr: string): string | null => {
    const partes = fechaStr.split('/');
    if (partes.length !== 3) return null;
    const [dia, mes, anio] = partes;
    const fecha = new Date(`${anio}-${mes}-${dia}T00:00:00.000Z`);
    return isNaN(fecha.getTime()) ? null : fecha.toISOString();
  };

  const parseFechaFin = (fechaStr: string): string | null => {
    const partes = fechaStr.split('/');
    if (partes.length !== 3) return null;
    const [dia, mes, anio] = partes;
    const fecha = new Date(`${anio}-${mes}-${dia}T23:59:59.999Z`);
    return isNaN(fecha.getTime()) ? null : fecha.toISOString();
  };

  const handlePreRegistrarMantenimiento = (data: MantenimientoData) => {
    setDatosMantenimientoTemp(data);
    setMostrarModalMantenimiento(false);
    setMostrarConfirmacionMantenimiento(true);
  };

  const confirmarRegistroMantenimiento = async () => {
    if (!datosMantenimientoTemp || !vehiculoSeleccionado) return;

    setIsProcessing(true);

    try {
      const data = datosMantenimientoTemp;
      const fechaInicio = parseFechaInicio(data.fechaInicio);
      const fechaFin = parseFechaFin(data.fechaFin);
      const kilometraje = Number(data.kilometraje);

      const response = await fetch(`${API_URL}/autos/${vehiculoSeleccionado}/mantenimiento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: data.descripcion,
          tipoMantenimiento: data.tipoMantenimiento,
          kilometraje: kilometraje,
          costo: parseFloat(data.costo),
          fechaInicio: fechaInicio,
          fechaFin: fechaFin
        })
      });

      if (!response.ok) {
        throw new Error(`Error al registrar mantenimiento: ${response.status}`);
      }

      await response.json();
      await cargarVehiculos();
      setMantenimientoExitoso(true);
    } catch (err) {
      console.error("Error al registrar mantenimiento:", err);
      setError("No se pudo registrar el mantenimiento. Por favor, intente nuevamente.");
    } finally {
      setIsProcessing(false);
      setMostrarConfirmacionMantenimiento(false);
      setVehiculoSeleccionado(null);
      setDatosMantenimientoTemp(null);
    }
  };

  const handleTerminarMantenimiento = (idAuto: number) => {
    setVehiculoSeleccionado(idAuto);
    setAccionActual("FINALIZAR_MANTENIMIENTO");
    setMostrarConfirmacion(true);
  };

  const renderEstadoVehiculo = (vehiculo: Vehiculo) => {
    const { estadoActual } = vehiculo;

    switch (estadoActual.tipo) {
      case 'RENTA_ACTIVA':
        return (
          <div className="bg-white p-4 rounded-md space-y-2 shadow-sm">
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Estado:
              </span>{" "}
              {estadoActual.datos.estado === 'EN_CURSO' ? 'Rentado' : 'Reservado'}
            </p>
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Rentado a:
              </span>{" "}
              {estadoActual.datos.cliente?.nombreCompleto}
            </p>
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Fecha de término:
              </span>{" "}
              {estadoActual.datos.fechaFin ? new Date(estadoActual.datos.fechaFin).toLocaleDateString() : 'No especificada'}
            </p>
          </div>
        );
      case 'EN_MANTENIMIENTO':
        return (
          <div className="bg-white p-4 rounded-md space-y-2 shadow-sm">
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Estado:
              </span>{" "}
              En Mantenimiento
            </p>
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Tipo:
              </span>{" "}
              {estadoActual.datos.tipoMantenimiento}
            </p>
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Fecha fin prevista:
              </span>{" "}
              {estadoActual.datos.fechaFinPrevista ? new Date(estadoActual.datos.fechaFinPrevista).toLocaleDateString() : 'No especificada'}
            </p>
          </div>
        );
      case 'RENTA_FINALIZADA_POR_LIBERAR':
        return (
          <div className="bg-white p-4 rounded-md space-y-2 shadow-sm">
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Estado:
              </span>{" "}
              Renta Finalizada, por liberar
            </p>
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Rentado a:
              </span>{" "}
              {estadoActual.datos.cliente?.nombreCompleto}
            </p>
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Fecha fin:
              </span>{" "}
              {estadoActual.datos.fechaFin ? new Date(estadoActual.datos.fechaFin).toLocaleDateString() : 'No especificada'}
            </p>
          </div>
        );
      case 'NO_DISPONIBLE':
        return (
          <span className="bg-white text-black text-base font-medium px-3 py-1 rounded-full w-fit">
            No Disponible
          </span>
        );
      case 'DISPONIBLE':
      default:
        return (
          <span className="bg-white text-black text-base font-medium px-3 py-1 rounded-full w-fit">
            Disponible
          </span>
        );
    }
  };

  const renderBotonAccion = (vehiculo: Vehiculo) => {
    const { estadoActual } = vehiculo;
    console.log("Estado actual:", estadoActual);
    const accionPosible = estadoActual.datos.accionPosible;
    console.log("Acción posible:", accionPosible);
    if (!accionPosible) return null;
    if (accionPosible === 'CANCELAR_RESERVA') {
      return (
        <div className="flex items-center w-full">
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => {
                const vehiculoActual = vehiculos.find(v => v.idAuto === vehiculo.idAuto);
                if (vehiculoActual) {
                  fetchComentarios(vehiculo.idAuto);
                  setVehiculoSeleccionado(vehiculo.idAuto);
                }
              }}
              className="ml-auto bg-[#11295B] hover:bg-blue-800 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
            >
              Ver comentarios
            </button>
            <button
              onClick={() => setModalKilometraje(true)}
              className="ml-auto bg-[#FCA311] hover:bg-yellow-500 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
            >
              Ver Kilometraje
            </button>
          </div>
        </div>
      );
    } else if (accionPosible === 'FINALIZAR_RENTA') {
      return (
        <div className="flex items-center w-full">
          <button
            onClick={() => handleLiberarRenta(vehiculo.idAuto)}
            className="bg-[#FCA311] hover:bg-yellow-500 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
          >
            Liberar Auto
          </button>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => {
                const vehiculoActual = vehiculos.find(v => v.idAuto === vehiculo.idAuto);
                if (vehiculoActual) {
                  fetchComentarios(vehiculo.idAuto);
                  setVehiculoSeleccionado(vehiculo.idAuto);
                }
              }}
              className="ml-auto bg-[#11295B] hover:bg-blue-800 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
            >
              Ver comentarios
            </button>
            <button
              onClick={() => setModalKilometraje(true)}
              className="ml-auto bg-[#FCA311] hover:bg-yellow-500 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
            >
              Ver Kilometraje
            </button>
          </div>
        </div>

      );
    } else if (accionPosible === 'FINALIZAR_MANTENIMIENTO') {
      return (
        <div className="flex items-center w-full">
          <button
            onClick={() => handleTerminarMantenimiento(vehiculo.idAuto)}
            className="bg-[#FCA311] hover:bg-yellow-500 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
          >
            Terminar Mantenimiento
          </button>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => {
                const vehiculoActual = vehiculos.find(v => v.idAuto === vehiculo.idAuto);
                if (vehiculoActual) {
                  fetchComentarios(vehiculo.idAuto);
                  setVehiculoSeleccionado(vehiculo.idAuto);
                }
              }}
              className="ml-auto bg-[#11295B] hover:bg-blue-800 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
            >
              Ver comentarios
            </button>
            <button
              onClick={() => setModalKilometraje(true)}
              className="ml-auto bg-[#FCA311] hover:bg-yellow-500 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
            >
              Ver Kilometraje
            </button>
          </div>
        </div>
      );
    } else if (accionPosible === 'CANCELAR_RESERVA') {
      return (
        <div className="flex items-center w-full">
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => {
                const vehiculoActual = vehiculos.find(v => v.idAuto === vehiculo.idAuto);
                if (vehiculoActual) {
                  fetchComentarios(vehiculo.idAuto);
                  setVehiculoSeleccionado(vehiculo.idAuto);
                }
              }}
              className="ml-auto bg-[#11295B] hover:bg-blue-800 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
            >
              Ver comentarios
            </button>
            <button
              onClick={() => setModalKilometraje(true)}
              className="ml-auto bg-[#FCA311] hover:bg-yellow-500 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
            >
              Ver Kilometraje
            </button>
          </div>
        </div>
      );
    } else if (accionPosible === 'MARCAR_NO_DISPONIBLE') {
      return (
        <div className="flex items-center w-full">
          <button
            onClick={() => handleMostrarModalMantenimiento(vehiculo.idAuto)}
            className="bg-[#11295B] hover:bg-blue-800 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
          >
            Poner en Mantenimiento
          </button>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => {
                const vehiculoActual = vehiculos.find(v => v.idAuto === vehiculo.idAuto);
                if (vehiculoActual) {
                  fetchComentarios(vehiculo.idAuto);
                  setVehiculoSeleccionado(vehiculo.idAuto);
                }
              }}
              className="ml-auto bg-[#11295B] hover:bg-blue-800 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
            >
              Ver comentarios
            </button>
            <button
              onClick={() => setModalKilometraje(true)}
              className="ml-auto bg-[#FCA311] hover:bg-yellow-500 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
            >
              Ver Kilometraje
            </button>
          </div>
        </div>
      );
    } else if (accionPosible === 'MARCAR_DISPONIBLE') {
      return (
        <div className="flex items-center w-full">
          <button
            onClick={() => handleMostrarModalMantenimiento(vehiculo.idAuto)}
            className="bg-[#11295B] hover:bg-blue-800 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
          >
            Poner en Mantenimiento
          </button>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => {
                const vehiculoActual = vehiculos.find(v => v.idAuto === vehiculo.idAuto);
                if (vehiculoActual) {
                  fetchComentarios(vehiculo.idAuto);
                  setVehiculoSeleccionado(vehiculo.idAuto);
                }
              }}
              className="ml-auto bg-[#11295B] hover:bg-blue-800 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
            >
              Ver comentarios
            </button>
            <button
              onClick={() => setModalKilometraje(true)}
              className="ml-auto bg-[#FCA311] hover:bg-yellow-500 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
            >
              Ver Kilometraje
            </button>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium">Cargando vehículos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={cargarVehiculos}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6">
      <VehiculoFilter
        search={search}
        setSearch={setSearch}
        setEstadoFilter={setEstadoFilter}
        setOrdenamiento={setOrdenamiento}
      />

      {vehiculosFiltrados.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-medium">No se encontraron autos...</p>
        </div>
      ) : (
        <>
          {vehiculosPaginados.map((vehiculo) => (
            <div
              key={vehiculo.idAuto}
              className="bg-[#D8C4A7] rounded-lg shadow-md overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 lg:w-2/5 h-[250px] md:h-[300px] lg:h-[350px] bg-gray-300 flex items-center justify-center text-gray-600 text-2xl overflow-hidden">
                  {vehiculo.imagen ? (
                    <img
                      src={vehiculo.imagen}
                      alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "Sin imagen disponible"
                  )}
                </div>

                <div className="p-6 flex flex-col justify-between w-full md:w-2/3 lg:w-3/5">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h2 className="text-xl font-bold" style={{ color: "#11295B" }}>
                        {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
                      </h2>
                      <span className="bg-white text-black text-sm px-2 py-1 rounded-full w-fit">
                        {vehiculo.placa}
                      </span>
                    </div>
                    {renderPromedioCalificacion(vehiculo)}
                    <div>
                      {renderEstadoVehiculo(vehiculo)}
                    </div>
                  </div>

                  <div className="mt-4 w-full">
                    {renderBotonAccion(vehiculo)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {totalPaginas > 1 && (    // paginacion de los autos//
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setPaginaActual(paginaActual - 1)}
                disabled={paginaActual === 1}
                className={`bg-[#11295B] text-white w-8 h-8 rounded-full ${paginaActual === 1 ? "opacity-40 pointer-events-none" : ""
                  }`}
              >
                &lt;
              </button>

              <span className="text-[#11295B] font-medium">
                {paginaActual} / {totalPaginas}
              </span>

              <button
                onClick={() => setPaginaActual(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className={`bg-[#11295B] text-white w-8 h-8 rounded-full ${paginaActual === totalPaginas ? "opacity-40 pointer-events-none" : ""
                  }`}
              >
                &gt;
              </button>

            </div>
          )}
        </>
      )}

      <ModalDeConfirmacion
        isOpen={mostrarConfirmacion}
        onClose={() => setMostrarConfirmacion(false)}
        onConfirm={confirmarAccion}
        title={
          accionActual === "FINALIZAR_RENTA"
            ? "¿Está seguro que desea liberar el vehículo?"
            : accionActual === "CANCELAR_RESERVA"
              ? "¿Está seguro que desea cancelar la reserva?"
              : "¿Está seguro que desea finalizar el mantenimiento?"
        }
        message={
          accionActual === "FINALIZAR_RENTA"
            ? "Está a punto de liberar el vehículo. Los días especificados en la renta actual estarán disponibles para una nueva renta."
            : accionActual === "CANCELAR_RESERVA"
              ? "Al cancelar esta reserva, el vehículo estará disponible para otras reservas en este período."
              : "El vehículo pasará a estar disponible para nuevas rentas."
        }
        confirmText="ACEPTAR"
        cancelText="CANCELAR"
        isProcessing={isProcessing}
        variant="confirmation"
        showSuccess={false}
      />

      <ModalDeConfirmacion
        isOpen={mostrarExito}
        onClose={() => setMostrarExito(false)}
        onConfirm={() => setMostrarExito(false)}
        title={
          accionActual === "FINALIZAR_RENTA"
            ? "Vehículo liberado con éxito"
            : accionActual === "CANCELAR_RESERVA"
              ? "Reserva cancelada con éxito"
              : "Mantenimiento finalizado con éxito"
        }
        message="La acción fue exitosa."
        confirmText="ACEPTAR"
        variant="success"
        showSuccess={true}
        successIcon={<FiCheckCircle className="text-5xl text-[#FFA500]" />}
      />

      <ModalDeConfirmacion
        isOpen={mantenimientoExitoso}
        onClose={() => setMantenimientoExitoso(false)}
        onConfirm={() => setMantenimientoExitoso(false)}
        title="Mantenimiento actualizado con éxito"
        message="Vehículo puesto en mantenimiento con exito."
        confirmText="ACEPTAR"
        variant="success"
        showSuccess={true}
        successIcon={<FiCheckCircle className="text-5xl text-[#FFA500]" />}
      />

      <ModalDeConfirmacion
        isOpen={mostrarConfirmacionMantenimiento}
        onClose={() => setMostrarConfirmacionMantenimiento(false)}
        onConfirm={confirmarRegistroMantenimiento}
        title="¿Confirma los datos del mantenimiento?"
        message={
          datosMantenimientoTemp ?
            `Tipo: ${datosMantenimientoTemp.tipoMantenimiento}
         Fecha inicio: ${datosMantenimientoTemp.fechaInicio}
         Fecha fin: ${datosMantenimientoTemp.fechaFin}
         Costo: $${datosMantenimientoTemp.costo}
         Descripción: ${datosMantenimientoTemp.descripcion}` :
            "¿Está seguro de registrar este mantenimiento?"
        }
        confirmText="CONFIRMAR"
        cancelText="CANCELAR"
        isProcessing={isProcessing}
        variant="confirmation"
        showSuccess={false}
      />

      <RegistrarMantenimientoModal
        isOpen={mostrarModalMantenimiento}
        onClose={() => setMostrarModalMantenimiento(false)}
        onSubmit={handlePreRegistrarMantenimiento}
        formData={formData}
        setFormData={setFormData}
        onCancel={() => setMostrarModalMantenimiento(false)}
      />

      <VerKilometraje
        isOpen={mostrarModalKilometraje}
        onClose={() => setModalKilometraje(false)}
        kilometrajeActual={kilometrajeActual}
        mileageHistory={historialKilometraje}
      />

      <VerComentarios
        isOpen={mostrarModalComentarios}
        onClose={() => setMostrarModalComentarios(false)}
        comentarios={comentarios}
        vehiculoInfo={
          vehiculos.find(v => v.idAuto === vehiculoSeleccionado) ||
          { marca: '', modelo: '', anio: '' }
        }
      />
    </div>
  );
}