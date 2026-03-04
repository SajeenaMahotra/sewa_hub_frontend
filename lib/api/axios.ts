import axios from 'axios';

let cookies: typeof import('next/headers').cookies | null = null;
try {
  cookies = require('next/headers').cookies;
} catch {}
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosInstance.interceptors.request.use(
    async (config) => {
        // server‑side branch
        if (typeof window === 'undefined' && cookies) {
            try {
                const cookieStore = await cookies();   
                const token = cookieStore.get('auth_token')?.value;
                if (token) {
                    config.headers!["Authorization"] =
                        `Bearer ${decodeURIComponent(token)}`;
                }
            } catch (e) {
                console.warn('failed to read server cookies', e);
            }
        }
        // client‑side branch
        if (typeof window !== 'undefined') {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('auth_token='))
                ?.split('=').slice(1).join('=');
            const decodedToken = token ? decodeURIComponent(token) : undefined;
            if (decodedToken) {
                config.headers!["Authorization"] = `Bearer ${decodedToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export default axiosInstance;                                                                                               