/**
 * Database Schema & Type Definitions
 * 고양 DMC 예약 시스템 데이터 구조
 */

// ============ Users (관리자 사용자) ============
export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'super_admin' | 'operator' | 'editor' | 'partner_manager';
  status: 'active' | 'inactive';
  last_login_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// ============ Products (상품) ============
export interface Product {
  id: string;
  partner_id?: string;
  product_type: 'stay' | 'experience' | 'tour' | 'package';
  title: string;
  slug: string;
  summary?: string;
  description: string;
  location?: string;
  duration_text?: string;
  min_people?: number;
  max_people?: number;
  base_price?: number;
  price_type: 'fixed' | 'from' | 'inquiry';
  is_bookable: boolean;
  status: 'draft' | 'published' | 'hidden';
  thumbnail_id?: string;
  lang: 'ko' | 'en';
  created_at: Date;
  updated_at: Date;
}

// ============ Product Options (상품 옵션/패키지) ============
export interface ProductOption {
  id: string;
  product_id: string;
  option_name: string;
  price?: number;
  capacity?: number;
  status: 'active' | 'inactive';
  sort_order?: number;
}

// ============ Product Schedules (예약 가능 일정) ============
export interface ProductSchedule {
  id: string;
  product_id: string;
  option_id?: string;
  schedule_date: Date;
  start_time?: string;
  end_time?: string;
  quota?: number;
  remaining_quota?: number;
  status: 'open' | 'closed' | 'soldout';
}

// ============ Bookings (예약 신청) ============
export interface Booking {
  id: string;
  booking_no: string;
  product_id: string;
  option_id?: string;
  schedule_id?: string;
  customer_name: string;
  organization_name?: string;
  phone: string;
  email: string;
  booking_date: Date;
  guest_count: number;
  unit_price?: number;
  total_price?: number;
  request_note?: string;
  status: 'received' | 'reviewing' | 'confirmed' | 'on_hold' | 'cancelled';
  privacy_agreed: boolean;
  created_at: Date;
  updated_at: Date;
}

// ============ Inquiries (문의 접수) ============
export interface Inquiry {
  id: string;
  inquiry_type: 'research' | 'policy' | 'dmc' | 'booking' | 'event' | 'partnership';
  organization_name?: string;
  contact_name: string;
  phone: string;
  email: string;
  subject?: string;
  event_date?: Date;
  expected_people?: number;
  budget_text?: string;
  message: string;
  status: 'received' | 'reviewing' | 'replied' | 'closed';
  privacy_agreed: boolean;
  created_at: Date;
}

// ============ Partners (제휴 파트너) ============
export interface Partner {
  id: string;
  name: string;
  partner_type: 'stay' | 'experience' | 'tour' | 'transport' | 'vip' | 'venue';
  contact_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: 'active' | 'inactive';
  notes?: string;
  created_at: Date;
}

// ============ Pages (정적 페이지 콘텐츠) ============
export interface Page {
  id: string;
  page_key: string;
  title: string;
  slug: string;
  content_json: Record<string, unknown>;
  lang: 'ko' | 'en';
  status: 'draft' | 'published';
  seo_title?: string;
  seo_description?: string;
  created_at: Date;
  updated_at: Date;
}

// ============ Posts (뉴스·공지·리포트) ============
export interface Post {
  id: string;
  category: 'notice' | 'press' | 'report' | 'archive' | 'event';
  title: string;
  slug: string;
  summary?: string;
  content: string;
  thumbnail_id?: string;
  attachment_id?: string;
  is_pinned?: boolean;
  status: 'draft' | 'published';
  published_at?: Date;
  lang: 'ko' | 'en';
}

// ============ Projects (프로젝트·실적) ============
export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'research' | 'event' | 'dmc' | 'branding' | 'partnership';
  summary?: string;
  content: string;
  start_date?: Date;
  end_date?: Date;
  result_text?: string;
  thumbnail_id?: string;
  status: 'draft' | 'published';
  lang: 'ko' | 'en';
}

// ============ Media Files (파일/이미지) ============
export interface MediaFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size?: number;
  alt_text?: string;
  uploaded_by?: string;
  created_at: Date;
}

// ============ API Response Types ============
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface BookingRequest {
  product_id: string;
  option_id?: string;
  schedule_id?: string;
  customer_name: string;
  organization_name?: string;
  phone: string;
  email: string;
  booking_date: string;
  guest_count: number;
  unit_price?: number;
  total_price?: number;
  request_note?: string;
  privacy_agreed: boolean;
}

export interface InquiryRequest {
  inquiry_type: string;
  organization_name?: string;
  contact_name: string;
  phone: string;
  email: string;
  subject?: string;
  event_date?: string;
  expected_people?: number;
  budget_text?: string;
  message: string;
  privacy_agreed: boolean;
}
