export type UserRole = 'public' | 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  description: string;
  yearGroup: string;
  dueDate: string; // YYYY-MM-DD format
  isLive: boolean;
  liveDate?: string; // YYYY-MM-DD format
  createdAt: string; // YYYY-MM-DD format
  updatedAt: string; // YYYY-MM-DD format
  createdBy: string; // admin user ID
  imageUrl?: string; // optional image for display
}

export interface UserHomework {
  id: string;
  userId: string;
  homeworkId: string;
  completedAt: Date;
  completed: boolean;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  gameUrl: string;
  category: string;
  featured: boolean;
}

export interface AIAssistant {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  assistantUrl: string;
  category: string;
  featured: boolean;
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalHomework: number;
  completedHomework: number;
  activeUsers: number;
} 