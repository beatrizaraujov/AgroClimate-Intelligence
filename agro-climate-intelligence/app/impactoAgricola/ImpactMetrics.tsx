export default function ImpactMetrics() {
  return (
    <section className="px-4 md:px-0 md:w-fit md:ml-12 transition-all">
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col items-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
          Score de Impacto Nacional
        </span>
        <div className="relative flex items-center justify-center">
          <svg className="w-52 h-52 transform -rotate-90">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            <circle
              cx="104" cy="104" r="90"
              stroke="currentColor" strokeWidth="12"
              fill="transparent" className="text-slate-100"
            />
            <circle
              cx="104" cy="104" r="90"
              stroke="url(#scoreGradient)" strokeWidth="12"
              fill="transparent"
              strokeDasharray="565"
              strokeDashoffset="141"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-6xl font-bold text-[#111827]">74</span>
            <span className="mt-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase">
              Sustentável
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-10 w-full">
          <div className="bg-slate-50/50 p-4 rounded-2xl flex flex-col items-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase mb-2">
              Variação Mensal
            </span>
            <span className="text-orange-500 font-bold flex items-center gap-1.5 text-sm">
              <img src="/metrics.svg" alt="Metrics" className="w-3.5 h-3.5" />
              +2.4%
            </span>
          </div>
          <div className="bg-slate-50/50 p-4 rounded-2xl flex flex-col items-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase mb-2">
              Confiança
            </span>
            <span className="text-emerald-500 font-bold flex items-center gap-1.5 text-sm">
              <img src="/confidence.svg" alt="Confidence" className="w-3.5 h-3.5" />
              98.2%
            </span>
          </div>
          
        </div>
      </div>
    </section>
  );
}