"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Calendar, HelpCircle, Clock, Sparkles, Check } from "lucide-react";
import { SubService } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { UI_STRINGS } from "@/data/translations";

interface SubServiceAccordionProps {
  subServices: SubService[];
  departmentSlug: string;
}

export function SubServiceAccordion({
  subServices,
  departmentSlug,
}: SubServiceAccordionProps) {
  const { t, isBn } = useLanguage();
  // By default, expand first 2 subservices
  const [expandedId, setExpandedId] = useState<string | null>(subServices[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {subServices.map((service) => {
        const isExpanded = expandedId === service.id;

        return (
          <div
            key={service.id}
            id={service.id}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isExpanded
                ? "bg-white border-zinc-400 shadow-md ring-1 ring-zinc-900/5"
                : "bg-zinc-50/70 hover:bg-white border-zinc-200"
            }`}
          >
            {/* Clickable Header Bar */}
            <button
              onClick={() => toggleExpand(service.id)}
              className="w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 pr-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-900 text-white text-xs font-bold shrink-0">
                  {service.number}
                </span>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-zinc-950">
                    {t(service.name)}
                  </h4>
                  <span className="text-xs text-zinc-600 block mt-0.5">
                    {isBn
                      ? "ক্লিনিক্যাল তথ্য ও নির্দেশিকা দেখতে ক্লিক করুন"
                      : "Click to view clinical indication & benefits"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:inline-block text-xs font-medium text-zinc-600">
                  {isExpanded ? (isBn ? "সংক্ষিপ্ত করুন" : "Collapse") : (isBn ? "বিস্তারিত দেখুন" : "Details")}
                </span>
                <div
                  className={`p-2 rounded-xl bg-zinc-100 text-zinc-700 transition-transform duration-200 ${
                    isExpanded ? "rotate-180 bg-zinc-900 text-white" : ""
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </button>

            {/* Expanded Content Section */}
            {isExpanded && (
              <div className="p-5 sm:p-6 border-t border-zinc-200 bg-white space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Why Needed */}
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs uppercase tracking-wider mb-2">
                        <HelpCircle className="w-4 h-4 text-zinc-700" />
                        <span>{isBn ? UI_STRINGS.subServiceLabels.why.bn : UI_STRINGS.subServiceLabels.why.en}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                        {t(service.why)}
                      </p>
                    </div>
                  </div>

                  {/* When Needed */}
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs uppercase tracking-wider mb-2">
                        <Clock className="w-4 h-4 text-zinc-700" />
                        <span>{isBn ? UI_STRINGS.subServiceLabels.when.bn : UI_STRINGS.subServiceLabels.when.en}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                        {t(service.when)}
                      </p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="p-4 rounded-xl bg-zinc-900 text-white flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs uppercase tracking-wider mb-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>{isBn ? UI_STRINGS.subServiceLabels.benefit.bn : UI_STRINGS.subServiceLabels.benefit.en}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {t(service.benefit)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-100">
                  <div className="flex items-center gap-2 text-xs text-zinc-700">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>
                      {isBn
                        ? "বিশেষজ্ঞ চিকিৎসক দ্বারা কনসালটেশন ও পরিকল্পনা"
                        : "Specialist-evaluated treatment plan with zero hidden charges"}
                    </span>
                  </div>

                  <Link
                    href={`/appointment?department=${departmentSlug}&treatment=${encodeURIComponent(
                      service.name.en
                    )}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#474B4E] hover:bg-[#373a3c] active:bg-[#2b2d2f] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {isBn
                        ? UI_STRINGS.subServiceLabels.bookThisTreatment.bn
                        : UI_STRINGS.subServiceLabels.bookThisTreatment.en}
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
