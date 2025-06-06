import axios from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
import {storage} from '../utils/mmkv';
import {API_URL} from '../utils/constants';
import useAuthStore from '../store/authStore';
import {refreshTokenApi} from './authApis';

const client = () => {
  const axiosInstance = axios.create({baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use(
    async config => {
      try {
        const accessToken = storage.getString('accessToken');

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      } catch (error) {
        crashlytics().recordError(error);
        return Promise.reject(error);
      }
    },
    error => {
      crashlytics().recordError(error);
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;
        const { refreshToken } = useAuthStore.getState();

        if (refreshToken) {
          try {
            const response = await axios.post(refreshTokenApi, {refreshToken});

            const {accessToken} = response?.data ?? {};
            storage.set('accessToken', accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return axios(originalRequest);
          } catch (error) {
            storage.set('accessToken', '');
            crashlytics().recordError(error);
            return Promise.reject(error);
          }
        }
      }

      crashlytics().recordError(error);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default client;
