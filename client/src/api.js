import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true, // 👈 This ensures cookies are included
});

export default api;
