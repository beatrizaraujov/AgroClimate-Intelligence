"use client";

import { useMemo } from "react";
import Image from "next/image";

interface ProgressBarItem {
  name: string;
  score: number;
  color: string;
  text: string;
}

interface DadoAlerta {
  areaHa: number;
  alertCode?: string;
  crossedStates: string[];
}

const ProgressBar = ({ name, score, color, textColor }: { name: string; score: number; color: string; textColor: string }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center text-xs md:text-sm font-bold">
      <span className="text-slate-600">{name}</span>
      <span className={textColor}>{score}/100</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-500`}
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

interface DiscoveryGridProps {
  dados: DadoAlerta[];
  loading: boolean;
}

export default function DiscoveryGrid({ dados, loading }: DiscoveryGridProps) {
  const topPerformance = useMemo((): ProgressBarItem[] => {
    return [...dados]
      .sort((a, b) => a.areaHa - b.areaHa)
      .slice(0, 3)
      .map((a) => ({
        name: a.crossedStates?.[0] || "Zona Estável",
        score: Math.max(100 - Math.round(a.areaHa / 5), 70),
        color: "bg-emerald-500",
        text: "text-emerald-500",
      }));
  }, [dados]);

  const pressureStates = useMemo((): ProgressBarItem[] => {
    return [...dados]
      .sort((a, b) => b.areaHa - a.areaHa)
      .slice(0, 3)
      .map((a) => ({
        name: a.crossedStates?.[0] || `Alerta ${a.alertCode}`,
        score: Math.min(Math.round(a.areaHa / 10), 60),
        color: "bg-orange-500",
        text: "text-orange-500",
      }));
  }, [dados]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
      <Card title="Top Performance Sustentável" icon="/check.svg" items={topPerformance} loading={loading} />
      <Card title="Monitoramento de Pressão" icon="/sobPressao.svg" items={pressureStates} loading={loading} />
      <MethodologyCard />
    </section>
  );
}

function Card({
  title,
  icon,
  items,
  loading,
}: {
  title: string;
  icon: string;
  items: ProgressBarItem[];
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <Image src={icon} alt="" width={24} height={24} className="w-6 h-6" />
        <h3 className="text-sm md:text-base font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      <div className="space-y-8 flex-1">
        {loading ? (
          <CardSkeleton />
        ) : items.length > 0 ? (
          items.map((item, i) => (
            <ProgressBar key={i} name={item.name} score={item.score} color={item.color} textColor={item.text} />
          ))
        ) : (
          <CardEmptyState />
        )}
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-3 w-2/3 bg-slate-100 rounded-full animate-pulse" />
          <div className="h-2 w-full bg-slate-100 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function CardEmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center py-6">
      <p className="text-slate-400 text-xs italic text-center">Nenhum dado disponível no momento.</p>
    </div>
  );
}

function MethodologyCard() {
  return (
    <div className="bg-white/50 rounded-[32px] p-8 border border-dashed border-slate-200 flex flex-col">
      <h3 className="text-base font-bold text-slate-800 mb-2">Metodologia do Score</h3>
      <p className="text-xs text-slate-400 leading-relaxed mb-10">Cálculo multidimensional atualizado em tempo real via satélite.</p>
      <div className="space-y-6 flex-1">
        <MethodItem icon="/hidrico.svg" title="Uso Hídrico" desc="Eficiência do manejo" />
        <MethodItem icon="/carbono.svg" title="Pegada de Carbono" desc="Emissão vs produtividade" />
        <MethodItem icon="/preservacao.svg" title="Preservação Ativa" desc="Índice de regeneração" />
      </div>
    </div>
  );
}

function MethodItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-50">
        <Image src={icon} alt="" width={24} height={24} className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-700">{title}</p>
        <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
  );
}
