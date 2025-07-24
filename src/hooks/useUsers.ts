import { useState } from 'react';
import { http } from '../lib/http';

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type UserResponse = {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
};

type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role: string;
};

type UpdateUserData = Omit<CreateUserData, 'password'> & {
  is_active?: boolean;
};

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = async (page = 1, limit = 10, role?: string, search?: string) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams: Record<string, string> = {
        page: String(page),
        limit: String(limit)
      };
      
      if (role) queryParams.role = role;
      if (search) queryParams.search = search;
      
      const response = await http<UserResponse>('/users', {
        query: queryParams,
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch users');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: User }>(`/users/${id}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserRoles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: string[] }>('/users/roles');
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch user roles');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: CreateUserData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: User }>('/users', {
        method: 'POST',
        body: userData,
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, userData: UpdateUserData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: User }>(`/users/${id}`, {
        method: 'PUT',
        body: userData,
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeUserPassword = async (id: number, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean }>(`/users/${id}/password`, {
        method: 'PUT',
        body: { password },
      });
      return response;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to change user password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await http<{ success: boolean }>(`/users/${id}`, {
        method: 'DELETE',
      });
    } catch (err: any) {
      setError(err.response?.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: { is_active: boolean } }>(
        `/users/${id}/toggle-status`,
        {
          method: 'PATCH',
        }
      );
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to toggle user status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getUsers,
    getUserById,
    getUserRoles,
    createUser,
    updateUser,
    changeUserPassword,
    deleteUser,
    toggleUserStatus,
  };
};