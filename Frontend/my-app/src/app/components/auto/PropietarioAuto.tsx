import { FaStar } from "react-icons/fa";

interface PropietarioAutoProps {
  propietario: {
    nombreCompleto: string;
    calificacion: number;
    comentarios: number;
  };
}

export default function PropietarioAuto({ propietario }: PropietarioAutoProps) {
  return (
    <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
      <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
      <div>
        <p className="font-semibold text-black">
          Auto ofrecido por {propietario.nombreCompleto}
        </p>
        <div className="flex items-center">
          <FaStar className="text-yellow-400" />
          <span className="ml-1 text-sm font-semibold text-black">
            {propietario.calificacion} ({propietario.comentarios} reseñas)
          </span>
        </div>
      </div>
    </div>
  );
}
