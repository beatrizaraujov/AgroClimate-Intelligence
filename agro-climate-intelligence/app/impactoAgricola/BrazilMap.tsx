import { mapData } from "../mapData";

export default function BrazilMaps() {
  return (
    <section className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-6 md:p-8 pb-4 md:pb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <h1 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
            Mapa de Pressão Ambiental (NRT)
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-bold text-slate-400 uppercase">Baixa</span>
          <div className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-500 h-1.5 w-20 md:w-24 rounded-full" />
          <span className="text-[8px] font-bold text-slate-400 uppercase">Alta</span>
        </div>
      </div>

      
      <div className="bg-[#2D7A73] w-full flex-grow flex items-center justify-center relative overflow-hidden group min-h-[400px]">
        
        
        <div className="absolute top-6 left-6 z-10 max-w-[200px] md:max-w-[240px] bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl transition-transform hover:scale-105">
          <div className="flex gap-3">
            <div className="bg-orange-500/20 p-2 rounded-lg h-fit">
              <span className="text-orange-500 text-xs">⚠️</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-bold text-teal-200 uppercase tracking-tighter">Área em Alerta</span>
              <h2 className="text-white text-xs font-bold leading-tight">Arco do Desmatamento</h2>
              <p className="text-[9px] text-teal-100/60 leading-normal mt-1">
                Pressão detectada em 1.2k hectares via Sentinel-2 nas últimas 48h.
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[8px] font-black text-orange-400 uppercase">Risco Crítico</span>
                <span className="text-[7px] text-white/30 font-mono italic">ID: #4421</span>
              </div>
            </div>
          </div>
        </div>

        
        <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
          <button className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-slate-600 shadow-lg hover:bg-white transition-all active:scale-95 font-bold">+</button>
          <button className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-slate-600 shadow-lg hover:bg-white transition-all active:scale-95 font-bold">-</button>
        </div>

        
        <div className="w-full h-full flex items-center justify-center p-10 md:p-14">
          <svg 
            viewBox="0 0 1000 912" 
            className="w-full h-full drop-shadow-[-20px_20px_40px_rgba(0,0,0,0.3)]"
          >
            {mapData.map((state) => (
              <path
                key={state.id}
                id={state.id}
                d={state.pathD}
                className="fill-teal-100/80 stroke-[#2D7A73] stroke-[1.2] hover:fill-emerald-400 cursor-pointer transition-all duration-300"
              />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}