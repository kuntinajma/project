import { useState, useEffect, useCallback } from 'react';
import { http } from '../lib/http';
import { Facility } from './useSettings';

// Cache for storing fetched data
let homeDataCache: HomeData | null = null;
let transportationCache: TransportationOption[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export type HomeSettings = {
  general: {
    island_name: string;
    village_name: string;
    description: string;
    welcome_message: string;
  };
  contact: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    maps_embed_url: string;
    latitude: string;
    longitude: string;
  };
  media: {
    hero_video_url: string;
    main_logo: string;
    hero_background: string;
    gallery: string[];
  };
  social: {
    tiktok: string;
    instagram: string;
    youtube: string;
    twitter: string;
  };
};

export type Testimonial = {
  id: number;
  name: string;
  rating: number;
  message: string;
  origin: string | null;
};

export type FeaturedDestination = {
  id: number;
  title: string;
  shortDescription: string;
  image: string | null;
  category: string;
};

export type FeaturedArticle = {
  id: number;
  title: string;
  excerpt: string | null;
  featuredImage: string | null;
  category: string;
  publishedAt: string | null;
  authorName: string | null;
};

export type PopularTourPackage = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: string;
  image: string | null;
  popular: boolean;
};

export type TransportationOption = {
  id: number;
  name: string;
  phone: string | null;
  departureTime: string | null;
  dockLocation: string | null;
};

export type HomeData = {
  settings: HomeSettings;
  facilities: Facility[];
  testimonials: Testimonial[];
  featuredDestinations: FeaturedDestination[];
  featuredArticles: FeaturedArticle[];
  popularTourPackages: PopularTourPackage[];
};

export const useHome = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(homeDataCache);
  const [transportation, setTransportation] = useState<TransportationOption[]>(transportationCache);
  const [loading, setLoading] = useState(!homeDataCache);
  const [error, setError] = useState<string | null>(null);

  // Check if cache is still valid
  const isCacheValid = () => {
    return Date.now() - lastFetchTime < CACHE_DURATION;
  };

  // Fetch home page data with caching
  const fetchHomeData = useCallback(async (forceRefresh = false) => {
    // Return cached data if available and not forced to refresh
    if (!forceRefresh && homeDataCache && isCacheValid()) {
      setHomeData(homeDataCache);
      setLoading(false);
      return homeDataCache;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: HomeData }>('/home');
      
      // Update cache
      homeDataCache = response.data;
      lastFetchTime = Date.now();
      
      setHomeData(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch home page data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch transportation data with caching
  const fetchTransportation = useCallback(async (forceRefresh = false) => {
    // Return cached data if available and not forced to refresh
    if (!forceRefresh && transportationCache.length > 0 && isCacheValid()) {
      setTransportation(transportationCache);
      setLoading(false);
      return transportationCache;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: TransportationOption[] }>('/home/transportation');
      
      // Update cache
      transportationCache = response.data;
      lastFetchTime = Date.now();
      
      setTransportation(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch transportation data');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load home data on component mount
  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  return {
    homeData,
    transportation,
    loading,
    error,
    fetchHomeData,
    fetchTransportation,
  };
}; 