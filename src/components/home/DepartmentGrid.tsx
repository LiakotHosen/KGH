"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { DEPARTMENTS } from "@/data/departments";
import { Department } from "@/types";
import { fetchLiveDepartments } from "@/lib/api/db";
import { DepartmentIcon } from "@/components/shared/DepartmentIcon";
import { useLanguage } from "@/context/LanguageContext";
import { UI_STRINGS } from "@/data/translations";

export function DepartmentGrid() {
  const { t, isBn } = useLanguage();
  const [deptList, setDeptList] = useState<Department[]>(DEPARTMENTS);

  useEffect(() => {
    fetchLiveDepartments().then((depts) => {
      if (depts && depts.length > 0) {
        setDeptList(depts);
      }
    });
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-zinc-50/50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              {isBn ? "বিশেষায়িত সেবা" : "Specialized Care"}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 mt-1">
              {isBn ? UI_STRINGS.departmentsSection.title.bn : UI_STRINGS.departmentsSection.title.en}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-xl">
              {isBn ? UI_STRINGS.departmentsSection.subtitle.bn : UI_STRINGS.departmentsSection.subtitle.en}
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-900 hover:text-black hover:underline"
          >
            <span>{isBn ? "সকল ৫৬টি সেবার তালিকা দেখুন" : "Browse All 56 Sub-Services"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 8-Card Grid (7 Department Cards with Images + 1 Distinguished Black Action Card) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deptList.map((dept) => {
            return (
              <Link
                key={dept.id}
                href={`/services/${dept.slug}`}
                className="group relative rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-400/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Image Header with Badge Overlay */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-zinc-100">
                  <img
                    src={dept.imageUrl}
                    alt={t(dept.name)}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  {/* Subtle Gradient Shade on bottom of image for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent pointer-events-none" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="p-2 rounded-xl bg-white/90 backdrop-blur-md text-zinc-900 border border-white/50 shadow-xs group-hover:bg-zinc-950 group-hover:text-white transition-colors duration-200">
                      <DepartmentIcon name={dept.iconName} className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-zinc-950 group-hover:text-black mb-1.5 transition-colors line-clamp-1">
                      {t(dept.name)}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                      {t(dept.shortDesc)}
                    </p>
                  </div>

                  {/* Bottom Link Action */}
                  <div className="mt-5 pt-3.5 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-800 group-hover:text-black">
                    <span>{isBn ? "সেবাসমূহ দেখুন" : "Explore Treatments"}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}

          {/* 8th Card: Distinguished Black Callout Card with Atmospheric Visual Backdrop */}
          <div className="relative rounded-2xl bg-zinc-950 text-white overflow-hidden shadow-xl border border-zinc-800 flex flex-col justify-between group">
            {/* Background Operatory Image with Dark Gradient Tint */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/departments/consultation-cta.jpg"
                alt="Consultation Setup"
                className="w-full h-full object-cover object-center opacity-25 group-hover:scale-105 group-hover:opacity-30 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-zinc-950/70" />
            </div>

            {/* Card Content */}
            <div className="relative z-10 p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 backdrop-blur-md border border-zinc-700 text-[11px] font-bold text-zinc-300 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isBn ? "নিশ্চিত না কোন বিভাগে যাবেন?" : "Not Sure Which Department?"}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  {isBn ? "জেনারেল কনসালটেশন নিন" : "Start with a General Consultation"}
                </h3>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {isBn
                    ? "আমাদের অভিজ্ঞ চিকিৎসক আপনার দাঁত ও মাড়ি পরীক্ষা করে উপযুক্ত বিশেষজ্ঞের কাছে রেফার করবেন।"
                    : "Book a preliminary consultation. Our doctor will assess your case and direct you to the ideal specialist."}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80">
                <Link
                  href="/appointment"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold rounded-xl transition-all shadow-md active:scale-98"
                >
                  <span>{isBn ? "কনসালটেশন বুক করুন" : "Book Consultation"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
