export default function ImpactHeader() {
  return (
    <section className="md:ml-9 px-4 max-w-7xl md:mx-0 md:w-fit transition-all">
      <div className="flex items-center gap-2 pt-10 mb-2">
        <span className="text-xs uppercase text-slate-400 font-medium tracking-wider">
          visão geral
        </span>
        <span className="text-slate-300 text-xs">{">"}</span>
        <span className="text-xs uppercase text-emerald-600 font-medium tracking-wider">
          impacto nacional
        </span>
      </div>

      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-4">
          Indicador de Impacto Agrícola
        </h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed mb-10 text-sm md:text-base">
          Analise consolidada de sustentabilidade baseada em modelos de IA,
          monitorando pressão ambiental e eficiência produtiva
        </p>
      </div>

      <div className="flex items-center bg-[#F8FAFC] rounded-full p-1.5 gap-1.5 w-fit border border-slate-100">
        <button className="bg-white text-[#0F172A] rounded-full px-6 py-2.5 text-sm font-bold shadow-sm">
          2026(atual)
        </button>
        <button className="text-slate-400 text-sm rounded-full px-6 py-2.5 hover:text-slate-600 transition-colors">
          série histórica
        </button>
      </div>
    </section>
  );
}