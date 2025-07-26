export interface User {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "msme" | "contributor" | "traveler";
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
  category: "beaches" | "culture" | "nature" | "adventure";
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
  maxPersons?: number;
  description: string;
  image: string;
  popular?: boolean;
  whatsappContact: string;
  whatsappBookingUrl?: string;
}

export interface CulturalContent {
  id: string;
  title: string;
  description: string;
  image: string;
  category: "dance" | "culinary" | "customs" | "wisdom";
  gallery: string[];
  videos?: string[];
  videoUrl?: string;
}

export interface MSMEProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: string;
  material: string;
  durability: string;
  deliveryTime: string;
  msme_id: string;
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
  featuredImage: string; // Changed from 'image' to match API
  authorName: string; // Changed from 'author' to match API
  publishedAt: string; // Changed from 'date' to match API
  category: "tips" | "tourism" | "culture" | "msmes" | "environment";
  status: "draft" | "pending" | "published" | "rejected";
  isFeatured: boolean;
  viewCount: number;
  tags: string[];
  slug: string;
  createdAt: string;
  updatedAt: string;
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
  id: string | number;
  name: string;
  type: "speedboat" | "boat" | "ferry";
  phone: string;
  whatsapp?: string;
  departureTime: string;
  dockLocation: string;
  capacity?: number;
  pricePerPerson?: number;
  duration: string;
  status: "active" | "inactive";
  notes?: string;
}

export interface Amenity {
  id: string;
  icon: string;
  label: string;
  description: string;
}

export interface MSME {
  id: string;
  brand: string;
  description: string;
  phone: string;
  whatsapp: string;
  shopee: string;
  instagram: string;
  user_id: string;
}