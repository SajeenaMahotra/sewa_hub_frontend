
export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        WHOAMI: '/api/auth/whoami',
        UPDATEPROFILE: '/api/auth/update-profile',
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
        GOOGLE_LOGIN: (role: string) => `/auth/google?role=${role}`,
        CHANGE_PASSWORD: `/auth/change-password`,
        DELETE_ACCOUNT: '/api/auth/delete-account',
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
        RATE: (bookingId: string) => `/api/provider/rate/${bookingId}`,

    },
    SERVICE_CATEGORY: {
        GET_ALL: '/api/service-categories',
    },
    BOOKING: {
        CREATE: "/api/bookings",
        MY_BOOKINGS: "/api/bookings/mybooking",
        CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
        UPDATE_STATUS: (id: string) => `/api/bookings/${id}/status`,
        DELETE: (id: string) => `/api/bookings/${id}`, 
    },
    CHAT: {
        SEND_MESSAGE: '/api/chat',
        GET_MESSAGES: (bookingId: string, page = 1, size = 50) => `/api/chat/${bookingId}?page=${page}&size=${size}`,
        MARK_READ: (bookingId: string) => `/api/chat/${bookingId}/read`,
        UNREAD_COUNT: (bookingId: string) => `/api/chat/${bookingId}/unread`,
    },
    NOTIFICATION: {
        GET_ALL: (page = 1, size = 20) => `/api/notifications?page=${page}&size=${size}`,
        MARK_ALL_READ: '/api/notifications/read-all',
        MARK_ONE_READ: (id: string) => `/api/notifications/${id}/read`,
        DELETE_ALL: '/api/notifications',
    },
}