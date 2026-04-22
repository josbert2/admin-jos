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
