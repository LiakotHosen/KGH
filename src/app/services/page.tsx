"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, ChevronRight } from "lucide-react";
import { DEPARTMENTS } from "@/data/departments";
import { DepartmentIcon } from "@/components/shared/DepartmentIcon";
import { useLanguage } from "@/context/LanguageContext";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function ServicesPage() {
  const { t, isBn } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDepartments = DEPARTMENTS.map((dept) => {
    if (!searchQuery.trim()) return dept;
    const q = searchQuery.toLowerCase();
    const matchingServices = dept.subServices.filter(
      (s) =>
        s.name.en.toLowerCase().includes(q) ||
        s.name.bn.toLowerCase().includes(q) ||
        s.why.en.toLowerCase().includes(q) ||
        s.why.bn.toLowerCase().includes(q)
    );
    return {
      ...dept,
      subServices: matchingServices,
    };
  }).filter((dept) => dept.subServices.length > 0 || !searchQuery.trim());

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-zinc-50 border-b border-zinc-200 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              {isBn ? "সকল ক্লিনিক্যাল বিভাগ ও সেবা" : "Clinical Departments & Services"}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 mt-1 tracking-tight">
              {isBn ? "কেজিএইচ ডেন্টালের সকল বিশেষায়িত সেবা" : "Comprehensive Dental Care Across 7 Specialties"}
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 mt-3 leading-relaxed">
              {isBn
                ? "আমাদের ৭টি সুনির্দিষ্ট বিভাগে মোট ৫৬টি আধুনিক চিকিৎসা সেবা রয়েছে। প্রতিটি বিভাগ পরিচালিত হয় সেই বিষয়ে উচ্চতর প্রশিক্ষণপ্রাপ্ত বিশেষজ্ঞদের মাধ্যমে।"
                : "Explore 56 specialized treatments across 7 clinical departments. Each department is operated by trained dental specialists committed to predictable, compassionate outcomes."}
            </p>

            {/* Treatment Search Bar */}
            <div className="mt-8 relative max-w-xl">
              <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isBn
                    ? "কোনো নির্দিষ্ট চিকিৎসা খুঁজছেন? (উদা: ব্রেসেস, রুট ক্যানেল, ইমপ্ল্যান্ট)..."
                    : "Search any treatment (e.g., Braces, Root Canal, Implant, Cleaning)..."
                }
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-zinc-300 text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Department Cards Listing */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {filteredDepartments.map((dept) => (
            <div
              key={dept.id}
              className="p-6 sm:p-8 rounded-3xl bg-zinc-50/60 border border-zinc-200 hover:border-zinc-300 transition-all shadow-2xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-200">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-zinc-950 text-white shrink-0">
                    <DepartmentIcon name={dept.iconName} className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                      {dept.subServices.length} {isBn ? "টি বিশেষ চিকিৎসা" : "Specialized Procedures"}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 mt-0.5">
                      {t(dept.name)}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
                      {t(dept.shortDesc)}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/services/${dept.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-colors self-start lg:self-auto"
                >
                  <span>{isBn ? "বিভাগের সকল চিকিৎসা দেখুন" : "View Department & Procedures"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Sub-services Preview Chips */}
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-3">
                  {isBn ? "প্রধান প্রধান সেবাসমূহ:" : "Available Treatments in this Department:"}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {dept.subServices.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/services/${dept.slug}#${sub.id}`}
                      className="group flex items-center justify-between p-3 rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 transition-all text-xs font-semibold text-zinc-800 hover:text-black"
                    >
                      <span className="truncate pr-2">
                        {sub.number}. {t(sub.name)}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {filteredDepartments.length === 0 && (
            <div className="text-center py-16 bg-zinc-50 rounded-3xl border border-zinc-200">
              <p className="text-zinc-600 text-sm">
                {isBn
                  ? `"${searchQuery}" এর সাথে কোনো সেবা খুঁজে পাওয়া যায়নি।`
                  : `No treatments found matching "${searchQuery}".`}
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-xs font-bold text-zinc-950 underline"
              >
                {isBn ? "অনুসন্ধান রিসেট করুন" : "Clear Search Filter"}
              </button>
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
