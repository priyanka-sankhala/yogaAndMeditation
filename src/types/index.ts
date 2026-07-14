// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  phone: string | null;
  isActive: boolean;
  isSuspended: boolean;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | null;
  gender: Gender | null;
  bio: string | null;
  profilePhoto: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  timezone: string;
  meditationLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  yogaLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  darkMode: boolean;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

// Subscription types
export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  monthlyPrice: number;
  halfYearlyPrice: number | null;
  yearlyPrice: number | null;
  currency: string;
  features: string[];
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  planDuration: 'MONTHLY' | 'HALF_YEARLY' | 'YEARLY';
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'CANCELLED' | 'SUSPENDED';

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionId: string | null;
  createdAt: Date;
}

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

// Content types
export interface Video {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  thumbnail_hd: string | null;
  duration: number;
  difficulty: ContentDifficulty;
  categoryId: string;
  category: Category;
  instructorId: string;
  instructor: Instructor;
  tags: Tag[];
  videoUrl: string; // S3 key, not direct URL
  format: string | null;
  resolution: string | null;
  language: string;
  views: number;
  rating: number | null;
  ratingCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  requiresSubscription: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Audio {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  audioType: AudioType;
  duration: number;
  difficulty: ContentDifficulty;
  categoryId: string;
  category: Category;
  instructorId: string;
  instructor: Instructor;
  tags: Tag[];
  audioUrl: string; // S3 key, not direct URL
  format: string | null;
  language: string;
  plays: number;
  rating: number | null;
  ratingCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  offlineAvailable: boolean;
  requiresSubscription: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AudioType =
  | 'MEDITATION'
  | 'BREATHING_EXERCISE'
  | 'MANTRA'
  | 'SLEEP_STORY'
  | 'SPIRITUAL_TALK'
  | 'HEALING_SESSION';

export type ContentDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  isActive: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  bio: string | null;
  profileImage: string | null;
  specialization: string[];
  experience: number | null;
  languages: string[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// Referral types
export interface ReferralMetric {
  id: string;
  userId: string;
  totalInvites: number;
  registeredCount: number;
  subscribedCount: number;
  activeCount: number;
  totalEarned: number;
  totalRedeemed: number;
  availableBalance: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
}

export interface ReferralReward {
  id: string;
  userId: string;
  amount: number;
  type: RewardType;
  status: RewardStatus;
  createdAt: Date;
}

export type RewardType =
  | 'REFERRER_BONUS'
  | 'REFERRED_BONUS'
  | 'LEVEL_2_BONUS'
  | 'LEVEL_3_BONUS'
  | 'MILESTONE_BONUS';

export type RewardStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID_OUT' | 'EXPIRED';

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl: string | null;
  isRead: boolean;
  readAt: Date | null;
  channels: NotificationChannel[];
  createdAt: Date;
}

export type NotificationType =
  | 'SUBSCRIPTION_EXPIRING'
  | 'SUBSCRIPTION_RENEWED'
  | 'NEW_CONTENT'
  | 'REFERRAL_REGISTERED'
  | 'REFERRAL_SUBSCRIBED'
  | 'REWARD_EARNED'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_SUCCESS'
  | 'DAILY_REMINDER'
  | 'ANNOUNCEMENT';

export type NotificationChannel = 'EMAIL' | 'PUSH' | 'IN_APP' | 'SMS';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
