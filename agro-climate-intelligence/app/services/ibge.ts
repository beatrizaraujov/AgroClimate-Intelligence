import { NOME_PARA_SIGLA } from "../constants";

interface ProducaoSojaResponse {
  valor: number;
  unidade: string;
  periodo: string;
  estado: string;
}

export interface EstadoIBGE {
  nome: string;
  sigla: string;
}

type EstadoConfig = {
  nivel: string;
  codigo: string;
};

const estadosIBGE: Record<string, EstadoConfig> = {
  BR: { nivel: "n1", codigo: "all" },

  AC: { nivel: "n3", codigo: "12" },
  AL: { nivel: "n3", codigo: "27" },
  AP: { nivel: "n3", codigo: "16" },
  AM: { nivel: "n3", codigo: "13" },
  BA: { nivel: "n3", codigo: "29" },
  CE: { nivel: "n3", codigo: "23" },
  DF: { nivel: "n3", codigo: "53" },
  ES: { nivel: "n3", codigo: "32" },
  GO: { nivel: "n3", codigo: "52" },
  MA: { nivel: "n3", codigo: "21" },
  MT: { nivel: "n3", codigo: "51" },
  MS: { nivel: "n3", codigo: "50" },
  MG: { nivel: "n3", codigo: "31" },
  PA: { nivel: "n3", codigo: "15" },
  PB: { nivel: "n3", codigo: "25" },
  PR: { nivel: "n3", codigo: "41" },
  PE: { nivel: "n3", codigo: "26" },
  PI: { nivel: "n3", codigo: "22" },
  RJ: { nivel: "n3", codigo: "33" },
  RN: { nivel: "n3", codigo: "24" },
  RS: { nivel: "n3", codigo: "43" },
  RO: { nivel: "n3", codigo: "11" },
  RR: { nivel: "n3", codigo: "14" },
  SC: { nivel: "n3", codigo: "42" },
  SP: { nivel: "n3", codigo: "35" },
  SE: { nivel: "n3", codigo: "28" },
  TO: { nivel: "n3", codigo: "17" },
};

const cache: Map<string, { data: ProducaoSojaResponse; timestamp: number }> = new Map();
const CACHE_TTL = 30 * 60 * 1000;

export async function getProducaoSoja(
  estado: string = 'BR'
): Promise<ProducaoSojaResponse | null> {
  const estadoNormalizado = estado.toUpperCase();

  const cached = cache.get(estadoNormalizado);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const configEstado =
    estadosIBGE[estadoNormalizado] || estadosIBGE['BR'];

  const { nivel } = configEstado;

  const url = `https://apisidra.ibge.gov.br/values/t/1618/${nivel}/all/v/109/p/last/c31/3939`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro IBGE: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length < 2) {
      throw new Error('Resposta inválida da API');
    }

    const item = data[1];

    const valor = Number(item?.V);

    if (valor === undefined || valor === null || isNaN(valor)) {
      throw new Error('Valor inválido');
    }

    const result: ProducaoSojaResponse = {
      valor,
      unidade: item?.UN || 'Toneladas',
      periodo: item?.D3C || 'Sem período',
      estado: estadoNormalizado,
    };

    cache.set(estadoNormalizado, { data: result, timestamp: Date.now() });
    return result;

  } catch (error) {
    console.warn(
      `[IBGE] Falha ao buscar produção de soja (${estadoNormalizado})`,
      error
    );
    return null;
  }
}

// ─── Dados por estado (n3/all) ─────────────────────────────────

const FALLBACK_ESTADOS: { sigla: string; nome: string; producao: number }[] = [
  { sigla: "MT", nome: "Mato Grosso", producao: 45226127 },
  { sigla: "RS", nome: "Rio Grande do Sul", producao: 23100000 },
  { sigla: "PR", nome: "Paraná", producao: 20100000 },
  { sigla: "GO", nome: "Goiás", producao: 17000000 },
  { sigla: "MS", nome: "Mato Grosso do Sul", producao: 13900000 },
  { sigla: "BA", nome: "Bahia", producao: 7500000 },
  { sigla: "SP", nome: "São Paulo", producao: 4500000 },
  { sigla: "MG", nome: "Minas Gerais", producao: 3500000 },
  { sigla: "TO", nome: "Tocantins", producao: 3200000 },
  { sigla: "MA", nome: "Maranhão", producao: 2800000 },
  { sigla: "PA", nome: "Pará", producao: 2200000 },
  { sigla: "SC", nome: "Santa Catarina", producao: 1800000 },
  { sigla: "RO", nome: "Rondônia", producao: 1500000 },
  { sigla: "PI", nome: "Piauí", producao: 1200000 },
];

const INVERSE_IBGE: Record<string, string> = {};
for (const [sigla, cfg] of Object.entries(estadosIBGE)) {
  if (cfg.nivel === "n3") INVERSE_IBGE[cfg.codigo] = sigla;
}

export function parseNomeParaSigla(nome: string): string {
  const trimmed = nome.trim().toUpperCase();
  return NOME_PARA_SIGLA[trimmed] || INVERSE_IBGE[nome] || nome.slice(0, 2);
}

const cacheEstados: Map<string, { data: { sigla: string; nome: string; producao: number }[]; timestamp: number }> = new Map();
const ESTADOS_CACHE_KEY = "ibge_estados";

export async function getDadosEstados(): Promise<{ sigla: string; nome: string; producao: number }[]> {
  const cached = cacheEstados.get(ESTADOS_CACHE_KEY);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const url = "https://apisidra.ibge.gov.br/values/t/1618/n3/all/v/109/p/last/c31/3939";
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro IBGE: ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Resposta inválida");

    const estados: { sigla: string; nome: string; producao: number }[] = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const nome = row?.D1C || "";
      const valor = Number(row?.V) || 0;
      if (valor <= 0) continue;
      const sigla = parseNomeParaSigla(nome);
      estados.push({ sigla, nome: nome.toUpperCase(), producao: valor });
    }

    if (estados.length === 0) throw new Error("Nenhum estado encontrado");

    estados.sort((a, b) => b.producao - a.producao);

    cacheEstados.set(ESTADOS_CACHE_KEY, { data: estados, timestamp: Date.now() });
    return estados;
  } catch (error) {
    console.warn("[IBGE] Falha ao buscar dados por estado, usando fallback", error);
    return FALLBACK_ESTADOS;
  }
}

// ─── Histórico de produção (2019-2023) ──────────────────────────

const FALLBACK_HISTORICO: { ano: number; valor: number }[] = [
  { ano: 2019, valor: 108700000 },
  { ano: 2020, valor: 121400000 },
  { ano: 2021, valor: 129800000 },
  { ano: 2022, valor: 146700000 },
  { ano: 2023, valor: 154300000 },
];

const cacheHistorico: Map<string, { data: { ano: number; valor: number }[]; timestamp: number }> = new Map();
const HISTORICO_CACHE_KEY = "ibge_historico";

export async function getHistoricoProducao(estado: string = "BR"): Promise<{ ano: number; valor: number }[]> {
  const cacheKey = `${HISTORICO_CACHE_KEY}_${estado}`;
  const cached = cacheHistorico.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const configEstado = estadosIBGE[estado.toUpperCase()] || estadosIBGE["BR"];
  const { nivel } = configEstado;

  try {
    const anos = [2019, 2020, 2021, 2022, 2023];
    const url = `https://apisidra.ibge.gov.br/values/t/1618/${nivel}/all/v/109/p/${anos.join("/")}/c31/3939`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro IBGE: ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Resposta inválida");

    const historico: { ano: number; valor: number }[] = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const ano = Number(row?.D3C) || 0;
      const valor = Number(row?.V) || 0;
      if (ano > 0 && valor > 0) {
        historico.push({ ano, valor });
      }
    }

    if (historico.length === 0) throw new Error("Nenhum histórico encontrado");
    historico.sort((a, b) => a.ano - b.ano);

    cacheHistorico.set(cacheKey, { data: historico, timestamp: Date.now() });
    return historico;
  } catch (error) {
    console.warn("[IBGE] Falha ao buscar histórico, usando fallback", error);
    return FALLBACK_HISTORICO;
  }
}

// ─── Lista de estados (localidades) ─────────────────────────────

let cacheListaEstados: { data: EstadoIBGE[]; timestamp: number } | null = null;

export async function getListaEstados(): Promise<EstadoIBGE[]> {
  if (cacheListaEstados && Date.now() - cacheListaEstados.timestamp < CACHE_TTL) {
    return cacheListaEstados.data;
  }

  try {
    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    );
    if (!response.ok) throw new Error(`Erro IBGE: ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Resposta inválida");

    const estados: EstadoIBGE[] = data.map((est: { nome: string; sigla: string }) => ({
      nome: est.nome,
      sigla: est.sigla,
    }));

    cacheListaEstados = { data: estados, timestamp: Date.now() };
    return estados;
  } catch (error) {
    console.warn("[IBGE] Falha ao buscar lista de estados", error);
    return cacheListaEstados?.data ?? [];
  }
}