import axios from 'axios';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { authService } from '@/features/auth/service/authService';
const API_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: API_URL || ' http://localhost:5000/api/v1',
  withCredentials: true,
  // headers: {
  //   'Content-Type': 'application/json'
  // }
});

// to refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLoginPath = originalRequest.url.includes('/auth/login');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginPath &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh');

        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        console.log(refreshError);
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject('Session expired. Please log in again.');
      }
    }
    return Promise.reject(error);
  }
);

// error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    let errorMessage = 'An unexpected error occurred';
    if (axios.isAxiosError(error)) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
        return new Promise(() => {});
      }
      if (error.response) {
        console.error('Axios Error:', error, error.response?.status);
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.message || 'Invalid request.';
            break;
          case 401:
            errorMessage = error.response.data?.message||'Session expired. Please log in again.';           
            break;
          case 403:
            errorMessage = error.response.data?.message||"Access Denied.";
            if(error.response.data?.message==='Your account has been suspended'){
              useAuthStore.getState().clearAuth();
              authService.logout();              
              return Promise.reject(new Error(errorMessage));
            }
            break;
          case 404:
            errorMessage = ' Not found.';
            break;
          case 422:
            errorMessage = error.response.data?.message || 'Validation failed.';
            break;
          case 500:
          case 502:
          case 503:
            errorMessage =  error.response.data?.message||'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data?.message||'Something went wrong. Please try again.';
        }
      } else if (error.request) {
        errorMessage = 'Network error: Please check your internet connection.';
        console.log('Network Error:', error.request);
      }
    } else if (error instanceof Error) {
      console.error('Unexpected Error:', error.message);
      errorMessage = 'An unexpected error occurred.';
    }
    return Promise.reject(new Error(errorMessage));
  }
);
export default api;
