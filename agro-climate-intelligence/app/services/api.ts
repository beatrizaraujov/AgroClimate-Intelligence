import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://plataforma.alerta.mapbiomas.org/api/v2/graphql',
  headers: {
    'Content-Type': 'application/json',
  }
});


api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_MAPBIOMAS_TOKEN;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});