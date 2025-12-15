import { FaUsers, FaCog, FaGasPump, FaShieldAlt } from 'react-icons/fa';


interface CaracteristicasAutoProps {
  asientos: number;
  transmision: string;
}

export default function CaracteristicasAuto({ asientos, transmision}: CaracteristicasAutoProps) {
  return (
    <>
      {/* Características principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center">
          <FaUsers className="text-black mr-2" />
          <span>{asientos} Asientos</span>
        </div>
        <div className="flex items-center">
          <FaCog className="text-black mr-2" />
          <span>{transmision}</span>
        </div>
        <div className="flex items-center">
          <FaGasPump className="text-black mr-2" />
          <span>Gasolina</span>
        </div>
        <div className="flex items-center">
          <FaShieldAlt className="text-black mr-2" />
          <span>Garantía</span>
        </div>
      </div>
      
     
    </>
  );
}