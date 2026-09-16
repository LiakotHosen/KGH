"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Printer,
  Copy,
  Check,
  Search,
  ShieldCheck,
  Loader2,
  Eye,
} from "lucide-react";
import { DOCTORS } from "@/data/doctors";
import { Doctor } from "@/types";
import {
  fetchLiveDoctors,
  createLiveAppointment,
  fetchBookedSlots,
  fetchDoctorBlockedDates,
} from "@/lib/api/db";
import { generateAppointmentReference } from "@/lib/appointment-utils";
import { CalendarMonthView } from "@/components/appointment/CalendarMonthView";
import { AppointmentPrintSlip } from "@/components/appointment/AppointmentPrintSlip";
import { DEPARTMENTS } from "@/data/departments";
import { useLanguage } from "@/context/LanguageContext";
import { UI_STRINGS } from "@/data/translations";
import { CLINIC_SETTINGS } from "@/data/settings";

export function BookingWizard() {
  const searchParams = useSearchParams();
  const preSelectedDoctor = searchParams.get("doctor");
  const preSelectedDept = searchParams.get("department");
  const preSelectedTreatment = searchParams.get("treatment");

  const { t, isBn } = useLanguage();
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(DOCTORS);

  useEffect(() => {
    fetchLiveDoctors().then((docs) => {
      if (docs && docs.length > 0) {
        setDoctorsList(docs);
      }
    });
  }, []);

  // Find initial doctor if passed in URL
  const initialDoctorId = useMemo(() => {
    if (preSelectedDoctor) {
      const doc = doctorsList.find((d) => d.id === preSelectedDoctor);
      if (doc) return doc.id;
    }
    if (preSelectedDept) {
      const dept = DEPARTMENTS.find((d) => d.slug === preSelectedDept);
      if (dept && dept.leadDoctorId) return dept.leadDoctorId;
    }
    return doctorsList[0]?.id || "dr-diean";
  }, [preSelectedDoctor, preSelectedDept, doctorsList]);

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState<string>("");
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [visitReason, setVisitReason] = useState<string>(
    preSelectedTreatment ? `Consultation for ${preSelectedTreatment}` : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingRef, setBookingRef] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showSlipPreview, setShowSlipPreview] = useState<boolean>(false);

  // Calendar and slot collision states
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const activeDoctor = useMemo(() => {
    return doctorsList.find((d) => d.id === selectedDoctorId) || doctorsList[0];
  }, [selectedDoctorId, doctorsList]);

  // Fetch blocked dates (leaves/holidays) for active doctor
  useEffect(() => {
    if (activeDoctor?.id) {
      fetchDoctorBlockedDates(activeDoctor.id).then((blks) => {
        setBlockedDates(blks.map((b: any) => b.blocked_date));
      });
    }
  }, [activeDoctor]);

  // Fetch booked slots for the chosen doctor and date to prevent double booking
  useEffect(() => {
    if (activeDoctor?.id && selectedDate) {
      setLoadingSlots(true);
      fetchBookedSlots(activeDoctor.id, selectedDate, activeDoctor.name.en)
        .then((slots) => setBookedSlots(slots))
        .finally(() => setLoadingSlots(false));
    } else {
      setBookedSlots([]);
    }
  }, [activeDoctor, selectedDate]);

  // Generate next 14 calendar days that match the doctor's active schedule
  const availableDates = useMemo(() => {
    const dates: { dateString: string; displayString: string; dayName: string }[] = [];
    const today = new Date();

    for (let i = 1; i <= 21; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

      if (activeDoctor.schedule.daysOfWeek.includes(dayOfWeek)) {
        const iso = d.toISOString().split("T")[0];
        const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayNamesBn = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];
        const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthNamesBn = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];

        const dayName = isBn ? dayNamesBn[dayOfWeek] : dayNamesEn[dayOfWeek];
        const monthName = isBn ? monthNamesBn[d.getMonth()] : monthNamesEn[d.getMonth()];
        const display = `${dayName}, ${d.getDate()} ${monthName}`;

        dates.push({
          dateString: iso,
          displayString: display,
          dayName,
        });
      }
    }
    return dates;
  }, [activeDoctor, isBn]);

  // Generate time slots based on doctor's start/end time and interval
  const availableSlots = useMemo(() => {
    const slots: string[] = [];
    const [startH, startM] = activeDoctor.schedule.startTime.split(":").map(Number);
    const [endH, endM] = activeDoctor.schedule.endTime.split(":").map(Number);
    const interval = activeDoctor.schedule.slotDurationMinutes || 30;

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes < endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;

      const period = h >= 12 ? "PM" : "AM";
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m === 0 ? "00" : m < 10 ? `0${m}` : m;

      slots.push(`${displayH}:${displayM} ${period}`);
      currentMinutes += interval;
    }

    return slots;
  }, [activeDoctor]);

  // Step navigation validations
  const handleNextStep = () => {
    setErrors({});
    if (currentStep === 1) {
      if (!selectedDoctorId) {
        setErrors({ doctor: isBn ? "অনুগ্রহ করে একজন ডাক্তার বেছে নিন" : "Please select a doctor" });
        return;
      }
      // If previous selected date doesn't fit this doctor, reset date and slot
      setSelectedDate("");
      setSelectedTimeSlot("");
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedDate) {
        setErrors({ date: isBn ? "অনুগ্রহ করে একটি তারিখ নির্বাচন করুন" : "Please select an available date" });
        return;
      }
      if (!selectedTimeSlot) {
        setErrors({ slot: isBn ? "অনুগ্রহ করে একটি সময় নির্বাচন করুন" : "Please pick an appointment time slot" });
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const errs: Record<string, string> = {};
      if (!patientName.trim()) {
        errs.name = isBn ? "রোগীর নাম পূরণ করুন" : "Patient name is required";
      }
      if (!patientPhone.trim() || patientPhone.trim().length < 8) {
        errs.phone = isBn ? "সঠিক মোবাইল নম্বর প্রদান করুন" : "A valid phone number is required";
      }

      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }

      // Generate doctor-coded reference code: KGH-[DOC]-[RANDOM]
      const ref = generateAppointmentReference(activeDoctor?.id, activeDoctor?.name?.en);
      setBookingRef(ref);
      setIsSubmitted(true);
      setCurrentStep(4);

      // Record in Admin Patient Registry and Supabase
      try {
        createLiveAppointment({
          reference_code: ref,
          patient_name: patientName,
          patient_phone: patientPhone,
          patient_email: patientEmail || undefined,
          doctor_id: activeDoctor?.id,
          doctor_name: activeDoctor ? activeDoctor.name.en : "Specialist Doctor",
          department_id: activeDoctor?.departmentId,
          department_name: activeDoctor ? activeDoctor.specialty.en : "General Consultation",
          appointment_date: selectedDate,
          time_slot: selectedTimeSlot,
          symptoms: visitReason || undefined,
          status: "confirmed",
        }).catch((err) => console.warn("Live appointment insert error:", err));
      } catch (err) {
        console.warn("Could not cache appointment:", err);
      }
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedDate("");
    setSelectedTimeSlot("");
    setPatientName("");
    setPatientPhone("");
    setPatientEmail("");
    setVisitReason("");
    setIsSubmitted(false);
    setShowSlipPreview(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden">
      {/* Top Wizard Steps Header */}
      <div className="bg-zinc-950 text-white p-6 sm:p-8 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {isBn ? "অনলাইন অ্যাপয়েন্টমেন্ট সিস্টেম" : "Direct Specialist Booking"}
          </span>
          <span className="text-xs text-zinc-400">
            {isSubmitted
              ? isBn
                ? "ধাপ ৪ / ৪ (নিশ্চিত)"
                : "Step 4 of 4 (Confirmed)"
              : isBn
              ? `ধাপ ${currentStep} / ৪`
              : `Step ${currentStep} of 4`}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          {isBn ? UI_STRINGS.bookingWizard.title.bn : UI_STRINGS.bookingWizard.title.en}
        </h2>

        {/* Progress Step Indicators */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {[1, 2, 3, 4].map((step) => {
            const labels = [
              UI_STRINGS.bookingWizard.steps.step1,
              UI_STRINGS.bookingWizard.steps.step2,
              UI_STRINGS.bookingWizard.steps.step3,
              UI_STRINGS.bookingWizard.steps.step4,
            ];
            const isCompleted = isSubmitted ? true : currentStep > step;
            const isCurrent = !isSubmitted && currentStep === step;

            return (
              <div key={step} className="space-y-1.5">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    isCompleted
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                      : isCurrent
                      ? "bg-white"
                      : "bg-zinc-800"
                  }`}
                />
                <span
                  className={`hidden sm:block text-[10px] font-medium truncate ${
                    isCompleted
                      ? "text-emerald-400 font-semibold"
                      : isCurrent
                      ? "text-white font-bold"
                      : "text-zinc-600"
                  }`}
                >
                  {isBn ? labels[step - 1].bn : labels[step - 1].en}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Content Body */}
      <div className="p-6 sm:p-8">
        {/* STEP 1: Select Doctor */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-950">
                {isBn ? "১. বিশেষজ্ঞ ডাক্তার নির্বাচন করুন" : "1. Choose Your Specialist Doctor"}
              </h3>
              <p className="text-xs text-zinc-600 mt-1">
                {isBn
                  ? "যে চিকিৎসকের পরামর্শ নিতে চান তাকে বেছে নিন। প্রতিটি ডাক্তারের আলাদা চেম্বার সময়সূচি রয়েছে।"
                  : "Select the doctor you wish to consult. Each doctor operates on their specific weekly chamber schedule."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctorsList.map((doc) => {
                const isSelected = selectedDoctorId === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctorId(doc.id);
                      setSelectedDate("");
                      setSelectedTimeSlot("");
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? "border-zinc-950 bg-zinc-50 shadow-md ring-1 ring-zinc-950"
                        : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-200 shrink-0 border border-zinc-300">
                      <img
                        src={doc.photoUrl}
                        alt={t(doc.name)}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 block truncate">
                          {t(doc.specialty)}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-zinc-950 shrink-0" />
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-zinc-950 truncate mt-0.5">
                        {t(doc.name)}
                      </h4>
                      <p className="text-[11px] text-zinc-600 line-clamp-1 mt-0.5">
                        {t(doc.degrees)}
                      </p>

                      <div className="mt-2 text-[11px] font-medium text-zinc-800 bg-white px-2 py-1 rounded-lg border border-zinc-200/80 inline-block">
                        {isBn ? doc.schedule.availableDaysBn : doc.schedule.availableDaysEn}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.doctor && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.doctor}</span>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Date & Time Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-950">
                  {isBn ? "২. চেম্বার ক্যালেন্ডার ও সময় নির্বাচন করুন" : "2. Chamber Calendar & Time Slot"}
                </h3>
                <span className="text-xs font-semibold text-zinc-700 bg-zinc-100 px-3 py-1 rounded-full">
                  {t(activeDoctor.name)}
                </span>
              </div>
              <p className="text-xs text-zinc-600 mt-1">
                {isBn
                  ? `নির্বাচিত ডাক্তারের চেম্বার: ${activeDoctor.schedule.availableDaysBn} (${t(activeDoctor.schedule.note)})`
                  : `Doctor's Chamber: ${activeDoctor.schedule.availableDaysEn} (${t(activeDoctor.schedule.note)})`}
              </p>
            </div>

            {/* Interactive Month Calendar View */}
            <div>
              <CalendarMonthView
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setSelectedTimeSlot("");
                  setErrors((prev) => ({ ...prev, date: "" }));
                }}
                doctor={activeDoctor}
                blockedDates={blockedDates}
                isBn={isBn}
              />

              {errors.date && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.date}</span>
                </div>
              )}
            </div>

            {/* Time Slot Selection Grid */}
            {selectedDate ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800">
                      {isBn ? "উপলব্ধ সময় নির্বাচন করুন (৩০ মিনিট স্লট)" : "Choose Available Time Slot (30-Min)"}
                    </label>
                    <span className="text-[11px] text-zinc-500">
                      {selectedDate} •{" "}
                      {loadingSlots
                        ? isBn
                          ? "স্লট চেক হচ্ছে..."
                          : "Checking slots..."
                        : `${availableSlots.length - bookedSlots.length} / ${availableSlots.length} ${
                            isBn ? "স্লট খালি আছে" : "slots available"
                          }`}
                    </span>
                  </div>

                  {bookedSlots.length > 0 && (
                    <span className="text-[11px] font-medium text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                      {bookedSlots.length} {isBn ? "স্লট আগে থেকেই বুকড" : "slots already booked"}
                    </span>
                  )}
                </div>

                {loadingSlots ? (
                  <div className="py-8 flex items-center justify-center gap-2 text-xs text-zinc-500">
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-700" />
                    <span>{isBn ? "রিয়েল-টাইম স্লট লোড হচ্ছে..." : "Loading live slot availability..."}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot;
                      const isBooked = bookedSlots.includes(slot);

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => {
                            if (!isBooked) {
                              setSelectedTimeSlot(slot);
                              setErrors((prev) => ({ ...prev, slot: "" }));
                            }
                          }}
                          className={`relative p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-zinc-950 text-white border-zinc-950 shadow-sm ring-1 ring-zinc-950 scale-102"
                              : isBooked
                              ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed line-through"
                              : "bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 cursor-pointer"
                          }`}
                        >
                          <div>{slot}</div>
                          {isBooked && (
                            <span className="text-[9px] uppercase tracking-wider text-rose-600 block mt-0.5 no-underline font-bold">
                              {isBn ? "বুকড" : "Booked"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {availableSlots.length > 0 && availableSlots.every((s) => bookedSlots.includes(s)) && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {isBn
                        ? "এই তারিখের সবকটি স্লট ইতিমধ্যেই বুক হয়ে গেছে। অনুগ্রহ করে ক্যালেন্ডার থেকে অন্য একটি তারিখ নির্বাচন করুন।"
                        : "All slots for this date are fully booked. Please select another date from the calendar."}
                    </span>
                  </div>
                )}

                {errors.slot && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.slot}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-center text-xs text-zinc-500">
                {isBn
                  ? "↑ উপরের ক্যালেন্ডার থেকে যেকোনো একটি উপলব্ধ তারিখ নির্বাচন করুন।"
                  : "↑ Please select an available chamber date on the calendar above to view time slots."}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Patient Details Form */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-950">
                {isBn ? "৩. রোগীর যোগাযোগের তথ্য দিন" : "3. Enter Patient Contact Details"}
              </h3>
              <p className="text-xs text-zinc-600 mt-1">
                {isBn
                  ? "সিরিয়াল নিশ্চিত করার জন্য আমাদের ক্লিনিক কোঅর্ডিনেটর এই নম্বরে যোগাযোগ করবেন।"
                  : "Our clinic coordinator will call this number to verify and confirm your consultation schedule."}
              </p>
            </div>

            {/* Selected Booking Summary Strip */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-zinc-600 block">{isBn ? "ডাক্তার:" : "Doctor:"}</span>
                <span className="font-bold text-zinc-950">{t(activeDoctor.name)}</span>
              </div>
              <div>
                <span className="text-zinc-600 block">{isBn ? "তারিখ ও সময়:" : "Date & Time:"}</span>
                <span className="font-bold text-zinc-950">
                  {selectedDate} at {selectedTimeSlot}
                </span>
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs font-bold text-zinc-900 underline underline-offset-2 hover:text-black"
              >
                {isBn ? "পরিবর্তন করুন" : "Change Slot"}
              </button>
            </div>

            <div className="space-y-4">
              {/* Patient Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  {isBn ? UI_STRINGS.bookingWizard.labels.fullName.bn : UI_STRINGS.bookingWizard.labels.fullName.en} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={isBn ? "উদা: মো. রফিকুল ইসলাম" : "e.g., Rafiqul Islam"}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950 transition-all"
                  />
                </div>
                {errors.name && (
                  <span className="text-xs text-red-600 font-medium block mt-1">{errors.name}</span>
                )}
              </div>

              {/* Patient Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  {isBn ? UI_STRINGS.bookingWizard.labels.phone.bn : UI_STRINGS.bookingWizard.labels.phone.en} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder={isBn ? "উদা: 017XXXXXXXX" : "e.g., 017XXXXXXXX"}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950 transition-all"
                  />
                </div>
                {errors.phone && (
                  <span className="text-xs text-red-600 font-medium block mt-1">{errors.phone}</span>
                )}
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  {isBn ? UI_STRINGS.bookingWizard.labels.email.bn : UI_STRINGS.bookingWizard.labels.email.en}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950 transition-all"
                  />
                </div>
              </div>

              {/* Reason / Symptoms (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  {isBn ? UI_STRINGS.bookingWizard.labels.reason.bn : UI_STRINGS.bookingWizard.labels.reason.en}
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <textarea
                    rows={3}
                    value={visitReason}
                    onChange={(e) => setVisitReason(e.target.value)}
                    placeholder={
                      isBn
                        ? "আপনার দাঁতের সমস্যা বা কোন চিকিৎসা করাতে চান তা সংক্ষেপে লিখুন..."
                        : "Briefly describe your symptoms or what treatment you are considering..."
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Booking Confirmation Screen */}
        {currentStep === 4 && isSubmitted && (
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              {/* Reference Code with Copy button */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-100 border border-zinc-200 mb-2">
                <span className="text-xs text-zinc-600 font-medium">
                  {isBn ? "সিরিয়াল রেফারেন্স:" : "Booking Ref:"}
                </span>
                <span className="font-mono text-sm sm:text-base font-extrabold text-zinc-950">
                  {bookingRef}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(bookingRef);
                    setCopiedRef(true);
                    setTimeout(() => setCopiedRef(false), 2000);
                  }}
                  className="p-1 rounded-md text-zinc-500 hover:text-zinc-900 transition-colors"
                  title={isBn ? "রেফারেন্স কোড কপি করুন" : "Copy reference code"}
                >
                  {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
                {isBn
                  ? UI_STRINGS.bookingWizard.confirmation.heading.bn
                  : UI_STRINGS.bookingWizard.confirmation.heading.en}
              </h3>
              <p className="text-sm text-zinc-600 mt-2 max-w-md mx-auto leading-relaxed">
                {isBn
                  ? UI_STRINGS.bookingWizard.confirmation.message.bn
                  : UI_STRINGS.bookingWizard.confirmation.message.en}
              </p>
            </div>

            {/* Booking Details Card (Web Summary) */}
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-zinc-50 border border-zinc-200 text-left space-y-3 text-xs shadow-xs">
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-600">
                  {UI_STRINGS.bookingWizard.confirmation.selectedDoctor[isBn ? "bn" : "en"]}
                </span>
                <span className="font-bold text-zinc-900">{t(activeDoctor.name)}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-600">
                  {UI_STRINGS.bookingWizard.confirmation.selectedDate[isBn ? "bn" : "en"]}
                </span>
                <span className="font-bold text-zinc-900">{selectedDate} ({selectedTimeSlot})</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-600">
                  {UI_STRINGS.bookingWizard.confirmation.patientName[isBn ? "bn" : "en"]}
                </span>
                <span className="font-bold text-zinc-900">{patientName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-600">
                  {UI_STRINGS.bookingWizard.confirmation.patientPhone[isBn ? "bn" : "en"]}
                </span>
                <span className="font-bold text-zinc-900 font-mono">{patientPhone}</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                <span className="text-zinc-600">
                  {isBn ? "অ্যাপয়েন্টমেন্ট স্ট্যাটাস:" : "Appointment Status:"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px] border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? "CONFIRMED (নিশ্চিত)" : "CONFIRMED"}</span>
                </span>
              </div>
              <div className="flex justify-between items-center pt-0.5">
                <span className="text-zinc-600">
                  {isBn ? "পেমেন্ট স্ট্যাটাস:" : "Payment Status:"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[11px] border border-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                  <span>UNPAID (চেম্বারে প্রদেয়)</span>
                </span>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                  `Hello KGH Dental, I have requested an appointment.\nRef: ${bookingRef}\nDoctor: ${activeDoctor.name.en}\nDate: ${selectedDate} at ${selectedTimeSlot}\nPatient: ${patientName}\nPhone: ${patientPhone}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {isBn
                    ? UI_STRINGS.bookingWizard.confirmation.whatsappBtn.bn
                    : UI_STRINGS.bookingWizard.confirmation.whatsappBtn.en}
                </span>
              </a>

              {/* Print Slip Button */}
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>{isBn ? "স্লিপ প্রিন্ট করুন" : "Print Slip"}</span>
              </button>

              {/* Track Status Online Link */}
              <Link
                href={`/appointment/track?ref=${bookingRef}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>{isBn ? "সিরিয়াল ট্র্যাক করুন" : "Track Status"}</span>
              </Link>

              {/* Book Another */}
              <button
                onClick={resetWizard}
                className="inline-flex items-center justify-center px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl transition-colors"
              >
                {isBn
                  ? UI_STRINGS.bookingWizard.confirmation.bookAnotherBtn.bn
                  : UI_STRINGS.bookingWizard.confirmation.bookAnotherBtn.en}
              </button>
            </div>

            {/* Toggle Preview Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => setShowSlipPreview(!showSlipPreview)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 underline underline-offset-4 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {showSlipPreview
                    ? isBn
                      ? "অফিসিয়াল স্লিপ প্রিভিউ লুকান"
                      : "Hide Official Slip Preview"
                    : isBn
                    ? "অফিসিয়াল প্রিন্ট স্লিপ প্রিভিউ দেখুন (UNPAID ও রিসিপশন সিল বক্স)"
                    : "Preview Official Slip (UNPAID & Reception Seal)"}
                </span>
              </button>
            </div>

            {/* On-screen Preview when toggled */}
            {showSlipPreview && (
              <div className="mt-4 pt-6 border-t border-zinc-200 text-left">
                <AppointmentPrintSlip
                  bookingRef={bookingRef}
                  doctorName={t(activeDoctor.name)}
                  departmentName={t(activeDoctor.specialty)}
                  date={selectedDate}
                  timeSlot={selectedTimeSlot}
                  patientName={patientName}
                  patientPhone={patientPhone}
                  patientEmail={patientEmail}
                  symptoms={visitReason}
                  paymentStatus="UNPAID"
                />
              </div>
            )}

            {/* Hidden on web, exclusively visible & isolated during print */}
            <div className="hidden print:block text-left">
              <AppointmentPrintSlip
                bookingRef={bookingRef}
                doctorName={t(activeDoctor.name)}
                departmentName={t(activeDoctor.specialty)}
                date={selectedDate}
                timeSlot={selectedTimeSlot}
                patientName={patientName}
                patientPhone={patientPhone}
                patientEmail={patientEmail}
                symptoms={visitReason}
                paymentStatus="UNPAID"
              />
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer Buttons */}
        {currentStep < 4 && (
          <div className="pt-6 mt-6 border-t border-zinc-200 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isBn ? UI_STRINGS.bookingWizard.labels.backButton.bn : UI_STRINGS.bookingWizard.labels.backButton.en}</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#474B4E] hover:bg-[#373a3c] active:bg-[#2b2d2f] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>
                {currentStep === 3
                  ? isBn
                    ? UI_STRINGS.bookingWizard.labels.confirmButton.bn
                    : UI_STRINGS.bookingWizard.labels.confirmButton.en
                  : isBn
                  ? UI_STRINGS.bookingWizard.labels.nextButton.bn
                  : UI_STRINGS.bookingWizard.labels.nextButton.en}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
