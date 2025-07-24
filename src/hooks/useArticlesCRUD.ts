import { useState } from 'react';
import { http } from '../lib/http';

type ArticleCreateData = {
  title: string;
  content: string;
  excerpt?: string | null;
  category: string;
  featuredImage?: string | null;
  tags?: string[] | null;
  status?: 'draft' | 'pending' | 'published' | 'rejected';
  isFeatured?: boolean;
};

type ArticleUpdateData = ArticleCreateData;

type ArticleResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    authorId: string;
    authorName?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    category: string;
    featuredImage: string | null;
    status: 'draft' | 'pending' | 'published' | 'rejected';
    isFeatured: boolean;
    viewCount: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
  };
  errors?: Array<{ msg: string; param: string; location: string }>;
};

const useArticlesCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createArticle = async (articleData: ArticleCreateData) => {
    setLoading(true);
    setError(null);

    try {
      // Ensure null values are properly sent
      const sanitizedData = {
        ...articleData,
        excerpt: articleData.excerpt || null,
        featuredImage: articleData.featuredImage || null,
        tags: articleData.tags || []
      };

      const response = await http<ArticleResponse>('/articles', {
        method: 'POST',
        body: sanitizedData,
      });
      
      return {
        success: response.success,
        message: response.message,
        data: response.data,
      };
    } catch (err: any) {
      setError(err.response?.message || 'Failed to create article');
      return {
        success: false,
        message: err.response?.message || 'Failed to create article',
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateArticle = async (id: string, articleData: ArticleUpdateData) => {
    setLoading(true);
    setError(null);

    try {
      // Ensure null values are properly sent
      const sanitizedData = {
        ...articleData,
        excerpt: articleData.excerpt || null,
        featuredImage: articleData.featuredImage || null,
        tags: articleData.tags || []
      };

      const response = await http<ArticleResponse>(`/articles/${id}`, {
        method: 'PUT',
        body: sanitizedData,
      });
      
      return {
        success: response.success,
        message: response.message,
        data: response.data,
      };
    } catch (err: any) {
      setError(err.response?.message || 'Failed to update article');
      return {
        success: false,
        message: err.response?.message || 'Failed to update article',
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; message: string }>(`/articles/${id}`, {
        method: 'DELETE',
      });
      
      return {
        success: response.success,
        message: response.message,
      };
    } catch (err: any) {
      setError(err.response?.message || 'Failed to delete article');
      return {
        success: false,
        message: err.response?.message || 'Failed to delete article',
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    createArticle,
    updateArticle,
    deleteArticle,
    loading,
    error,
  };
};

export default useArticlesCRUD;
