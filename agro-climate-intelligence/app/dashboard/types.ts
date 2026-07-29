export interface DadosEstado {
  sigla: string;
  nome: string;
  producao: number;
  porcentagem: number;
}

export interface HistoricoAno {
  ano: number;
  valor: number;
}

export interface Insight {
  id: string;
  icone: string;
  titulo: string;
  descricao: string;
}

export interface MiniKPI {
  icone: string;
  variacao: string;
  label: string;
  comparacao: string;
  positiva: boolean;
}

export interface DadosDashboard {
  producaoPorEstado: DadosEstado[];
  historico: HistoricoAno[];
  ranking: DadosEstado[];
  insights: Insight[];
  miniKPIs: MiniKPI[];
}
