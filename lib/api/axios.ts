import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=').slice(1).join('=');

const decodedToken = token ? decodeURIComponent(token) : undefined;

if (decodedToken) {
    config.headers["Authorization"] = `Bearer ${decodedToken}`;
}

            console.log("Token from cookie:", token); // 👈 add this
            
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;