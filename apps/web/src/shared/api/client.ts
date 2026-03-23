import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const message = error.response?.data?.error?.message || error.message;
    return Promise.reject(new Error(message));
  },
);
