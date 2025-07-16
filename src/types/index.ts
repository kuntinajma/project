export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'msme' | 'contributor' | 'traveler';
  verified?: boolean;
  university?: string;
  major?: string;
  photo?: string;
}

export interface Destination {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  category: 'beaches' | 'culture' | 'nature' | 'adventure';
  location: {
    lat: number;
    lng: number;
  };
  gallery: string[];
}

export interface TourPackage {
  id: string;
  name: string;
  price: number;
  facilities: string[];
  duration: string;
  minPersons: number;
  description: string;
  image: string;
  popular?: boolean;
  whatsappContact: string;
}

export interface CulturalContent {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'dance' | 'culinary' | 'customs' | 'wisdom';
  gallery: string[];
  videos?: string[];
}

export interface MSMEProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  material: string;
  durability: string;
  deliveryTime: string;
  sellerInfo: {
    brand: string;
    whatsapp: string;
    shopee?: string;
    tiktok?: string;
    instagram?: string;
  };
  relatedProducts: string[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: 'tips' | 'tourism' | 'culture' | 'msmes' | 'environment';
  approved: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
  fullReview: string;
  date: string;
}

export interface Transportation {
  id: string;
  name: string;
  phone: string;
  departureTime: string;
  dockLocation: string;
}

export interface Amenity {
  id: string;
  icon: string;
  label: string;
  description: string;
}