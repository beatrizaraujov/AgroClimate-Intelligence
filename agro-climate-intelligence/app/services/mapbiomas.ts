
import { api } from './api';


const ALERTS_QUERY = `
  query {
    alerts(limit: 5) {
      collection {
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

    
    return response.data.data.alerts.collection;
  } catch (error) {
    console.error("Erro ao buscar sementes do MapBiomas:", error);
    return [];
  }
};