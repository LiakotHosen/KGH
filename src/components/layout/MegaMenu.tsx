"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { DEPARTMENTS } from "@/data/departments";
import { DepartmentIcon } from "@/components/shared/DepartmentIcon";
import { useLanguage } from "@/context/LanguageContext";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const { t, isBn } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-1/2 -translate-x-1/2 w-[94vw] max-w-5xl mt-2 p-6 rounded-2xl glass-panel shadow-2xl border border-zinc-200/90 animate-in fade-in slide-in-from-top-2 duration-200 z-50"
    >
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-200/80">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
            {isBn ? "সকল ক্লিনিক্যাল বিভাগ" : "Clinical Specializations"}
          </span>
          <h3 className="text-lg font-bold text-zinc-900">
            {isBn ? "কেজিএইচ ডেন্টালের ৭টি বিশেষায়িত বিভাগ" : "7 Specialized Departments at KGH Dental"}
          </h3>
        </div>
        <Link
          href="/services"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-800 hover:text-black hover:underline"
        >
          <span>{isBn ? "সকল সেবার ওভারভিউ" : "All Services Overview"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {DEPARTMENTS.map((dept) => (
          <Link
            key={dept.id}
            href={`/services/${dept.slug}`}
            onClick={onClose}
            className="group flex items-start gap-3.5 p-3.5 rounded-xl bg-white/70 hover:bg-zinc-100/90 border border-zinc-200/60 hover:border-zinc-300 transition-all duration-200"
          >
            <div className="p-2.5 rounded-xl bg-zinc-100 text-zinc-800 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
              <DepartmentIcon name={dept.iconName} className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-black truncate">
                  {t(dept.name)}
                </h4>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5 leading-relaxed">
                {t(dept.shortDesc)}
              </p>
              <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-zinc-600">
                <span>{dept.subServices.length}</span>
                <span>{isBn ? "টি বিশেষ চিকিৎসা" : "Specialized Treatments"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 pt-3.5 border-t border-zinc-200/70 flex flex-wrap items-center justify-between text-xs text-zinc-600">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
          {isBn
            ? "প্রতিটি চিকিৎসায় কোনো মূল্য লুকানো নেই — শতভাগ স্বচ্ছ চিকিৎসা পরিকল্পনা"
            : "Transparent Treatment Plans — Specialist-led consultations with zero guesswork"}
        </span>
        <Link
          href="/appointment"
          onClick={onClose}
          className="font-semibold text-zinc-900 hover:text-black underline underline-offset-4"
        >
          {isBn ? "সরাসরি সিরিয়াল বুক করুন →" : "Book Directly with a Specialist →"}
        </Link>
      </div>
    </div>
  );
}
