import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { DOCTORS } from "@/data/doctors";
import { DEPARTMENTS } from "@/data/departments";
import { CLINIC_SETTINGS } from "@/data/settings";
import { BLOG_POSTS } from "@/data/blog";
import { REVIEWS } from "@/data/reviews";
import {
  Doctor,
  Department,
  SubService,
  ClinicSettings,
  BlogPost,
  GalleryItem,
  GoogleReview,
  WhyChooseCard,
  ClinicalCreedData,
} from "@/types";

// ==============================================================================
// 1. DOCTORS API
// ==============================================================================

export async function fetchLiveDoctors(): Promise<Doctor[]> {
  if (!isSupabaseConfigured) return DOCTORS;

  try {
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return DOCTORS;
    }

    const liveDocs = data.map((d: any) => {
      const staticDoc = DOCTORS.find((s) => s.id === d.id);
      return {
        id: d.id,
        slug: staticDoc?.slug || d.id,
        name: { en: d.name_en, bn: d.name_bn },
        specialty: { en: d.specialty_en, bn: d.specialty_bn },
        degrees: { en: d.degrees_en, bn: d.degrees_bn },
        designation: d.designation_en ? { en: d.designation_en, bn: d.designation_bn } : staticDoc?.designation,
        institution: d.institution_en ? { en: d.institution_en, bn: d.institution_bn } : staticDoc?.institution,
        experience: d.experience_en ? { en: d.experience_en, bn: d.experience_bn } : staticDoc?.experience,
        departmentId: d.department_id || staticDoc?.departmentId,
        schedule: d.schedule,
        bio: { en: d.bio_en, bn: d.bio_bn },
        photoUrl: d.photo_url || staticDoc?.photoUrl || "/images/doctors/dr-diean.jpg",
        bmdcReg: d.bmdc_reg || staticDoc?.bmdcReg || "",
        isConfirmed: true,
        isActive: d.is_active ?? true,
      };
    });

    const missingStaticDocs = DOCTORS.filter((s) => !liveDocs.some((l) => l.id === s.id));
    return [...liveDocs, ...missingStaticDocs];
  } catch (err) {
    console.error("fetchLiveDoctors error:", err);
    return DOCTORS;
  }
}

export async function saveLiveDoctor(doc: Doctor): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const payload = {
      id: doc.id,
      name_en: doc.name.en,
      name_bn: doc.name.bn,
      specialty_en: doc.specialty.en,
      specialty_bn: doc.specialty.bn,
      degrees_en: doc.degrees.en,
      degrees_bn: doc.degrees.bn,
      schedule: doc.schedule,
      bio_en: doc.bio.en,
      bio_bn: doc.bio.bn,
      photo_url: doc.photoUrl,
      bmdc_reg: doc.bmdcReg || null,
      is_active: doc.isActive ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("doctors").upsert(payload, { onConflict: "id" });
    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    console.error("saveLiveDoctor error:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteLiveDoctor(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("deleteLiveDoctor error:", err);
    return { success: false, error: err.message };
  }
}

// ==============================================================================
// 2. DEPARTMENTS & SUB-SERVICES API
// ==============================================================================

export async function fetchLiveDepartments(): Promise<Department[]> {
  if (!isSupabaseConfigured) return DEPARTMENTS;

  try {
    const { data: deptData, error: deptErr } = await supabase
      .from("departments")
      .select("*")
      .order("sort_order", { ascending: true });

    const { data: subData, error: subErr } = await supabase
      .from("sub_services")
      .select("*")
      .order("number", { ascending: true });

    if (deptErr || !deptData || deptData.length === 0) {
      return DEPARTMENTS;
    }

    const liveDepts = deptData.map((d: any) => {
      const subsForDept = (subData || [])
        .filter((s: any) => s.department_id === d.id)
        .map((s: any) => ({
          id: s.id,
          number: s.number,
          name: { en: s.name_en, bn: s.name_bn },
          why: { en: s.why_en, bn: s.why_bn },
          when: { en: s.when_en, bn: s.when_bn },
          benefit: { en: s.benefit_en, bn: s.benefit_bn },
        }));

      return {
        id: d.id,
        slug: d.slug,
        name: { en: d.name_en, bn: d.name_bn },
        shortDesc: { en: d.short_desc_en, bn: d.short_desc_bn },
        iconName: d.icon_name,
        leadDoctorId: d.lead_doctor_id,
        imageUrl: d.image_url,
        subServices: subsForDept.length > 0 ? subsForDept : (DEPARTMENTS.find(dep => dep.id === d.id)?.subServices || []),
      };
    });

    const missingStaticDepts = DEPARTMENTS.filter((s) => !liveDepts.some((l) => l.id === s.id));
    return [...liveDepts, ...missingStaticDepts];
  } catch (err) {
    console.error("fetchLiveDepartments error:", err);
    return DEPARTMENTS;
  }
}

export async function saveLiveDepartment(dept: Department): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const payload = {
      id: dept.id,
      slug: dept.slug,
      name_en: dept.name.en,
      name_bn: dept.name.bn,
      short_desc_en: dept.shortDesc.en,
      short_desc_bn: dept.shortDesc.bn,
      icon_name: dept.iconName,
      lead_doctor_id: dept.leadDoctorId || null,
      image_url: dept.imageUrl,
    };

    const { error } = await supabase.from("departments").upsert(payload, { onConflict: "id" });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("saveLiveDepartment error:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteLiveDepartment(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    // Remove linked sub-services first
    await supabase.from("sub_services").delete().eq("department_id", id);
    const { error } = await supabase.from("departments").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("deleteLiveDepartment error:", err);
    return { success: false, error: err.message };
  }
}

export async function saveLiveSubService(
  deptId: string,
  sub: SubService
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const payload = {
      id: sub.id.includes(deptId) ? sub.id : `${deptId}-${sub.id}`,
      department_id: deptId,
      number: sub.number,
      name_en: sub.name.en,
      name_bn: sub.name.bn,
      why_en: sub.why.en,
      why_bn: sub.why.bn,
      when_en: sub.when.en,
      when_bn: sub.when.bn,
      benefit_en: sub.benefit.en,
      benefit_bn: sub.benefit.bn,
    };

    const { error } = await supabase.from("sub_services").upsert(payload, { onConflict: "id" });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("saveLiveSubService error:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteLiveSubService(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const { error } = await supabase.from("sub_services").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("deleteLiveSubService error:", err);
    return { success: false, error: err.message };
  }
}

// ==============================================================================
// 3. APPOINTMENTS API
// ==============================================================================

export async function fetchLiveAppointments(): Promise<any[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((a: any) => ({
      id: a.id,
      reference_code: a.reference_code,
      patient_name: a.patient_name,
      patient_phone: a.patient_phone,
      patient_email: a.patient_email || "",
      doctor_name: a.doctor_id || "Specialist Doctor",
      department_name: a.department_id || "General Consultation",
      appointment_date: a.appointment_date,
      time_slot: a.time_slot,
      symptoms: a.symptoms || "",
      status: a.status,
      created_at: a.created_at ? a.created_at.substring(0, 16).replace("T", " ") : "",
    }));
  } catch (err) {
    console.error("fetchLiveAppointments error:", err);
    return [];
  }
}

export async function updateLiveAppointmentStatus(
  id: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const { error } = await supabase
      .from("appointments")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("updateLiveAppointmentStatus error:", err);
    return { success: false, error: err.message };
  }
}

export async function createLiveAppointment(record: {
  reference_code: string;
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  doctor_name: string;
  department_name: string;
  appointment_date: string;
  time_slot: string;
  symptoms?: string;
  status?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const payload = {
      reference_code: record.reference_code,
      patient_name: record.patient_name,
      patient_phone: record.patient_phone,
      patient_email: record.patient_email || null,
      doctor_id: record.doctor_name,
      department_id: record.department_name,
      appointment_date: record.appointment_date,
      time_slot: record.time_slot,
      symptoms: record.symptoms || null,
      status: "pending",
    };

    const { error } = await supabase.from("appointments").insert(payload);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("createLiveAppointment error:", err);
    return { success: false, error: err.message };
  }
}

// ==============================================================================
// 4. CLINIC SETTINGS API
// ==============================================================================

export async function fetchLiveClinicSettings(): Promise<ClinicSettings> {
  let cached: ClinicSettings | null = null;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("kgh_live_clinic_settings");
      if (stored) cached = JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured) return cached || CLINIC_SETTINGS;

  try {
    const { data, error } = await supabase
      .from("clinic_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) return cached || CLINIC_SETTINGS;

    const merged: ClinicSettings = {
      ...CLINIC_SETTINGS,
      ...(cached || {}),
      phoneNumbers: data.phone_numbers || cached?.phoneNumbers || CLINIC_SETTINGS.phoneNumbers,
      emergencyPhone: data.emergency_phone || cached?.emergencyPhone || CLINIC_SETTINGS.emergencyPhone,
      workingHours: data.working_hours || cached?.workingHours || CLINIC_SETTINGS.workingHours,
      address: {
        en: data.address_en || cached?.address?.en || CLINIC_SETTINGS.address.en,
        bn: data.address_bn || cached?.address?.bn || CLINIC_SETTINGS.address.bn,
      },
      isAddressPlaceholder: data.is_address_placeholder ?? cached?.isAddressPlaceholder ?? true,
      googleReviewUrl: data.google_review_url || cached?.googleReviewUrl || CLINIC_SETTINGS.googleReviewUrl,
      socialLinks: data.social_links || cached?.socialLinks || CLINIC_SETTINGS.socialLinks,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("kgh_live_clinic_settings", JSON.stringify(merged));
      } catch {
        // ignore
      }
    }

    return merged;
  } catch (err) {
    console.error("fetchLiveClinicSettings error:", err);
    return cached || CLINIC_SETTINGS;
  }
}

export async function saveLiveClinicSettings(settings: ClinicSettings): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("kgh_live_clinic_settings", JSON.stringify(settings));
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured) return { success: true };

  try {
    const payload = {
      id: 1,
      phone_numbers: settings.phoneNumbers,
      emergency_phone: settings.emergencyPhone,
      working_hours: settings.workingHours,
      address_en: settings.address.en,
      address_bn: settings.address.bn,
      is_address_placeholder: settings.isAddressPlaceholder,
      google_review_url: settings.googleReviewUrl,
      social_links: settings.socialLinks,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("clinic_settings").upsert(payload, { onConflict: "id" });
    if (error) {
      console.warn("Supabase upsert warning for clinic_settings:", error.message);
    }
    return { success: true };
  } catch (err: any) {
    console.error("saveLiveClinicSettings error:", err);
    return { success: true };
  }
}

// ==============================================================================
// 5. GALLERY API
// ==============================================================================

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: { en: "Modern Dental Operatory Suite", bn: "আধুনিক ডেন্টাল চেয়ার ও ক্লিনিক্যাল রুম" },
    category: "chamber",
    desc: { en: "Ergonomic clinical chairs with integrated digital display systems.", bn: "রোগীর সর্বোচ্চ আরামদায়ক পরিবেশ ও ডিজিটাল মনিটরিং ব্যবস্থা।" },
    imageUrl: "/images/departments/consultation-cta.jpg",
  },
  {
    id: "gal-2",
    title: { en: "Digital 3D Intraoral Scanner", bn: "ডিজিটাল থ্রিডি ইন্ট্রাওরাল স্ক্যানার" },
    category: "treatments",
    desc: { en: "Micron-precise digital impression taking without silicone putty.", bn: "কোনো আঠালো পেস্ট ছাড়াই সেকেন্ডে দাঁতের ডিজিটাল থ্রিডি মডেল।" },
    imageUrl: "/images/departments/orthodontics.jpg",
  },
  {
    id: "gal-3",
    title: { en: "Hospital-Grade Class-B Autoclave", bn: "ক্লাস-বি অটোক্লেভ জীবাণুমুক্তকরণ ইউনিট" },
    category: "sterilization",
    desc: { en: "100% bacterial and viral eradication for every surgical instrument.", bn: "আন্তর্জাতিক মান অনুযায়ী প্রতিটি যন্ত্রের শতভাগ জীবাণুমুক্তকরণ।" },
    imageUrl: "/images/departments/oral-surgery.jpg",
  },
  {
    id: "gal-4",
    title: { en: "Clear Aligners Precision Planning", bn: "ক্লিয়ার অ্যালাইনার পরিকল্পনা" },
    category: "treatments",
    desc: { en: "Computerized orthodontic progression from initial visit to final smile.", bn: "কম্পিউটার নিয়ন্ত্রিত সুনির্দিষ্ট দাঁত সোজা করার পরিকল্পনা।" },
    imageUrl: "/images/departments/endodontics.jpg",
  },
  {
    id: "gal-5",
    title: { en: "Digital OPG & Panoramic Radiography", bn: "ডিজিটাল ওপিজি ও প্যানোরামিক এক্স-রে" },
    category: "treatments",
    desc: { en: "Ultra-low radiation high definition jaw imaging suite.", bn: "স্বল্পমাত্রার রেডিয়েশনসহ চোয়ালের উচ্চমানের ডিজিটাল প্রতিচ্ছবি।" },
    imageUrl: "/images/departments/periodontics.jpg",
  },
  {
    id: "gal-6",
    title: { en: "Patient Consultation Lounge", bn: "রোগী ও পরিবারের আরামদায়ক লাউঞ্জ" },
    category: "chamber",
    desc: { en: "Serene, quiet waiting environment designed for patient peace of mind.", bn: "মানসিক প্রশান্তিদায়ক শান্ত ও স্নিগ্ধ অপেক্ষার পরিবেশ।" },
    imageUrl: "/images/departments/prosthodontics.jpg",
  },
];

export async function fetchLiveGalleryItems(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured) return INITIAL_GALLERY;

  try {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_GALLERY;
    }

    return data.map((d: any) => ({
      id: d.id,
      title: { en: d.title_en, bn: d.title_bn },
      category: d.category,
      desc: { en: d.desc_en, bn: d.desc_bn },
      imageUrl: d.image_url,
    }));
  } catch (err) {
    console.error("fetchLiveGalleryItems error:", err);
    return INITIAL_GALLERY;
  }
}

export async function saveLiveGalleryItem(item: GalleryItem): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const payload = {
      title_en: item.title.en,
      title_bn: item.title.bn,
      category: item.category,
      desc_en: item.desc.en,
      desc_bn: item.desc.bn,
      image_url: item.imageUrl,
    };

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);

    if (isUuid) {
      const { data, error } = await supabase
        .from("gallery_items")
        .upsert({ id: item.id, ...payload })
        .select()
        .single();
      if (error) throw error;
      return { success: true, data };
    } else {
      const { data, error } = await supabase
        .from("gallery_items")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return { success: true, data };
    }
  } catch (err: any) {
    console.error("saveLiveGalleryItem error:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteLiveGalleryItem(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: true };

  try {
    const { error } = await supabase
      .from("gallery_items")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("deleteLiveGalleryItem error:", err);
    return { success: false, error: err.message };
  }
}

// ==============================================================================
// 6. REVIEWS API
// ==============================================================================

export async function fetchLiveReviews(): Promise<GoogleReview[]> {
  let cached: GoogleReview[] | null = null;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("kgh_live_reviews");
      if (stored) cached = JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured) {
    return cached && cached.length > 0 ? cached : REVIEWS;
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return cached && cached.length > 0 ? cached : REVIEWS;
    }

    const liveReviews: GoogleReview[] = data.map((d: any) => ({
      id: d.id,
      authorName: d.author_name,
      rating: d.rating || 5,
      date: d.date || "1 month ago",
      comment: {
        en: d.comment_en,
        bn: d.comment_bn,
      },
      treatment: d.treatment_en
        ? {
            en: d.treatment_en,
            bn: d.treatment_bn || d.treatment_en,
          }
        : undefined,
    }));

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("kgh_live_reviews", JSON.stringify(liveReviews));
      } catch {
        // ignore
      }
    }

    return liveReviews;
  } catch (err) {
    console.error("fetchLiveReviews error:", err);
    return cached && cached.length > 0 ? cached : REVIEWS;
  }
}

export async function saveLiveReview(review: GoogleReview): Promise<{ success: boolean; error?: string }> {
  // Sync immediately to local storage cache
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("kgh_live_reviews");
      const currentList: GoogleReview[] = stored ? JSON.parse(stored) : [...REVIEWS];
      const index = currentList.findIndex((r) => r.id === review.id);
      if (index >= 0) {
        currentList[index] = review;
      } else {
        currentList.unshift(review);
      }
      localStorage.setItem("kgh_live_reviews", JSON.stringify(currentList));
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured) return { success: true };

  try {
    const payload = {
      id: review.id,
      author_name: review.authorName,
      rating: review.rating,
      date: review.date,
      comment_en: review.comment.en,
      comment_bn: review.comment.bn,
      treatment_en: review.treatment?.en || null,
      treatment_bn: review.treatment?.bn || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("reviews").upsert(payload, { onConflict: "id" });
    if (error) {
      console.warn("Supabase upsert warning for reviews:", error.message);
    }
    return { success: true };
  } catch (err: any) {
    console.error("saveLiveReview error:", err);
    return { success: true };
  }
}

export async function deleteLiveReview(id: string): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("kgh_live_reviews");
      const currentList: GoogleReview[] = stored ? JSON.parse(stored) : [...REVIEWS];
      const filtered = currentList.filter((r) => r.id !== id);
      localStorage.setItem("kgh_live_reviews", JSON.stringify(filtered));
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured) return { success: true };

  try {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      console.warn("Supabase delete warning for reviews:", error.message);
    }
    return { success: true };
  } catch (err: any) {
    console.error("deleteLiveReview error:", err);
    return { success: true };
  }
}

// ==============================================================================
// 7. HOMEPAGE WHY CHOOSE US CARDS API
// ==============================================================================

export const DEFAULT_WHY_CHOOSE_CARDS: WhyChooseCard[] = [
  {
    id: "specialists",
    stepNumber: "01",
    badge: { en: "Specialist Board", bn: "বিশেষজ্ঞ প্যানেল" },
    title: { en: "Specialist-Led Care", bn: "বিশেষজ্ঞদের হাতে চিকিৎসা" },
    subtitle: {
      en: "Every department is led by a doctor trained specifically in that field — not a single general dentist trying to do everything.",
      bn: "প্রতিটা বিভাগ পরিচালনা করেন সেই নির্দিষ্ট বিষয়ে প্রশিক্ষিত ডাক্তার — একজন জেনারেল ডেন্টিস্ট দিয়ে সবকিছু করানো নয়।",
    },
    bullets: [
      { en: "FCPS & Masters Certified Surgeons", bn: "এফসিপিএস ও স্নাতকোত্তর ডিগ্রিধারী সার্জন" },
      { en: "Dedicated Department Heads", bn: "নির্দিষ্ট বিভাগের স্বতন্ত্র প্রধান" },
      { en: "Zero Generalist Guesswork", bn: "অনুমাননির্ভর চিকিৎসার সুযোগ নেই" },
    ],
    tags: [
      { en: "Orthodontics", bn: "অর্থোডন্টিক্স" },
      { en: "Oral Surgery", bn: "ওরাল সার্জারি" },
      { en: "Endodontics", bn: "এন্ডোডন্টিক্স" },
      { en: "Prosthodontics", bn: "প্রস্থোডন্টিক্স" },
    ],
    image: "/images/why-choose-us/specialist-care.jpg",
    accent: "#474B4E",
    protocolTitle: { en: "Specialist-Led Clinical Protocol", bn: "বিশেষজ্ঞ পরিচালিত চিকিৎসা প্রোটোকল" },
    protocolSubtitle: {
      en: "Every dental department at KGH is led exclusively by qualified specialist surgeons (FCPS, MS, PhD) who focus 100% on their specialized discipline.",
      bn: "কেজিএইচ ডেন্টালের প্রতিটি বিভাগ শুধুমাত্র উচ্চশিক্ষিত ও সার্টিফায়েড বিশেষজ্ঞ ডাক্তারদের (FCPS, MS, PhD) তত্ত্বাবধানে পরিচালিত হয়।",
    },
    protocolSteps: [
      {
        number: "01",
        title: { en: "Primary Specialty Assessment", bn: "প্রাথমিক বিভাগীয় মূল্যায়ন" },
        detail: { en: "Diagnostic imaging and focused examination by a certified department consultant.", bn: "বিভাগীয় বিশেষজ্ঞ কনসালটেন্ট কর্তৃক ডিজিটাল প্রতিচ্ছবি ও গভীর পরীক্ষা।" },
      },
      {
        number: "02",
        title: { en: "Inter-Disciplinary Board Review", bn: "সম্মিলিত মেডিকেল বোর্ড রিভিউ" },
        detail: { en: "Multi-specialist consensus on complex aligner, surgical, or implant therapies.", bn: "জটিল সার্জারি বা অ্যালাইনার চিকিৎসায় যৌথ মেডিকেল বোর্ডের সমন্বিত মতামত।" },
      },
      {
        number: "03",
        title: { en: "Precision Surgical Execution", bn: "নির্ভুল বিশেষজ্ঞ চিকিৎসা সম্পাদন" },
        detail: { en: "Implementation following global clinical guidelines and microscopic accuracy.", bn: "আন্তর্জাতিক মানদণ্ড এবং আধুনিক মাইক্রোস্কোপিক নির্ভুলতায় চিকিৎসা।" },
      },
    ],
    protocolGuarantees: [
      { en: "100% Specialist-Led Diagnosis — No Generalist Guesswork", bn: "১০০% বিশেষজ্ঞ চিকিৎসকের পরামর্শ — কোনো অনুমাননির্ভর চিকিৎসা নয়" },
    ],
  },
  {
    id: "chamber",
    stepNumber: "02",
    badge: { en: "Hospital Grade", bn: "হাসপাতাল মান" },
    title: { en: "Modern, Comfortable Chamber", bn: "আধুনিক ও আরামদায়ক চেম্বার" },
    subtitle: {
      en: "A clean, calm space designed around patient comfort, from your first visit to your last follow-up.",
      bn: "প্রথম ভিজিট থেকে শেষ ফলো-আপ পর্যন্ত, রোগীর স্বাচ্ছন্দ্যের কথা মাথায় রেখে সাজানো একটা পরিচ্ছন্ন, শান্ত পরিবেশ।",
    },
    bullets: [
      { en: "Ergonomic Memory-Foam Dental Chairs", bn: "আরামদায়ক মেমোরি-ফোম চেয়ার" },
      { en: "Class-B European Autoclave Sterilization", bn: "ক্লাস-বি অটোক্লেভ স্টেরিলাইজেশন" },
      { en: "Soothing Acoustic & Ambient Lighting", bn: "শান্ত ও আরামদায়ক পরিবেশ" },
    ],
    tags: [
      { en: "Class-B 134°C", bn: "ক্লাস-বি ১৩৪° সে." },
      { en: "Zero Cross-Infection", bn: "জীবাণুমুক্ত নিশ্চয়তা" },
      { en: "Calm Atmosphere", bn: "শান্ত পরিবেশ" },
    ],
    image: "/images/why-choose-us/modern-chamber.jpg",
    accent: "#474B4E",
    protocolTitle: { en: "European Sterilization & Chamber Protocol", bn: "ইউরোপীয় স্টেরিলাইজেশন ও চেম্বার প্রোটোকল" },
    protocolSubtitle: {
      en: "We designed our clinic from the ground up to replace medical anxiety with absolute calm, hygiene, and hospital-grade sterilization.",
      bn: "রোগীর ভয় ও অস্বস্তি দূর করে একটি শান্ত, মনোরম ও আন্তর্জাতিক মানের স্বাস্থ্যকর পরিবেশ নিশ্চিত করতে আমাদের চেম্বারটি সাজানো।",
    },
    protocolSteps: [
      {
        number: "01",
        title: { en: "Class-B Vacuum Decontamination", bn: "ক্লাস-বি ভ্যাকুয়াম জীবাণুমুক্তকরণ" },
        detail: { en: "134°C steam under pressure guarantees 100% viral and bacterial eradication.", bn: "১৩৪° সেলসিয়াস তাপমাত্রায় উচ্চ চাপে প্রতিটি যন্ত্রের শতভাগ জীবাণুমুক্তকরণ।" },
      },
      {
        number: "02",
        title: { en: "Sealed Barrier Pouches", bn: "সিল করা জীবাণুমুক্ত প্যাকেট" },
        detail: { en: "Instruments are opened exclusively in front of each individual patient.", bn: "প্রতিটি রোগীর চোখের সামনেই সিল করা নতুন জীবাণুমুক্ত প্যাকেট খোলা হয়।" },
      },
      {
        number: "03",
        title: { en: "Operatory Surface Disinfection", bn: "চেয়ার ও মেঝের বায়ো-ডিসইনফেকশন" },
        detail: { en: "Medical-grade hospital wipes applied after every single appointment.", bn: "প্রতিটি রোগীর পরপরই সম্পূর্ণ চেয়ার ও যন্ত্রপাতি স্প্রে দ্বারা ডিসইনফেক্ট করা হয়।" },
      },
    ],
    protocolGuarantees: [
      { en: "Strict European Class-B Sterilization Protocol for Every Patient", bn: "প্রতিটি রোগীর জন্য কঠোর ইউরোপীয় ক্লাস-বি স্টেরিলাইজেশন প্রোটোকল" },
    ],
  },
  {
    id: "plans",
    stepNumber: "03",
    badge: { en: "Clear & Honest", bn: "স্বচ্ছ ও নির্ভরযোগ্য" },
    title: { en: "Transparent Treatment Plans", bn: "স্পষ্ট চিকিৎসা পরিকল্পনা" },
    subtitle: {
      en: "We explain why a treatment is needed, when it's needed, and what to expect — before any decision is made.",
      bn: "কোনো সিদ্ধান্ত নেওয়ার আগেই আমরা বুঝিয়ে বলি কেন এই চিকিৎসা দরকার, কখন দরকার, আর তাতে কী উপকার পাবেন।",
    },
    bullets: [
      { en: "HD Intraoral Digital Camera Screening", bn: "এইচডি ইন্ট্রাওরাল স্ক্রিনিং" },
      { en: "Itemized Cost Breakdown — Zero Hidden Bills", bn: "অগ্রিম খরচের স্বচ্ছ বিবরণ" },
      { en: "Clear Step-by-Step Clinical Roadmap", bn: "ধাপভিত্তিক স্পষ্ট পরিকল্পনা" },
    ],
    tags: [
      { en: "Written Estimate", bn: "লিখিত খরচের বিবরণ" },
      { en: "HD Live Screen", bn: "লাইভ এইচডি স্ক্রিন" },
      { en: "No Hidden Costs", bn: "কোনো গোপন খরচ নেই" },
    ],
    image: "/images/why-choose-us/transparent-plans-hd.jpeg",
    accent: "#474B4E",
    protocolTitle: { en: "Clinical Transparency & Cost Protocol", bn: "চিকিৎসা ও খরচের স্বচ্ছতা প্রোটোকল" },
    protocolSubtitle: {
      en: "We believe healthcare should have complete clarity. We show you the exact clinical condition and transparent costs before touching a tooth.",
      bn: "আমরা বিশ্বাস করি চিকিৎসার প্রতিটি ধাপে স্বচ্ছতা জরুরি। চিকিৎসা শুরুর আগেই দাঁতের প্রকৃত অবস্থা ও খরচের স্পষ্ট ধারণা দেওয়া হয়।",
    },
    protocolSteps: [
      {
        number: "01",
        title: { en: "Live Intraoral Camera Display", bn: "লাইভ ইন্ট্রাওরাল ক্যামেরা ডিসপ্লে" },
        detail: { en: "High-definition visuals on the chairside monitor so you see what the doctor sees.", bn: "চেয়ারের সামনে এইচডি মনিটরে সরাসরি দাঁতের প্রকৃত সমস্যা রোগীকে দেখানো।" },
      },
      {
        number: "02",
        title: { en: "Comprehensive Treatment Roadmap", bn: "ধাপভিত্তিক পূর্ণাঙ্গ পরিকল্পনা" },
        detail: { en: "Clear explanation of stages, expected recovery duration, and milestone visits.", bn: "চিকিৎসার প্রয়োজনীয় ধাপ, সময়কাল ও পরবর্তী চেকআপের স্পষ্ট ধারণা।" },
      },
      {
        number: "03",
        title: { en: "Fixed Itemized Cost Estimate", bn: "নির্ধারিত খরচের লিখিত তালিকা" },
        detail: { en: "Transparent billing with zero surprise add-ons or sudden charges.", bn: "চিকিৎসা শুরুর পূর্বেই লিখিত খরচের বিবরণ — কোনো বাড়তি গোপন চার্জ নেই।" },
      },
    ],
    protocolGuarantees: [
      { en: "Full Cost & Clinical Transparency — Zero Hidden Charges", bn: "চিকিৎসা ও খরচে ১০০% স্বচ্ছতা — কোনো গোপন চার্জ নেই" },
    ],
  },
  {
    id: "booking",
    stepNumber: "04",
    badge: { en: "Instant & Smooth", bn: "সহজ ও দ্রুত" },
    title: { en: "Easy Appointment Booking", bn: "সহজ অ্যাপয়েন্টমেন্ট বুকিং" },
    subtitle: {
      en: "Pick your doctor, pick your time — book online in a few taps, no phone tag or long waiting lines.",
      bn: "নিজের পছন্দের ডাক্তার আর সময় বেছে নিন — কয়েকটা ক্লিকেই বুকিং, বারবার ফোন করার ঝামেলা নেই।",
    },
    bullets: [
      { en: "Select Specialist & Preferred Day in < 2 Mins", bn: "ডাক্তার ও সুবিধাজনক দিন পছন্দ" },
      { en: "Instant WhatsApp & SMS Confirmation", bn: "তাৎক্ষণিক হোয়াটসঅ্যাপ নিশ্চিতকরণ" },
      { en: "Dedicated Clinic Care Coordinator Support", bn: "ডেডিকেটেড কেয়ার কোঅর্ডিনেটর" },
    ],
    tags: [
      { en: "2-Min Booking", bn: "২ মিনিটে বুকিং" },
      { en: "WhatsApp Updates", bn: "হোয়াটসঅ্যাপ আপডেট" },
      { en: "Min Waiting", bn: "অপেক্ষাহীন সেবা" },
    ],
    image: "/images/why-choose-us/easy-booking.jpg",
    accent: "#474B4E",
    protocolTitle: { en: "Smart Scheduling & Waiting Protocol", bn: "স্মার্ট শিডিউলিং ও সিরিয়াল প্রোটোকল" },
    protocolSubtitle: {
      en: "No endless phone calls or crowded waiting rooms. Our digital booking system respects your busy schedule with precision time slots.",
      bn: "বারবার ফোন করার ঝামেলা কিংবা চেম্বারে বসে ঘণ্টার পর ঘণ্টা অপেক্ষা করার দিন শেষ। ডিজিটাল পদ্ধতিতে দ্রুততম সময়ে সিরিয়াল নিন।",
    },
    protocolSteps: [
      {
        number: "01",
        title: { en: "Online Booking in 3 Easy Steps", bn: "৩টি সহজ ধাপে অনলাইন বুকিং" },
        detail: { en: "Choose department, preferred doctor, and available time slot in under 2 minutes.", bn: "বিভাগ, কাঙ্ক্ষিত ডাক্তার ও সুবিধাজনক সময় বেছে নিয়ে দ্রুত সিরিয়াল নিশ্চিতকরণ।" },
      },
      {
        number: "02",
        title: { en: "Instant WhatsApp Confirmation", bn: "তাৎক্ষণিক হোয়াটসঅ্যাপ নোটিফিকেশন" },
        detail: { en: "Receive reference code, appointment time, and direct Google Maps location pin.", bn: "সিরিয়াল রেফারেন্স কোড, সময় ও গুগল ম্যাপ লোকেশন সরাসরি মেসেজে প্রাপ্তি।" },
      },
      {
        number: "03",
        title: { en: "Zero-Wait Queue Management", bn: "যথাসময়ে সিরিয়াল প্রদান" },
        detail: { en: "Our front desk prepares all sterile setup in advance to minimize waiting time.", bn: "রোগীর পৌঁছানোর পূর্বেই চেম্বার প্রস্তুতি সম্পন্ন করে অপেক্ষার সময় কমিয়ে আনা।" },
      },
    ],
    protocolGuarantees: [
      { en: "Guaranteed Dedicated Time Slot — Minimized Waiting Time", bn: "নির্দিষ্ট সময়ে সিরিয়াল কনফার্মেশন — দীর্ঘ অপেক্ষার অবসান" },
    ],
  },
];

export async function fetchLiveWhyChooseCards(): Promise<WhyChooseCard[]> {
  let cached: WhyChooseCard[] | null = null;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("kgh_live_why_choose_cards");
      if (stored) cached = JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured) {
    return cached && cached.length > 0 ? cached : DEFAULT_WHY_CHOOSE_CARDS;
  }

  try {
    const { data, error } = await supabase
      .from("why_choose_cards")
      .select("*")
      .order("step_number", { ascending: true });

    if (error || !data || data.length === 0) {
      return cached && cached.length > 0 ? cached : DEFAULT_WHY_CHOOSE_CARDS;
    }

    const liveCards: WhyChooseCard[] = data.map((d: any) => ({
      id: d.id,
      stepNumber: d.step_number,
      badge: { en: d.badge_en, bn: d.badge_bn },
      title: { en: d.title_en, bn: d.title_bn },
      subtitle: { en: d.subtitle_en, bn: d.subtitle_bn },
      bullets: d.bullets || [],
      tags: d.tags || [],
      image: d.image || "/images/why-choose-us/specialist-care.jpg",
      accent: d.accent || "#474B4E",
      protocolTitle: { en: d.protocol_title_en, bn: d.protocol_title_bn },
      protocolSubtitle: { en: d.protocol_subtitle_en, bn: d.protocol_subtitle_bn },
      protocolSteps: d.protocol_steps || [],
      protocolGuarantees: d.protocol_guarantees || [],
    }));

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("kgh_live_why_choose_cards", JSON.stringify(liveCards));
      } catch {
        // ignore
      }
    }

    return liveCards;
  } catch (err) {
    console.error("fetchLiveWhyChooseCards error:", err);
    return cached && cached.length > 0 ? cached : DEFAULT_WHY_CHOOSE_CARDS;
  }
}

export async function saveLiveWhyChooseCards(cards: WhyChooseCard[]): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("kgh_live_why_choose_cards", JSON.stringify(cards));
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured) return { success: true };

  try {
    const payload = cards.map((c) => ({
      id: c.id,
      step_number: c.stepNumber,
      badge_en: c.badge.en,
      badge_bn: c.badge.bn,
      title_en: c.title.en,
      title_bn: c.title.bn,
      subtitle_en: c.subtitle.en,
      subtitle_bn: c.subtitle.bn,
      bullets: c.bullets,
      tags: c.tags,
      image: c.image,
      accent: c.accent,
      protocol_title_en: c.protocolTitle.en,
      protocol_title_bn: c.protocolTitle.bn,
      protocol_subtitle_en: c.protocolSubtitle.en,
      protocol_subtitle_bn: c.protocolSubtitle.bn,
      protocol_steps: c.protocolSteps,
      protocol_guarantees: c.protocolGuarantees,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("why_choose_cards").upsert(payload, { onConflict: "id" });
    if (error) {
      console.warn("Supabase upsert warning for why_choose_cards:", error.message);
    }
    return { success: true };
  } catch (err: any) {
    console.error("saveLiveWhyChooseCards error:", err);
    return { success: true };
  }
}

// ==============================================================================
// 8. HOMEPAGE CLINICAL CREED API
// ==============================================================================

export const DEFAULT_CLINICAL_CREED: ClinicalCreedData = {
  tag: {
    en: "OUR CLINICAL CREED",
    bn: "আমাদের চিকিৎসা দর্শন",
  },
  quote: {
    en: "A genuine smile is the universal language of health, confidence, and human connection. We combine surgical mastery with compassionate gentleness — because modern dentistry isn't just about fixing teeth, it's about transforming how you live.",
    bn: "একটি আত্মবিশ্বাসী ও সুন্দর হাসি মানুষের স্বাস্থ্য, মর্যাদা ও আত্মবিশ্বাসের প্রতীক। কেজিএইচ ডেন্টালে আমরা বিশেষায়িত সার্জিক্যাল দক্ষতা ও আন্তরিক সেবার মেলবন্ধন ঘটাই — কারণ আধুনিক ডেন্টাল কেয়ার শুধু দাঁত সারানো নয়, জীবনকে সহজ ও হাসিময় করে তোলা।",
  },
  subQuote: {
    en: "Transforming how you live and smile.",
    bn: "আপনার জীবন ও হাসিতে নতুন আত্মবিশ্বাস।",
  },
  authority: {
    en: "Clinical Advisory Council",
    bn: "ক্লিনিক্যাল অ্যাডভাইজরি কাউন্সিল",
  },
  designation: {
    en: "KGH Dental Multi-Specialty Chamber",
    bn: "কেজিএইচ ডেন্টাল মাল্টি-স্পেশালিটি চেম্বার",
  },
  stats: [
    {
      value: { en: "100%", bn: "১০০%" },
      label: { en: "Sterilization Standard", bn: "জীবাণুমুক্তকরণ মানদণ্ড" },
    },
    {
      value: { en: "15+", bn: "১৫+" },
      label: { en: "Years Combined Board Mastery", bn: "সম্মিলিত বোর্ড অভিজ্ঞতা" },
    },
    {
      value: { en: "Zero", bn: "জিরো" },
      label: { en: "Unscheduled Waiting Delay", bn: "অতিরিক্ত অপেক্ষাহীন সেবা" },
    },
  ],
};

export async function fetchLiveClinicalCreed(): Promise<ClinicalCreedData> {
  let cached: ClinicalCreedData | null = null;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("kgh_live_clinical_creed");
      if (stored) cached = JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured) {
    return cached || DEFAULT_CLINICAL_CREED;
  }

  try {
    const { data, error } = await supabase
      .from("clinical_creed")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      return cached || DEFAULT_CLINICAL_CREED;
    }

    const liveCreed: ClinicalCreedData = {
      tag: { en: data.tag_en, bn: data.tag_bn },
      quote: { en: data.quote_en, bn: data.quote_bn },
      subQuote: { en: data.sub_quote_en, bn: data.sub_quote_bn },
      authority: { en: data.authority_en, bn: data.authority_bn },
      designation: { en: data.designation_en, bn: data.designation_bn },
      stats: data.stats || DEFAULT_CLINICAL_CREED.stats,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("kgh_live_clinical_creed", JSON.stringify(liveCreed));
      } catch {
        // ignore
      }
    }

    return liveCreed;
  } catch (err) {
    console.error("fetchLiveClinicalCreed error:", err);
    return cached || DEFAULT_CLINICAL_CREED;
  }
}

export async function saveLiveClinicalCreed(creed: ClinicalCreedData): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("kgh_live_clinical_creed", JSON.stringify(creed));
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured) return { success: true };

  try {
    const payload = {
      id: 1,
      tag_en: creed.tag.en,
      tag_bn: creed.tag.bn,
      quote_en: creed.quote.en,
      quote_bn: creed.quote.bn,
      sub_quote_en: creed.subQuote.en,
      sub_quote_bn: creed.subQuote.bn,
      authority_en: creed.authority.en,
      authority_bn: creed.authority.bn,
      designation_en: creed.designation.en,
      designation_bn: creed.designation.bn,
      stats: creed.stats,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("clinical_creed").upsert(payload, { onConflict: "id" });
    if (error) {
      console.warn("Supabase upsert warning for clinical_creed:", error.message);
    }
    return { success: true };
  } catch (err: any) {
    console.error("saveLiveClinicalCreed error:", err);
    return { success: true };
  }
}

