import ImpactHeader from "./ImpactHeader";
import ImpactMetrics from "./ImpactMetrics";
import BrazilMap from "./BrazilMap";

export default function ImpactoAgricolaPage() {
  return (
    <main className="p-10 bg-slate-50 min-h-screen flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <ImpactHeader />
      </section>

      <section className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-[350px]">
          <ImpactMetrics />
        </div>

        <div className="flex-1 w-full">
          <BrazilMap />
        </div>
      </section>
    </main>
  );
}
