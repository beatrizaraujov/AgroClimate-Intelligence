import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/mapbiomas',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`Erro ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('Erro de Rede: O servidor não respondeu.');
    }
    return Promise.reject(error);
  }
);
