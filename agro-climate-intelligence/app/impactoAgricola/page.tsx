import ImpactHeader from "./ImpactHeader";
import ImpactMetrics from "./ImpactMetrics"; // O novo componente

export default function ImpactoAgricolaPage() {
  return (
    <main className="flex flex-col gap-6 p-4"> 
      <ImpactHeader />
      <ImpactMetrics /> 
    </main>
  );
}