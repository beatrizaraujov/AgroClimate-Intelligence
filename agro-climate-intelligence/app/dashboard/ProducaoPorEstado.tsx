"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  type LabelProps,
} from "recharts";
import { Sprout, TrendingUp, Droplets, Wheat } from "lucide-react";

import type { DadosEstado, HistoricoAno } from "./types";

const CORES_DONUT = ["#166534", "#15803d", "#16a34a", "#22c55e", "#4ade80", "#d6d3d1"];

const MapaIcone: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  sprout: Sprout,
  trending: TrendingUp,
  droplets: Droplets,
  wheat: Wheat,
};

interface MiniKPIItem {
  icone: string;
  variacao: string;
  label: string;
  comparacao: string;
  positiva: boolean;
}

interface ProducaoPorEstadoProps {
  producaoPorEstado: DadosEstado[];
  historico: HistoricoAno[];
  totalProducao: number;
  miniKPIs: MiniKPIItem[];
}

const formatarNumero = (valor: number) => {
  return (valor / 1_000_000).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  });
};

function DonutTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: DadosEstado }> }) {
  if (!active || !payload?.length) return null;
  const estado = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-lg">
      <p className="text-xs font-bold text-slate-700">{estado.nome}</p>
      <p className="text-xs text-slate-500 mt-0.5">
        {formatarNumero(estado.producao)}M Ton
        <span className="text-slate-400"> · {estado.porcentagem}%</span>
      </p>
    </div>
  );
}

export default function ProducaoPorEstado({
  producaoPorEstado,
  historico,
  totalProducao,
  miniKPIs,
}: ProducaoPorEstadoProps) {
  // O donut só tem 6 cores distintas: os 5 maiores produtores ganham cor própria
  // e o restante é agrupado em "Outros" (cinza) — evita repetir cor entre estados
  // sem relação, o que aconteceria se cada fatia tivesse sua própria cor em loop.
  const dadosDonut = useMemo((): DadosEstado[] => {
    if (producaoPorEstado.length <= 5) return producaoPorEstado;

    const top5 = producaoPorEstado.slice(0, 5);
    const restante = producaoPorEstado.slice(5);
    const producaoOutros = restante.reduce((acc, e) => acc + e.producao, 0);
    const porcentagemOutros = Number(
      restante.reduce((acc, e) => acc + e.porcentagem, 0).toFixed(1)
    );

    return [
      ...top5,
      {
        sigla: "outros",
        nome: `Outros ${restante.length} estados`,
        producao: producaoOutros,
        porcentagem: porcentagemOutros,
      },
    ];
  }, [producaoPorEstado]);

  return (
    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Produção por Estado</h3>
          <p className="text-xs text-slate-400 mt-1">
            Distribuição da produção por unidade federativa
          </p>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-4 py-2">
          Por volume
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 mb-10 flex-1">
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={230} height={230}>
            <PieChart>
              <Pie
                data={dadosDonut}
                dataKey="producao"
                nameKey="sigla"
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={105}
                strokeWidth={0}
              >
                {dadosDonut.map((_, index) => (
                  <Cell key={index} fill={CORES_DONUT[index]} />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900">
                {formatarNumero(totalProducao)}
              </p>
              <p className="text-[11px] font-medium text-slate-400">Ton</p>
            </div>
          </div>
        </div>

        <div className="w-full flex-1 space-y-4 sm:pt-3">
          {producaoPorEstado.slice(0, 5).map((estado, index) => (
            <div key={estado.sigla} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CORES_DONUT[index] }}
                />
                <span className="text-sm font-semibold text-slate-700">
                  {estado.nome}
                </span>
              </div>
              <div className="flex items-center gap-5">
                <span className="text-sm font-bold text-slate-800 w-20 text-right tabular-nums">
                  {formatarNumero(estado.producao)}M
                </span>
                <span className="text-xs font-semibold text-slate-400 w-10 text-right tabular-nums">
                  {estado.porcentagem}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <ResponsiveContainer width="100%" height={190}>
          <LineChart
            data={historico}
            margin={{ top: 18, right: 16, left: 16, bottom: 0 }}
          >
            <XAxis
              dataKey="ano"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
              dy={8}
            />
            <YAxis hide domain={["dataMin - 10000000", "dataMax + 10000000"]} />
            <Tooltip
              formatter={(value) => [
                `${formatarNumero(Number(value))}M Ton`,
                "Produção",
              ]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                fontSize: 12,
                padding: "8px 14px",
              }}
              labelFormatter={(ano) => `Safra ${ano}`}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 5, fill: "#16a34a", strokeWidth: 0 }}
              activeDot={{
                r: 7,
                fill: "#16a34a",
                strokeWidth: 2,
                stroke: "#fff",
              }}
            >
              <LabelList
                dataKey="valor"
                position="top"
                content={(props: LabelProps) => {
                  const { x, y, value } = props;
                  if (value === undefined || x === undefined || y === undefined) return null;
                  return (
                    <text
                      x={x}
                      y={Number(y) - 10}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={800}
                      fill="#334155"
                      className="tabular-nums"
                    >
                      {formatarNumero(Number(value))}M
                    </text>
                  );
                }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Indicadores complementares
        </span>
        <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          Exemplo
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {miniKPIs.map((kpi, index) => {
          const IconComponent = MapaIcone[kpi.icone];
          return (
            <div
              key={index}
              className="bg-slate-50/40 rounded-2xl p-4 border border-slate-100/50"
            >
              <div className="flex items-center gap-2 mb-2">
                {IconComponent && (
                  <div className={kpi.positiva ? "text-emerald-500" : "text-red-400"}>
                    <IconComponent size={14} strokeWidth={1.5} />
                  </div>
                )}
                <span
                  className={`text-xs font-bold ${
                    kpi.positiva ? "text-emerald-500" : "text-red-400"
                  }`}
                >
                  {kpi.variacao}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {kpi.label}
              </p>
              <p className="text-[10px] text-slate-300 mt-0.5">
                {kpi.comparacao}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
