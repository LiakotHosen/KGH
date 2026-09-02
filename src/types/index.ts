export type Language = 'en' | 'bn';

export interface BilingualText {
  en: string;
  bn: string;
}

export interface SubService {
  id: string;
  number: number;
  name: BilingualText;
  why: BilingualText;
  when: BilingualText;
  benefit: BilingualText;
  imagePlaceholder?: string;
}

export interface Department {
  id: string;
  slug: string;
  name: BilingualText;
  shortDesc: BilingualText;
  iconName: string;
  leadDoctorId?: string;
  imageUrl: string;
  subServices: SubService[];
}

export interface DoctorSchedule {
  availableDaysEn: string;
  availableDaysBn: string;
  daysOfWeek: number[]; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  startTime: string; // e.g., "17:00"
  endTime: string; // e.g., "21:30"
  slotDurationMinutes: number;
  note?: BilingualText;
}

export interface Doctor {
  id: string;
  name: BilingualText;
  slug: string;
  specialty: BilingualText;
  departmentId?: string;
  degrees: BilingualText;
  designation?: BilingualText;
  institution?: BilingualText;
  bmdcReg?: string;
  bio: BilingualText;
  photoUrl: string;
  experience?: BilingualText;
  schedule: DoctorSchedule;
  isConfirmed: boolean;
  isActive?: boolean;
}

export interface GoogleReview {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  comment: BilingualText;
  treatment?: BilingualText;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: BilingualText;
  excerpt: BilingualText;
  departmentSlug: string;
  departmentName: BilingualText;
  readTime: string;
  date: string;
  targetKeyword: string;
  content: {
    hook: BilingualText;
    overview: BilingualText;
    symptomsOrOptions: BilingualText[];
    procedureOrExpectations: BilingualText;
    preventionOrAftercare: BilingualText;
  };
}

export interface AppointmentBooking {
  id?: string;
  doctorId: string;
  departmentId?: string;
  date: string;
  timeSlot: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  notes?: string;
  createdAt?: string;
}

export interface ClinicSettings {
  name: string;
  tagline: BilingualText;
  phoneNumbers: string[];
  emergencyPhone: string;
  email: string;
  address: BilingualText;
  isAddressPlaceholder: boolean;
  workingHours: {
    days: BilingualText;
    hours: BilingualText;
  }[];
  googleReviewUrl: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}
