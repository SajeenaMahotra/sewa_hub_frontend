
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
    },
    PROVIDER: {
        SETUP_PROFILE: '/api/provider/setup-profile',
        GET_PROFILE: '/api/provider/profile',
        UPDATE_PROFILE: '/api/provider/profile',
        GET_ALL: '/api/provider',
        GET_BY_ID: (id: string) => `/api/provider/${id}`,
    },
    SERVICE_CATEGORY: {
        GET_ALL: '/api/service-categories',
    },
    BOOKING: {
    CREATE:          "/api/bookings",
    MY_BOOKINGS:     "/api/bookings/my",
    CANCEL:          (id: string) => `/api/bookings/${id}/cancel`,
    UPDATE_STATUS:   (id: string) => `/api/bookings/${id}/status`,
}

}