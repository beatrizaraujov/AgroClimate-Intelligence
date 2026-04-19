"use client";

import { mapData } from "../mapData";

interface BrazilMapsProps {
  estadoAtivo?: string | null;
  onStateClick?: (sigla: string | null) => void;
}

export default function BrazilMaps({ estadoAtivo, onStateClick }: BrazilMapsProps) {
  
  
  const getPathClasses = (id: string) => {
    const isSelected = estadoAtivo === id;
    const base = "cursor-pointer transition-all duration-500 ease-in-out stroke-[#2D7A73]";
    const active = "fill-emerald-400 stroke-[3] drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]";
    const inactive = "fill-teal-100/80 stroke-[1] md:stroke-[1.2] hover:fill-teal-50";
    
    return `${base} ${isSelected ? active : inactive}`;
  };

  return (
    <section className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[580px] w-full max-w-[900px]">
      
      <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-6 md:p-8 pb-4 md:pb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
              Mapa de Pressão Ambiental (NRT)
            </h1>
          </div>
          <span className="text-[11px] font-bold text-slate-600 mt-1 ml-4">
            {estadoAtivo ? `Foco: ${estadoAtivo}` : "Monitoramento Nacional"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[8px] font-bold text-slate-400 uppercase">Baixa</span>
          <div className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-500 h-1.5 w-20 md:w-24 rounded-full" />
          <span className="text-[8px] font-bold text-slate-400 uppercase">Alta</span>
        </div>
      </header>

      
      <main className="bg-[#2D7A73] w-full relative overflow-hidden group flex-1 flex items-center justify-center">
        
       
        <div className="hidden md:flex absolute top-6 left-6 z-10 max-w-[240px] bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl transition-all hover:scale-105">
           <p className="text-white text-xs">Informações de monitoramento aqui...</p>
        </div>

        
        <div className="w-full h-full flex items-center justify-center p-2 md:p-4">
          <svg viewBox="0 0 1000 912" preserveAspectRatio="xMidYMid meet" className="w-[90%] h-[90%] drop-shadow-[-20px_20px_40px_rgba(0,0,0,0.3)]">
            {mapData.map((state) => (
              <path
                key={state.id}
                id={state.id}
                d={state.pathD}
                onClick={() => onStateClick?.(state.id)}
                className={getPathClasses(state.id)}
              >
                <title>{state.nome}</title>
              </path>
            ))}
          </svg>
        </div>
      </main>
    </section>
  );
}