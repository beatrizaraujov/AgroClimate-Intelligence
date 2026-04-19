import Image from "next/image";

interface MetricsGridProps {
  producao?: string; 
  loading?: boolean; 
}

export default function MetricsGrid({ producao, loading }: MetricsGridProps) {
  
  
  const metricas = [
    { 
      titulo: "PRODUÇÃO TOTAL", 
      valor: loading ? "..." : (producao ? `${producao}M Ton` : "154.3M Ton"), 
      variacao: "+5.2%", 
      desc: "2023", 
      icone: "/producaototal.svg" 
    },
    { 
      titulo: "ESTADO LÍDER", 
      valor: "Mato Grosso", 
      variacao: null, 
      desc: "Estável",
      icone: "/estadolider.svg"
    },
    { 
      titulo: "CULTURA DOMINANTE", 
      valor: "Soja", 
      desc: "Área plantada",
      icone: "/culturadominante.svg"
    },
    { 
      titulo: "IMPACTO AMBIENTAL", 
      valor: "Baixo (A+)", 
      desc: "Em CO2",
      icone: "/impactoambiental.svg"
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricas.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          
          <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50">
            <Image 
              src={item.icone} 
              alt={item.titulo} 
              width={24} 
              height={24} 
            />
          </div>

          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{item.titulo}</h3>
          
          
          <p className={`text-2xl font-black text-slate-900 mt-2 ${loading ? "animate-pulse text-slate-300" : ""}`}>
            {item.valor}
          </p>
          
          <div className="flex items-center gap-2 mt-1">
            {item.variacao && (
              <span className="text-emerald-500 text-xs font-bold">{item.variacao}</span>
            )}
            <p className="text-slate-400 text-[11px]">{item.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
}