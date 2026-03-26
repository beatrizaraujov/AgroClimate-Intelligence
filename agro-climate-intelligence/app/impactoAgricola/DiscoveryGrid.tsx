'use client'; 

import { useEffect, useState } from 'react';
import { getLatestAlerts } from '../services/mapbiomas';


interface MapBiomasAlert {
  alertCode: string;
  areaHa: number;
  crossedStates: string[];
  publishedAt: string;
}

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
        
        setTimeout(() => setLoading(false), 800);
      }
    }
    loadData();
  }, []);

  
  const topPerformance = loading 
    ? [{ name: "Analisando...", score: 0, color: "bg-slate-200", text: "text-slate-400" }]
    : alerts.length > 0 
      ? [...alerts] 
          .sort((a, b) => a.areaHa - b.areaHa) 
          .slice(0, 3) 
          .map((alert: MapBiomasAlert) => ({
            name: alert.crossedStates[0] || "Preservado",
            score: Math.max(100 - Math.round(alert.areaHa / 5), 70), 
            color: "bg-emerald-500",
            text: "text-emerald-500"
          }))
      : [
          { name: "Santa Catarina", score: 98, color: "bg-emerald-500", text: "text-emerald-500" },
          { name: "Paraná", score: 95, color: "bg-emerald-500", text: "text-emerald-500" },
          { name: "Espírito Santo", score: 92, color: "bg-emerald-500", text: "text-emerald-500" },
        ];

  
  const pressureStates = loading 
    ? [{ name: "Buscando satélite...", score: 0, color: "bg-slate-200", text: "text-slate-400" }]
    : alerts.length > 0 
      ? [...alerts]
          .sort((a, b) => b.areaHa - a.areaHa) 
          .slice(0, 3)
          .map((alert: MapBiomasAlert) => ({
            name: alert.crossedStates[0] || "Área Crítica",
            score: Math.min(Math.round(alert.areaHa / 10), 60), 
            color: "bg-orange-500",
            text: "text-orange-500"
          }))
      : [
          { name: "Pará", score: 42, color: "bg-orange-500", text: "text-orange-500" },
          { name: "Mato Grosso", score: 48, color: "bg-orange-500", text: "text-orange-500" },
          { name: "Maranhão", score: 51, color: "bg-orange-500", text: "text-orange-500" },
        ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
      
      
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <img src="/check.svg" alt="" className="w-6 h-6" /> 
          <h3 className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
            Top Performance Sustentável
          </h3>
        </div>

        <div className="space-y-8 flex-1">
          {topPerformance.map((item, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center text-xs md:text-sm font-bold">
                <span className="text-slate-600">{item.name}</span>
                <span className={item.text}>{item.score}/100</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.color} transition-all duration-500`} 
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <img src="/sobPressao.svg" alt="" className="w-6 h-6" />
          <h3 className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
            Estados sob Pressão
          </h3>
        </div>

        <div className="space-y-8 flex-1">
          {pressureStates.map((item, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center text-xs md:text-sm font-bold">
                <span className="text-slate-600">{item.name}</span>
                <span className={item.text}>{item.score}/100</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.color} transition-all duration-500`} 
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    
      <div className="bg-white/50 rounded-[32px] p-8 border border-dashed border-slate-200 flex flex-col">
        <h3 className="text-base font-bold text-slate-800 mb-2">Metodologia do Score</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-10">
          Cálculo multidimensional atualizado em tempo real via satélite.
        </p>

        <div className="space-y-6 flex-1">
          <MethodItem icon="/hidrico.svg" title="Uso Hídrico" desc="Eficiência do manejo de recursos" />
          <MethodItem icon="/carbono.svg" title="Pegada de Carbono" desc="Emissão vs produtividade" />
          <MethodItem icon="/preservacao.svg" title="Preservação Ativa" desc="Índice de regeneração local" />
        </div>

        <button className="w-full mt-10 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm">
          Documentação Completa
        </button>
      </div>

    </section>
  );
}


function MethodItem({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-50">
        <img src={icon} alt="" className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs md:text-sm font-bold text-slate-700">{title}</p>
        <p className="text-[10px] md:text-xs text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
  );
}