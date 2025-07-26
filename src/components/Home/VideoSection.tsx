import React, { useState, useEffect, useMemo } from 'react';
import { Play } from 'lucide-react';
import { useSettings, GeneralSettings, MediaSettings } from '../../hooks/useSettings';

const VideoSection: React.FC = () => {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    island_name: 'Pulau Laiya',
    village_name: 'Desa Mattiro Labangeng',
    description: '',
    welcome_message: 'Selamat Datang di Pulau Laiya'
  });
  
  const [mediaSettings, setMediaSettings] = useState<MediaSettings>({
    hero_video_url: 'https://www.youtube.com/embed/Gh0K71uxucM',
    main_logo: '',
    hero_background: '',
    gallery: []
  });
  
  const [loading, setLoading] = useState(true);
  const { getSettingsByCategory } = useSettings();
  
  // Only load settings once when component mounts
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Use Promise.all to fetch settings concurrently
        const [generalData, mediaData] = await Promise.all([
          getSettingsByCategory<GeneralSettings>('general'),
          getSettingsByCategory<MediaSettings>('media')
        ]);
        
        if (generalData) {
          setGeneralSettings(generalData);
        }
        
        if (mediaData) {
          setMediaSettings(mediaData);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Extract YouTube video ID from URL - memoize to prevent recalculation
  const youtubeEmbedUrl = useMemo(() => {
    if (!mediaSettings.hero_video_url) return 'https://www.youtube.com/embed/Gh0K71uxucM';
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = mediaSettings.hero_video_url.match(regExp);
    
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}?controls=1&modestbranding=1&rel=0&autoplay=0`
      : mediaSettings.hero_video_url;
  }, [mediaSettings.hero_video_url]);

  // Get welcome message parts
  const welcomeParts = useMemo(() => {
    const parts = generalSettings.welcome_message.split(' di ');
    return {
      prefix: parts[0] || 'Selamat Datang',
      suffix: parts.length > 1 ? parts[1] : generalSettings.island_name
    };
  }, [generalSettings.welcome_message, generalSettings.island_name]);

  return (
    <section className="py-16 bg-gradient-to-r from-orange-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section - Left Side */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {welcomeParts.prefix} di <span className="text-orange-600">{generalSettings.island_name}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {generalSettings.village_name}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {generalSettings.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold">
                Jelajahi Destinasi
              </button>
              <a 
                href={mediaSettings.hero_video_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold text-center"
              >
                Tonton Video
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">5+</div>
                <div className="text-sm text-gray-600">Atraksi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-600">Pengunjung Senang</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600">Dukungan</div>
              </div>
            </div>
          </div>

          {/* Video Container - Right Side */}
          <div className="w-full">
            <div className="relative w-full rounded-lg overflow-hidden shadow-xl" style={{ aspectRatio: '16/9' }}>
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
                </div>
              ) : (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={youtubeEmbedUrl}
                  title={`Video Wisata ${generalSettings.island_name}`}
                  frameBorder="0"
                  loading="lazy" // Lazy load the iframe for better performance
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
