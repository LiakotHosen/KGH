"use client";

import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { UI_STRINGS } from "@/data/translations";

export function Hero() {
  const { isBn } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-100/80 via-white to-zinc-50/50 py-16 sm:py-24 lg:py-28 border-b border-zinc-200">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-50">
        <div className="absolute -top-24 left-1/3 w-96 h-96 bg-zinc-200/60 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-zinc-300/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 sm:space-y-8">
          {/* Eyebrow Pill */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/5 border border-zinc-300/80 backdrop-blur-md shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-zinc-900 animate-pulse" />
              <span className="text-xs font-semibold text-zinc-800 tracking-wide">
                {isBn ? UI_STRINGS.hero.eyebrow.bn : UI_STRINGS.hero.eyebrow.en}
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-950 tracking-tight leading-[1.15] max-w-3xl mx-auto">
            {isBn ? UI_STRINGS.hero.headline.bn : UI_STRINGS.hero.headline.en}
          </h1>

          {/* Subhead */}
          <p className="text-base sm:text-lg lg:text-xl text-zinc-600 leading-relaxed max-w-2xl mx-auto">
            {isBn ? UI_STRINGS.hero.subhead.bn : UI_STRINGS.hero.subhead.en}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/appointment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-zinc-950 hover:bg-black text-white text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-98"
            >
              <Calendar className="w-4 h-4" />
              <span>{isBn ? UI_STRINGS.hero.primaryCta.bn : UI_STRINGS.hero.primaryCta.en}</span>
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 hover:text-black text-sm font-semibold transition-all shadow-2xs"
            >
              <span>{isBn ? UI_STRINGS.hero.secondaryCta.bn : UI_STRINGS.hero.secondaryCta.en}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Value Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-zinc-700">
            {UI_STRINGS.hero.pills.map((pill, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{isBn ? pill.bn : pill.en}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
