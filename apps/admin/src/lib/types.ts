export interface Project {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  content: string | null;
  coverImage: string | null;
  images: string[];
  tags: string[];
  stack: string[];
  linkLive: string | null;
  linkRepo: string | null;
  client: string | null;
  date: string | null;
  order: number;
  isBest: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  location: string | null;
  description: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string | null;
  level: number;
  icon: string | null;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
}

export interface Template {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  notes: string | null;
  websiteUrl: string | null;
  sourceUrl: string | null;
  authorName: string | null;
  authorUrl: string | null;
  authorImage: string | null;
  coverImage: string | null;
  mobileImage: string | null;
  images: string[];
  sections: string[];
  features: string[];
  categories: string[];
  styles: string[];
  typefaces: string[];
  tags: string[];
  colors: string[];
  stack: string[];
  publishedAt: string | null;
  price: 'free' | 'paid' | null;
  rating: number | null;
  isFavorite: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiToken {
  id: number;
  name: string;
  prefix: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
}
