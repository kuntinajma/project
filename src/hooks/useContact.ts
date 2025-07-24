import { useState } from 'react';
import { http } from '../lib/http';

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
};

type ContactMessageResponse = {
  success: boolean;
  data: {
    messages: ContactMessage[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
};

type ContactMessageCreateData = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMessages = async (page = 1, limit = 10, status?: string, search?: string) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams: Record<string, string> = {
        page: String(page),
        limit: String(limit)
      };
      
      if (status) queryParams.status = status;
      if (search) queryParams.search = search;
      
      const response = await http<ContactMessageResponse>('/contact', {
        query: queryParams,
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch messages');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMessageById = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: ContactMessage }>(`/contact/${id}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUnreadCount = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: { count: number } }>('/contact/unread-count');
      return response.data.count;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch unread count');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createMessage = async (messageData: ContactMessageCreateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; message: string; data: ContactMessage }>('/contact', {
        method: 'POST',
        body: messageData,
      });
      return response;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const replyToMessage = async (id: number, adminReply: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; message: string; data: ContactMessage }>(`/contact/${id}/reply`, {
        method: 'PUT',
        body: { admin_reply: adminReply },
      });
      return response;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to reply to message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; message: string }>(`/contact/${id}/mark-read`, {
        method: 'PATCH',
      });
      return response;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to mark message as read');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; message: string }>(`/contact/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to delete message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getMessages,
    getMessageById,
    getUnreadCount,
    createMessage,
    replyToMessage,
    markAsRead,
    deleteMessage,
  };
}; 