"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Clock, Award, Sparkles, Pause, Play } from "lucide-react";
import { DOCTORS } from "@/data/doctors";
import { Doctor } from "@/types";
import { fetchLiveDoctors } from "@/lib/api/db";
import { useLanguage } from "@/context/LanguageContext";
import { UI_STRINGS } from "@/data/translations";

export function DoctorPreview() {
  const { t, isBn } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(DOCTORS);

  useEffect(() => {
    fetchLiveDoctors().then((docs) => {
      if (docs && docs.length > 0) {
        setDoctorsList(docs);
      }
    });
  }, []);

  // Duplicate the list of doctors to create an endless, seamless looping slider
  const loopDoctors = [...doctorsList, ...doctorsList];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
              <span>{isBn ? "অভিজ্ঞ চিকিৎসক টিম" : "Specialist Team"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight">
              {isBn ? UI_STRINGS.doctorsSection.title.bn : UI_STRINGS.doctorsSection.title.en}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-xl">
              {isBn ? UI_STRINGS.doctorsSection.subtitle.bn : UI_STRINGS.doctorsSection.subtitle.en}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Pause / Play Toggle Button for User Control */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition-all shadow-2xs"
              title={isPaused ? "Play animation" : "Pause animation"}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isBn ? "চালু করুন" : "Play"}</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>{isBn ? "থামান" : "Pause"}</span>
                </>
              )}
            </button>

            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-900 hover:text-black hover:underline"
            >
              <span>{isBn ? "সকল ডাক্তারের তালিকা ও শিডিউল" : "View All Specialists"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Auto-Sliding Marquee Track with Smooth Left-to-Right Edge Masks */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right Soft Fade Gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-white via-white/90 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-white via-white/90 to-transparent z-10" />

        {/* Moving Container */}
        <div
          className="animate-marquee-smooth flex gap-6 px-4"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {loopDoctors.map((doc, idx) => (
            <div
              key={`${doc.id}-${idx}`}
              className="w-[330px] sm:w-[380px] shrink-0 p-6 rounded-2xl bg-zinc-50/80 border border-zinc-200/90 hover:border-zinc-400/90 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Doctor Avatar and Specialty */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-200 border border-zinc-300 shrink-0 shadow-xs group-hover:scale-103 transition-transform duration-200">
                    <img
                      src={doc.photoUrl}
                      alt={t(doc.name)}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider block">
                      {t(doc.specialty)}
                    </span>
                    <h3 className="text-base font-bold text-zinc-950 mt-0.5 leading-snug group-hover:text-black transition-colors">
                      {t(doc.name)}
                    </h3>
                    <p className="text-xs text-zinc-600 mt-1 line-clamp-2 leading-relaxed">
                      {t(doc.degrees)}
                    </p>
                  </div>
                </div>

                {/* Schedule Chip */}
                <div className="p-3.5 rounded-xl bg-white border border-zinc-200/80 mb-4 space-y-1.5 text-xs shadow-2xs">
                  <div className="flex items-center gap-2 text-zinc-800">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="font-semibold">
                      {isBn ? doc.schedule.availableDaysBn : doc.schedule.availableDaysEn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{t(doc.schedule.note)}</span>
                  </div>
                </div>

                {/* Short Bio */}
                <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3 mb-4">
                  {t(doc.bio)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-200/80 flex items-center gap-3">
                <Link
                  href={`/appointment?doctor=${doc.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-950 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors active:scale-98"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isBn ? "সিরিয়াল নিন" : "Book Serial"}</span>
                </Link>

                <Link
                  href={`/doctors#${doc.id}`}
                  className="px-3.5 py-2.5 border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold rounded-xl transition-colors active:scale-98"
                >
                  {isBn ? "প্রোফাইল" : "Profile"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Helper Hint */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-zinc-900 shrink-0" />
            <span>
              {isBn
                ? "কার্ডের ওপর মাউস রাখলে স্লাইডিং থেমে যাবে • সরাসরি বুকিং করতে 'সিরিয়াল নিন' চাপুন।"
                : "Hover cursor over any doctor card to pause the slider • Click 'Book Serial' for direct slot reservation."}
            </span>
          </div>

          <Link
            href="/doctors"
            className="font-bold text-zinc-950 hover:underline shrink-0"
          >
            {isBn ? "সকল ৬ জন ডাক্তারের শিডিউল দেখুন →" : "Explore All 6 Doctors' Schedules →"}
          </Link>
        </div>
      </div>
    </section>
  );
}
