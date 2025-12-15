interface EncabezadoAutoProps {
    titulo: string;
    tipo: string;
    año: string;
  }
  
  export default function EncabezadoAuto({ titulo, tipo, año }: EncabezadoAutoProps) {
    return (
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">{titulo}</h1>
        <div className="flex items-center space-x-3 mt-1">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{tipo}</span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{año}</span>
        </div>
      </div>
    );
  }