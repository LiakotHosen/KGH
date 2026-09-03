import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { DOCTORS } from "@/data/doctors";
import { DEPARTMENTS } from "@/data/departments";
import { CLINIC_SETTINGS } from "@/data/settings";
import { BLOG_POSTS } from "@/data/blog";
import { Doctor, Department, SubService, ClinicSettings, BlogPost, GalleryItem } from "@/types";

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

    return data.map((d: any) => {
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

    return deptData.map((d: any) => {
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
  if (!isSupabaseConfigured) return CLINIC_SETTINGS;

  try {
    const { data, error } = await supabase
      .from("clinic_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) return CLINIC_SETTINGS;

    return {
      ...CLINIC_SETTINGS,
      phoneNumbers: data.phone_numbers || CLINIC_SETTINGS.phoneNumbers,
      emergencyPhone: data.emergency_phone || CLINIC_SETTINGS.emergencyPhone,
      workingHours: data.working_hours || CLINIC_SETTINGS.workingHours,
      address: {
        en: data.address_en || CLINIC_SETTINGS.address.en,
        bn: data.address_bn || CLINIC_SETTINGS.address.bn,
      },
      isAddressPlaceholder: data.is_address_placeholder ?? true,
    };
  } catch (err) {
    console.error("fetchLiveClinicSettings error:", err);
    return CLINIC_SETTINGS;
  }
}

export async function saveLiveClinicSettings(settings: ClinicSettings): Promise<{ success: boolean; error?: string }> {
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
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("clinic_settings").upsert(payload, { onConflict: "id" });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("saveLiveClinicSettings error:", err);
    return { success: false, error: err.message };
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
