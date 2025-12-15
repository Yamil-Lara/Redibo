// components/MileageModal.tsx
import React from 'react';


interface Kilometraje {
    id: string;
    nombre: string;
    fechaInicio: string;
    fechaFin: string;
    kilometraje: number;
  }
  
interface HistorialKilometraje {
    isOpen: boolean;
    onClose: () => void;
    kilometrajeActual: number;
    mileageHistory: Kilometraje[];
  }
  
  export const VerKilometraje: React.FC<HistorialKilometraje> = ({
  isOpen,
  onClose,
  kilometrajeActual,
  mileageHistory
}) => {
  if (!isOpen) return null;

  const formatNumber = (num: number): string => {
    return num.toLocaleString('es-ES');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Historial de Kilometraje
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Current Mileage */}
          <div className="bg-orange-100 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Kilometraje Actual
            </h3>
            <div className="text-3xl font-bold text-gray-800">
              {formatNumber(kilometrajeActual)} km
            </div>
          </div>

          {/* Past Mileages */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Kilometrajes Pasados
            </h3>
            
            {mileageHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay registros de kilometraje anteriores
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                        Nombre
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                        Fecha Inicio
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                        Fecha Fin
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                        Kilometraje
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mileageHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 text-gray-800">
                          {record.nombre}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-600">
                          {formatDate(record.fechaInicio)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-600">
                          {formatDate(record.fechaFin)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-800">
                          {formatNumber(record.kilometraje)} km
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};