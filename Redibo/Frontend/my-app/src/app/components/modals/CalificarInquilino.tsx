'use client';
import Image from "next/image";
import { useState} from "react";
import CalificarModal from "./CalificarModal";
import ComentariosInquilino from "./ComentariosInquilino";

interface Comentario {
  id: number;
  autor: string;
  texto: string;
  fecha?: string;
  avatar?: string;
  calificacion: number;
}

interface Inquilino {
  id: number;
  nombre: string;
  img: string;
  promedio: number;
  totalReseñas: number;
  comentarios: Comentario[];
}

const inquilinos: Inquilino[] = [
  {
    id: 1,
    nombre: "Mariza Ramirez",
    img: "https://media.istockphoto.com/id/1305462732/photo/headshot-studio-portrait-of-a-woman-in-profile-looking-at-the-camera.jpg?s=612x612&w=0&k=20&c=T0R-pAmJJpErWc8hE0jSJnmptUFQ5MvtPX7NPJJln9s=",
    totalReseñas: 3,
    promedio: 4.9,
    comentarios: [
      {
        id: 1,
        autor: "Jorge Suarez",
        texto: "Todo bien con Mariza.",
        fecha: "10/06/25",
        avatar: "https://media.istockphoto.com/id/1303206558/photo/headshot-portrait-of-smiling-businessman-talk-on-video-call.jpg?s=612x612&w=0&k=20&c=hMJhVHKeTIznZgOKhtlPQEdZqb0lJ5Nekz1A9f8sPV8=",
        calificacion: 5
      },
      {
        id: 2,
        autor: "Jack Peralta",
        texto: "",
        fecha:"08/06/25",
                avatar: "https://media.istockphoto.com/id/1388253782/photo/positive-successful-millennial-business-professional-man-head-shot-portrait.jpg?s=612x612&w=0&k=20&c=uS4knmZ88zNA_OjNaE_JCRuq9qn3ycgtHKDKdJSnGdY=",

        calificacion: 5
      },
      {
        id: 3,
        autor: "Carlos Pérez",
        texto: "Puntual para la entrega, muy bien!",
        fecha:"14/03/25",
                        avatar: "https://media.istockphoto.com/id/1320686253/fr/photo/portrait-dun-homme-confiant-%C3%A0-son-bureau.jpg?s=612x612&w=0&k=20&c=ohC2Bu8uH_dplQwUyomrz8VHO3q7AyIjYJrAnVgEuqk=",

        calificacion: 5
      }
    ]
  },
  {
    id: 2,
    nombre: "Diego Flores",
    img: "https://media.istockphoto.com/id/1399565382/es/foto/joven-empresario-mestizo-feliz-de-pie-con-los-brazos-cruzados-trabajando-solo-en-una-oficina.jpg?s=612x612&w=0&k=20&c=Tls7PDwhSbA9aaVg0RkpfPfWYaQrfecN319aOCKuU34=",
    totalReseñas: 4,
    promedio: 3.0,
    comentarios: [
      {
        id: 1,
        autor: "Samuel Lopez",
        texto: "Diego devolvió el auto con retraso.",
        fecha: "12/06/25",
        avatar: "https://media.istockphoto.com/id/1285124274/es/foto/retrato-de-hombre-de-mediana-edad.jpg?s=612x612&w=0&k=20&c=j3byP57bGnLFPhEwoJNjwnQVL58RRpmYfLT5k_O9nKE=",
        calificacion: 3
      },
      {
        id: 2,
        autor: "Francisca Duran",
        texto: "",
        fecha: "25/05/25",
                avatar: "https://media.istockphoto.com/id/1384357158/photo/portrait-of-a-beautiful-mexican-woman.jpg?s=612x612&w=0&k=20&c=OtFYs_rdWIm6JJZxAanK6f0pV-YMfMr1IXUAHUCRfss=",

        calificacion: 3
      },
      {
        id: 3,
        autor: "Laura Díaz",
        texto: "Retraso en la entrega, y ademas entrego muy sucio el vehiculo, al parecer es poco cuidadoso.",
        fecha: "03/05/25",
                        avatar: "https://media.istockphoto.com/id/1384357158/photo/portrait-of-a-beautiful-mexican-woman.jpg?s=612x612&w=0&k=20&c=OtFYs_rdWIm6JJZxAanK6f0pV-YMfMr1IXUAHUCRfss=",

        calificacion: 2
      },
      {
        id: 4,
        autor: "Pedro Mendez",
        texto: "",
        fecha: "20/04/25",
        
        calificacion: 4
      }
    ]
  },
  {
    id: 3,
    nombre: "Camila Torres",
    img: "https://media.istockphoto.com/id/1389348844/es/foto/foto-de-estudio-de-una-hermosa-joven-sonriendo-mientras-est%C3%A1-de-pie-sobre-un-fondo-gris.jpg?s=612x612&w=0&k=20&c=kUufmNoTnDcRbyeHhU1wRiip-fNjTWP9owjHf75frFQ=",
    totalReseñas: 6,
    promedio: 4.2,
    comentarios: [
      {
        id: 1,
        autor: "Ana Maria",
        texto: "Devuelto a tiempo y en perfectas condiciones, con limpieza y sin ningún problema técnico. La gestión y comunicación fueron excelentes, lo que facilitó todo el proceso de alquiler.",
        fecha: "12/04/25",
        avatar: "https://media.istockphoto.com/id/1135381120/photo/portrait-of-a-young-woman-outdoors-smiling.jpg?s=612x612&w=0&k=20&c=T5dukPD1r-o0BFqeqlIap7xzw07icucetwKaEC2Ms5M=",
        calificacion: 5
      },
      {
        id: 2,
        autor: "Samuel Zegarra",
        texto: "",
        fecha: "02/04/25",
                avatar: "https://media.istockphoto.com/id/1135381173/photo/portrait-of-a-young-man-outdoors-smiling.jpg?s=612x612&w=0&k=20&c=J8DKGHI8o-oj8cY1CCNpFY2V9OmVVbJuKSO2DdbMvRg=",

        calificacion: 4
      },
      {
        id: 3,
        autor: "Mario Aponte",
        texto: "El uso del vehículo fue adecuado y el inquilino mostró responsabilidad en el cuidado. Se recomienda mejorar la puntualidad para futuros alquileres, pero en términos generales fue una experiencia satisfactoria.",
        fecha: "17/03/25",
                avatar: "https://media.istockphoto.com/id/1060638302/photo/portrait-of-a-hispanic-man.jpg?s=612x612&w=0&k=20&c=q43le0l4RAktx-aqyd94tgFdPnZ3_KnpfSgtnWMpfFw=",

        calificacion: 4
      },
      {
        id: 4,
        autor: "Paola Gonzales",
        texto: "Muy responsable y atenta, cumplió con todos los horarios y dejó el vehículo en perfectas condiciones.",
        fecha: "02/03/25",
        avatar:"https://media.istockphoto.com/id/530518653/photo/mature-hispanic-woman.jpg?s=612x612&w=0&k=20&c=QfmahO32c09UB9M4qHrbmbLpANuH-4Pg0DyvAERV6l8=",
        calificacion: 5
      },
      {
        id: 5,
        autor: "Pablo Keller",
        texto: "Aceptable, pero deberia mejorar en la puntualidad",
        fecha: "07/10/24",
                avatar: "https://media.istockphoto.com/id/1135381120/photo/portrait-of-a-young-woman-outdoors-smiling.jpg?s=612x612&w=0&k=20&c=T5dukPD1r-o0BFqeqlIap7xzw07icucetwKaEC2Ms5M=",

        calificacion: 3
      },
      {
        id: 6,
        autor: "Fernando Sarmiento",
        texto: "El vehículo fue devuelto con algunos detalles menores y la puntualidad podría mejorar.",
        fecha: "20/08/24",
                        avatar: "https://media.istockphoto.com/id/956845678/photo/real-malaysian-man-standing-and-looking-away.jpg?s=612x612&w=0&k=20&c=NntMK4ByOKBlar3htXjZbxnc6Q6DRne1HS3OTSMqQ3c=",

        calificacion: 4
      }
    ]
  }
];

export default function CalificarInquilino() {
  //const [renderFlag, setRenderFlag] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComentariosModalOpen, setIsComentariosModalOpen] = useState(false);
  const [selectedInquilino, setSelectedInquilino] = useState<Inquilino | null>(null);

  //useEffect(() => {
   // const handler = () => setRenderFlag(f => !f);
   // window.addEventListener("inquilinoCalificado", handler);
   // return () => window.removeEventListener("inquilinoCalificado", handler);
  //}, []);

  const yaFueCalificado = (id: number) => {
    if (typeof window === 'undefined') return false;
    const calificados = JSON.parse(localStorage.getItem('comentariosInquilinos') || '{}');
    return !!calificados[id];
  };

  // Calcula el total de reseñas dinámicamente (solo comentarios + tu calificación)
  const getTotalResenas = (inq: Inquilino) => {
    if (typeof window === 'undefined') return inq.comentarios.length;
    const calificados = JSON.parse(localStorage.getItem('comentariosInquilinos') || '{}');
    return calificados[inq.id] ? inq.comentarios.length + 1 : inq.comentarios.length;
  };

  // Calcula el promedio dinámico de estrellas (solo comentarios + tu calificación)
  const getPromedioDinamico = (inq: Inquilino) => {
    if (typeof window === 'undefined') return 0;
    const calificados = JSON.parse(localStorage.getItem('comentariosInquilinos') || '{}');
    let suma = inq.comentarios.reduce((acc, c) => acc + c.calificacion, 0);
    let total = inq.comentarios.length;
    if (calificados[inq.id]) {
      suma += calificados[inq.id].rating;
      total += 1;
    }
    return total > 0 ? suma / total : 0;
  };

  const abrirModal = (inq: Inquilino) => {
    setSelectedInquilino(inq);
    setIsModalOpen(true);
  };

  const abrirComentariosModal = (inq: Inquilino) => {
    setSelectedInquilino(inq);
    setIsComentariosModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setSelectedInquilino(null);
  };

  const cerrarModalComentarios = () => {
    setIsComentariosModalOpen(false);
    setSelectedInquilino(null);
  };

  function Star({ fillPercent }: { fillPercent: number }) {
    return (
      <svg viewBox="0 0 24 24" className="w-[34px] h-[34px] inline-block">
        <defs>
          <linearGradient id={`grad-${fillPercent}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset={`${fillPercent}%`} stopColor="#facc15" />
            <stop offset={`${fillPercent}%`} stopColor="#e5e7eb" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#grad-${fillPercent})`}
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
           9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    );
  }

  return (
    <div className="w-full max-w-[92rem] mx-auto px-4 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer ">
        {inquilinos.map((inq) => {
          const promedioDinamico = getPromedioDinamico(inq);
          const fullStars = Math.floor(promedioDinamico);
          const partialFill = (promedioDinamico - fullStars) * 100;
          const totalResenas = getTotalResenas(inq);

          return (
            <div
              key={inq.id}
              className="border-2 border-orange-400 rounded-2xl p-3 shadow-lg flex gap-4 items-center bg-white hover:shadow-md transform hover:scale-101 transition-all duration-300"
            >
              <div className="flex flex-col items-center w-32 min-w-0">
                <Image
                  src={inq.img}
                  alt={inq.nombre}
                  width={150}
                  height={150}
                  className="rounded-full object-cover aspect-square"
                />
                <h3 className="mt-3 font-semibold text-center text-sm sm:text-base">
                  {inq.nombre}
                </h3>
              </div>

              <div className="flex-1 h-full flex flex-col justify-center min-w-0">
                <p className="text-base text-gray-600 mb-2 truncate">
                  Reseñas y comentarios: <span className="font-bold text-lg">{totalResenas}</span>
                </p>
                <div className="flex items-center mb-2 flex-wrap">
                  {Array.from({ length: 5 }).map((_, i) => {
                    if (i < fullStars) return <Star key={i} fillPercent={100} />;
                    if (i === fullStars && partialFill > 0) return <Star key={i} fillPercent={partialFill} />;
                    return <Star key={i} fillPercent={0} />;
                  })}
                  <span className="ml-2 font-bold text-xl text-gray-800">
                    {promedioDinamico.toFixed(1)}
                  </span>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => abrirComentariosModal(inq)}
                    className="bg-blue-500 hover:bg-blue-600 transition text-white px-2 py-0.5 rounded text-xs sm:text-sm cursor-pointer"
                  >
                    VER
                  </button>
                  {!yaFueCalificado(inq.id) && (
                    <button
                      onClick={() => abrirModal(inq)}
                      className="bg-orange-400 hover:bg-orange-500 transition text-white px-2 py-0.5 rounded text-xs sm:text-sm cursor-pointer"
                    >
                      CALIFICAR
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedInquilino && (
        <CalificarModal
          isOpen={isModalOpen}
          onClose={cerrarModal}
          inquilino={selectedInquilino}
        />
      )}

      {isComentariosModalOpen && selectedInquilino && (
        <ComentariosInquilino
          inquilino={selectedInquilino}
          onClose={cerrarModalComentarios}
          isOpen={isComentariosModalOpen}
        />
      )}
    </div>
  );
}