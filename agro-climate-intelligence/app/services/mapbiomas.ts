import { api } from './api';

let cache: { data: Array<{ id: string; alertCode: string; areaHa: number; crossedStates: string[]; publishedAt: string }>; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export const getLatestAlerts = async () => {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  try {
    const response = await api.get('');

    if (response.data?.errors) {
      if (response.data.errors[0]?.extensions?.code === 'TOKEN_EXPIRED') {
        const alerts = getFallbackAlerts();
        return alerts;
      }
      throw new Error(response.data.errors[0].message);
    }

    if (response.status === 401) {
      const alerts = getFallbackAlerts();
      return alerts;
    }

    const alerts = response.data?.data?.alerts?.collection;

    if (!alerts) {
      return [];
    }

    const mapped = alerts.map((item: { id?: string; alertCode?: string; areaHa?: number; crossedStates?: string[]; publishedAt?: string }) => ({
      id: item.id || Math.random().toString(),
      alertCode: item.alertCode ?? 'N/A',
      areaHa: Number(item.areaHa) || 0,
      crossedStates: Array.isArray(item.crossedStates) ? item.crossedStates : [],
      publishedAt: item.publishedAt ?? new Date().toISOString(),
    }));

    cache = { data: mapped, timestamp: Date.now() };
    return mapped;

  } catch (error: unknown) {
    const axiosError = error as { response?: { status: number } };
    if (axiosError?.response?.status === 401 || axiosError?.response?.status === 403) {
      return getFallbackAlerts();
    }
    return [];
  }
};

function getFallbackAlerts() {
  if (cache) return cache.data;
  return [];
}