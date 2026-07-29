"use client";

import { Zap, AlertTriangle, TrendingUp, Leaf, Award } from "lucide-react";
import type { Insight } from "./types";

const MapaIcone: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  alert: AlertTriangle,
  trending: TrendingUp,
  leaf: Leaf,
  award: Award,
};

interface InsightsRapidosProps {
  insights: Insight[];
}

export default function InsightsRapidos({ insights }: InsightsRapidosProps) {
  return (
    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
          <Zap size={18} strokeWidth={1.5} className="text-amber-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">Insights Rápidos</h3>
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Exemplo
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Destaques ilustrativos do panorama agroclimático
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-0">
        {insights.map((insight, index) => {
          const IconComponent = MapaIcone[insight.icone];
          return (
            <div key={insight.id}>
              <div className="flex gap-4 py-5">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {IconComponent && (
                    <IconComponent size={18} strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 leading-snug">
                    {insight.titulo}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {insight.descricao}
                  </p>
                </div>
              </div>
              {index < insights.length - 1 && (
                <hr className="border-t border-slate-100" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
