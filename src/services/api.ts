import axios, { AxiosInstance } from 'axios';

const API_URL = 'http://localhost/api';

// Definir rutas públicas que no requieren token
const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password'
];

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar tokens
api.interceptors.request.use(
    (config: any) => {
        const isPublicRoute = publicRoutes.some(route => 
            config.url?.includes(route)
        );

        if (!isPublicRoute) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
        if (error.response?.status === 401) {
            // Limpiar datos de autenticación
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirigir a login
            window.location.href = '/auth/login';
        }
        return Promise.reject(error.response.data);
    }
);

export default api;