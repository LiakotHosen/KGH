export interface DbDoctor {
  id: string;
  name_en: string;
  name_bn: string;
  specialty_en: string;
  specialty_bn: string;
  degrees_en: string;
  degrees_bn: string;
  schedule: {
    availableDaysEn: string;
    availableDaysBn: string;
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    note?: { en: string; bn: string };
  };
  bio_en: string;
  bio_bn: string;
  photo_url: string;
  bmdc_reg?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DbDepartment {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string;
  short_desc_en: string;
  short_desc_bn: string;
  icon_name: string;
  lead_doctor_id?: string;
  image_url: string;
  sort_order?: number;
  created_at?: string;
}

export interface DbSubService {
  id: string;
  department_id: string;
  number: number;
  name_en: string;
  name_bn: string;
  why_en: string;
  why_bn: string;
  when_en: string;
  when_bn: string;
  benefit_en: string;
  benefit_bn: string;
  created_at?: string;
}

export interface DbAppointment {
  id: string;
  reference_code: string;
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  doctor_id?: string;
  department_id?: string;
  appointment_date: string;
  time_slot: string;
  symptoms?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbBlogPost {
  id: string;
  slug: string;
  title_en: string;
  title_bn: string;
  excerpt_en: string;
  excerpt_bn: string;
  department_slug: string;
  department_name_en: string;
  department_name_bn: string;
  read_time: string;
  date: string;
  content: {
    hook: { en: string; bn: string };
    overview: { en: string; bn: string };
    symptomsOrOptions: Array<{ en: string; bn: string }>;
    procedureOrExpectations: { en: string; bn: string };
    preventionOrAftercare: { en: string; bn: string };
  };
  is_published: boolean;
  created_at?: string;
}

export interface DbGalleryItem {
  id: string;
  title_en: string;
  title_bn: string;
  category: "chamber" | "treatments" | "sterilization";
  desc_en: string;
  desc_bn: string;
  image_url: string;
  created_at?: string;
}

export interface DbMediaFile {
  id: string;
  name: string;
  url: string;
  size_bytes?: number;
  mime_type?: string;
  created_at?: string;
}

export interface DbClinicSettings {
  id: number;
  phone_numbers: string[];
  emergency_phone: string;
  working_hours: Array<{
    days: { en: string; bn: string };
    hours: { en: string; bn: string };
  }>;
  address_en: string;
  address_bn: string;
  is_address_placeholder: boolean;
  updated_at?: string;
}
