import { useState } from 'react';
import { http } from '../lib/http';
import { Testimonial } from './useTestimonials';

type TestimonialCreateData = {
  name: string;
  star: number;
  origin?: string;
  message: string;
};

type TestimonialUpdateData = TestimonialCreateData;

type TestimonialResponse = {
  success: boolean;
  message: string;
  data: Testimonial;
};

export const useTestimonialsCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTestimonial = async (testimonialData: TestimonialCreateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<TestimonialResponse>('/testimonials', {
        method: 'POST',
        body: testimonialData,
      });
      
      return {
        success: response.success,
        message: response.message,
        data: response.data,
      };
    } catch (err: any) {
      setError(err.response?.message || 'Failed to create testimonial');
      return {
        success: false,
        message: err.response?.message || 'Failed to create testimonial',
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateTestimonial = async (id: number, testimonialData: TestimonialUpdateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<TestimonialResponse>(`/testimonials/${id}`, {
        method: 'PUT',
        body: testimonialData,
      });
      
      return {
        success: response.success,
        message: response.message,
        data: response.data,
      };
    } catch (err: any) {
      setError(err.response?.message || 'Failed to update testimonial');
      return {
        success: false,
        message: err.response?.message || 'Failed to update testimonial',
        data: null,
      };
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
      
      return {
        success: response.success,
        message: response.message,
      };
    } catch (err: any) {
      setError(err.response?.message || 'Failed to delete testimonial');
      return {
        success: false,
        message: err.response?.message || 'Failed to delete testimonial',
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    loading,
    error,
  };
}; 