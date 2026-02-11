"use server";

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "@/lib/api/admin/user";
import { revalidatePath } from "next/cache";

export const handleCreateUser = async (data: FormData) => {
  try {
    const response = await createUser(data);
    if (response.success) {
      revalidatePath("/admin/users");
      return {
        success: true,
        message: response.message || "User created successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to create user",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create user",
    };
  }
};

export const handleGetAllUsers = async (
    page: string, size: string, search?: string
) => {
    try {
        const currentPage = parseInt(page) || 1;
        const currentSize = parseInt(size) || 10;

        const response = await getAllUsers(currentPage, currentSize, search);
        if (response.success) {
            return {
                success: true,
                message: 'Get all users successful',
                data: response.data,
                pagination: response.pagination
            }
        }
        return {
            success: false,
            message: response.message || 'Get all users failed'
        }
    } catch (error: Error | any) {
        return {
            success: false,
            message: error.message || 'Get all users action failed'
        }
    }
}

export const handleGetUserById = async (id: string) => {
  try {
    const response = await getUserById(id);
    if (response.success) {
      return {
        success: true,
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to fetch user",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch user",
    };
  }
};

export const handleUpdateUser = async (id: string, data: FormData) => {
  try {
    const response = await updateUser(id, data);
    if (response.success) {
      revalidatePath("/admin/users");
      revalidatePath(`/admin/users/${id}`);
      return {
        success: true,
        message: response.message || "User updated successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to update user",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update user",
    };
  }
};

export const handleDeleteUser = async (id: string) => {
  try {
    const response = await deleteUser(id);
    if (response.success) {
      revalidatePath("/admin/users");
      return {
        success: true,
        message: response.message || "User deleted successfully",
      };
    }
    return {
      success: false,
      message: response.message || "Failed to delete user",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete user",
    };
  }
};