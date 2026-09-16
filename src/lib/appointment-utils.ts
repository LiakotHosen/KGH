import { Doctor, AppointmentRecord } from "@/types";

export const DOCTOR_CODE_MAP: Record<string, string> = {
  "dr-diean": "ADS",
  "dr-sanwar": "SMH",
  "dr-fatema": "FTM",
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
 * Generates tracking reference code in format: KGH-[DOC_CODE]-[RANDOM_NUMBER]
 * Example: KGH-ADS-481920
 */
export function generateAppointmentReference(doctorId?: string, doctorName?: string): string {
  const code = getDoctorCode(doctorId, doctorName);
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `KGH-${code}-${randomNum}`;
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
