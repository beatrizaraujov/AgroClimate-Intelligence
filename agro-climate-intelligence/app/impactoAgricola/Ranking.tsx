export default function Ranking() {
  return (
    <section className="bg-[#020617] rounded-[32px] p-8 shadow-xl relative overflow-hidden w-full min-w-full">
      {/* SVG de Fundo */}
      <img 
        src="/ia-preditiva.svg" 
        alt="" 
        className="absolute bottom-0 right-0 opacity-20 pointer-events-none" 
      />

      <div className="flex flex-col gap-6 relative z-10 text-left">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
            <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" fill="currentColor" />
          </svg>
          <h2 className="uppercase text-[10px] tracking-[0.2em] font-bold text-emerald-400">
            Inteligência Preditiva
          </h2>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          Detectamos anomalias térmicas crescentes no bioma <span className="text-white font-semibold">Cerrado</span>. 
          A probabilidade de pressão crítica por estresse hídrico aumentou para 
          <span className="text-white font-bold ml-1">65% nos próximos 30 dias.</span>
        </p>

        <button className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest hover:text-emerald-300 transition-all group/btn">
          Analisar Risco 
          <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </section>
  );
}