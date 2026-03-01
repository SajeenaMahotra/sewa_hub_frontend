"use server";

import {
    setupProviderProfile,
    getProviderProfile,
    updateProviderProfile,
    getServiceCategories,
    getAllProviders,
    getProviderById,
    rateProvider,
} from "@/lib/api/provider";
import { updateProfile } from "@/lib/api/auth";
import { getUserData, setUserData } from "@/lib/cookie";

export const handleUpdateProviderAuthInfo = async (data: FormData) => {
    try {
        const response = await updateProfile(data);
        if (response.success) {
            const currentUserData = await getUserData();

            const mergedUserData = {
                ...currentUserData,
                ...response.data,
                role: currentUserData?.role ?? response.data?.role, // preserve role always
            };

            await setUserData(mergedUserData);
            return { success: true, message: "Profile updated", data: mergedUserData };
        }
        return { success: false, message: response.message || "Failed to update profile" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update profile" };
    }
};

export const handleSetupProviderProfile = async (data: FormData) => {
    try {
        const response = await setupProviderProfile(data);
        if (response.success) return { success: true, message: "Profile setup successfully", data: response.data };
        return { success: false, message: response.message || "Failed to setup profile" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to setup profile" };
    }
};

export const handleGetProviderProfile = async () => {
    try {
        const response = await getProviderProfile();
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message || "Failed to fetch profile" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch profile" };
    }
};

export const handleUpdateProviderProfile = async (data: FormData) => {
    try {
        const response = await updateProviderProfile(data);
        if (response.success) return { success: true, message: "Profile updated", data: response.data };
        return { success: false, message: response.message || "Failed to update profile" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update profile" };
    }
};

export const handleGetServiceCategories = async () => {
    try {
        const response = await getServiceCategories();
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message || "Failed to fetch categories" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch categories" };
    }
};

export const handleGetAllProviders = async (page = 1, size = 12, categoryId?: string) => {
    try {
        const response = await getAllProviders(page, size, categoryId);
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message || "Failed to fetch providers" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch providers" };
    }
};

export const handleGetProviderById = async (id: string) => {
    try {
        const response = await getProviderById(id);
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message || "Failed to fetch provider" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch provider" };
    }
};

export const handleRateProvider = async (bookingId: string, rating: number) => {
    try {
        const response = await rateProvider(bookingId, rating);
        if (response.success) return { success: true, message: "Rating submitted" };
        return { success: false, message: response.message || "Failed to submit rating" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to submit rating" };
    }
};