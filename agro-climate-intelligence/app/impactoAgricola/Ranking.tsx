"use client";

import { useMemo } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { NOME_PARA_SIGLA } from "@/constants";

interface RankingItem {
  uf: string;
  sigla: string;
  area: number;
  count: number;
}

interface RankingProps {
  alertas: { areaHa: number; crossedStates: string[] }[];
  loading: boolean;
  estadoFocado?: string | null;
  onEstadoClick?: (sigla: string) => void;
}

export default function Ranking({ alertas, loading, estadoFocado, onEstadoClick }: RankingProps) {
  const siglaFocada = estadoFocado ? estadoFocado.replace(/^BR-?/, "") : null;

  const rankingData = useMemo(() => {
    if (!alertas?.length) return [];

    const stats = alertas.reduce<Record<string, RankingItem>>((acc, curr) => {
      const nome = curr.crossedStates?.[0] || "Outros";
      const sigla = NOME_PARA_SIGLA[nome.toUpperCase().trim()] || nome;
      if (!acc[sigla]) acc[sigla] = { uf: nome, sigla, area: 0, count: 0 };
      acc[sigla].area += Number(curr.areaHa || 0);
      acc[sigla].count += 1;
      return acc;
    }, {});

    return Object.values(stats)
      .sort((a, b) => b.area - a.area)
      .slice(0, 5);
  }, [alertas]);

  const maxArea = rankingData[0]?.area || 1;

  if (loading && !rankingData.length) return <LoadingState />;

  return (
    <div className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
          <TrendingUp size={18} />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
            Top Estados em Alerta
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">
            Desmatamento detectado via satélite
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {rankingData.length > 0 ? (
          rankingData.map((item, index) => (
            <RankingRow
              key={item.uf}
              item={item}
              index={index}
              isActive={siglaFocada === item.sigla}
              maxArea={maxArea}
              onClick={onEstadoClick ? () => onEstadoClick(item.sigla) : undefined}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function RankingRow({
  item,
  index,
  isActive,
  maxArea,
  onClick,
}: {
  item: RankingItem;
  index: number;
  isActive?: boolean;
  maxArea: number;
  onClick?: () => void;
}) {
  const barPercent = Math.max((item.area / maxArea) * 100, 4);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex flex-col gap-1.5 p-3 rounded-2xl transition-all duration-200 ${
        isActive
          ? "bg-emerald-50 border border-emerald-100"
          : "hover:bg-slate-50 border border-transparent"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xs font-bold text-slate-300 w-4 flex-shrink-0">{index + 1}</span>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] transition-colors flex-shrink-0 ${
              isActive
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {item.sigla.length <= 2 ? item.sigla : item.sigla.slice(0, 2)}
          </div>
          <span className="text-xs font-semibold text-slate-600 truncate">{item.uf}</span>
        </div>

        <div className="text-right flex-shrink-0">
          <span className={`text-xs font-black ${isActive ? "text-emerald-600" : "text-slate-600"}`}>
            {Math.round(item.area).toLocaleString("pt-BR")} ha
          </span>
          <span className="text-[10px] text-slate-400 block">{item.count} alertas</span>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-7">
        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isActive ? "bg-emerald-500" : "bg-slate-300"
            }`}
            style={{ width: `${barPercent}%` }}
          />
        </div>
      </div>
    </button>
  );
}

function LoadingState() {
  return (
    <div className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-sm flex items-center justify-center min-h-[300px]">
      <Loader2 className="animate-spin text-emerald-500" size={24} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-10">
      <p className="text-slate-400 text-xs italic">Nenhum dado disponível.</p>
    </div>
  );
}
