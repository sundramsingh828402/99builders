export type PageId =
  | 'home'
  | 'about'
  | 'profile'
  | 'team'
  | 'projects'
  | 'project-detail'
  | 'residential'
  | 'commercial'
  | 'services'
  | 'service-detail'
  | 'locations'
  | 'media-gallery'
  | 'video-gallery'
  | 'news'
  | 'news-article'
  | 'press'
  | 'blog'
  | 'events'
  | 'careers'
  | 'contact'
  | 'site-visit'
  | 'download-brochure'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'disclaimer'
  | 'not-found'
  | 'admin'
  | 'admin-login';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'editor' | 'lead_manager';
}

export interface EnquiryRecord {
  id: string;
  form_type: string;
  name: string;
  email: string;
  phone: string;
  project_id?: string;
  subject?: string;
  message?: string;
  status: 'new' | 'contacted' | 'site_visit_scheduled' | 'negotiation' | 'closed' | 'archived';
  assigned_to?: string;
  internal_notes?: string;
  preferred_date?: string;
  preferred_time?: string;
  meta?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MediaRecord {
  id: string;
  title: string;
  file_url: string;
  file_type: 'image' | 'video' | 'document';
  file_size: number;
  category: string;
  caption?: string;
  created_at: string;
}

export interface AuditLogRecord {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'residential' | 'commercial';
  subCategory: string;
  status: 'ongoing' | 'completed' | 'upcoming';
  location: string;
  cityHub: string;
  priceStarting: string;
  unitsOrArea: string;
  reraNumber: string;
  heroImage: string;
  gallery: string[];
  videoTourUrl: string;
  overview: string;
  architectureFirm: string;
  overallProgress?: number;
  possessionDate: string;
  amenities: { name: string; description: string }[];
  specifications: { category: string; items: string[] }[];
  milestones: { stage: string; status: 'completed' | 'in-progress' | 'upcoming'; date: string; progressPercent: number }[];
  featured?: boolean;
}

export interface ConstructionService {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  heroImage: string;
  deliverables: string[];
  methodology: { step: string; title: string; desc: string }[];
  stats: { label: string; value: string }[];
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  image: string;
  credentials: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Corporate' | 'Groundbreaking' | 'Sustainability' | 'Award' | 'Press' | 'Insight';
  date: string;
  readTime: string;
  summary: string;
  content: string[];
  image: string;
  author: string;
  tags: string[];
  isPressRelease?: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  category: 'Exterior' | 'Interior' | 'Amenities' | 'Drone & Site' | 'Milestone' | 'Awards & Milestones';
  url: string;
  caption: string;
  projectRef?: string;
  duration?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Expo' | 'Open House' | 'Groundbreaking' | 'Investor Meet';
  description: string;
  rsvpOpen: boolean;
  image: string;
}

export interface CareerPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'Homebuyers' | 'Commercial Tenants' | 'NRI Investors' | 'NRI Services' | 'Construction & Quality' | 'RERA & Legal';
}
