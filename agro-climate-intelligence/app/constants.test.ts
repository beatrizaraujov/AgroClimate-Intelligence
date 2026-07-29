import { describe, expect, it } from "vitest";
import { SIGLA_PARA_NOME, NOME_PARA_SIGLA } from "./constants";

describe("SIGLA_PARA_NOME / NOME_PARA_SIGLA", () => {
  it("cobre as 26 unidades federativas mais o Distrito Federal", () => {
    expect(Object.keys(SIGLA_PARA_NOME)).toHaveLength(27);
  });

  it("NOME_PARA_SIGLA é o inverso exato de SIGLA_PARA_NOME", () => {
    for (const [sigla, nome] of Object.entries(SIGLA_PARA_NOME)) {
      expect(NOME_PARA_SIGLA[nome]).toBe(sigla);
    }
  });

  it("não tem nomes de estado duplicados (cada nome mapeia para uma única sigla)", () => {
    const nomes = Object.values(SIGLA_PARA_NOME);
    expect(new Set(nomes).size).toBe(nomes.length);
  });
});
