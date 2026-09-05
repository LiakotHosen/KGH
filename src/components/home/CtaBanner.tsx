"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { UI_STRINGS } from "@/data/translations";
import { CLINIC_SETTINGS } from "@/data/settings";

export function CtaBanner() {
  const { isBn } = useLanguage();

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-[#474B4E] text-white relative overflow-hidden border-t border-white/10">
      {/* Background subtle radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 text-center space-y-7">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold text-zinc-100 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {isBn ? "সহজ ৩-ধাপ অনলাইন বুকিং" : "Fast & Seamless 3-Step Booking"}
        </span>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          {isBn ? UI_STRINGS.ctaBand.headline.bn : UI_STRINGS.ctaBand.headline.en}
        </h2>

        <p className="text-base sm:text-lg lg:text-xl text-zinc-200 max-w-3xl mx-auto leading-relaxed">
          {isBn ? UI_STRINGS.ctaBand.subtext.bn : UI_STRINGS.ctaBand.subtext.en}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/appointment"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-4 bg-white hover:bg-zinc-100 text-[#474B4E] text-sm sm:text-base font-bold rounded-xl transition-all shadow-xl active:scale-98"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#474B4E]" />
            <span>{isBn ? UI_STRINGS.ctaBand.button.bn : UI_STRINGS.ctaBand.button.en}</span>
          </Link>

          <a
            href={`tel:${CLINIC_SETTINGS.phoneNumbers[0]}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 sm:px-9 py-4 bg-black/25 hover:bg-black/35 border border-white/20 text-white text-sm sm:text-base font-semibold rounded-xl transition-colors"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300" />
            <span>{CLINIC_SETTINGS.phoneNumbers[0]}</span>
          </a>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 pt-2">
          {isBn ? UI_STRINGS.ctaBand.helpline.bn : UI_STRINGS.ctaBand.helpline.en}{" "}
          <span className="text-white font-bold">{CLINIC_SETTINGS.emergencyPhone}</span>
        </p>
      </div>
    </section>
  );
}
