"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import {
  getProducaoSoja,
  getDadosEstados,
  getHistoricoProducao,
} from "../services/ibge";

import DashboardTitle from "./DashboardTitle";
import MetricsGrid from "./MetricsGrid";
import ProducaoPorEstado from "./ProducaoPorEstado";
import InsightsRapidos from "./InsightsRapidos";
import RankingEstados from "./RankingEstados";

import type {
  DadosEstado,
  HistoricoAno,
  Insight,
  MiniKPI,
} from "./types";

interface DadosSafra {
  producaoTotal: number;
  areaTotal: number;
  variacaoProducao?: string;
  variacaoArea: string;
  culturaDominante: {
    nome: string;
    area: number;
  };
  estado: string;
  periodo: string;
}

const FALLBACK_DADOS: DadosSafra = {
  producaoTotal: 302261272,
  areaTotal: 99080548,
  variacaoProducao: "+5.2%",
  variacaoArea: "+1.3%",
  culturaDominante: {
    nome: "Soja",
    area: 48269548,
  },
  estado: "BR",
  periodo: "2026",
};

const INSIGHTS_FALLBACK: Insight[] = [
  {
    id: "1",
    icone: "alert",
    titulo: "Déficit Hídrico no Sul",
    descricao:
      "Projeção de queda de produtividade para a safra de verão nos estados do Sul devido à estiagem prolongada.",
  },
  {
    id: "2",
    icone: "trending",
    titulo: "Preços Estáveis",
    descricao:
      "Mercado de Chicago opera estável com demanda aquecida por farelo de soja e óleo vegetal.",
  },
  {
    id: "3",
    icone: "leaf",
    titulo: "Carbono Negativo",
    descricao:
      "Propriedades monitoradas apresentam balanço de carbono negativo com adoção de ILPF.",
  },
  {
    id: "4",
    icone: "award",
    titulo: "Safra Recorde",
    descricao:
      "Colheita atinge recorde histórico com 154.3M de toneladas, impulsionada pelo avanço tecnológico.",
  },
];

const MINI_KPIS_FALLBACK: MiniKPI[] = [
  {
    icone: "sprout",
    variacao: "+2.1%",
    label: "Área plantada",
    comparacao: "vs 2022",
    positiva: true,
  },
  {
    icone: "trending",
    variacao: "+3.8%",
    label: "Produtividade",
    comparacao: "média",
    positiva: true,
  },
  {
    icone: "droplets",
    variacao: "-0.5%",
    label: "Precipitação",
    comparacao: "acumulada",
    positiva: false,
  },
  {
    icone: "wheat",
    variacao: "+1.2%",
    label: "Colheita",
    comparacao: "prevista",
    positiva: true,
  },
];

function DashboardContent() {
  const searchParams = useSearchParams();
  const estadoSelecionado = searchParams.get("estado") || "BR";

  const [dadosSafra, setDadosSafra] = useState<DadosSafra | null>(null);
  const [dadosEstadosBrutos, setDadosEstadosBrutos] = useState<
    { sigla: string; nome: string; producao: number }[]
  >([]);
  const [historico, setHistorico] = useState<HistoricoAno[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setIsLoading(true);

        const [producao, estados, hist] = await Promise.all([
          getProducaoSoja(estadoSelecionado),
          getDadosEstados(),
          getHistoricoProducao(),
        ]);

        if (producao) {
          setDadosSafra({
            producaoTotal: producao.valor,
            areaTotal: 99080548,
            variacaoProducao: "+5.2%",
            variacaoArea: "+1.3%",
            culturaDominante: { nome: "Soja", area: 48269548 },
            estado: producao.estado,
            periodo: producao.periodo,
          });
        } else {
          setDadosSafra(FALLBACK_DADOS);
        }

        setDadosEstadosBrutos(estados);
        setHistorico(hist);
      } catch (error) {
        console.error("[Dashboard] Erro ao carregar dados", error);
        setDadosSafra(FALLBACK_DADOS);
      } finally {
        setIsLoading(false);
      }
    }

    carregarDados();
  }, [estadoSelecionado]);

  const producaoPorEstado = useMemo((): DadosEstado[] => {
    if (dadosEstadosBrutos.length === 0) return [];
    const total = dadosEstadosBrutos.reduce(
      (acc, e) => acc + e.producao,
      0
    );
    return dadosEstadosBrutos.map((e) => ({
      ...e,
      porcentagem: Number(((e.producao / total) * 100).toFixed(1)),
    }));
  }, [dadosEstadosBrutos]);

  const totalPorEstados = useMemo(() => {
    return dadosEstadosBrutos.reduce((acc, e) => acc + e.producao, 0);
  }, [dadosEstadosBrutos]);

  const ranking = useMemo((): DadosEstado[] => {
    return producaoPorEstado.slice(0, 5);
  }, [producaoPorEstado]);

  return (
    <main className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-8">
      <DashboardTitle />

      <MetricsGrid dados={dadosSafra} loading={isLoading} />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
        <ProducaoPorEstado
          producaoPorEstado={producaoPorEstado}
          historico={historico}
          totalProducao={
            producaoPorEstado.length > 0
              ? totalPorEstados
              : FALLBACK_DADOS.producaoTotal
          }
          miniKPIs={MINI_KPIS_FALLBACK}
        />
        <InsightsRapidos insights={INSIGHTS_FALLBACK} />
      </div>

      {ranking.length > 0 && <RankingEstados dados={ranking} />}
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <main className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2 mb-8">
        <div className="h-8 w-56 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-4 w-72 bg-slate-100 rounded-full animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-36 bg-slate-100 rounded-[20px] animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
        <div className="h-96 bg-slate-100 rounded-[20px] animate-pulse" />
        <div className="h-96 bg-slate-100 rounded-[20px] animate-pulse" />
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
