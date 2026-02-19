import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const api = {
  get: (url, token) => instance.get(url, token ? authConfig(token) : {}),
  post: (url, body, token) => instance.post(url, body, token ? authConfig(token) : {}),
  patch: (url, body, token) => instance.patch(url, body, token ? authConfig(token) : {})
};
