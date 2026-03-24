import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => {
    const body = res.data;
    // Unwrap the standard { success, data, meta } API envelope
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      if (body.meta) {
        return { data: body.data.data ?? body.data, meta: body.meta };
      }
      return body.data;
    }
    return body;
  },
  (error) => {
    const message = error.response?.data?.error?.message || error.message;
    return Promise.reject(new Error(message));
  },
);
