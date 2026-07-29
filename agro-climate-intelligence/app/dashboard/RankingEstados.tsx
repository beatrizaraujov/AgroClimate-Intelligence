"use client";

import { Trophy } from "lucide-react";
import type { DadosEstado } from "./types";

interface RankingEstadosProps {
  dados: DadosEstado[];
}

const formatarNumero = (valor: number) => {
  return (valor / 1_000_000).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  });
};

export default function RankingEstados({ dados }: RankingEstadosProps) {
  const maxProducao = dados.length > 0 ? dados[0].producao : 1;

  return (
    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Trophy size={18} strokeWidth={1.5} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              TOP 5 Estados Produtores
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranking por volume total
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-4 py-2">
          Visualizar por Volume
        </span>
      </div>

      <div className="space-y-6">
        {dados.map((estado, index) => {
          const largura = (estado.producao / maxProducao) * 100;
          return (
            <div key={estado.sigla} className="flex items-center gap-5">
              <span className="text-xs font-bold text-slate-300 w-5 text-center">
                {index + 1}
              </span>

              <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center font-black text-xs text-slate-600 flex-shrink-0">
                {estado.sigla}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-slate-700 block mb-2 truncate">
                  {estado.nome}
                </span>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                    style={{ width: `${largura}%` }}
                  />
                </div>
              </div>

              <div className="text-right min-w-[100px]">
                <span className="text-sm font-black text-slate-800 tabular-nums">
                  {formatarNumero(estado.producao)}M Ton
                </span>
                <span className="text-xs font-semibold text-slate-400 ml-2 tabular-nums">
                  {estado.porcentagem}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
