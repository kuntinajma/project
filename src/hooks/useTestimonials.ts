import { useState, useCallback } from 'react';
import { http } from '../lib/http';

export type Testimonial = {
  id: number;
  name: string;
  star: number;
  origin: string | null;
  message: string;
  created_at: string;
  isDisplayed?: boolean;  // Add these for UI display purposes
  isVerified?: boolean;   // Add these for UI display purposes
};

type TestimonialResponse = {
  success: boolean;
  data: {
    testimonials: Testimonial[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
};

type TestimonialCreateData = {
  name: string;
  star: number;
  origin?: string;
  message: string;
};

// Create a simple cache to prevent redundant API calls
const cache = new Map<string, {
  data: {
    testimonials: Testimonial[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  },
  timestamp: number
}>();

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

export const useTestimonials = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTestimonials = useCallback(async (page = 1, limit = 10, search?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Create a cache key based on the request parameters
      const cacheKey = `testimonials_${page}_${limit}_${search || ''}`;
      
      // Check if we have a valid cache entry
      const cachedData = cache.get(cacheKey);
      const now = Date.now();
      
      if (cachedData && (now - cachedData.timestamp < CACHE_EXPIRATION)) {
        setLoading(false);
        return cachedData.data;
      }
      
      const queryParams: Record<string, string> = {
        page: String(page),
        limit: String(limit)
      };
      
      if (search) queryParams.search = search;
      
      const response = await http<TestimonialResponse>('/testimonials', {
        query: queryParams,
      });
      
      const result = {
        testimonials: response.data.testimonials,
        pagination: response.data.pagination
      };
      
      // Store in cache
      cache.set(cacheKey, {
        data: result,
        timestamp: now
      });
      
      return result;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch testimonials');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeaturedTestimonials = async (limit = 5) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: Testimonial[] }>('/testimonials/featured', {
        query: { limit: String(limit) },
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch featured testimonials');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTestimonialById = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: Testimonial }>(`/testimonials/${id}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch testimonial');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTestimonial = async (testimonialData: TestimonialCreateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; message: string; data: Testimonial }>('/testimonials', {
        method: 'POST',
        body: testimonialData,
      });
      return response;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to create testimonial');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTestimonial = async (id: number, testimonialData: TestimonialCreateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; message: string; data: Testimonial }>(`/testimonials/${id}`, {
        method: 'PUT',
        body: testimonialData,
      });
      return response;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to update testimonial');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; message: string }>(`/testimonials/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to delete testimonial');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getTestimonials,
    getFeaturedTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  };
}; 