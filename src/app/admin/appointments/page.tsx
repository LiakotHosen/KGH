"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Search,
  Filter,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  MessageSquare,
  FileText,
} from "lucide-react";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

interface AppointmentRecord {
  id: string;
  reference_code: string;
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  doctor_name: string;
  department_name: string;
  appointment_date: string;
  time_slot: string;
  symptoms?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
}

const INITIAL_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: "app-1",
    reference_code: "KGH-472299",
    patient_name: "Rafiqul Islam",
    patient_phone: "01712345678",
    patient_email: "rafiqul@example.com",
    doctor_name: "Dr. Ahamed Diean Sammir",
    department_name: "Prosthodontics",
    appointment_date: "2026-09-06",
    time_slot: "05:30 PM",
    symptoms: "Upper molar tooth replacement and crown inquiry.",
    status: "pending",
    created_at: "2026-09-02 18:30",
  },
  {
    id: "app-2",
    reference_code: "KGH-819302",
    patient_name: "Farhana Akter",
    patient_phone: "01898765432",
    doctor_name: "Dr. Fatema Tasrin Madhubi",
    department_name: "Orthodontics",
    appointment_date: "2026-09-08",
    time_slot: "06:00 PM",
    symptoms: "Mild tooth crowding, interested in clear aligners.",
    status: "confirmed",
    created_at: "2026-09-01 15:20",
  },
  {
    id: "app-3",
    reference_code: "KGH-304918",
    patient_name: "Kamal Hossain",
    patient_phone: "01911223344",
    doctor_name: "Dr. Md. Sanwar Hossain",
    department_name: "Oral & Maxillofacial Surgery",
    appointment_date: "2026-09-05",
    time_slot: "07:00 PM",
    symptoms: "Lower impacted wisdom tooth severe pain.",
    status: "confirmed",
    created_at: "2026-09-01 11:10",
  },
  {
    id: "app-4",
    reference_code: "KGH-192847",
    patient_name: "Nusrat Jahan",
    patient_phone: "01677889900",
    doctor_name: "Dr. Ahamed Diean Sammir",
    department_name: "Conservative Dentistry",
    appointment_date: "2026-09-04",
    time_slot: "06:30 PM",
    symptoms: "Tooth sensitivity to cold water, needs filling.",
    status: "completed",
    created_at: "2026-08-30 14:00",
  },
];

import { fetchLiveAppointments, updateLiveAppointmentStatus } from "@/lib/api/db";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(INITIAL_APPOINTMENTS);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<AppointmentRecord | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    fetchLiveAppointments().then((liveApps) => {
      if (liveApps && liveApps.length > 0) {
        setAppointments(liveApps);
      }
    });
  }, []);

  const handleStatusChange = async (id: string, newStatus: AppointmentRecord["status"]) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status: newStatus } : a
    );
    setAppointments(updated);
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
    await updateLiveAppointmentStatus(id, newStatus);
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesQuery =
      app.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.patient_phone.includes(searchQuery) ||
      app.reference_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.doctor_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: AppointmentRecord["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Patient Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
            Appointment Bookings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Review, confirm, or reschedule patient bookings across all 7 departments.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filterStatus === st
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by patient name, phone number, doctor, or reference code..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-zinc-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-950 shadow-xs"
        />
      </div>

      {/* Appointments Table */}
      <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Ref Code</th>
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Doctor & Specialty</th>
                <th className="py-3.5 px-4">Date & Slot</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 text-xs">
                    No appointments found matching your search.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-50/60 transition-colors">
                    {/* Ref Code */}
                    <td className="py-4 px-4 font-mono font-bold text-zinc-900">
                      {app.reference_code}
                    </td>

                    {/* Patient Info */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-zinc-950">{app.patient_name}</div>
                      <div className="flex items-center gap-2 text-zinc-500 text-[11px] mt-0.5">
                        <a href={`tel:${app.patient_phone}`} className="hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{app.patient_phone}</span>
                        </a>
                        <a
                          href={`https://wa.me/88${app.patient_phone}?text=${encodeURIComponent(
                            `Hello ${app.patient_name}, regarding your KGH Dental appointment #${app.reference_code}...`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:text-emerald-800"
                          title="Message on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    {/* Doctor Info */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-zinc-900">{app.doctor_name}</div>
                      <div className="text-[11px] text-zinc-500">{app.department_name}</div>
                    </td>

                    {/* Date & Slot */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-zinc-900">{app.appointment_date}</div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{app.time_slot}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">{getStatusBadge(app.status)}</td>

                    {/* Action Dropdown / Buttons */}
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {app.status === "pending" && (
                          <button
                            onClick={() => handleStatusChange(app.id, "confirmed")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs"
                            title="Confirm Appointment"
                          >
                            Confirm
                          </button>
                        )}

                        {app.status === "confirmed" && (
                          <button
                            onClick={() => handleStatusChange(app.id, "completed")}
                            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-semibold shadow-2xs"
                            title="Mark as Completed"
                          >
                            Complete
                          </button>
                        )}

                        {app.status !== "cancelled" && (
                          <button
                            onClick={() => handleStatusChange(app.id, "cancelled")}
                            className="px-2.5 py-1 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold"
                            title="Cancel Booking"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-2.5 py-1 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100 text-xs font-semibold"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <div>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Appointment Details
                </span>
                <h3 className="text-lg font-bold text-zinc-950 font-mono">
                  {selectedApp.reference_code}
                </h3>
              </div>
              {getStatusBadge(selectedApp.status)}
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Patient Name:</span>
                  <span className="font-bold text-zinc-900">{selectedApp.patient_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Phone Number:</span>
                  <a href={`tel:${selectedApp.patient_phone}`} className="font-bold text-zinc-900 hover:underline">
                    {selectedApp.patient_phone}
                  </a>
                </div>
                {selectedApp.patient_email && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Email:</span>
                    <span className="text-zinc-800">{selectedApp.patient_email}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Doctor:</span>
                  <span className="font-bold text-zinc-900">{selectedApp.doctor_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Department:</span>
                  <span className="font-semibold text-zinc-800">{selectedApp.department_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Date & Slot:</span>
                  <span className="font-bold text-zinc-900">
                    {selectedApp.appointment_date} at {selectedApp.time_slot}
                  </span>
                </div>
              </div>

              {selectedApp.symptoms && (
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <span className="text-zinc-500 font-medium">Patient Symptoms / Chief Complaint:</span>
                  <p className="text-zinc-800 font-normal leading-relaxed">{selectedApp.symptoms}</p>
                </div>
              )}
            </div>

            {/* Quick WhatsApp & Call Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={`https://wa.me/88${selectedApp.patient_phone}?text=${encodeURIComponent(
                  `Hello ${selectedApp.patient_name}, this is KGH Dental confirming your appointment (#${selectedApp.reference_code}) on ${selectedApp.appointment_date} at ${selectedApp.time_slot}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Confirmation</span>
              </a>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
