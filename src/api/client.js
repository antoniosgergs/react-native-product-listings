import axios from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
import {storage} from '../utils/mmkv';
import {API_URL} from '../utils/constants';

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

  return axiosInstance;
};

export default client;
