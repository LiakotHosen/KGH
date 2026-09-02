"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
} from "lucide-react";
import { DOCTORS } from "@/data/doctors";
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

  // Find initial doctor if passed in URL
  const initialDoctorId = useMemo(() => {
    if (preSelectedDoctor) {
      const doc = DOCTORS.find((d) => d.id === preSelectedDoctor);
      if (doc) return doc.id;
    }
    if (preSelectedDept) {
      const dept = DEPARTMENTS.find((d) => d.slug === preSelectedDept);
      if (dept && dept.leadDoctorId) return dept.leadDoctorId;
    }
    return DOCTORS[0].id;
  }, [preSelectedDoctor, preSelectedDept]);

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

  const activeDoctor = useMemo(() => {
    return DOCTORS.find((d) => d.id === selectedDoctorId) || DOCTORS[0];
  }, [selectedDoctorId]);

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

      // Generate reference code
      const ref = `KGH-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(ref);
      setIsSubmitted(true);
      setCurrentStep(4);

      // Record in Admin Patient Registry
      try {
        const newRecord = {
          id: `app-${Date.now()}`,
          reference_code: ref,
          patient_name: patientName,
          patient_phone: patientPhone,
          patient_email: patientEmail || "",
          doctor_name: activeDoctor ? activeDoctor.name.en : "Specialist Doctor",
          department_name: activeDoctor ? activeDoctor.specialty.en : "General Consultation",
          appointment_date: selectedDate,
          time_slot: selectedTimeSlot,
          symptoms: visitReason || "",
          status: "pending",
          created_at: new Date().toISOString().replace("T", " ").substring(0, 16),
        };

        const existing = localStorage.getItem("kgh_admin_appointments");
        const list = existing ? JSON.parse(existing) : [];
        localStorage.setItem("kgh_admin_appointments", JSON.stringify([newRecord, ...list]));
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
            {isBn ? `ধাপ ${currentStep} / ৪` : `Step ${currentStep} of 4`}
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
            const isCurrent = currentStep === step;
            const isCompleted = currentStep > step;

            return (
              <div key={step} className="space-y-1.5">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    isCurrent
                      ? "bg-white"
                      : isCompleted
                      ? "bg-emerald-400"
                      : "bg-zinc-800"
                  }`}
                />
                <span
                  className={`hidden sm:block text-[10px] font-medium truncate ${
                    isCurrent ? "text-white font-bold" : isCompleted ? "text-zinc-300" : "text-zinc-600"
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
              {DOCTORS.map((doc) => {
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
                  {isBn ? "২. তারিখ ও সুবিধাজনক সময় নির্বাচন করুন" : "2. Select Date & Preferred Time Slot"}
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

            {/* Date Selection Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2.5">
                {isBn ? "উপলব্ধ তারিখসমূহ (আগামী ৩ সপ্তাহ)" : "Available Dates (Next 3 Weeks)"}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.dateString;
                  return (
                    <button
                      key={item.dateString}
                      type="button"
                      onClick={() => {
                        setSelectedDate(item.dateString);
                        setErrors((prev) => ({ ...prev, date: "" }));
                      }}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
                          : "bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
                      }`}
                    >
                      <div className="text-xs font-bold">{item.displayString}</div>
                    </button>
                  );
                })}
              </div>

              {errors.date && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.date}</span>
                </div>
              )}
            </div>

            {/* Time Slot Selection Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2.5">
                {isBn ? "সময় নির্বাচন করুন (৩০ মিনিট স্লট)" : "Choose Time Slot (30-Minute Interval)"}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {availableSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setSelectedTimeSlot(slot);
                        setErrors((prev) => ({ ...prev, slot: "" }));
                      }}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                          : "bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>

              {errors.slot && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.slot}</span>
                </div>
              )}
            </div>
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
              <span className="text-xs font-bold tracking-wider uppercase text-zinc-600 block mb-1">
                {UI_STRINGS.bookingWizard.confirmation.bookingRef[isBn ? "bn" : "en"]} {bookingRef}
              </span>
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

            {/* Booking Details Card */}
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-zinc-50 border border-zinc-200 text-left space-y-3 text-xs">
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
              <div className="flex justify-between">
                <span className="text-zinc-600">
                  {UI_STRINGS.bookingWizard.confirmation.patientPhone[isBn ? "bn" : "en"]}
                </span>
                <span className="font-bold text-zinc-900">{patientPhone}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                  `Hello KGH Dental, I have requested an appointment.\nRef: ${bookingRef}\nDoctor: ${activeDoctor.name.en}\nDate: ${selectedDate} at ${selectedTimeSlot}\nPatient: ${patientName}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {isBn
                    ? UI_STRINGS.bookingWizard.confirmation.whatsappBtn.bn
                    : UI_STRINGS.bookingWizard.confirmation.whatsappBtn.en}
                </span>
              </a>

              <button
                onClick={resetWizard}
                className="w-full sm:w-auto px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-colors"
              >
                {isBn
                  ? UI_STRINGS.bookingWizard.confirmation.bookAnotherBtn.bn
                  : UI_STRINGS.bookingWizard.confirmation.bookAnotherBtn.en}
              </button>
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold shadow-xs transition-colors active:scale-98"
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
