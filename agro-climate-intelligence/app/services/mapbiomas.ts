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
    
    const response = await api.post('', { query: ALERTS_QUERY });
    
    if (response.data?.errors) {
      console.error("[AgroClimate] ❌ Erro de Schema:", response.data.errors[0].message);
      return [];
    }

    const alerts = response.data?.data?.alerts?.collection;

    if (!alerts || !Array.isArray(alerts)) {
      console.warn("[AgroClimate] ⚠️ Nenhuma coleção de alertas encontrada.");
      return [];
    }

   
    return alerts.map((item: any) => ({
      id: item.id || Math.random(),
      alertCode: item.alertCode || "N/A",
      areaHa: Number(item.areaHa) || 0,
      crossedStates: Array.isArray(item.crossedStates) ? item.crossedStates : [], 
      publishedAt: item.publishedAt || new Date().toISOString(),
    }));

  } catch (error: any) {
    console.error("[AgroClimate] 🔥 Erro de conexão na API:", error.message);
    return [];
  }
};