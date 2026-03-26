import ImpactHeader from "./ImpactHeader";
import ImpactMetrics from "./ImpactMetrics";
import BrazilMap from "./BrazilMap";
import Ranking from "./Ranking";
import DiscoveryGrid from "./DiscoveryGrid"; 

export default function ImpactoAgricolaPage() {
  return (
    <main className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-10">
      
      <ImpactHeader />

      <section className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
        
        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col items-stretch gap-6">
          <ImpactMetrics /> 
          <Ranking />
        </div>

        <div className="flex-1 w-full">
          <BrazilMap />
        </div>

      </section>

      <DiscoveryGrid />

    </main>
  );
}