import axios from 'axios';

// Dev: local Django. Prod: same-origin /api (e.g. docker-compose nginx) unless
// VITE_API_URL is set — required when frontend and API are on different hosts (two DO apps).
const viteBase = import.meta.env.VITE_API_URL?.trim();
const baseURL =
    viteBase ||
    (import.meta.env.DEV ? 'http://127.0.0.1:8000/api' : '/api');

if (import.meta.env.PROD && !viteBase) {
    console.warn(
        '[axios] VITE_API_URL is unset; API calls use this origin + /api. ' +
            'If your API is another host, set VITE_API_URL at build time (see .env.production.example).'
    );
}

const api = axios.create({
    baseURL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            const path = window.location.pathname;
            if (path !== '/login' && path !== '/register') {
                window.location.assign('/login');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
