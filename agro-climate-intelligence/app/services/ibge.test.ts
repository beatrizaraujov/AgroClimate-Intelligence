import { describe, expect, it } from "vitest";
import { parseNomeParaSigla } from "./ibge";

describe("parseNomeParaSigla", () => {
  it("converte o nome oficial de um estado para a sigla correspondente", () => {
    expect(parseNomeParaSigla("Mato Grosso")).toBe("MT");
    expect(parseNomeParaSigla("São Paulo")).toBe("SP");
    expect(parseNomeParaSigla("Rio Grande do Sul")).toBe("RS");
  });

  it("é case-insensitive e ignora espaços nas pontas", () => {
    expect(parseNomeParaSigla("  mato grosso do sul  ")).toBe("MS");
    expect(parseNomeParaSigla("GOIÁS")).toBe("GO");
  });

  it("cai no fallback (dois primeiros caracteres) para nomes desconhecidos", () => {
    expect(parseNomeParaSigla("Estado Inexistente")).toBe("Es");
  });
});
