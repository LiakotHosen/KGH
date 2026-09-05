"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight, ChevronRight } from "lucide-react";
import { DEPARTMENTS } from "@/data/departments";
import { Department } from "@/types";
import { fetchLiveDepartments } from "@/lib/api/db";
import { DepartmentIcon } from "@/components/shared/DepartmentIcon";
import { useLanguage } from "@/context/LanguageContext";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function ServicesPage() {
  const { t, isBn } = useLanguage();
  const [deptList, setDeptList] = useState<Department[]>(DEPARTMENTS);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLiveDepartments().then((depts) => {
      if (depts && depts.length > 0) {
        setDeptList(depts);
      }
    });
  }, []);

  const filteredDepartments = deptList.map((dept) => {
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
      <section className="bg-zinc-50 border-b border-zinc-200 py-16 sm:py-20">
        <div className="w-full max-w-[2200px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="max-w-4xl">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-600">
              {isBn ? "সকল ক্লিনিক্যাল বিভাগ ও সেবা" : "Clinical Departments & Services"}
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-950 mt-2 tracking-tight">
              {isBn ? "কেজিএইচ ডেন্টালের সকল বিশেষায়িত সেবা" : "Comprehensive Dental Care Across 7 Specialties"}
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 mt-4 leading-relaxed max-w-3xl">
              {isBn
                ? "কেজিএইচ ডেন্টালে প্রতিটি চিকিৎসার জন্য আছেন আলাদা বিশেষজ্ঞ ডাক্তার। আপনার সমস্যা অনুযায়ী সঠিক বিভাগটি বেছে নিন এবং জেনে নিন আমাদের সেবাসমূহ।"
                : "Explore our 7 specialized dental departments and 54 dedicated treatments. Every department is led by a specialist trained in that exact field."}
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
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-zinc-300 text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#474B4E] focus:border-[#474B4E] transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Department Cards Listing */}
      <section className="py-16 sm:py-24">
        <div className="w-full max-w-[2200px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-8">
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
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#474B4E] hover:bg-[#373a3c] text-white text-xs font-bold shadow-xs transition-colors self-start lg:self-auto"
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
