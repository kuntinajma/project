import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Testimonial } from '../../hooks/useHome';
import { useSettings, GeneralSettings } from '../../hooks/useSettings';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}



const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    island_name: 'Pulau Laiya',
    village_name: 'Desa Mattiro Labangeng',
    description: '',
    welcome_message: ''
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-r from-orange-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Apa Kata Mereka
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pengalaman pengunjung yang telah menikmati keindahan {generalSettings.island_name}
          </p>
        </div>

        <div className="relative">
          {/* Carousel Navigation */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <div className="absolute top-1/2 right-0 -translate-y-1/2 z-10">
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Testimonial Card */}
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                {/* Star Rating */}
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < (testimonials[currentIndex]?.rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <p className="text-gray-700 text-lg italic">
                  "{testimonials[currentIndex]?.message}"
                </p>
              </div>
              
              {/* Author Info */}
              <div>
                <h3 className="font-bold text-gray-900">
                  {testimonials[currentIndex]?.name}
                </h3>
                {testimonials[currentIndex]?.origin && (
                  <p className="text-gray-500 text-sm">
                    {testimonials[currentIndex].origin}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === index ? 'w-6 bg-orange-600' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
