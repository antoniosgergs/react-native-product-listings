import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = 'https://backend-practice.eurisko.me';

const client = () => {
  const axiosInstance = axios.create({baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use(
    async config => {
      try {
        const { accessToken } = useAuthStore.getState();

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    error => {
      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

export default client;
