// Course related types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  type: 'TECHNOLOGY' | 'MANAGEMENT';
  courseCount: number;
}

export interface Instructor {
  id: number;
  name: string;
  bio: string;
  designation: string;
  profilePictureUrl: string;
  linkedinUrl?: string;
  yearsOfExperience: number;
  rating: number;
  totalStudents: number;
  totalCourses: number;
}

export interface CourseCard {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  totalDuration: string;
  totalLessons: number;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  rating: number;
  totalReviews: number;
  totalStudents: number;
  featured: boolean;
  trending: boolean;
  instructor: Instructor;
  category: Category;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  videoUrl?: string;
  youtubeVideoId?: string;
  duration: string;
  preview: boolean;
  sectionName: string;
  displayOrder: number;
}

export interface CourseProgressDTO {
  courseId: number;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  completedLessonIds: number[];
  isCompleted: boolean;
}

export interface Review {
  id: number;
  userName: string;
  userProfilePicture?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type CategoryDTO = Category;
export type InstructorDTO = Instructor;
export type CourseCardDTO = CourseCard;
export type LessonDTO = Lesson;
export type CourseDTO = Course;

export interface Course extends CourseCard {
  description: string;
  whatYouWillLearn: string[];
  requirements: string[];
  previewVideoUrl?: string;
  language: string;
  lessons: Lesson[];
  recentReviews: Review[];
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// Auth types
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  bio?: string;
  profilePictureUrl?: string;
  role: 'USER' | 'ADMIN' | 'INSTRUCTOR';
  createdAt: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Payment types
export interface CreateOrderResponse {
  razorpayOrderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  keyId: string;
}

// Order types
export interface OrderItem {
  id: number;
  course: CourseCard;
  price: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  items: OrderItem[];
  createdAt: string;
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// Filter types
export interface CourseFilters {
  q?: string;
  type?: string;
  categoryId?: number;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  size?: number;
}
