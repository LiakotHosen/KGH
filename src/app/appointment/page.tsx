"use client";

import React, { Suspense } from "react";
import { BookingWizard } from "@/components/appointment/BookingWizard";
import { useLanguage } from "@/context/LanguageContext";
import { Phone, Clock, ShieldCheck } from "lucide-react";
import { CLINIC_SETTINGS } from "@/data/settings";

function AppointmentContent() {
  const { isBn } = useLanguage();

  return (
    <div className="min-h-screen bg-zinc-50/60 py-16 sm:py-20">
      <div className="w-full max-w-[2200px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-600">
            {isBn ? "অনলাইন সিরিয়াল বুকিং" : "Online Chamber Reservation"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 mt-2 tracking-tight">
            {isBn ? "আপনার অ্যাপয়েন্টমেন্ট বুক করুন" : "Book Your Specialist Appointment"}
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 mt-3 max-w-2xl mx-auto">
            {isBn
              ? "আপনার পছন্দের ডাক্তার বেছে নিন, সুবিধাজনক একটা সময় নির্বাচন করুন — বাকিটা আমরা দেখব।"
              : "Choose your doctor, pick a time that works for you, and we'll take care of the rest."}
          </p>
        </div>

        {/* Wizard Container */}
        <BookingWizard />

        {/* Supporting Trust Strip */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-700">
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-zinc-900 shrink-0" />
            <span>
              {isBn ? "কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই" : "No Advance Payment Required"}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 flex items-center gap-3">
            <Clock className="w-5 h-5 text-zinc-900 shrink-0" />
            <span>
              {isBn ? "৩০ মিনিট নিবেদিত কনসালটেশন স্লট" : "Dedicated 30-Min Consultation"}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-zinc-200 flex items-center gap-3">
            <Phone className="w-5 h-5 text-zinc-900 shrink-0" />
            <span>
              {isBn
                ? `হেল্পলাইন: ${CLINIC_SETTINGS.emergencyPhone}`
                : `Need Help? Call ${CLINIC_SETTINGS.emergencyPhone}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 text-zinc-500 text-sm">
          Loading appointment system...
        </div>
      }
    >
      <AppointmentContent />
    </Suspense>
  );
}
