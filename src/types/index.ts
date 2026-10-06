export type ContentStatus = 'draft' | 'published';

export interface SiteSettings {
  id?: string;
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  heroHeadline?: string;
  heroDescription?: string;
  heroBadge?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  content?: string;
  features: string[];
  benefits?: string[];
  technologies: string[];
  milestones?: { phase: string; title: string; duration: string }[];
  imageUrl?: string;
  featured: boolean;
  status: ContentStatus;
  sortOrder: number;
  serviceCode?: string;
  tierBadge?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  slug: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Enterprise';
  duration: string;
  hours: string;
  seats: string;
  rating: string;
  price: string;
  shortDescription: string;
  description: string;
  technologies: string[];
  curriculum: { module: string; topics: string }[];
  learningOutcomes?: string[];
  prerequisites?: string[];
  registrationUrl?: string;
  imageUrl?: string;
  featured: boolean;
  status: ContentStatus;
  sortOrder: number;
  cohortStartDate?: string;
  schedule?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  sourceUrl?: string;
  featured: boolean;
  status: ContentStatus;
  sortOrder: number;
  badge?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileUrl: string;
  fileSize?: string;
  downloadCount: number;
  featured: boolean;
  status: ContentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  photoUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  sortOrder: number;
  status: ContentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type InquiryStatus = 'New' | 'In Progress' | 'Resolved';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  budget?: string;
  timeline?: string;
  subject?: string;
  message: string;
  services?: string[];
  status: InquiryStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminAuditLog {
  id: string;
  adminEmail: string;
  action: string;
  contentType: string;
  recordId?: string;
  details: string;
  timestamp: string;
}
