// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // ✅ Make sure this matches backend port
});

export default api;
