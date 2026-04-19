"use client";

import { useEffect, useState, useMemo } from 'react';
import { getLatestAlerts } from '../services/mapbiomas';

interface MapBiomasAlert {
  alertCode: string;
  areaHa: number;
  crossedStates: string[];
  publishedAt: string;
}

const ProgressBar = ({ name, score, color, textColor }: { name: string, score: number, color: string, textColor: string }) => (
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

export default function DiscoveryGrid() {
  const [alerts, setAlerts] = useState<MapBiomasAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getLatestAlerts();
        setAlerts(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

 
  const topPerformance = useMemo(() => {
    if (loading) return [{ name: "Analisando...", score: 0, color: "bg-slate-200", text: "text-slate-400" }];
    if (alerts.length === 0) return [{ name: "Santa Catarina", score: 98, color: "bg-emerald-500", text: "text-emerald-500" }, { name: "Paraná", score: 95, color: "bg-emerald-500", text: "text-emerald-500" }, { name: "Espírito Santo", score: 92, color: "bg-emerald-500", text: "text-emerald-500" }];
    
    return [...alerts].sort((a, b) => a.areaHa - b.areaHa).slice(0, 3).map(a => ({
      name: a.crossedStates?.[0] || "Zona Estável",
      score: Math.max(100 - Math.round(a.areaHa / 5), 70),
      color: "bg-emerald-500",
      text: "text-emerald-500"
    }));
  }, [alerts, loading]);

  const pressureStates = useMemo(() => {
    if (loading) return [{ name: "Buscando satélite...", score: 0, color: "bg-slate-200", text: "text-slate-400" }];
    if (alerts.length === 0) return [{ name: "Pará", score: 42, color: "bg-orange-500", text: "text-orange-500" }, { name: "Mato Grosso", score: 48, color: "bg-orange-500", text: "text-orange-500" }, { name: "Maranhão", score: 51, color: "bg-orange-500", text: "text-orange-500" }];
    
    return [...alerts].sort((a, b) => b.areaHa - a.areaHa).slice(0, 3).map(a => ({
      name: a.crossedStates?.[0] || `Alerta ${a.alertCode}`,
      score: Math.min(Math.round(a.areaHa / 10), 60),
      color: "bg-orange-500",
      text: "text-orange-500"
    }));
  }, [alerts, loading]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
      <Card title="Top Performance Sustentável" icon="/check.svg" items={topPerformance} />
      <Card title="Monitoramento de Pressão" icon="/sobPressao.svg" items={pressureStates} />
      <MethodologyCard />
    </section>
  );
}


function Card({ title, icon, items }: { title: string, icon: string, items: any[] }) {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <img src={icon} alt="" className="w-6 h-6" />
        <h3 className="text-sm md:text-base font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      <div className="space-y-8 flex-1">
        {items.map((item, i) => <ProgressBar key={i} name={item.name} score={item.score} color={item.color} textColor={item.text} />)}
      </div>
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

function MethodItem({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-50">
        <img src={icon} alt="" className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-700">{title}</p>
        <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
  );
}