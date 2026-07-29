import { Sprout, MapPin, Leaf, Calendar } from "lucide-react";

interface SafraData {
  producaoTotal: number;
  areaTotal: number;
  variacaoProducao?: string;
  variacaoArea?: string;
  culturaDominante: {
    nome: string;
    area: number;
  };
}

interface MetricsGridProps {
  dados: SafraData | null;
  loading?: boolean;
}

const formatarValor = (valor?: number) => {
  if (valor === undefined || valor === null || isNaN(valor)) return "0.0";
  return (valor / 1_000_000).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  });
};

interface CardStyle {
  bg: string;
  text: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

const ESTILOS_ICONES: CardStyle[] = [
  { bg: "bg-emerald-100", text: "text-emerald-600", Icon: Sprout },
  { bg: "bg-sky-100", text: "text-sky-600", Icon: MapPin },
  { bg: "bg-orange-100", text: "text-orange-600", Icon: Leaf },
  { bg: "bg-teal-100", text: "text-teal-600", Icon: Calendar },
];

export default function MetricsGrid({ dados, loading }: MetricsGridProps) {
  const metricas = [
    {
      titulo: "PRODUÇÃO TOTAL",
      valor: loading ? "..." : `${formatarValor(dados?.producaoTotal)}M Ton`,
      variacao: dados?.variacaoProducao || null,
      desc: "Estimativa do período mais recente",
      estimado: false,
    },
    {
      titulo: "ÁREA TOTAL PLANTADA",
      valor: loading ? "..." : `${formatarValor(dados?.areaTotal)}M ha`,
      variacao: dados?.variacaoArea || null,
      desc: "Crescimento vs período anterior",
      estimado: true,
    },
    {
      titulo: "CULTURA DOMINANTE",
      valor: loading ? "..." : dados?.culturaDominante.nome || "Soja",
      variacao: null,
      desc: `${formatarValor(dados?.culturaDominante.area)}M ha ocupados`,
      estimado: true,
    },
    {
      titulo: "STATUS DA SAFRA",
      valor: loading ? "..." : "Em Campo",
      variacao: null,
      desc: "Safra atual",
      estimado: true,
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricas.map((item, index) => {
        const { bg, text, Icon } = ESTILOS_ICONES[index];
        return (
          <div
            key={index}
            className="bg-white p-7 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden"
          >
            <div className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl ${bg} ${text}`}>
              <Icon size={20} strokeWidth={1.5} />
            </div>

            <div className="flex items-center gap-1.5">
              <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                {item.titulo}
              </h3>
              {item.estimado && (
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                  Estimado
                </span>
              )}
            </div>

            {loading ? (
              <div className="h-9 w-28 bg-slate-100 rounded-lg animate-pulse mt-3" />
            ) : (
              <p className="text-3xl font-black text-slate-900 mt-3 leading-tight">
                {item.valor}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2">
              {item.variacao && (
                <span className="text-emerald-500 text-xs font-bold">
                  {item.variacao}
                </span>
              )}
              <p className="text-slate-400 text-[11px]">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
