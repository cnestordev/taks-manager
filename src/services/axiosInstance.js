import axios from 'axios';

const apiBaseUrl = window.location.hostname === 'localhost'
  ? import.meta.env.VITE_BACKEND_LOCALHOST
  : import.meta.env.VITE_BACKEND_LOCAL_IP;


const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
