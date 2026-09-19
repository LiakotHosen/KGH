import { Doctor, AppointmentRecord } from "@/types";

export const DOCTOR_CODE_MAP: Record<string, string> = {
  "dr-diean": "ADS",
  "dr-sanwar": "SMH",
  "dr-fatema": "FTM",
  "dr-bappy": "MMC",
  "dr-ratina": "JI",
  "dr-rifat": "RR",
  "dr-rafia": "RN",
  "dr-rafia-nazneen": "RN",
  "dr-farzana": "FH",
  "dr-kazi-nawshad": "KNH",
  "dr-kazi-sharmin": "KSS",
  "dr-tamjid": "TA",
  "dr-liakot": "LH",
};

/**
 * Extracts a concise 2-4 uppercase letter code for a doctor.
 * Example: Dr. Ahamed Diean Sammir -> ADS
 */
export function getDoctorCode(doctorId?: string, doctorName?: string): string {
  if (doctorId && DOCTOR_CODE_MAP[doctorId]) {
    return DOCTOR_CODE_MAP[doctorId];
  }

  if (doctorName) {
    // Strip prefixes like Dr., Prof., Md., etc.
    const clean = doctorName
      .replace(/^(Dr\.|Doctor|Prof\.|Professor)\s+/i, "")
      .trim();

    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return parts.map((p) => p[0].toUpperCase()).slice(0, 4).join("");
    }
    if (parts.length === 1 && parts[0].length >= 3) {
      return parts[0].substring(0, 3).toUpperCase();
    }
  }

  return "DOC";
}

/**
 * Formats appointment date into [YYYY][DD][Mon] format.
 * Example: 2026-09-11 -> 202611Sep
 */
export function formatAppointmentDateCode(dateInput?: string | Date): string {
  let d: Date;
  if (!dateInput) {
    d = new Date();
  } else if (typeof dateInput === "string") {
    const parts = dateInput.split("T")[0].split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      d = new Date(year, month, day);
    } else {
      d = new Date(dateInput);
    }
  } else {
    d = dateInput;
  }

  if (isNaN(d.getTime())) {
    d = new Date();
  }

  const year = d.getFullYear();
  const day = String(d.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const mon = monthNames[d.getMonth()] || "Sep";

  return `${year}${day}${mon}`;
}

/**
 * Generates tracking reference code in format: KGH-[DOC_CODE][YYYY][DD][Mon]-[3-DIGIT_RANDOM]
 * Example: KGH-ADS202611Sep-001
 * Matches: KGH-Doctor initial, Year, Date + random number
 */
export function generateAppointmentReference(
  doctorId?: string,
  doctorName?: string,
  appointmentDate?: string | Date
): string {
  const code = getDoctorCode(doctorId, doctorName);
  const dateCode = formatAppointmentDateCode(appointmentDate);
  const randomNum = String(Math.floor(1 + Math.random() * 999)).padStart(3, "0");
  return `KGH-${code}${dateCode}-${randomNum}`;
}

/**
 * Exports appointment records to a UTF-8 BOM CSV for direct Excel compatibility.
 */
export function exportAppointmentsToCSV(
  appointments: AppointmentRecord[],
  filename = `KGH_Appointments_${new Date().toISOString().split("T")[0]}.csv`
) {
  const headers = [
    "Reference Code",
    "Patient Name",
    "Phone",
    "Email",
    "Doctor",
    "Department",
    "Appointment Date",
    "Time Slot",
    "Status",
    "Symptoms / Notes",
    "Booked At",
  ];

  const escapeCSV = (val?: string | null) => {
    if (!val) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = appointments.map((a) => [
    escapeCSV(a.reference_code),
    escapeCSV(a.patient_name),
    escapeCSV(a.patient_phone),
    escapeCSV(a.patient_email),
    escapeCSV(a.doctor_name),
    escapeCSV(a.department_name),
    escapeCSV(a.appointment_date),
    escapeCSV(a.time_slot),
    escapeCSV(a.status),
    escapeCSV(a.symptoms || a.admin_notes),
    escapeCSV(a.created_at),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  // Prepend UTF-8 BOM (\uFEFF) so Excel renders Bengali and special characters cleanly
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==============================================================================
// APPOINTMENT READ / UNREAD STATE MANAGEMENT (Gmail Style)
// ==============================================================================

export const READ_APPOINTMENTS_STORAGE_KEY = "kgh_read_appointment_refs";

export function getReadAppointmentRefs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(READ_APPOINTMENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isAppointmentRead(refCodeOrId: string, readRefs?: string[]): boolean {
  const list = readRefs || getReadAppointmentRefs();
  return list.includes(refCodeOrId);
}

export function markAppointmentAsRead(refCodeOrId: string): void {
  if (typeof window === "undefined" || !refCodeOrId) return;
  try {
    const current = getReadAppointmentRefs();
    if (!current.includes(refCodeOrId)) {
      const updated = [...current, refCodeOrId];
      localStorage.setItem(READ_APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
      notifyAppointmentsUpdated();
    }
  } catch {
    // ignore
  }
}

export function markAppointmentAsUnread(refCodeOrId: string): void {
  if (typeof window === "undefined" || !refCodeOrId) return;
  try {
    const current = getReadAppointmentRefs();
    const updated = current.filter((r) => r !== refCodeOrId);
    localStorage.setItem(READ_APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
    notifyAppointmentsUpdated();
  } catch {
    // ignore
  }
}

export function markAllAppointmentsAsRead(refCodesOrIds: string[]): void {
  if (typeof window === "undefined") return;
  try {
    const current = getReadAppointmentRefs();
    const combined = Array.from(new Set([...current, ...refCodesOrIds]));
    localStorage.setItem(READ_APPOINTMENTS_STORAGE_KEY, JSON.stringify(combined));
    notifyAppointmentsUpdated();
  } catch {
    // ignore
  }
}

export function notifyAppointmentsUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("kgh_appointments_updated"));
  }
}

