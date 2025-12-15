interface DescripcionAutoProps {
    descripcion: string;
  }

export default function DescripcionAuto({ descripcion }: DescripcionAutoProps) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Acerca de este auto</h2>
        <p className="text-gray-600">{descripcion}</p>
      </div>
    );
  }