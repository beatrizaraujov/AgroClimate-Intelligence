"use client";

import { useMemo } from "react";
import { Loader2, TrendingUp } from "lucide-react";

interface RankingProps {
  alertas: any[];
  loading: boolean;
  estadoFocado?: string | null;
}

export default function Ranking({ alertas, loading, estadoFocado }: RankingProps) {
  const rankingData = useMemo(() => {
    if (!alertas || alertas.length === 0) return [];

    
    const stats = alertas.reduce((acc: any, curr: any) => {
      
      const uf = curr.crossedStates?.[0] || "Outros";
      
      if (!acc[uf]) {
        acc[uf] = { uf, area: 0, count: 0 };
      }
      
      acc[uf].area += Number(curr.areaHa || 0);
      acc[uf].count += 1;
      
      return acc;
    }, {});

    
    return Object.values(stats)
      .sort((a: any, b: any) => b.area - a.area)
      .slice(0, 5);
  }, [alertas]);

  
  if (loading && rankingData.length === 0) {
    return (
      <div className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-sm flex items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin text-emerald-500" size={24} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
          <TrendingUp size={18} />
        </div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
          Top Estados em Alerta
        </h3>
      </div>

      <div className="flex flex-col gap-6">
        {rankingData.length > 0 ? (
          rankingData.map((item: any, index) => {
            
            const isAtivo = estadoFocado?.includes(item.uf);

            return (
              <div key={item.uf} className={`flex items-center justify-between transition-all ${isAtivo ? "scale-105" : ""}`}>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-300 w-4">0{index + 1}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-colors ${
                    isAtivo ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-slate-50 text-slate-500"
                  }`}>
                    {item.uf}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Alertas</span>
                    <span className="text-sm font-black text-slate-700">{item.count}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Área (ha)</span>
                  <span className={`text-sm font-black ${isAtivo ? "text-emerald-600" : "text-slate-600"}`}>
                    {Math.round(item.area).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-400 text-xs italic">Nenhum dado para o filtro atual.</p>
          </div>
        )}
      </div>
    </div>
  );
}