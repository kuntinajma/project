import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send, Upload, User, GraduationCap } from 'lucide-react';
import { StarIcon as SolidStar } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStar } from '@heroicons/react/24/outline';
import { useContact } from '../hooks/useContact';
import { useTestimonials } from '../hooks/useTestimonials';
import { useArticles } from '../hooks/useArticles';
import { useAuth } from '../context/AuthContext';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'contact' | 'contribute' | 'testimonial'>('contact');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Location dropdown state
  // Removed hierarchical location dropdowns as per user request

  // The testimonialForm already has 'origin' field for location input
  // No changes needed for country, province, city dropdowns
  const [contributeForm, setContributeForm] = useState({
    name: '',
    title: '',
    category: 'tips',
    content: '',
    image: null as File | null,
  });
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    star: 5,
    origin: '',
    message: '',
  });
  const [testimonialSubmitting, setTestimonialSubmitting] = useState(false);
  const [testimonialSuccess, setTestimonialSuccess] = useState<string | null>(null);
  const [testimonialError, setTestimonialError] = useState<string | null>(null);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contributeSubmitting, setContributeSubmitting] = useState(false);
  const [contributeSuccess, setContributeSuccess] = useState<string | null>(null);
  const [contributeError, setContributeError] = useState<string | null>(null);
  
  const { createMessage } = useContact();
  const { createTestimonial } = useTestimonials();
  const { createArticle } = useArticles();
  const { user } = useAuth();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactSuccess(null);
    setContactError(null);

    try {
      await createMessage(contactForm);
      setContactSuccess('Thank you for your message! We will get back to you soon.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      setContactError(error.response?.message || 'Failed to send message. Please try again later.');
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleContributeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContributeSubmitting(true);
    setContributeSuccess(null);
    setContributeError(null);
    
    try {
      if (!user) {
        throw new Error('You must be logged in to contribute an article');
      }
      
      const articleData = {
        title: contributeForm.title,
        content: contributeForm.content,
        category: contributeForm.category,
        // If image is present, it would need to be uploaded separately
        // This is a simplified version
      };
      
      await createArticle(articleData);
      setContributeSuccess('Thank you for your contribution! We will review your article and get back to you.');
      setContributeForm({ name: '', title: '', content: '', category: 'tips', image: null });
    } catch (error: any) {
      setContributeError(error.response?.message || 'Failed to submit article. Please try again later.');
    } finally {
      setContributeSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContributeForm({ ...contributeForm, image: file });
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestimonialSubmitting(true);
    setTestimonialSuccess(null);
    setTestimonialError(null);
    
    try {
      await createTestimonial(testimonialForm);
      setTestimonialSuccess('Testimonial berhasil dikirim. Terima kasih!');
      setTestimonialForm({ name: '', star: 5, origin: '', message: '' });
    } catch (error: any) {
      setTestimonialError(error.response?.message || 'Gagal mengirim testimonial.');
    } finally {
      setTestimonialSubmitting(false);
    }
  };

  const teamMembers = [
    { name: 'Kunti Najma Jalia', university: 'Universitas Sains Al-Quran', major: 'Teknik Informatika', photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { name: 'Julianto Cahyo P.', university: 'Universitas Noor Huda Mustofa', major: 'Ilmu Keperawatan', photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { name: 'Heru', university: 'Universitas Sultan Ageng Tirtayasa', major: 'Ilmu Perikanan', photo: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { name: 'Nur Aisyah', university: 'Universitas Tadulako', major: 'Ilmu Pemerintahan', photo: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { name: 'Diva Amanda Putri', university: 'Universitas Bangka Belitung', major: 'Hukum', photo: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Dilla Nazalatul Amira', university: 'Universitas Malikussaleh', major: 'Administrasi Bisnis', photo: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Hengky', university: 'Universitas Khairun', major: 'Manajemen', photo: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { name: 'Dicky Putra Setiawan', university: 'UIN Sayyid Ali Rahmatullah ', major: 'Komunikasi Penyiaran Islam', photo: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { name: 'M. Aqwam', university: 'Universitas Lampung', major: 'Biologi', photo: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { name: 'Asmar', university: 'Universitas 19 November Kolaka', major: 'Teknik Sipil', photo: 'https://randomuser.me/api/portraits/women/6.jpg' },
    { name: 'Winda Septiani', university: 'Universitas Boyolali', major: 'Akutansi', photo: 'https://randomuser.me/api/portraits/men/7.jpg' },
    { name: 'Risma Ardiyanti', university: 'Universitas Khairun', major: 'Hukum', photo: 'https://randomuser.me/api/portraits/women/8.jpg' },
    { name: 'Rindang Yulistina', university: 'Unoversitas Halu Oleo', major: 'Ilmu Budaya', photo: 'https://randomuser.me/api/portraits/men/9.jpg' },
    { name: 'Sabrina Syafa', university: 'Institut Teknologi Sepuluh November', major: 'Statistika Bisnis', photo: 'https://randomuser.me/api/portraits/women/10.jpg' },
    { name: 'M. Haikal Faran F.', university: 'Universitas Bangka Belitung', major: 'Manajemen', photo: 'https://randomuser.me/api/portraits/men/11.jpg' },
    { name: 'Rahmat Firsandi', university: 'Institut Teknologi Kalimantan', major: 'Teknik Kelautan', photo: 'https://randomuser.me/api/portraits/women/12.jpg' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Silakan hubungi kami untuk pertanyaan, dukungan, atau jika Anda ingin membagikan cerita dan pengalaman pribadi tentang Pulau Laiya.
          </p>
        </div>

        {/* Location Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Kunjungi Laiya Island</h3>
              <p className="text-gray-600 mb-6">
                Pulau Laiya terletak di perairan jernih Sulawesi Selatan dan dapat diakses melalui perjalanan laut dari Pelabuhan Bulukumba.
                Tempat untuk melepas penat dari hiruk-pikuk kehidupan kota dan menikmati keindahan alam yang masih alami.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="text-orange-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Lokasi</h4>
                    <p className="text-gray-600">Pulau Laiya, Kabupaten Pangkejene dan Kepulauan, Provinsi Sulawesi Selatan, Indonesia</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="text-orange-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">+62 812-3456-7890</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="text-orange-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">info@laiyaisland.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="rounded-lg overflow-hidden h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1234567890123!2d120.12345678901234!3d-5.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee2c4e3a2f4e5%3A0x1a2b3c4d5e6f7g8h!2sLaiya%20Island!5e0!3m2!1sid!2sid!4v1234567890123!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Laiya Island Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'contact'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pesan
            </button>
            <button
              onClick={() => setActiveTab('contribute')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'contribute'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Artikel
            </button>
            <button
              onClick={() => setActiveTab('testimonial')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'testimonial'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Testimoni
            </button>
            </nav>
          </div>

          <div className="p-8">
          {activeTab === 'contact' ? (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Location Dropdowns */}
              {/* Removed hierarchical location dropdowns as per user request */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              
              {contactSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {contactSuccess}
                </div>
              )}
              
              {contactError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {contactError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={contactSubmitting}
                className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-70"
              >
                <Send size={20} />
                <span>{contactSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
            </div>
          ) : activeTab === 'contribute' ? (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contribute Your Story</h3>
              <form onSubmit={handleContributeSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={contributeForm.name}
                    onChange={(e) => setContributeForm({ ...contributeForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={contributeForm.title}
                    onChange={(e) => setContributeForm({ ...contributeForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={contributeForm.category}
                    onChange={(e) => setContributeForm({ ...contributeForm, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="tips">Tips</option>
                    <option value="experience">Experience</option>
                    <option value="culture">Culture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={contributeForm.content}
                    onChange={(e) => setContributeForm({ ...contributeForm, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                  />
                  {contributeForm.image && <p className="text-sm text-gray-500 mt-2">{contributeForm.image.name}</p>}
                </div>
                {contributeSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {contributeSuccess}
                  </div>
                )}
                
                {contributeError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {contributeError}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={contributeSubmitting}
                  className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-70"
                >
                  <Upload size={20} />
                  <span>{contributeSubmitting ? 'Submitting...' : 'Submit Article'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Testimonial</h3>
              <form
                onSubmit={handleTestimonialSubmit}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Star Rating</label>
                  <div className="flex space-x-2 items-center overflow-visible">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTestimonialForm({ ...testimonialForm, star: num })}
                        className="focus:outline-none p-1 rounded"
                        aria-label={`${num} Star${num > 1 ? 's' : ''}`}
                      >
                        {num <= testimonialForm.star ? (
                          <SolidStar className="w-6 h-6 text-yellow-400" />
                        ) : (
                          <OutlineStar className="w-6 h-6 text-gray-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                </div>
                <div>
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                    Origin
                  </label>
                  <input
                    type="text"
                    id="origin"
                    value={testimonialForm.origin}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, origin: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={testimonialForm.message}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                {testimonialSuccess && (
                  <p className="text-green-600">{testimonialSuccess}</p>
                )}
                {testimonialError && (
                  <p className="text-red-600">{testimonialError}</p>
                )}
                <button
                  type="submit"
                  disabled={testimonialSubmitting}
                  className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  <Send size={20} />
                  <span>{testimonialSubmitting ? 'Submitting...' : 'Submit Testimonial'}</span>
                </button>
              </form>
            </div>
          )}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            KKN Kebangsaan XIII – Tim Pulau Laiya
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h4 className="font-semibold text-gray-900 text-sm">{member.name}</h4>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <p className="text-xs text-gray-600">{member.university}</p>
                </div>
                <p className="text-xs text-gray-500">{member.major}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;