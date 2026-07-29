"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { mapData } from "../mapData";
import { SIGLA_PARA_NOME } from "../constants";

interface BrazilMapProps {
  estadoAtivo?: string | null;
  onStateClick?: (sigla: string | null) => void;
}

interface HoverInfo {
  name: string;
  x: number;
  y: number;
}

export default function BrazilMap({ estadoAtivo, onStateClick }: BrazilMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<HoverInfo | null>(null);

  const nomeEstadoAtivo = estadoAtivo
    ? SIGLA_PARA_NOME[estadoAtivo.replace(/^BR-?/, "")] || estadoAtivo
    : null;

  const getPathClasses = (id: string) => {
    const isSelected = estadoAtivo === id;
    const base = "cursor-pointer transition-all duration-500 ease-in-out stroke-[#2D7A73]";
    const active = "fill-emerald-400 stroke-[3] drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]";
    const inactive = "fill-teal-100/80 stroke-[1] md:stroke-[1.2] hover:fill-teal-50";
    return `${base} ${isSelected ? active : inactive}`;
  };

  const handlePathMouseMove = (name: string, e: React.MouseEvent<SVGPathElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({ name, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[420px] sm:h-[580px] w-full max-w-[900px]">
      <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-6 md:p-8 pb-4 md:pb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
              Mapa de Pressão Ambiental (NRT)
            </h1>
          </div>
          <span className="text-[11px] font-bold text-slate-600 mt-1 ml-4">
            {nomeEstadoAtivo ? `Foco: ${nomeEstadoAtivo}` : "Monitoramento Nacional"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[8px] font-bold text-slate-400 uppercase">Baixa</span>
          <div className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-500 h-1.5 w-20 md:w-24 rounded-full" />
          <span className="text-[8px] font-bold text-slate-400 uppercase">Alta pressão</span>
        </div>
      </header>

      <main
        ref={containerRef}
        className="bg-[#2D7A73] w-full relative overflow-hidden group flex-1 flex items-center justify-center"
      >
        {estadoAtivo && onStateClick && (
          <button
            onClick={() => onStateClick(null)}
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider transition-all"
          >
            <X size={10} strokeWidth={3} />
            Limpar seleção
          </button>
        )}

        {hover && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-lg"
            style={{ left: hover.x, top: hover.y }}
          >
            {hover.name}
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-white" />
          </div>
        )}

        <div className="w-full h-full flex items-center justify-center p-2 md:p-4">
          <svg viewBox="0 0 1000 912" preserveAspectRatio="xMidYMid meet" className="w-[90%] h-[90%] drop-shadow-[-20px_20px_40px_rgba(0,0,0,0.3)]">
            {mapData.map((state) => (
              <path
                key={state.id}
                id={state.id}
                d={state.pathD}
                onClick={() => onStateClick?.(state.id)}
                onMouseMove={(e) => handlePathMouseMove(state.name, e)}
                onMouseLeave={() => setHover(null)}
                className={getPathClasses(state.id)}
              />
            ))}
          </svg>
        </div>
      </main>
    </section>
  );
}
