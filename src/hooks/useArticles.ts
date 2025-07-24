import { useState, useCallback } from 'react';
import { http } from '../lib/http';

export type Article = {
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

type ArticleResponse = {
  success: boolean;
  data: {
    articles: Article[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
};

type ArticleCreateData = {
  title: string;
  content: string;
  excerpt?: string | null;
  category: string;
  featuredImage?: string | null;
  tags?: string[];
  status?: 'draft' | 'pending' | 'published' | 'rejected';
  isFeatured?: boolean;
};

type ArticleUpdateData = ArticleCreateData & {
  status?: 'draft' | 'pending' | 'published' | 'rejected';
  isFeatured?: boolean;
};

// Create a simple cache to prevent redundant API calls
const cache = new Map<string, {
  data: {
    articles: Article[];
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

export const useArticles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getArticles = useCallback(async (
    page = 1,
    limit = 10,
    category?: string,
    search?: string,
    status?: string,
    authorId?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Create a cache key based on the request parameters
      const cacheKey = `articles_${page}_${limit}_${category || ''}_${search || ''}_${status || ''}_${authorId || ''}`;
      
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
      
      if (category) queryParams.category = category;
      if (search) queryParams.search = search;
      if (status) queryParams.status = status;
      if (authorId) queryParams.author_id = authorId;
      
      const response = await http<ArticleResponse>('/articles', {
        query: queryParams,
      });
      
      const result = {
        articles: response.data.articles,
        pagination: response.data.pagination
      };
      
      // Store in cache
      cache.set(cacheKey, {
        data: result,
        timestamp: now
      });
      
      return result;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch articles');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getArticleById = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: Article }>(`/articles/${id}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch article');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getArticleBySlug = async (slug: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: Article }>(`/articles/slug/${slug}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch article');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedArticles = async (limit = 5) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: Article[] }>('/articles/featured', {
        query: { limit: String(limit) },
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch featured articles');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createArticle = async (articleData: ArticleCreateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; message: string; data: Article }>('/articles', {
        method: 'POST',
        body: articleData,
      });
      return response;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to create article');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateArticle = async (id: string, articleData: ArticleUpdateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; message: string; data: Article }>(`/articles/${id}`, {
        method: 'PUT',
        body: articleData,
      });
      return response;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to update article');
      throw err;
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
      return response;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to delete article');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getArticles,
    getArticleById,
    getArticleBySlug,
    getFeaturedArticles,
    createArticle,
    updateArticle,
    deleteArticle,
  };
};
