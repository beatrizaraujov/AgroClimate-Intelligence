"use client";

import { useEffect, useState } from "react";
import Header from "../components/layout/Header";

interface ImpactHeaderProps {
  onSelectEstado?: (sigla: string | null) => void;
  estadoFocado?: string | null;
}

export default function ImpactHeader({ onSelectEstado, estadoFocado }: ImpactHeaderProps) {
  const [nomeEstado, setNomeEstado] = useState<string | null>(null);

  
  useEffect(() => {
    if (estadoFocado) {
      const siglaLimpa = estadoFocado.replace("BR", "");
      const nomes: { [key: string]: string } = {
        AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas",
        BA: "Bahia", CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo",
        GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul",
        MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná",
        PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte",
        RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina",
        SP: "São Paulo", SE: "Sergipe", TO: "Tocantins"
      };
      setNomeEstado(nomes[siglaLimpa] || siglaLimpa);
    } else {
      setNomeEstado(null);
    }
  }, [estadoFocado]);

  return (
    <>
      
      <Header onSelectEstado={onSelectEstado} />

      <section className="md:ml-9 px-4 max-w-7xl md:mx-0 md:w-fit transition-all duration-500">
        
        <div className="flex items-center gap-2 pt-10 mb-2">
          <button 
            onClick={() => onSelectEstado?.(null)}
            className="text-[10px] uppercase text-slate-400 font-bold tracking-widest hover:text-emerald-600 transition-colors cursor-pointer"
          >
            visão geral
          </button>
          <span className="text-slate-300 text-xs">{">"}</span>
          <span className="text-[10px] uppercase text-emerald-600 font-bold tracking-widest animate-in fade-in slide-in-from-left-2">
            {nomeEstado ? `Impacto: ${nomeEstado}` : "impacto nacional"}
          </span>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-4">
            Indicador de Impacto Agrícola
          </h1>
          <p className="text-slate-500 max-w-2xl leading-relaxed mb-10 text-sm md:text-base border-l-2 border-emerald-500/20 pl-4">
            Análise consolidada de sustentabilidade baseada em modelos de IA,
            monitorando pressão ambiental e eficiência produtiva {nomeEstado ? `no estado do ${nomeEstado}` : "em todo o território nacional"}.
          </p>
        </div>

        <div className="flex items-center bg-[#F8FAFC] rounded-full p-1.5 gap-1.5 w-fit border border-slate-100 shadow-sm">
          <button className="bg-white text-[#0F172A] rounded-full px-6 py-2.5 text-sm font-bold shadow-sm border border-slate-200/50 active:scale-95 transition-all">
            2026 (atual)
          </button>
          <button className="text-slate-400 text-sm rounded-full px-6 py-2.5 hover:text-slate-600 hover:bg-slate-200/20 transition-all">
            série histórica
          </button>
        </div>
      </section>
    </>
  );
}