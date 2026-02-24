import axios from "./axios";
import { API } from "./endpoints";

export const setupProviderProfile = async (profileData: FormData) => {
    try {
        const response = await axios.post(API.PROVIDER.SETUP_PROFILE, profileData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Profile setup failed');
    }
};

export const getProviderProfile = async () => {
    try {
        const response = await axios.get(API.PROVIDER.GET_PROFILE);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch profile');
    }
};

export const updateProviderProfile = async (profileData: FormData) => {
    try {
        const response = await axios.put(API.PROVIDER.UPDATE_PROFILE, profileData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Profile update failed');
    }
};

export const getServiceCategories = async () => {
    try {
        const response = await axios.get(API.SERVICE_CATEGORY.GET_ALL);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch categories');
    }
};

export const getAllProviders = async (page = 1, size = 12, categoryId?: string) => {
    try {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (categoryId && categoryId !== "all") params.append("categoryId", categoryId);
        const response = await axios.get(`${API.PROVIDER.GET_ALL}?${params}`);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch providers');
    }
};

export const getProviderById = async (id: string) => {
    try {
        const response = await axios.get(API.PROVIDER.GET_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch provider');
    }
};