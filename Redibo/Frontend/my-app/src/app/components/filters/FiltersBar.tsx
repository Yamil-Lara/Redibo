'use client';

interface FiltersBarProps {
  onFilterChange: (filter: string) => void;
  activeFilter: string;
}

export default function FiltersBar({ onFilterChange, activeFilter }: FiltersBarProps) {
  const filtros = ['todos', 'Filtro 1', 'Filtro 2', 'Filtro 3', 'Filtro 4', 'Filtro 5', 'Filtro 6', 'Filtro 7'];

  const handleFilterClick = (filtro: string) => {
    onFilterChange(filtro);
  };

  return (
    <div className="flex justify-center items-center px-4 py-2 bg-white font-[var(--fuente-principal)] border-b-[2px] border-[rgba(0,0,0,0.2)] shadow-[0_4px_10px_rgba(0,0,0,0.25)] rounded-b-[20px]">
      <div className="flex gap-16 overflow-x-auto scrollbar-hide text-[rgba(0,0,0,0.64)]">
        {filtros.map((filtro) => (
          <span
            key={filtro}
            onClick={() => handleFilterClick(filtro)}
            className={`cursor-pointer whitespace-nowrap ${
              filtro === activeFilter
                ? 'text-[var(--naranja)] font-bold underline'
                : ''
            }`}
          >
            {filtro}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-12 ml-4">
        <button className="bg-white border-2 border-[rgba(0,0,0,0.2)] rounded px-2 py-1 cursor-pointer">
          &gt;
        </button>
        <button className="bg-[var(--naranja)] text-[var(--blanco)] font-bold rounded px-8 py-2 shadow-[0px_4px_3px_rgba(1,0,0,0.165)] cursor-pointer">
          Filtros
        </button>
      </div>
    </div>
  );
}