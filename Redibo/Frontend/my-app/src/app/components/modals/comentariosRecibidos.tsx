'use client';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';


type CommentedCar = {
  id: string;
  modelo: string;
  marca: string;
  direccionImagen: string | null;
  comentarios: string;
  calificacionPromedio: number;
  date: string;
  name: string;
};

const variableDeOrden = 'comentarios-sortBy';
const variableDeDireccion = 'comentarios-direction';

export default function ComentariosRecibidos() {
  // 1. Estados
  const [items, setItems] = useState<CommentedCar[]>([]);
  //const [loading, setLoading] = useState(true);
  const [respuestasVisibles, setRespuestasVisibles] = useState<{ [id: string]: boolean }>({});
  const [respuestasTexto, setRespuestasTexto] = useState<{ [id: string]: string }>({});
  const [respuestasEnviadas, setRespuestasEnviadas] = useState<{ [id: string]: string }>({});
  const [cargadoRespuestas, setCargadoRespuestas] = useState(false);

  // 2. Estados persistentes
  const [sortBy, setSortBy] = useState<'date' | 'rating'>(() => {
    if (typeof window === 'undefined') return 'date';
    return (localStorage.getItem(variableDeOrden) as 'date' | 'rating') || 'date';
  });
  const [direction, setDirection] = useState<'asc' | 'desc'>(() => {
    if (typeof window === 'undefined') return 'desc';
    return (localStorage.getItem(variableDeDireccion) as 'asc' | 'desc') || 'desc';
  });

  const defaultImage =
    'https://images.unsplash.com/photo-1596165494776-c27e37f666fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3';

  // 3. Persistir sortBy y direction
  useEffect(() => {
    localStorage.setItem(variableDeOrden, sortBy);
  }, [sortBy]);
  useEffect(() => {
    localStorage.setItem(variableDeDireccion, direction);
  }, [direction]);

  // 4. Cargar mock con IDs
  useEffect(() => {
    const mockData: CommentedCar[] = [
      {
        id: 'honda-civic-2025-05-01',
        modelo: 'Civic',
        marca: 'Honda',
        direccionImagen: 'https://media.istockphoto.com/id/899251594/es/foto/honda-civic-sedan-en-la-calle.jpg?s=612x612&w=0&k=20&c=eEzweppmMXJOshxYF63ozoyDtjmqxxH302rNr4P5rp0=',
        comentarios: 'El auto estaba impecable y el dueño fue muy amable.',
        calificacionPromedio: 4.8,
        date: '2025-05-01',
        name: 'Carlos Rojas',
      },
      {
        id: 'tesla-model3-2025-04-21',
        modelo: 'RAV4',
        marca: 'Toyota',
        direccionImagen:
          'https://media.istockphoto.com/id/2153276505/es/foto/retrato-de-un-suv-toyota-rav4-en-blanco-y-negro-circulando-por-un-distrito-del-centro-de-la.jpg?s=612x612&w=0&k=20&c=Wu31-VpkZk750dbggYNJvJmZctnhvVySYUBmoEKlA9A=',
        comentarios: 'Increíble experiencia, definitivamente lo volvería a alquilar.',
        calificacionPromedio: 5,
        date: '2025-04-21',
        name: 'Diego Flores',
      },
      {
        id: 'toyota-corolla-2025-06-05',
        modelo: 'Corolla',
        marca: 'Toyota',
        direccionImagen: 'https://media.istockphoto.com/id/1490889104/es/foto/toyota-corolla-h%C3%ADbrido.jpg?s=612x612&w=0&k=20&c=grvsyYdyg2uPiK3v-K5ZBCuttu5KU8UlLPLMHzs12B4=',
        comentarios: 'Buen coche, aunque el aire acondicionado falló un poco.',
        calificacionPromedio: 3.5,
        date: '2025-06-05',
        name: 'Luis Fernández',
      },
    ];
    setItems(mockData);
    //setLoading(false);
  }, []);

  // 5. Leer respuestas guardadas una sola vez
  useEffect(() => {
    const guardadas = localStorage.getItem('respuestasEnviadas');
    if (guardadas) {
      try {
        setRespuestasEnviadas(JSON.parse(guardadas));
      } catch {
        setRespuestasEnviadas({});
      }
    }
    setCargadoRespuestas(true);
  }, []);

  // 6. Persistir respuestasEnviadas tras la carga inicial
  useEffect(() => {
    if (cargadoRespuestas) {
      localStorage.setItem('respuestasEnviadas', JSON.stringify(respuestasEnviadas));
    }
  }, [respuestasEnviadas, cargadoRespuestas]);

  // 7. Funciones para respuestas
  const toggleRespuesta = (id: string) => {
    setRespuestasVisibles(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const handleTextoRespuesta = (id: string, texto: string) => {
    setRespuestasTexto(prev => ({ ...prev, [id]: texto }));
  };
  const enviarRespuesta = (id: string) => {
    const texto = respuestasTexto[id]?.trim();
    if (!texto) {
      alert('La respuesta no puede estar vacía.');
      return;
    }
    setRespuestasEnviadas(prev => ({ ...prev, [id]: texto }));
    handleTextoRespuesta(id, '');
    setRespuestasVisibles(prev => ({ ...prev, [id]: false }));
  };

  // 8. Ordenar items localmente
  const sortedItems = [...items].sort((a, b) => {
    const dir = direction === 'asc' ? 1 : -1;
    if (sortBy === 'date') {
      return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return dir * (a.calificacionPromedio - b.calificacionPromedio);
  });

  // 9. Renderizado
  return (
    <div className="px-4 py-0 space-y-4 w-full max-w-screen-xl mx-auto">
      <div className="sticky top-0 z-20 bg-white border-b py-2 px-4">
        <div className="flex gap-4 items-center top-0">
          <label>Ordenar por:</label>
          <button
            onClick={() => setSortBy('date')}
            className={`border px-2 py-1 rounded ${
              sortBy === 'date' ? 'bg-gray-300 font-semibold' : 'bg-white'
            }`}
          >
            Fecha 📅
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`border px-2 py-1 rounded ${
              sortBy === 'rating' ? 'bg-gray-300 font-semibold' : 'bg-white'
            }`}
          >
            Calificación ⭐
          </button>

          <label>Dirección:</label>
          <button
            onClick={() => setDirection('asc')}
            className={`border px-2 py-1 rounded ${
              direction === 'asc' ? 'bg-gray-300 font-semibold' : 'bg-white'
            }`}
          >
            Ascendente ⬆️
          </button>
          <button
            onClick={() => setDirection('desc')}
            className={`border px-2 py-1 rounded ${
              direction === 'desc' ? 'bg-gray-300 font-semibold' : 'bg-white'
            }`}
          >
            Descendente ⬇️
          </button>
        </div>
      </div>

      {/* Contenedor con animación layout */}
      <motion.div layout>
        <AnimatePresence>
          {sortedItems.map(item => {
            const id = item.id;
            const ratingStars = Math.min(Math.max(Math.round(item.calificacionPromedio), 0), 5);
            const respGuardada = respuestasEnviadas[id] || '';
            const respVisible = respuestasVisibles[id] || false;
            const textoResp = respuestasTexto[id] || '';

            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full border-3 border-yellow-400 rounded-lg p-4 bg-white shadow-sm mb-4"
              >
                <div className="grid grid-cols-12 gap-4 items-start text-center">
                  <div className="col-span-12 sm:col-span-2 flex flex-col items-center justify-start">
                    <Image
                      src={item.direccionImagen || defaultImage}
                      alt={`${item.marca} ${item.modelo}`}
                      className="w-full h-30 object-cover rounded"
                    />
                    <h2 className="text-lg font-semibold mt-2">
                      {item.marca} {item.modelo}
                    </h2>
                  </div>

                  <div className="col-span-6 sm:col-span-2 flex flex-col items-center justify-start">
                    <strong className="text-gray-600 mb-10">Inquilino</strong>
                    <p>{item.name}</p>
                  </div>

                  <div className="col-span-12 sm:col-span-4 flex flex-col items-center justify-start">
                    <strong className="text-gray-600 mb-2">Comentario</strong>
                    <p className="mb-4">{item.comentarios}</p>

                    {respGuardada ? (
                      <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded w-full text-left">
                        <p className="text-sm text-blue-800">
                          <strong>Tu respuesta:</strong> {respGuardada}
                        </p>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleRespuesta(id)}
                          className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          {respVisible ? 'Cancelar' : 'Responder'}
                        </button>
                        {respVisible && (
                          <div className="mt-2 w-full">
                            <textarea
                              className="w-full border p-2 rounded text-sm"
                              rows={3}
                              placeholder="Escribe tu respuesta..."
                              value={textoResp}
                              onChange={e => handleTextoRespuesta(id, e.target.value)}
                              maxLength={300}
                            />
                            <div className="text-right text-xs text-gray-500 mt-1">
                              {textoResp.length}/300 caracteres
                            </div>
                            <button
                              onClick={() => enviarRespuesta(id)}
                              className={`mt-1 px-3 py-1 rounded text-sm transition-colors ${
                                textoResp.trim()
                                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              }`}
                              disabled={!textoResp.trim()}
                            >
                              Enviar respuesta
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="col-span-3 sm:col-span-2 flex flex-col items-center justify-start">
                    <strong className="text-gray-600 mb-10">Calificación</strong>
                    <p className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          color={i < ratingStars ? '#FBBF24' : '#D1D5DB'}
                          size={20}
                        />
                      ))}
                    </p>
                  </div>

                  <div className="col-span-3 sm:col-span-2 flex flex-col items-center justify-start">
                    <strong className="text-gray-600 mb-10">Fecha</strong>
                    <p>{item.date}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}