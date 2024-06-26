import axios, { InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, removeSession } from '@/utils/authentication';

const baseURL = 'https://cs-demo-api.herokuapp.com';

const client = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      // Request was aborted
    } else if (error.response.status === 401) {
      removeSession();
    }
    return Promise.reject(error);
  },
);

export { client };
