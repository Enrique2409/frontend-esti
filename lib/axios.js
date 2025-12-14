import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('🔐 [Axios Interceptor] Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ [Axios Interceptor] Authorization header set');
        } else {
            console.warn('⚠️ [Axios Interceptor] No token found in localStorage');
        }
        console.log('📤 [Axios Interceptor] Request to:', config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;