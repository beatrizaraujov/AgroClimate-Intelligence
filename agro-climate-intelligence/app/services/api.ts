import axios from 'axios';


export const api = axios.create({
  baseURL: 'https://plataforma.alerta.mapbiomas.org/api/v2/graphql',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, 
});


api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_MAPBIOMAS_TOKEN;
  
  if (!token) {
    console.warn("⚠️ Token não encontrado. Verifique seu arquivo .env!");
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      
      console.error(`❌ Erro ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      
      console.error("❌ Erro de Rede: O servidor não respondeu.");
    }
    return Promise.reject(error);
  }
);


api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_MAPBIOMAS_TOKEN;
  
  console.log("Token sendo usado:", token?.substring(0, 10) + "..."); 
  
  if (!token) {
    console.warn("⚠️ Token não encontrado!");
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_MAPBIOMAS_TOKEN;
  console.log("DEBUG: Token lido pelo Next.js:", token ? "EXISTE" : "NULO");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});