export interface AlertaComArea {
  areaHa: number;
}

export type StatusSustentabilidade = "Preservado" | "Sustentável" | "Em Alerta" | "Crítico";

export interface IndiceSustentabilidade {
  score: number;
  areaTotal: number;
  areaMedia: number;
  numAlertas: number;
  status: StatusSustentabilidade;
  isCritical: boolean;
}

/**
 * score = 100 − (nº de alertas × 0.5 + √área_total_ha × 0.8)
 * A raiz quadrada evita que um único evento muito grande distorça o índice.
 */
export function calcularIndiceSustentabilidade(alertas: AlertaComArea[]): IndiceSustentabilidade {
  if (!alertas.length) {
    return {
      score: 100,
      areaTotal: 0,
      areaMedia: 0,
      numAlertas: 0,
      status: "Preservado",
      isCritical: false,
    };
  }

  const areaTotal = alertas.reduce((acc, curr) => acc + (Number(curr.areaHa) || 0), 0);
  const numAlertas = alertas.length;
  const penalidade = numAlertas * 0.5 + Math.sqrt(areaTotal) * 0.8;
  const score = Math.round(Math.max(0, Math.min(100, 100 - penalidade)));

  return {
    score,
    areaTotal,
    areaMedia: areaTotal / numAlertas,
    numAlertas,
    status: score > 75 ? "Sustentável" : score > 40 ? "Em Alerta" : "Crítico",
    isCritical: score <= 40,
  };
}
