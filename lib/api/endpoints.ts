
export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        WHOAMI: '/api/auth/whoami',
        UPDATEPROFILE: '/api/auth/update-profile',
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    },
    ADMIN: {
        USER: {
            CREATE: '/api/admin/users/',
            GET_ALL: '/api/admin/users',
            GET_BY_ID: (id: string) => `/api/admin/users/${id}`,
            UPDATE: (id: string) => `/api/admin/users/${id}`,
            DELETE: (id: string) => `/api/admin/users/${id}`,

        }
    }
}