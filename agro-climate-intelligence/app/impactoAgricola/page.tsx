"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import ImpactMetrics from "./ImpactMetrics";
import BrazilMap from "./BrazilMap";
import Ranking from "./Ranking";
import DiscoveryGrid from "./DiscoveryGrid";
import { getLatestAlerts } from "@/services/mapbiomas";
import { SIGLA_PARA_NOME } from "@/constants";

interface AlertaMapBiomas {
  id?: string;
  alertCode?: string;
  areaHa: number;
  crossedStates: string[];
  publishedAt?: string;
}

function ImpactoAgricolaContent() {
  const [listaCompleta, setListaCompleta] = useState<AlertaMapBiomas[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const estadoUrl = searchParams.get("estado");

  const estadoSelecionado = useMemo(
    () => (estadoUrl ? `BR${estadoUrl.toUpperCase()}` : null),
    [estadoUrl]
  );

  const nomeEstadoSelecionado = useMemo(() => {
    if (!estadoSelecionado) return null;
    const sigla = estadoSelecionado.replace(/BR-?/, "");
    return SIGLA_PARA_NOME[sigla] || sigla;
  }, [estadoSelecionado]);

  const handleStateClick = useCallback(
    (sigla: string | null) => {
      if (sigla) {
        const raw = sigla.replace(/^BR-?/, "");
        router.push(`/impactoAgricola?estado=${raw}`);
      } else {
        router.push("/impactoAgricola");
      }
    },
    [router]
  );

  useEffect(() => {
    const buscarDadosIniciais = async () => {
      setIsLoading(true);
      try {
        const alerts = await getLatestAlerts();
        if (alerts && Array.isArray(alerts)) {
          setListaCompleta(alerts);
        }
      } catch (error) {
        console.error("[AgroClimate] Erro:", error);
      } finally {
        setIsLoading(false);
      }
    };
    buscarDadosIniciais();
  }, []);

  const dadosFiltrados = useMemo(() => {
    if (!listaCompleta.length || !estadoSelecionado) return listaCompleta;
    const sigla = estadoSelecionado.replace(/BR-?/, "").toUpperCase().trim();
    const nomeEstadoAlvo = SIGLA_PARA_NOME[sigla];
    return listaCompleta.filter((item) => {
      const estadosNoAlerta = Array.isArray(item.crossedStates) ? item.crossedStates : [];
      return estadosNoAlerta.some(
        (nome: string) => nome.toUpperCase().trim() === nomeEstadoAlvo
      );
    });
  }, [estadoSelecionado, listaCompleta]);

  return (
    <main className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-10 animate-in fade-in duration-700">
      <section className="flex flex-col gap-2 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            Visão Geral
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Indicador de Impacto Agrícola
          </h1>
          {nomeEstadoSelecionado && (
            <button
              onClick={() => handleStateClick(null)}
              className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors"
            >
              {nomeEstadoSelecionado}
              <X size={10} strokeWidth={3} />
            </button>
          )}
        </div>
        <p className="text-slate-500 text-sm md:text-base max-w-3xl leading-relaxed">
          Análise consolidada de sustentabilidade que cruza alertas de desmatamento via satélite
          com dados oficiais de produção agrícola, monitorando pressão ambiental e eficiência
          produtiva em todo o território nacional.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12 items-start">
        <div className="flex flex-col gap-6">
          <ImpactMetrics estadoFocado={estadoSelecionado} alertas={dadosFiltrados} loading={isLoading} />
          <Ranking
            estadoFocado={estadoSelecionado}
            alertas={listaCompleta}
            loading={isLoading}
            onEstadoClick={(sigla) => handleStateClick(`BR${sigla}`)}
          />
        </div>

        <div className="w-full h-full min-h-[500px] flex items-start justify-center">
          <BrazilMap estadoAtivo={estadoSelecionado} onStateClick={handleStateClick} />
        </div>
      </section>

      <div className="pt-10 border-t border-slate-100">
        <header className="flex items-center justify-between flex-wrap gap-3 mb-8 px-2">
          <div>
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
              Monitoramento em Tempo Real
            </h2>
            <p className="text-slate-500 text-sm">
              {nomeEstadoSelecionado ? `Exibindo alertas em: ${nomeEstadoSelecionado}` : "Impacto Nacional"}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest leading-none">
              Monitoramento Contínuo
            </span>
          </div>
        </header>

        <DiscoveryGrid dados={dadosFiltrados} loading={isLoading} />
      </div>
    </main>
  );
}

function ImpactoSkeleton() {
  return (
    <main className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-10">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-8">
        <div className="h-3 w-24 bg-slate-100 rounded-full animate-pulse" />
        <div className="h-10 w-80 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-4 w-96 bg-slate-100 rounded-full animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12">
        <div className="flex flex-col gap-6">
          <div className="h-72 w-full bg-slate-100 rounded-[40px] animate-pulse" />
          <div className="h-64 w-full bg-slate-100 rounded-[40px] animate-pulse" />
        </div>
        <div className="h-[420px] sm:h-[580px] w-full bg-slate-100 rounded-[32px] animate-pulse" />
      </div>
    </main>
  );
}

export default function ImpactoAgricolaPage() {
  return (
    <Suspense fallback={<ImpactoSkeleton />}>
      <ImpactoAgricolaContent />
    </Suspense>
  );
}
