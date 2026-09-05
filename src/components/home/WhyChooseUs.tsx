"use client";

import React from "react";
import { UserCheck, Sparkles, FileText, CalendarCheck2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { UI_STRINGS } from "@/data/translations";

export function WhyChooseUs() {
  const { isBn } = useLanguage();

  const icons = [UserCheck, Sparkles, FileText, CalendarCheck2];

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-zinc-50 border-b border-zinc-200">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-600">
            {isBn ? "আমাদের বিশেষত্ব" : "Our Clinical Standard"}
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 mt-2">
            {isBn ? UI_STRINGS.whyChooseUs.title.bn : UI_STRINGS.whyChooseUs.title.en}
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 mt-3 max-w-2xl mx-auto">
            {isBn ? UI_STRINGS.whyChooseUs.subtitle.bn : UI_STRINGS.whyChooseUs.subtitle.en}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {UI_STRINGS.whyChooseUs.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="inline-flex p-3 rounded-2xl bg-zinc-100 text-zinc-900 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-950 mb-2.5">
                    {isBn ? item.title.bn : item.title.en}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {isBn ? item.desc.bn : item.desc.en}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-zinc-100 text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                  0{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
