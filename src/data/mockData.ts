import { Destination, TourPackage, CulturalContent, MSMEProduct, Article, Testimonial, Transportation, Amenity } from '../types';

export const destinations: Destination[] = [
  {
    id: '1',
    title: 'Pantai Laiya',
    description: 'Pantai berpasir putih yang masih alami dengan air laut yang jernih, sempurna untuk berenang dan snorkeling. Pantai ini menawarkan pemandangan matahari terbit yang menakjubkan dan dikelilingi oleh pohon kelapa.',
    shortDescription: 'Pantai berpasir putih alami dengan air laut jernih',
    image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'beaches',
    location: { lat: -5.1234, lng: 119.5678 },
    gallery: [
      'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
  },
  {
    id: '2',
    title: 'Taman Karang',
    description: 'Surga bawah laut dengan kehidupan laut yang beragam dan formasi karang yang berwarna-warni. Sempurna untuk para penggemar diving dan snorkeling.',
    shortDescription: 'Surga bawah laut dengan kehidupan laut yang beragam',
    image: 'https://images.pexels.com/photos/1680779/pexels-photo-1680779.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'nature',
    location: { lat: -5.1300, lng: 119.5700 },
    gallery: [
      'https://images.pexels.com/photos/1680779/pexels-photo-1680779.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
  },
  {
    id: '3',
    title: 'Desa Tradisional',
    description: 'Rasakan budaya lokal yang autentik di Desa Mattiro Labangeng, tempat rumah-rumah tradisional dan adat istiadat masih dilestarikan.',
    shortDescription: 'Budaya lokal autentik dan rumah-rumah tradisional',
    image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'culture',
    location: { lat: -5.1200, lng: 119.5650 },
    gallery: [
      'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
  },
];

export const tourPackages: TourPackage[] = [
  {
    id: '1',
    name: 'Petualangan Island Hopping',
    price: 750000,
    facilities: ['Transportasi kapal', 'Peralatan snorkeling', 'Makan siang', 'Pemandu lokal'],
    duration: '8 jam',
    minPersons: 4,
    description: 'Jelajahi beberapa pulau di sekitar Laiya dengan aktivitas snorkeling dan pantai.',
    image: 'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg?auto=compress&cs=tinysrgb&w=800',
    popular: true,
    whatsappContact: '+6281234567890',
  },
  {
    id: '2',
    name: 'Imersi Budaya',
    price: 500000,
    facilities: ['Tur desa', 'Makanan tradisional', 'Pertunjukan budaya', 'Workshop kerajinan'],
    duration: '6 jam',
    minPersons: 2,
    description: 'Rasakan budaya dan tradisi lokal di Desa Mattiro Labangeng.',
    image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
    whatsappContact: '+6281234567890',
  },
];

export const culturalContent: CulturalContent[] = [
  {
    id: '1',
    title: 'Tari Saman',
    description: 'Tarian tradisional yang dipentaskan saat festival dan perayaan.',
    image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'dance',
    gallery: [
      'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
  },
  {
    id: '2',
    title: 'Ikan Bakar Laiya',
    description: 'Ikan segar yang dibakar dengan bumbu tradisional dan nasi kelapa.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'culinary',
    gallery: [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
  },
];

export const msmeProducts: MSMEProduct[] = [
  {
    id: '1',
    name: 'Kerajinan Tempurung Kelapa',
    price: 125000,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Barang kerajinan indah yang dibuat dari tempurung kelapa.',
    material: 'Tempurung kelapa, serat alami',
    durability: '5+ tahun dengan perawatan yang tepat',
    deliveryTime: '3-5 hari kerja',
    sellerInfo: {
      brand: 'Kerajinan Laiya',
      whatsapp: '+6281234567890',
      shopee: 'https://shopee.co.id/kerajinanlaiya',
      instagram: '@kerajinanlaiya',
    },
    relatedProducts: ['2', '3'],
  },
];

export const articles: Article[] = [
  {
    id: '1',
    title: 'Waktu Terbaik Mengunjungi Pulau Laiya',
    content: 'Pulau Laiya indah sepanjang tahun, tetapi waktu terbaik untuk berkunjung...',
    excerpt: 'Temukan waktu yang tepat untuk mengunjungi Pulau Laiya untuk cuaca dan pengalaman terbaik.',
    image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Tim Panduan Wisata',
    date: '2024-01-15',
    category: 'tips',
    approved: true,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    rating: 5,
    review: 'Pengalaman yang luar biasa! Pulau ini adalah surga...',
    fullReview: 'Pengalaman yang luar biasa! Pulau ini adalah surga dengan air jernih dan penduduk lokal yang ramah. Pemandu wisata sangat berpengetahuan dan membuat perjalanan kami berkesan. Sangat direkomendasikan untuk siapa saja yang mencari liburan yang damai.',
    date: '2024-01-10',
  },
  {
    id: '2',
    name: 'Ahmad Rahman',
    rating: 5,
    review: 'Tempat liburan keluarga yang sempurna...',
    fullReview: 'Tempat liburan keluarga yang sempurna dengan pantai yang indah dan snorkeling yang menakjubkan. Tur budaya sangat edukatif dan menyenangkan untuk anak-anak. Pasti akan kembali lagi!',
    date: '2024-01-08',
  },
];

export const transportation: Transportation[] = [
  {
    id: '1',
    name: 'Laiya Express',
    phone: '+6281234567890',
    departureTime: '08:00, 14:00',
    dockLocation: 'Pelabuhan Bulukumba',
  },
  {
    id: '2',
    name: 'Island Hopper',
    phone: '+6281234567891',
    departureTime: '09:00, 15:00',
    dockLocation: 'Pelabuhan Bulukumba',
  },
  {
    id: '3',
    name: 'Ocean Rider',
    phone: '+6281234567892',
    departureTime: '10:00, 16:00',
    dockLocation: 'Pelabuhan Bulukumba',
  },
];

export const amenities: Amenity[] = [
  {
    id: '1',
    icon: '🚿',
    label: 'Kamar Mandi',
    description: 'Fasilitas kamar mandi yang bersih',
  },
  {
    id: '2',
    icon: '📶',
    label: 'Wi-Fi',
    description: 'Akses internet nirkabel gratis',
  },
  {
    id: '3',
    icon: '⚡',
    label: 'Listrik',
    description: 'Pasokan listrik 24 jam',
  },
  {
    id: '4',
    icon: '🏪',
    label: 'Toko',
    description: 'Toko dan pasar lokal',
  },
  {
    id: '5',
    icon: '🏥',
    label: 'Medis',
    description: 'Fasilitas medis dasar',
  },
  {
    id: '6',
    icon: '🍽️',
    label: 'Restoran',
    description: 'Masakan lokal dan internasional',
  },
];