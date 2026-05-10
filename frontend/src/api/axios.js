import axios from 'axios';

const baseURL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? 'http://127.0.0.1:8000/api' : '/api');

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
