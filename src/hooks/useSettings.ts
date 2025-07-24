import { useState } from 'react';
import { http } from '../lib/http';

export type SettingsCategory = 'general' | 'contact' | 'media' | 'social' | 'island_profile';

export type GeneralSettings = {
  island_name: string;
  village_name: string;
  description: string;
  welcome_message: string;
};

export type ContactSettings = {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  maps_embed_url: string;
  latitude: string;
  longitude: string;
};

export type MediaSettings = {
  hero_video_url: string;
  main_logo: string;
  hero_background: string;
  gallery: string[];
};

export type SocialSettings = {
  tiktok: string;
  instagram: string;
  youtube: string;
  twitter: string;
};

export type IslandProfileSettings = {
  community_values: string;
  history_description: string;
  location: string;
  population: string;
  best_time: string;
};

export type AllSettings = {
  general: GeneralSettings;
  contact: ContactSettings;
  media: MediaSettings;
  social: SocialSettings;
  island_profile: IslandProfileSettings;
};

export type Facility = {
  id: number;
  icon: string;
  label: string;
  description: string | null;
  available: boolean;
};

export const useSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get all settings
   */
  const getAllSettings = async (): Promise<AllSettings | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: AllSettings }>('/settings');
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch settings');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get settings by category
   */
  const getSettingsByCategory = async <T>(category: SettingsCategory): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: T }>(`/settings/category/${category}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || `Failed to fetch ${category} settings`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update settings by category
   */
  const updateSettings = async <T>(category: SettingsCategory, settings: Partial<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: T }>(`/settings/category/${category}`, {
        method: 'PUT',
        body: settings,
      });
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || `Failed to update ${category} settings`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get all facilities
   */
  const getAllFacilities = async (): Promise<Facility[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: Facility[] }>('/settings/facilities');
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to fetch facilities');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new facility
   */
  const createFacility = async (facility: Omit<Facility, 'id'>): Promise<Facility | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: Facility }>('/settings/facilities', {
        method: 'POST',
        body: facility,
      });
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to create facility');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a facility
   */
  const updateFacility = async (id: number, facility: Partial<Omit<Facility, 'id'>>): Promise<Facility | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await http<{ success: boolean; data: Facility }>(`/settings/facilities/${id}`, {
        method: 'PUT',
        body: facility,
      });
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to update facility');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a facility
   */
  const deleteFacility = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await http<{ success: boolean }>(`/settings/facilities/${id}`, {
        method: 'DELETE',
      });
      
      return true;
    } catch (err: any) {
      setError(err.response?.message || 'Failed to delete facility');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAllSettings,
    getSettingsByCategory,
    updateSettings,
    getAllFacilities,
    createFacility,
    updateFacility,
    deleteFacility,
  };
}; 