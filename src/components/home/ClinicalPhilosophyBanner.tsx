"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Quote,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { UI_STRINGS } from "@/data/translations";
import { ClinicalCreedData } from "@/types";
import { fetchLiveClinicalCreed, DEFAULT_CLINICAL_CREED } from "@/lib/api/db";

export function ClinicalPhilosophyBanner() {
  const { isBn } = useLanguage();
  const [creedData, setCreedData] = useState<ClinicalCreedData>(DEFAULT_CLINICAL_CREED);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    fetchLiveClinicalCreed().then((live) => {
      if (live) setCreedData(live);
    });
  }, []);

  const quoteData = UI_STRINGS.clinicalQuoteBreaker;
  const quotes = quoteData?.quotes || [];

  // Auto-advance quotes every 9 seconds
  useEffect(() => {
    if (quotes.length <= 1) return;
    const interval = setInterval(() => {
      handleNextQuote();
    }, 9000);
    return () => clearInterval(interval);
  }, [quotes.length, activeQuoteIndex]);

  const changeQuote = (newIndex: number) => {
    if (newIndex === activeQuoteIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveQuoteIndex(newIndex);
      setIsFading(false);
    }, 250);
  };

  const handleNextQuote = () => {
    changeQuote((activeQuoteIndex + 1) % quotes.length);
  };

  const handlePrevQuote = () => {
    changeQuote((activeQuoteIndex - 1 + quotes.length) % quotes.length);
  };

  const currentQuote = quotes[activeQuoteIndex] || quotes[0];
  const displayedQuote = activeQuoteIndex === 0 && creedData ? {
    quote: creedData.quote,
    highlight: creedData.subQuote,
    author: creedData.authority,
    role: creedData.designation,
  } : currentQuote;

  return (
    <section className="relative w-full py-20 sm:py-28 lg:py-32 bg-[#eef0f2] border-y border-zinc-200 text-zinc-900 overflow-hidden isolate">
      {/* High-Definition Clinic Background Image - Clearly Visible without Heavy White Wash */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/why-choose-us/modern-chamber.jpg"
          alt="KGH Dental Clinic Chamber"
          className="w-full h-full object-cover object-center opacity-75 scale-105 transition-transform duration-1000"
        />

        {/* Subtle Light Vignette for Smooth Contrast while keeping photo clear */}
        <div className="absolute inset-0 bg-white/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#eef0f2]/70 via-transparent to-[#eef0f2]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#eef0f2]/40 via-transparent to-[#eef0f2]/40" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Top Header Badge & Live Indicator in Minimalist Charcoal/Light-Grey (No Green) */}
          <div className="flex items-center justify-between gap-4 mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-300/80 shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-600 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-800" />
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-800">
                {isBn
                  ? creedData?.tag?.bn || quoteData?.badge?.bn || "আমাদের চিকিৎসা দর্শন"
                  : creedData?.tag?.en || quoteData?.badge?.en || "Our Clinical Creed"}
              </span>
            </div>

            {/* Minimalist Soundwave Indicator in Slate/Charcoal (No Green) */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-300/80 shadow-xs text-zinc-700 text-xs font-mono">
              <Activity className="w-3.5 h-3.5 text-zinc-800" />
              <span className="text-[11px] font-semibold text-zinc-800">KGH Philosophy</span>
              <div className="flex items-center gap-0.5 ml-1">
                <span className="w-0.5 h-3 bg-zinc-700 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-0.5 h-4 bg-zinc-700 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-0.5 h-2 bg-zinc-700 rounded-full animate-bounce [animation-delay:300ms]" />
                <span className="w-0.5 h-3.5 bg-zinc-700 rounded-full animate-bounce [animation-delay:450ms]" />
              </div>
            </div>
          </div>

          {/* 90% Transparent Quotation Box (ব্যাকগ্রাউন্ডের ছবি ৯০% স্বচ্ছভাবে দেখা যাবে) */}
          <div className="relative p-7 sm:p-10 lg:p-12 rounded-3xl bg-white/[0.22] border border-white/60 shadow-[0_12px_32px_0_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300">
            {/* Massive Stylized Background Quote Glyph */}
            <div className="pointer-events-none absolute -top-8 -left-4 text-zinc-400/25 select-none font-serif text-9xl sm:text-[180px] leading-none">
              “
            </div>

            {/* Dynamic Quote Content */}
            <div
              className={`relative z-10 transition-all duration-300 ease-out ${
                isFading
                  ? "opacity-0 -translate-y-2"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <div className="flex items-center gap-3 text-zinc-800 mb-5">
                <Quote className="w-6 h-6 rotate-180" />
                {displayedQuote?.highlight && (
                  <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-zinc-900 bg-white/70 px-3.5 py-1 rounded-full border border-zinc-300/80 shadow-2xs">
                    {isBn
                      ? displayedQuote.highlight.bn
                      : displayedQuote.highlight.en}
                  </span>
                )}
              </div>

              {/* Main Editorial Quote Statement */}
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-950 leading-relaxed sm:leading-relaxed lg:leading-relaxed tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                “
                {isBn
                  ? displayedQuote?.quote?.bn
                  : displayedQuote?.quote?.en}
                ”
              </blockquote>

              {/* Quote Author & Council Attribution */}
              <div className="mt-8 pt-6 border-t border-zinc-300/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white/80 border border-zinc-300 flex items-center justify-center text-zinc-900 shadow-xs">
                    <Award className="w-5 h-5 text-zinc-800" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-zinc-950 tracking-wide">
                      {isBn
                        ? displayedQuote?.author?.bn || "ক্লিনিক্যাল অ্যাডভাইজরি কাউন্সিল"
                        : displayedQuote?.author?.en || "Clinical Advisory Council"}
                    </h4>
                    <p className="text-xs font-medium text-zinc-700">
                      {isBn
                        ? displayedQuote?.role?.bn || "কেজিএইচ ডেন্টাল মাল্টি-স্পেশালিটি চেম্বার"
                        : displayedQuote?.role?.en || "KGH Dental Multi-Specialty Chamber"}
                    </p>
                  </div>
                </div>

                {/* Quote Switcher Controls in Minimalist Light Grey */}
                {quotes.length > 1 && (
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={handlePrevQuote}
                      aria-label="Previous quote"
                      className="p-2 rounded-xl bg-white/80 hover:bg-white text-zinc-800 transition-colors border border-zinc-300 shadow-2xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1.5 px-2">
                      {quotes.map((_, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => changeQuote(qIdx)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            qIdx === activeQuoteIndex
                              ? "w-6 bg-zinc-900"
                              : "w-2 bg-zinc-400 hover:bg-zinc-600"
                          }`}
                          aria-label={`Go to quote ${qIdx + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleNextQuote}
                      aria-label="Next quote"
                      className="p-2 rounded-xl bg-white/80 hover:bg-white text-zinc-800 transition-colors border border-zinc-300 shadow-2xs"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Standard Pills Row in Minimalist Light Grey / Charcoal (No Green) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
            {creedData?.stats ? (
              creedData.stats.map((st, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-zinc-300/80 text-xs text-zinc-800 font-bold shadow-xs"
                >
                  <span className="font-mono text-xs font-extrabold text-zinc-950">
                    {isBn ? st.value.bn : st.value.en}
                  </span>
                  <span className="text-zinc-700">
                    {isBn ? st.label.bn : st.label.en}
                  </span>
                </div>
              ))
            ) : quoteData?.pills ? (
              quoteData.pills.map((pill, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-zinc-300/80 text-xs text-zinc-800 font-bold shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-700 flex-shrink-0" />
                  <span>{isBn ? pill.bn : pill.en}</span>
                </div>
              ))
            ) : null}
          </div>

          {/* Action Callouts */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/appointment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm tracking-wide shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <span>
                {isBn
                  ? quoteData?.ctaPrimary?.bn || "অ্যাপয়েন্টমেন্ট বুক করুন"
                  : quoteData?.ctaPrimary?.en || "Book an Appointment"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm border border-zinc-300 shadow-xs transition-all duration-200"
            >
              <span>
                {isBn
                  ? quoteData?.ctaSecondary?.bn || "বিভাগসমূহ দেখুন"
                  : quoteData?.ctaSecondary?.en || "Explore Our Departments"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
