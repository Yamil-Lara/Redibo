import Image from 'next/image';

interface GaleriaAutoProps {
  imagenes: string[];
}

export default function GaleriaAuto({ imagenes }: GaleriaAutoProps) {
  // La primera imagen es la principal, el resto son miniaturas
  const imagenPrincipal = imagenes[0];
  const miniaturas = imagenes.slice(1);

  return (
    <div className="mb-8">
      <div className="w-full h-64 md:h-80 bg-gray-200 relative mb-2 rounded-lg overflow-hidden">
        <Image 
          src={imagenPrincipal} 
          alt="Imagen principal del auto" 
          layout="fill" 
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {miniaturas.map((imagen, index) => (
          <div key={index} className="h-24 md:h-32 bg-gray-200 relative rounded-lg overflow-hidden">
            <Image 
              src={imagen} 
              alt={`Imagen del auto ${index + 1}`} 
              layout="fill" 
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}