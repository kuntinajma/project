import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import axios from 'axios';

interface Testimonial {
  id: string;
  name: string;
  star: number;
  origin?: string;
  message: string;
  created_at: string;
}

const TestimonialCarousel: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/testimonials');
        if (response.data.success) {
          setTestimonials(response.data.data);
          setError(null);
        } else {
          setError('Gagal memuat testimoni.');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memuat testimoni.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const toggleReview = (id: string) => {
    setExpandedReview(expandedReview === id ? null : id);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white text-center">
        <p>Memuat testimoni...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white text-center text-red-600">
        <p>{error}</p>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-white text-center">
        <p>Tidak ada testimoni tersedia.</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kata Pengunjung Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pengalaman nyata dari wisatawan yang menemukan Pulau Laiya
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-lg p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={i < testimonial.star ? 'fill-current' : ''}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {new Date(testimonial.created_at).toISOString().split('T')[0]}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {expandedReview === testimonial.id 
                          ? testimonial.message 
                          : testimonial.message.length > 100 ? testimonial.message.substring(0, 100) + '...' : testimonial.message}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600">{testimonial.origin || 'Pengunjung Terverifikasi'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-orange-600' : 'bg-gray-300'
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
