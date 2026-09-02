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
    <section className="py-16 sm:py-20 bg-zinc-950 text-white relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-800/40 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-semibold text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {isBn ? "সহজ ৩-ধাপ অনলাইন বুকিং" : "Fast & Seamless 3-Step Booking"}
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          {isBn ? UI_STRINGS.ctaBand.headline.bn : UI_STRINGS.ctaBand.headline.en}
        </h2>

        <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          {isBn ? UI_STRINGS.ctaBand.subtext.bn : UI_STRINGS.ctaBand.subtext.en}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/appointment"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white hover:bg-zinc-100 text-zinc-950 text-sm font-bold rounded-xl transition-all shadow-lg active:scale-98"
          >
            <Calendar className="w-4 h-4 text-zinc-900" />
            <span>{isBn ? UI_STRINGS.ctaBand.button.bn : UI_STRINGS.ctaBand.button.en}</span>
          </Link>

          <a
            href={`tel:${CLINIC_SETTINGS.phoneNumbers[0]}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Phone className="w-4 h-4 text-zinc-400" />
            <span>{CLINIC_SETTINGS.phoneNumbers[0]}</span>
          </a>
        </div>

        <p className="text-xs text-zinc-400 pt-2">
          {isBn ? UI_STRINGS.ctaBand.helpline.bn : UI_STRINGS.ctaBand.helpline.en}{" "}
          <span className="text-zinc-200 font-semibold">{CLINIC_SETTINGS.emergencyPhone}</span>
        </p>
      </div>
    </section>
  );
}
