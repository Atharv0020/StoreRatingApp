import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

// ============ Interceptor - Add Token ============
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('🔑 Token from localStorage:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Token added to request headers');
        } else {
            console.log('❌ No token found');
        }
        console.log('📤 Request:', config.method.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============ Interceptor - Response ============
api.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default api;