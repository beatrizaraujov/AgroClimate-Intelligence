import axios from 'axios';


const getSecretToken = () => (import.meta as any).env?.VITE_MAPBIOMAS_TOKEN;


export const api = axios.create({
  baseURL: 'https://plataforma.alerta.mapbiomas.org/api/v2/graphql',
  headers: {
    'Content-Type': 'application/json'
  }
});


const token = getSecretToken();

if (token) {

  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}