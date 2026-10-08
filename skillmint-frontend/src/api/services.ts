import api from './axiosInstance';
import type {
  ApiResponse, JwtResponse, User,
  CourseCard, Course, Category, Instructor, PagedResponse, CourseFilters,
  Order, CreateOrderResponse
} from '../types';

// ── AUTH ─────────────────────────────────────────────────────
export const authApi = {
  signup: (data: { fullName: string; email: string; password: string; confirmPassword: string }) =>
    api.post<ApiResponse<JwtResponse>>('/auth/signup', data),

  signin: (data: { email: string; password: string }) =>
    api.post<ApiResponse<JwtResponse>>('/auth/signin', data),

  forgotPassword: (email: string) =>
    api.post<ApiResponse>('/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; newPassword: string; confirmPassword: string }) =>
    api.post<ApiResponse>('/auth/reset-password', data),
};

// ── COURSES ───────────────────────────────────────────────────
export const courseApi = {
  getAll: (filters: CourseFilters = {}) =>
    api.get<ApiResponse<PagedResponse<CourseCard>>>('/courses', { params: filters }),

  getById: (id: number) =>
    api.get<ApiResponse<Course>>(`/courses/${id}`),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Course>>(`/courses/slug/${slug}`),

  getFeatured: () =>
    api.get<ApiResponse<CourseCard[]>>('/courses/featured'),

  getTrending: () =>
    api.get<ApiResponse<CourseCard[]>>('/courses/trending'),

  getByType: (type: 'TECHNOLOGY' | 'MANAGEMENT') =>
    api.get<ApiResponse<CourseCard[]>>(`/courses/type/${type}`),
};

// ── CATEGORIES ────────────────────────────────────────────────
export const categoryApi = {
  getAll: () =>
    api.get<ApiResponse<Category[]>>('/categories'),

  getByType: (type: 'TECHNOLOGY' | 'MANAGEMENT') =>
    api.get<ApiResponse<Category[]>>(`/categories/type/${type}`),
};

// ── INSTRUCTORS ───────────────────────────────────────────────
export const instructorApi = {
  getAll: () =>
    api.get<ApiResponse<Instructor[]>>('/instructors'),

  getById: (id: number) =>
    api.get<ApiResponse<Instructor>>(`/instructors/${id}`),
};

// ── CART ──────────────────────────────────────────────────────
export const cartApi = {
  get: () =>
    api.get<ApiResponse<CourseCard[]>>('/cart'),

  add: (courseId: number) =>
    api.post<ApiResponse>('/cart/add', { courseId }),

  remove: (courseId: number) =>
    api.delete<ApiResponse>(`/cart/remove/${courseId}`),

  clear: () =>
    api.delete<ApiResponse>('/cart/clear'),
};

// ── WISHLIST ──────────────────────────────────────────────────
export const wishlistApi = {
  get: () =>
    api.get<ApiResponse<CourseCard[]>>('/wishlist'),

  toggle: (courseId: number) =>
    api.post<ApiResponse<{ added: boolean }>>('/wishlist/toggle', { courseId }),

  check: (courseId: number) =>
    api.get<ApiResponse<{ wishlisted: boolean }>>(`/wishlist/check/${courseId}`),
};

// ── ORDERS ────────────────────────────────────────────────────
export const orderApi = {
  getAll: () =>
    api.get<ApiResponse<Order[]>>('/orders'),

  getById: (id: number) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`),
};

// ── PAYMENT ───────────────────────────────────────────────────
export const paymentApi = {
  createOrder: (courseIds: number[]) =>
    api.post<ApiResponse<CreateOrderResponse>>('/payment/create-order', { courseIds }),

  verify: (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderNumber: string;
  }) => api.post<ApiResponse>('/payment/verify', data),
};

// ── ENROLLMENTS ───────────────────────────────────────────────
export const enrollmentApi = {
  getMyCourses: () =>
    api.get<ApiResponse<CourseCard[]>>('/enrollments/my-courses'),

  check: (courseId: number) =>
    api.get<ApiResponse<{ enrolled: boolean }>>(`/enrollments/check/${courseId}`),
};

// ── USER ──────────────────────────────────────────────────────
export const userApi = {
  getProfile: () =>
    api.get<ApiResponse<User>>('/users/profile'),

  updateProfile: (data: Partial<User>) =>
    api.put<ApiResponse>('/users/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    api.put<ApiResponse>('/users/change-password', data),
};
