import axios from 'axios';

/**
 * Centralized Axios network client.
 * Base URL targets localhost Spring Boot endpoints at http://localhost:8080/api/v1.
 */
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default axiosClient;
