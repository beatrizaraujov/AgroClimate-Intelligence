"use client";

import { useState, useEffect, useCallback } from "react";
import ImpactHeader from "./ImpactHeader";
import ImpactMetrics from "./ImpactMetrics";
import BrazilMap from "./BrazilMap";
import Ranking from "./Ranking";
import DiscoveryGrid from "./DiscoveryGrid";
import { getLatestAlerts } from "../services/mapbiomas"; 


const SIGLA_PARA_NOME: Record<string, string> = {
  "AC": "ACRE", "AL": "ALAGOAS", "AP": "AMAPÁ", "AM": "AMAZONAS",
  "BA": "BAHIA", "CE": "CEARÁ", "DF": "DISTRITO FEDERAL", "ES": "ESPÍRITO SANTO",
  "GO": "GOIÁS", "MA": "MARANHÃO", "MT": "MATO GROSSO", "MS": "MATO GROSSO DO SUL",
  "MG": "MINAS GERAIS", "PA": "PARÁ", "PB": "PARAÍBA", "PR": "PARANÁ",
  "PE": "PERNAMBUCO", "PI": "PIAUÍ", "RJ": "RIO DE JANEIRO", "RN": "RIO GRANDE DO NORTE",
  "RS": "RIO GRANDE DO SUL", "RO": "RONDÔNIA", "RR": "RORAIMA", "SC": "SANTA CATARINA",
  "SP": "SÃO PAULO", "SE": "SERGIPE", "TO": "TOCANTINS"
};

export default function ImpactoAgricolaPage() {
  const [estadoSelecionado, setEstadoSelecionado] = useState<string | null>(null);
  const [listaCompleta, setListaCompleta] = useState<any[]>([]); 
  const [dadosFiltrados, setDadosFiltrados] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  const handleSelecaoEstado = useCallback((sigla: string | null) => {
    setEstadoSelecionado(sigla);
  }, []);

  
  useEffect(() => {
    const buscarDadosIniciais = async () => {
      setIsLoading(true);
      try {
        const alerts = await getLatestAlerts();
        if (alerts && Array.isArray(alerts)) {
          setListaCompleta(alerts);
          setDadosFiltrados(alerts);
        }
      } catch (error) {
        console.error("[AgroClimate] Erro:", error);
      } finally {
        setIsLoading(false);
      }
    };
    buscarDadosIniciais();
  }, []);

  
  useEffect(() => {
    if (!listaCompleta.length) return;

    if (estadoSelecionado) {
      
      const sigla = estadoSelecionado.replace(/BR-?/, "").toUpperCase().trim();
      
      
      const nomeEstadoAlvo = SIGLA_PARA_NOME[sigla];

      const filtrados = listaCompleta.filter((item: any) => {
        
        const estadosNoAlerta = Array.isArray(item.crossedStates) ? item.crossedStates : [];
        
        
        return estadosNoAlerta.some(nome => 
          nome.toUpperCase().trim() === nomeEstadoAlvo
        );
      });

      setDadosFiltrados(filtrados);
    } else {
      setDadosFiltrados(listaCompleta); 
    }
  }, [estadoSelecionado, listaCompleta]);

  return (
    <main className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-10 animate-in fade-in duration-700">
      <ImpactHeader onSelectEstado={handleSelecaoEstado} estadoFocado={estadoSelecionado} />

      <section className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col items-stretch gap-6">
          <ImpactMetrics estadoFocado={estadoSelecionado} alertas={dadosFiltrados} loading={isLoading} /> 
          <Ranking estadoFocado={estadoSelecionado} alertas={listaCompleta} loading={isLoading} />
        </div>

        <div className="flex-1 w-full bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-6 md:p-10 shadow-sm transition-all duration-500 hover:shadow-md">
          <BrazilMap estadoAtivo={estadoSelecionado} onStateClick={handleSelecaoEstado} />
        </div>
      </section>

      <div className="pt-10 border-t border-slate-100">
        <header className="flex items-center justify-between mb-8 px-2">
          <div>
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Monitoramento em Tempo Real</h2>
            <p className="text-slate-500 text-sm">
              {estadoSelecionado ? `Exibindo alertas em: ${SIGLA_PARA_NOME[estadoSelecionado.replace(/BR-?/, "")] || estadoSelecionado}` : "Impacto Nacional"}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest leading-none">API ATIVA</span>
          </div>
        </header>

        {!isLoading && dadosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Nenhum alerta recente para este estado nos dados carregados.</p>
          </div>
        ) : (
          <DiscoveryGrid estadoFocado={estadoSelecionado} dados={dadosFiltrados} loading={isLoading} />
        )}
      </div>
    </main>
  );
}