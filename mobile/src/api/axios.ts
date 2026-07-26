import axios from 'axios';
import { Config } from '../constants/config';

export const api = axios.create({
  baseURL: Config.apiBaseUrl,
  timeout: Config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Configure Axios interceptors for authentication
api.interceptors.request.use(
  async (config) => {
    // Session token attachment code will go here in Phase 2
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Global API error interception / logger will go here in Phase 2
    return Promise.reject(error);
  }
);

export default api;
