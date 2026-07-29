import { describe, expect, it } from "vitest";
import { calcularIndiceSustentabilidade } from "./score";

describe("calcularIndiceSustentabilidade", () => {
  it("retorna score máximo e status Preservado quando não há alertas", () => {
    const stats = calcularIndiceSustentabilidade([]);

    expect(stats).toEqual({
      score: 100,
      areaTotal: 0,
      areaMedia: 0,
      numAlertas: 0,
      status: "Preservado",
      isCritical: false,
    });
  });

  it("classifica como Sustentável quando o score fica acima de 75", () => {
    const stats = calcularIndiceSustentabilidade([{ areaHa: 1 }]);

    expect(stats.numAlertas).toBe(1);
    expect(stats.score).toBeGreaterThan(75);
    expect(stats.status).toBe("Sustentável");
    expect(stats.isCritical).toBe(false);
  });

  it("classifica como Em Alerta na faixa intermediária do score", () => {
    // penalidade ~= 5*0.5 + sqrt(2500)*0.8 = 2.5 + 40 = 42.5 -> score ~57
    const alertas = Array.from({ length: 5 }, () => ({ areaHa: 500 }));
    const stats = calcularIndiceSustentabilidade(alertas);

    expect(stats.score).toBeGreaterThan(40);
    expect(stats.score).toBeLessThanOrEqual(75);
    expect(stats.status).toBe("Em Alerta");
  });

  it("classifica como Crítico e nunca deixa o score negativo mesmo com área muito grande", () => {
    const stats = calcularIndiceSustentabilidade([{ areaHa: 1_000_000_000 }]);

    expect(stats.score).toBe(0);
    expect(stats.status).toBe("Crítico");
    expect(stats.isCritical).toBe(true);
  });

  it("soma a área total e calcula a média por alerta corretamente", () => {
    const stats = calcularIndiceSustentabilidade([
      { areaHa: 10 },
      { areaHa: 20 },
      { areaHa: 30 },
    ]);

    expect(stats.areaTotal).toBe(60);
    expect(stats.areaMedia).toBe(20);
    expect(stats.numAlertas).toBe(3);
  });

  it("trata valores de área inválidos (NaN/undefined) como zero", () => {
    const stats = calcularIndiceSustentabilidade([
      { areaHa: 10 },
      { areaHa: Number.NaN },
      { areaHa: undefined as unknown as number },
    ]);

    expect(stats.areaTotal).toBe(10);
  });
});
