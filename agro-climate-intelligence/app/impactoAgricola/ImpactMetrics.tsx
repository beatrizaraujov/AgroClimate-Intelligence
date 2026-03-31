"use client";

import { useMemo } from "react";
import { ShieldCheck, AlertCircle, Loader2, TriangleAlert } from "lucide-react";

interface ImpactMetricsProps {
  estadoFocado?: string | null;
  alertas: any[];
  loading: boolean;
}

export default function ImpactMetrics({ estadoFocado, alertas = [], loading }: ImpactMetricsProps) {
  
  const stats = useMemo(() => {
   
    if (!alertas || alertas.length === 0) {
      return { 
        score: 0, 
        areaTotal: "0", 
        status: "Preservado", 
        numAlertas: 0,
        areaMedia: "0",
        isCritical: false
      };
    }

   
    const areaTotalBruta = alertas.reduce((acc, curr) => acc + (Number(curr.areaHa) || 0), 0);
    
   
    const numAlertas = alertas.length;
    const areaMediaCalculada = areaTotalBruta / numAlertas;

    
    const impactoQuantidade = numAlertas * 1.5; 
    
    const impactoExtensao = Math.sqrt(areaTotalBruta) * 2.0; 
    
    let scoreCalculado = 100 - (impactoQuantidade + impactoExtensao);

    
    scoreCalculado = Math.max(5, Math.min(98, scoreCalculado));

    return {
      score: Math.round(scoreCalculado),
      areaTotal: areaTotalBruta.toLocaleString('pt-BR', { maximumFractionDigits: 1 }),
      areaMedia: areaMediaCalculada.toLocaleString('pt-BR', { maximumFractionDigits: 1 }),
      status: scoreCalculado > 75 ? "Sustentável" : scoreCalculado > 45 ? "Em Alerta" : "Crítico",
      numAlertas: numAlertas,
      isCritical: scoreCalculado <= 45
    };
  }, [alertas]);

  
  const siglaExibicao = estadoFocado?.replace(/BR-?/, "").toUpperCase() || null;

  
  const totalDash = 565; 
  const strokeDashoffset = totalDash - (totalDash * stats.score) / 100;

  return (
    <section className="w-full transition-all relative">
      
      {loading && (
        <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-[2px] rounded-[40px] flex items-center justify-center">
          <Loader2 className="animate-spin text-emerald-500" size={32} />
        </div>
      )}

      <div className={`bg-white rounded-[40px] p-8 shadow-sm border transition-all duration-500 flex flex-col items-center ${
        stats.isCritical ? "border-red-100 shadow-red-50/50" : "border-slate-50"
      }`}>
        
        
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-12 text-center">
          {estadoFocado ? `Análise Regional: ${siglaExibicao}` : "Impacto Nacional (Tempo Real)"}
        </span>
        
        
        <div className="relative flex items-center justify-center h-52 w-52">
          {stats.isCritical && (
            <div className="absolute inset-0 rounded-full bg-red-50 animate-ping opacity-20" />
          )}

          <svg viewBox="0 0 208 208" className="w-full h-full transform -rotate-90 relative z-10">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={stats.score < 10 ? "#CBD5E1" : stats.score < 45 ? "#EF4444" : stats.score < 75 ? "#F97316" : "#10B981"} />
                <stop offset="100%" stopColor={stats.score < 10 ? "#94A3B8" : stats.score < 45 ? "#B91C1C" : "#34D399"} />
              </linearGradient>
            </defs>
            
            <circle cx="104" cy="104" r="90" strokeWidth="14" fill="transparent" className="text-slate-50" stroke="currentColor" />
            
            <circle
              cx="104" cy="104" r="90"
              stroke="url(#scoreGradient)"
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={totalDash}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>

          
          <div className="absolute flex flex-col items-center z-20">
            <span className={`text-6xl font-black tracking-tighter transition-colors duration-500 ${
              stats.score === 0 ? "text-slate-300" : stats.isCritical ? "text-red-600" : "text-[#0F172A]"
            }`}>
              {stats.score}
            </span>
            <div className={`mt-3 px-4 py-1.5 flex items-center gap-1.5 text-[10px] font-bold rounded-full uppercase tracking-wider transition-all ${
              stats.score === 0 ? "bg-slate-100 text-slate-500" :
              stats.score > 75 ? "bg-emerald-50 text-emerald-600" : 
              stats.score > 45 ? "bg-orange-50 text-orange-600" : 
              "bg-red-600 text-white shadow-lg shadow-red-200"
            }`}>
              {stats.score === 0 ? null : stats.score > 75 ? <ShieldCheck size={12} strokeWidth={3} /> : 
               stats.score > 45 ? <AlertCircle size={12} strokeWidth={3} /> : 
               <TriangleAlert size={12} strokeWidth={3} />}
              {stats.status}
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-2 gap-4 mt-12 w-full">
          <div className="bg-slate-50/40 p-5 rounded-[24px] flex flex-col items-center border border-slate-100/50">
            <span className="text-[9px] font-bold text-slate-400 uppercase mb-3 tracking-widest text-center leading-tight">
              Área sob<br/>Alerta
            </span>
            <span className="font-black text-base text-slate-700 text-center">
              {stats.areaTotal} <span className="text-[10px] font-medium text-slate-400">ha</span>
            </span>
          </div>

          <div className="bg-slate-50/40 p-5 rounded-[24px] flex flex-col items-center border border-slate-100/50">
            <span className="text-[9px] font-bold text-slate-400 uppercase mb-3 tracking-widest text-center leading-tight">
              Média por<br/>Alerta
            </span>
            <div className="flex items-center gap-2">
              <span className={`font-black text-base ${stats.score === 0 ? "text-slate-400" : stats.isCritical ? "text-red-600" : "text-emerald-600"}`}>
                {stats.areaMedia} <span className="text-[10px] font-medium text-slate-400">ha</span>
              </span>
            </div>
          </div>
        </div>

        
        <div className="mt-6 flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${stats.score === 0 ? "bg-slate-300" : "animate-pulse " + (stats.isCritical ? "bg-red-500" : "bg-emerald-500")}`} />
          <span className="text-[10px] font-medium text-slate-400">
            {stats.numAlertas} registros analisados agora
          </span>
        </div>
      </div>
    </section>
  );
}