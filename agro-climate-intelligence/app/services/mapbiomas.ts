import { api } from './api';

const ALERTS_QUERY = `
  query {
    alerts(limit: 500) {
      collection {
        id
        alertCode
        areaHa
        crossedStates
        publishedAt
      }
    }
  }
`;

export const getLatestAlerts = async () => {
  try {
    console.log("[Service] Iniciando busca de alertas...");

    const response = await api.post('', { query: ALERTS_QUERY });
    
    if (response.data?.errors) {
      console.error("[Service] Erros retornados pelo GraphQL:", response.data.errors);
      throw new Error(response.data.errors[0].message);
    }

   
    const alerts = response.data?.data?.alerts?.collection;

    if (!alerts) {
      console.warn("[Service] A API retornou sucesso, mas a coleção de alertas está vazia ou indefinida.");
      return [];
    }

    console.log(`[Service] Sucesso! ${alerts.length} alertas recebidos.`);


    return alerts.map((item: any) => ({
      id: item.id || Math.random().toString(), 
      alertCode: item.alertCode ?? "N/A",
      areaHa: Number(item.areaHa) || 0,
      crossedStates: Array.isArray(item.crossedStates) ? item.crossedStates : [],
      publishedAt: item.publishedAt ?? new Date().toISOString(),
    }));

  } catch (error: any) {
  
    if (error.response) {
      console.error("[Service] Erro de Servidor (Status):", error.response.status);
    } else if (error.request) {
      console.error("[Service] Erro de Rede: Nenhuma resposta recebida.");
    } else {
      console.error("[Service] Erro na requisição:", error.message);
    }
    
   
    return []; 
  }
};