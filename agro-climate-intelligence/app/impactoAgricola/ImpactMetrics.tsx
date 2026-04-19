"use client";

import { useMemo } from "react";
import { ShieldCheck, AlertCircle, Loader2, TriangleAlert } from "lucide-react";

interface ImpactMetricsProps {
  estadoFocado?: string | null;
  alertas: any[];
  loading: boolean;
}

const STATUS_CONFIG = {
  sustentavel: { color: "bg-emerald-50 text-emerald-600", icon: ShieldCheck },
  alerta: { color: "bg-orange-50 text-orange-600", icon: AlertCircle },
  critico: { color: "bg-red-600 text-white shadow-lg shadow-red-200", icon: TriangleAlert },
  vazio: { color: "bg-slate-100 text-slate-500", icon: null }
};

export default function ImpactMetrics({ estadoFocado, alertas = [], loading }: ImpactMetricsProps) {
  
  const stats = useMemo(() => {
    if (!alertas?.length) return { score: 100, areaTotal: "0", status: "Preservado", numAlertas: 0, areaMedia: "0", isCritical: false };

    const areaTotalBruta = alertas.reduce((acc, curr) => acc + (Number(curr.areaHa) || 0), 0);
    const numAlertas = alertas.length;
    
    const penalty = (numAlertas * 0.5) + (Math.sqrt(areaTotalBruta) * 0.8);
    const score = Math.max(0, Math.min(100, 100 - penalty));
    
    return {
      score: Math.round(score),
      areaTotal: areaTotalBruta.toLocaleString('pt-BR', { maximumFractionDigits: 1 }),
      areaMedia: (areaTotalBruta / numAlertas).toLocaleString('pt-BR', { maximumFractionDigits: 1 }),
      status: score > 75 ? "Sustentável" : score > 40 ? "Em Alerta" : "Crítico",
      numAlertas,
      isCritical: score <= 40
    };
  }, [alertas]);

  const statusKey = alertas.length === 0 ? "vazio" : stats.score > 75 ? "sustentavel" : stats.score > 40 ? "alerta" : "critico";
  const { color: statusColor, icon: StatusIcon } = STATUS_CONFIG[statusKey];

  return (
    <section className="w-full transition-all relative">
      {loading && <LoadingOverlay />}

      <div className={`bg-white rounded-[40px] p-8 shadow-sm border transition-all duration-500 flex flex-col items-center ${stats.isCritical ? "border-red-100" : "border-slate-50"}`}>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">
          {estadoFocado ? `Análise: ${estadoFocado.replace(/BR-?/, "")}` : "Impacto Nacional"}
        </span>
        
        <ScoreRing score={stats.score} color={stats.score > 75 ? "#10b981" : stats.score > 40 ? "#f97316" : "#ef4444"} />
        
        <div className={`mt-6 px-4 py-1.5 flex items-center gap-1.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusColor}`}>
          {StatusIcon && <StatusIcon size={12} strokeWidth={3} />}
          {stats.status}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-10 w-full">
          <MetricCard label="Área sob Alerta" value={stats.areaTotal} unit="ha" />
          <MetricCard label="Média por Alerta" value={stats.areaMedia} unit="ha" />
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, unit }: { label: string, value: string, unit: string }) {
  return (
    <div className="bg-slate-50/40 p-4 rounded-[24px] flex flex-col items-center border border-slate-100/50">
      <span className="text-[9px] font-bold text-slate-400 uppercase mb-2 text-center leading-tight">{label.replace(" ", "\n")}</span>
      <span className="font-black text-sm text-slate-700">{value} <span className="text-[10px] text-slate-400">{unit}</span></span>
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-[2px] rounded-[40px] flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
    </div>
  );
}

function ScoreRing({ score, color }: { score: number, color: string }) {
  
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-48 w-48 flex items-center justify-center">
      <svg viewBox="0 0 210 210" className="w-full h-full transform -rotate-90">
        <circle cx="105" cy="105" r={radius} strokeWidth="12" fill="transparent" className="text-slate-100" stroke="currentColor" />
        <circle 
          cx="105" cy="105" r={radius} 
          strokeWidth="12" 
          fill="transparent" 
          stroke={color}
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
          className="transition-all duration-1000 ease-out" 
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-slate-800">{score}</span>
      </div>
    </div>
  );
}