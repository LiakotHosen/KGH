"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
  const staticQuotes = quoteData?.quotes || [];

  const quotesList =
    creedData?.quotes && creedData.quotes.length > 0
      ? creedData.quotes
      : staticQuotes.map((sq, idx) => ({
          id: `quote-${idx + 1}`,
          quote: sq.quote,
          highlight: sq.highlight,
          author: sq.author,
          role: sq.role,
          image:
            sq.image ||
            (idx === 0
              ? "/images/why-choose-us/modern-chamber.jpg"
              : idx === 1
              ? "/images/why-choose-us/transparent-plans-hd.jpeg"
              : "/images/why-choose-us/specialist-care.jpg"),
        }));

  // Auto-advance quotes every 9 seconds
  useEffect(() => {
    if (quotesList.length <= 1) return;
    const interval = setInterval(() => {
      handleNextQuote();
    }, 9000);
    return () => clearInterval(interval);
  }, [quotesList.length, activeQuoteIndex]);

  const changeQuote = (newIndex: number) => {
    if (newIndex === activeQuoteIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveQuoteIndex(newIndex);
      setIsFading(false);
    }, 250);
  };

  const handleNextQuote = () => {
    changeQuote((activeQuoteIndex + 1) % quotesList.length);
  };

  const handlePrevQuote = () => {
    changeQuote((activeQuoteIndex - 1 + quotesList.length) % quotesList.length);
  };

  const currentQuote = quotesList[activeQuoteIndex] || quotesList[0];
  const displayedQuote = currentQuote;

  return (
    <section className="relative w-full py-20 sm:py-28 lg:py-32 bg-[#eef0f2] border-y border-zinc-200 text-zinc-900 overflow-hidden isolate">
      {/* High-Definition Clinic Background Images - One Per Quote, Sync Transition */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {quotesList.map((q, qIdx) => {
          const isActive = qIdx === activeQuoteIndex;
          const bgImg =
            q.image ||
            (qIdx === 0
              ? "/images/why-choose-us/modern-chamber.jpg"
              : qIdx === 1
              ? "/images/why-choose-us/transparent-plans-hd.jpeg"
              : "/images/why-choose-us/specialist-care.jpg");

          return (
            <div
              key={q.id || qIdx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={bgImg}
                alt={isBn ? q.author?.bn || "KGH Dental" : q.author?.en || "KGH Dental"}
                className={`w-full h-full object-cover object-center opacity-75 transition-transform duration-1000 ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />

              {/* Subtle Light Vignette for Smooth Contrast while keeping photo clear */}
              <div className="absolute inset-0 bg-white/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#eef0f2]/70 via-transparent to-[#eef0f2]/70" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#eef0f2]/40 via-transparent to-[#eef0f2]/40" />
            </div>
          );
        })}
      </div>

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-4xl mx-auto">
          {/* 90% Transparent Quotation Box */}
          <div className="relative p-8 sm:p-12 lg:p-14 rounded-3xl bg-white/[0.22] border border-white/60 shadow-[0_12px_32px_0_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300">
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
              {/* Main Editorial Quote Statement */}
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-950 leading-relaxed sm:leading-relaxed lg:leading-relaxed tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] text-center">
                “
                {isBn
                  ? displayedQuote?.quote?.bn
                  : displayedQuote?.quote?.en}
                ”
              </blockquote>

              {/* Quote Switcher Controls */}
              {quotesList.length > 1 && (
                <div className="mt-8 pt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={handlePrevQuote}
                    aria-label="Previous quote"
                    className="p-2 rounded-xl bg-white/80 hover:bg-white text-zinc-800 transition-colors border border-zinc-300 shadow-2xs cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5 px-2">
                    {quotesList.map((_, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => changeQuote(qIdx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
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
                    className="p-2 rounded-xl bg-white/80 hover:bg-white text-zinc-800 transition-colors border border-zinc-300 shadow-2xs cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
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
