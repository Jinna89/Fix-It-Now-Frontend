// Types mirrored from the FixItNow backend Prisma schema.

export type Role = 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BANNED';
export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
  technicianProfile?: TechnicianProfile | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  bio?: string | null;
  skills: string[];
  experienceYears: number;
  hourlyRate: string | number;
  location?: string | null;
  avgRating: string | number;
  totalReviews: number;
  isAvailable: boolean;
  user?: Pick<User, 'id' | 'name' | 'email' | 'phone'>;
  services?: Service[];
  availability?: Availability[];
  reviews?: Review[];
}

export interface Service {
  id: string;
  technicianId: string;
  categoryId: string;
  category?: Category;
  technician?: TechnicianProfile;
  title: string;
  description?: string | null;
  price: string | number;
  durationMins: number;
  location?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface Availability {
  id: string;
  technicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  customer?: Pick<User, 'id' | 'name' | 'email' | 'phone'>;
  technicianId: string;
  technician?: TechnicianProfile;
  serviceId: string;
  service?: Service;
  availabilityId?: string | null;
  availability?: Availability | null;
  scheduledAt: string;
  status: BookingStatus;
  notes?: string | null;
  cancelReason?: string | null;
  createdAt: string;
  payment?: Payment | null;
  review?: Review | null;
}

export interface Payment {
  id: string;
  bookingId: string;
  booking?: Booking;
  userId: string;
  transactionId: string;
  amount: string | number;
  method?: string | null;
  provider: 'SSLCOMMERZ' | 'STRIPE';
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customer?: Pick<User, 'id' | 'name'>;
  technicianId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
}

export interface ApiErrorShape {
  success: false;
  message: string;
  errorDetails: unknown;
}

export interface ServiceFilters {
  category?: string;
  location?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface TechnicianFilters {
  // ...existing fields stay exactly as they are...
  [key: string]: string | number | boolean | null | undefined;
}