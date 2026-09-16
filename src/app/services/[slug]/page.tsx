"use client";

import React, { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, ArrowRight } from "lucide-react";
import { DEPARTMENTS } from "@/data/departments";
import { Department } from "@/types";
import { fetchLiveDepartments } from "@/lib/api/db";
import { DepartmentIcon } from "@/components/shared/DepartmentIcon";
import { SubServiceShowcase } from "@/components/services/SubServiceShowcase";
import { useLanguage } from "@/context/LanguageContext";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function DepartmentDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { t, isBn } = useLanguage();
  const [department, setDepartment] = useState<Department | undefined>(() =>
    DEPARTMENTS.find((d) => d.slug === slug)
  );

  useEffect(() => {
    fetchLiveDepartments().then((depts) => {
      if (depts && depts.length > 0) {
        const liveDept = depts.find((d) => d.slug === slug);
        if (liveDept) {
          setDepartment(liveDept);
        }
      }
    });
  }, [slug]);

  if (!department) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Full-Bleed Hero Cover Banner */}
      <section className="relative w-full overflow-hidden bg-zinc-950 text-white min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center border-b border-zinc-800">
        {/* Cover Banner Background Image */}
        {department.coverBannerUrl && (
          <img
            src={department.coverBannerUrl}
            alt={t(department.name)}
            className="absolute inset-0 w-full h-full object-cover object-center scale-100"
          />
        )}

        {/* Subtle localized gradient overlay on the left for text legibility, leaving the real cover image 100% bright and authentic */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-[72%] md:w-[62%] lg:w-[52%] xl:w-[46%] bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[2200px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-20">
          <div className="max-w-2xl lg:max-w-3xl space-y-5">
            {/* Back Button */}
            <div>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/95 hover:text-white text-xs font-medium border border-white/20 transition-all shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{isBn ? "সকল সেবার তালিকায় ফিরে যান" : "Back to All Departments"}</span>
              </Link>
            </div>

            {/* Department Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 text-xs font-bold shadow-sm">
              <DepartmentIcon name={department.iconName} className="w-3.5 h-3.5 text-white" />
              <span>
                {isBn ? "বিশেষায়িত চিকিৎসা অন্তর্ভুক্ত" : "Specialized Treatments Included"}
              </span>
            </div>

            {/* Department Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              {t(department.name)}
            </h1>

            {/* Department Description */}
            <p className="text-base sm:text-lg lg:text-xl text-zinc-100 leading-relaxed max-w-2xl font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {t(department.shortDesc)}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                href={`/appointment?department=${department.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 active:bg-zinc-200 text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4 text-zinc-950" />
                <span>{isBn ? "এই বিভাগে সিরিয়াল নিন" : "Book Department Appointment"}</span>
              </Link>

              <a
                href="#treatment-list"
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-black/40 hover:bg-black/60 active:bg-black/70 backdrop-blur-md text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/25 transition-all shadow-sm"
              >
                <span>{isBn ? "চিকিৎসার বিস্তারিত দেখুন" : "View Treatment Details"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Sub-Services Showcase (Mirrored/Inverted Showcase) */}
      <SubServiceShowcase
        subServices={department.subServices}
        department={department}
      />

      <CtaBanner />
    </div>
  );
}
