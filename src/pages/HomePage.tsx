import React from 'react';
import VideoSection from '../components/Home/VideoSection';
import IslandProfile from '../components/Home/IslandProfile';
import AmenitiesGrid from '../components/Home/AmenitiesGrid';
import TransportationTable from '../components/Home/TransportationTable';
import TestimonialCarousel from '../components/Home/TestimonialCarousel';
import QuickLinks from '../components/Home/QuickLinks';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen">
      <VideoSection />
      <IslandProfile />
      <AmenitiesGrid />
      <TransportationTable />
      <TestimonialCarousel />
      <QuickLinks onNavigate={onNavigate} />
    </div>
  );
};

export default HomePage;