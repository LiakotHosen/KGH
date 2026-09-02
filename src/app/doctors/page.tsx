"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Award,
  GraduationCap,
  Building,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { DOCTORS } from "@/data/doctors";
import { Doctor } from "@/types";
import { fetchLiveDoctors } from "@/lib/api/db";
import { useLanguage } from "@/context/LanguageContext";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function DoctorsPage() {
  const { t, isBn } = useLanguage();
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(DOCTORS);

  useEffect(() => {
    fetchLiveDoctors().then((docs) => {
      if (docs && docs.length > 0) {
        setDoctorsList(docs);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-zinc-50 border-b border-zinc-200 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              {isBn ? "ক্লিনিক্যাল প্যানেল" : "Specialist Dental Faculty"}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 mt-1 tracking-tight">
              {isBn ? "আমাদের বিশেষজ্ঞ ডাক্তারবৃন্দ" : "Meet Our Specialists"}
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 mt-3 leading-relaxed">
              {isBn
                ? "ছয়জন বিশেষজ্ঞ। লক্ষ্য একটাই — আপনার ঠিক যে চিকিৎসাটা দরকার, সেটা দেবে সেই বিষয়ে সবচেয়ে দক্ষ মানুষটাই।"
                : "Six specialists. One shared mission — to give you the exact care you need, from the person best trained to give it."}
            </p>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {doctorsList.map((doc) => (
            <div
              key={doc.id}
              id={doc.id}
              className="p-6 sm:p-8 rounded-3xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 transition-all shadow-2xs scroll-mt-24"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Doctor Avatar Column */}
                <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden bg-zinc-200 border-2 border-zinc-300 shadow-md">
                    <img
                      src={doc.photoUrl}
                      alt={t(doc.name)}
                      className="w-full h-full object-cover object-top"
                    />
                    {doc.isConfirmed && (
                      <span className="absolute bottom-2.5 right-2.5 p-1.5 bg-zinc-950 text-white rounded-lg shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </span>
                    )}
                  </div>

                  <div className="mt-4 w-full">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-zinc-200 text-zinc-800 uppercase tracking-wider mb-2">
                      {t(doc.specialty)}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-950">
                      {t(doc.name)}
                    </h2>
                    <p className="text-xs font-semibold text-zinc-600 mt-1">
                      {t(doc.degrees)}
                    </p>
                  </div>
                </div>

                {/* Doctor Bio & Schedule Details */}
                <div className="lg:col-span-8 space-y-5">
                  {/* Designation & Institutions */}
                  {(doc.designation || doc.institution) && (
                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-700 bg-white p-3.5 rounded-xl border border-zinc-200/80">
                      {doc.designation && (
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Award className="w-4 h-4 text-zinc-900 shrink-0" />
                          <span>{t(doc.designation)}</span>
                        </div>
                      )}
                      {doc.institution && (
                        <div className="flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-zinc-500 shrink-0" />
                          <span>{t(doc.institution)}</span>
                        </div>
                      )}
                      {doc.bmdcReg && (
                        <div className="flex items-center gap-1.5 text-zinc-600">
                          <ShieldCheck className="w-4 h-4 text-zinc-500 shrink-0" />
                          <span>BMDC: {doc.bmdcReg}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Biography */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                      {isBn ? "পেশাগত বিবরণী" : "Professional Biography"}
                    </h3>
                    <p className="text-sm text-zinc-700 leading-relaxed">
                      {t(doc.bio)}
                    </p>
                  </div>

                  {/* Chamber Availability Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 text-white space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                          {isBn ? "কেজিএইচ ডেন্টাল চেম্বার সময়সূচি" : "KGH Dental Chamber Schedule"}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-md">
                        {isBn ? "৩০ মিনিট স্লট" : "30-Min Interval"}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span>{isBn ? doc.schedule.availableDaysBn : doc.schedule.availableDaysEn}</span>
                    </div>

                    <p className="text-xs text-zinc-300">
                      {t(doc.schedule.note)}
                    </p>
                  </div>

                  {/* Book Button */}
                  <div className="pt-2">
                    <Link
                      href={`/appointment?doctor=${doc.id}`}
                      className="inline-flex items-center gap-2 px-7 py-3.5 bg-zinc-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{isBn ? "এই ডাক্তারের সিরিয়াল বুক করুন" : "Book Consultation with Doctor"}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
