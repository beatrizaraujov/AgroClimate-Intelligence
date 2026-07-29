import Image from "next/image";

const FONTES = [
  {
    icon: "/sobPressao.svg",
    titulo: "MapBiomas Alerta",
    descricao:
      "Rede de monitoramento por satélite que identifica supressões de vegetação nativa em tempo quase real, cruzando cada polígono detectado com os limites estaduais.",
  },
  {
    icon: "/producaototal.svg",
    titulo: "IBGE — Produção Agrícola",
    descricao:
      "Séries históricas de área plantada, produtividade e volume de produção por estado, usadas para contextualizar o impacto ambiental com o desempenho produtivo.",
  },
];

const PILARES = [
  {
    icon: "/hidrico.svg",
    titulo: "Uso Hídrico",
    descricao: "Eficiência do manejo de água em relação à área produtiva monitorada.",
  },
  {
    icon: "/carbono.svg",
    titulo: "Pegada de Carbono",
    descricao: "Relação entre emissões estimadas e produtividade agrícola do período.",
  },
  {
    icon: "/preservacao.svg",
    titulo: "Preservação Ativa",
    descricao: "Índice de regeneração e conservação de áreas nativas dentro da propriedade.",
  },
];

const STATUS = [
  { label: "Sustentável", faixa: "76 – 100", color: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Em Alerta", faixa: "41 – 75", color: "bg-orange-500", text: "text-orange-600", bg: "bg-orange-50" },
  { label: "Crítico", faixa: "0 – 40", color: "bg-red-500", text: "text-red-600", bg: "bg-red-50" },
];

export default function MetodologiaPage() {
  return (
    <main className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-12 md:gap-16 animate-in fade-in duration-700">
      <section className="flex flex-col gap-2 border-b border-slate-100 pb-8">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            Documentação
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Metodologia
        </h1>
        <p className="text-slate-500 text-sm md:text-base max-w-3xl leading-relaxed">
          Entenda de onde vêm os dados, como o Índice de Sustentabilidade é calculado e com
          qual frequência as informações da plataforma são atualizadas.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <SectionTitle
          eyebrow="Dados"
          titulo="Fontes de Dados"
          descricao="Cruzamos monitoramento por satélite com estatísticas oficiais de produção agrícola."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FONTES.map((fonte) => (
            <div
              key={fonte.titulo}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 flex flex-col gap-4"
            >
              <div className="p-3 bg-slate-50 rounded-2xl w-fit">
                <Image src={fonte.icon} alt="" width={28} height={28} className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">
                {fonte.titulo}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{fonte.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionTitle
          eyebrow="Score"
          titulo="Como o Índice de Sustentabilidade é calculado"
          descricao="Uma nota de 0 a 100 combina três pilares ambientais com o volume e a intensidade dos alertas registrados na região."
        />

        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-slate-50 flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILARES.map((pilar) => (
              <div key={pilar.titulo} className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-50 shrink-0">
                  <Image src={pilar.icon} alt="" width={24} height={24} className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{pilar.titulo}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">{pilar.descricao}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col lg:flex-row gap-8 lg:items-center">
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Fórmula simplificada
              </p>
              <code className="block bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs md:text-sm text-slate-600 font-mono leading-relaxed overflow-x-auto">
                score = 100 − (nº de alertas × 0.5 + √área_total_ha × 0.8)
              </code>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Quanto mais alertas ativos e maior a área total afetada em uma região, maior a
                penalidade aplicada — a raiz quadrada evita que um único evento muito grande
                distorça o índice.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-56 shrink-0">
              {STATUS.map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl ${s.bg}`}
                >
                  <span className={`flex items-center gap-2 text-xs font-bold ${s.text}`}>
                    <span className={`w-2 h-2 rounded-full ${s.color}`} />
                    {s.label}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">{s.faixa}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <SectionTitle
            eyebrow="Roadmap"
            titulo="Próximos passos: análise preditiva"
            descricao="A versão atual mostra um retrato do momento presente. O próximo passo é projetar tendências a partir do histórico de alertas e das séries de produção."
          />
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full whitespace-nowrap">
            Planejado — ainda não implementado
          </span>
        </div>
        <div className="bg-white/50 rounded-[32px] p-8 border border-dashed border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-50 shrink-0">
              <Image src="/ia-preditiva.svg" alt="" width={28} height={28} className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Projeção de tendência</p>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Cruzar a série histórica de produção com o volume recente de alertas para estimar
                se a pressão ambiental de uma região está subindo ou recuando.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-50 shrink-0">
              <Image src="/confidence.svg" alt="" width={28} height={28} className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Nível de confiança</p>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Projeções em estados com poucos registros receberiam menor confiança e seriam
                sinalizadas como preliminares até haver dados suficientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 pb-4">
        <SectionTitle eyebrow="Transparência" titulo="Atualização e Limitações" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 flex flex-col gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest leading-none">
                Atualização contínua
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Os alertas do MapBiomas são revalidados a cada 5 minutos. Os dados de produção do
              IBGE seguem o calendário oficial de divulgação de cada levantamento.
            </p>
          </div>

          <div className="bg-white/50 rounded-[32px] p-8 border border-dashed border-slate-200 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800">Limitações conhecidas</h3>
            <ul className="text-sm text-slate-500 leading-relaxed list-disc pl-4 space-y-2">
              <li>Alertas por satélite podem sofrer atraso em dias de alta cobertura de nuvens.</li>
              <li>O índice é um indicador comparativo, não uma certificação ambiental oficial.</li>
              <li>Estados com baixo volume histórico de dados têm projeções menos precisas.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionTitle({
  eyebrow,
  titulo,
  descricao,
}: {
  eyebrow: string;
  titulo: string;
  descricao?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.2em]">
        {eyebrow}
      </span>
      <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{titulo}</h2>
      {descricao && (
        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">{descricao}</p>
      )}
    </div>
  );
}
