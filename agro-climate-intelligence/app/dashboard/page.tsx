"use client"; 
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getProducaoSoja } from "../services/ibge"; 
import DashboardTitle from "./DashboardTitle";
import MetricsGrid from "./MetricsGrid";

function DashboardContent() {
  const searchParams = useSearchParams();
  const estadoUrl = searchParams.get("estado") || "BR"; 

 
  const [producao, setProducao] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      setIsLoading(true); 
      
      const resultado = await getProducaoSoja(estadoUrl);
      
      if (resultado) {
        setProducao(resultado.valor); 
      }
      
      setIsLoading(false); 
    }

    carregarDados();
  }, [estadoUrl]); 

  return (
    <main className="p-8 flex flex-col gap-8">
      <DashboardTitle />
     
      <MetricsGrid producao={producao} loading={isLoading} />
    </main>
  );
}


export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Carregando Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}