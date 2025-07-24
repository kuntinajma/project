import React, { useEffect } from 'react';
import VideoSection from '../components/Home/VideoSection';
import IslandProfile from '../components/Home/IslandProfile';
import AmenitiesGrid from '../components/Home/AmenitiesGrid';
import TransportationTable from '../components/Home/TransportationTable';
import TestimonialCarousel from '../components/Home/TestimonialCarousel';
import QuickLinks from '../components/Home/QuickLinks';
import { useHome } from '../hooks/useHome';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { homeData, transportation, loading, error, fetchHomeData, fetchTransportation } = useHome();

  // Fetch data only if it's not already available (caching handled in the hook)
  useEffect(() => {
    // Only fetch transportation if we don't have it yet
    if (transportation.length === 0) {
      fetchTransportation(false);
    }
  }, [fetchTransportation, transportation.length]);

  if (loading && !homeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Error loading data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <VideoSection />
      <IslandProfile />
      <AmenitiesGrid />
      <TransportationTable transportationOptions={transportation} />
      <TestimonialCarousel testimonials={homeData?.testimonials || []} />
      <QuickLinks onNavigate={onNavigate} />
    </div>
  );
};

export default HomePage;