"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calendar,
  Sparkles,
  HelpCircle,
  Clock,
  CheckCircle2,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import { SubService, Department } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { DepartmentIcon } from "@/components/shared/DepartmentIcon";

// Curated image mappings for sub-services to provide distinct, rich photography
const SUB_SERVICE_IMAGE_MAP: Record<string, string> = {
  // Orthodontics
  "metal-braces": "/images/services-images-for-7-services/Orthodontics.jpeg",
  "clear-aligners": "/images/departments/orthodontics.jpg",
  "smile-design": "/images/departments/general-consultation.jpg",
  "retainers": "/images/departments/consultation-cta.jpg",
  "space-maintainers": "/images/departments/pediatric.jpg",
  "orthognathic": "/images/departments/oral-surgery.jpg",
  "ceramic-braces": "/images/services-images-for-7-services/Orthodontics.jpeg",

  // Oral & Maxillofacial Surgery
  "wisdom-tooth": "/images/services-images-for-7-services/Oral & Maxillofacial Surgery.png",
  "dental-implants": "/images/departments/oral-surgery.jpg",
  "facial-trauma": "/images/departments/consultation-cta.jpg",
  "tmj-disorder": "/images/departments/orthodontics.jpg",
  "cyst-removal": "/images/services-images-for-7-services/ORAL Medicine.jpeg",
  "bone-grafting": "/images/services-images-for-7-services/Oral & Maxillofacial Surgery.png",
  "biopsy": "/images/departments/oral-medicine.jpg",

  // Conservative Dentistry & Endodontics
  "root-canal": "/images/services-images-for-7-services/Conservative Dentistry & Endodontics.jpeg",
  "composite-fillings": "/images/departments/endodontics.jpg",
  "re-rct": "/images/departments/consultation-cta.jpg",
  "inlay-onlay": "/images/departments/prosthodontics.jpg",
  "teeth-bleaching": "/images/departments/general-consultation.jpg",
  "dental-veneer": "/images/departments/orthodontics.jpg",
  "post-core": "/images/services-images-for-7-services/Conservative Dentistry & Endodontics.jpeg",

  // Prosthodontics
  "zirconia-crowns": "/images/services-images-for-7-services/Prosthodontics.jpeg",
  "fixed-bridges": "/images/departments/prosthodontics.jpg",
  "complete-dentures": "/images/departments/consultation-cta.jpg",
  "partial-dentures": "/images/departments/endodontics.jpg",
  "implant-overdentures": "/images/services-images-for-7-services/Oral & Maxillofacial Surgery.png",
  "porcelain-laminates": "/images/departments/general-consultation.jpg",
  "mouth-guards": "/images/departments/orthodontics.jpg",

  // Pediatric Dentistry
  "kids-rct": "/images/services-images-for-7-services/Pediatric Dentistry.jpeg",
  "pit-fissure-sealants": "/images/departments/pediatric.jpg",
  "fluoride-therapy": "/images/departments/general-consultation.jpg",
  "space-maintainers-kids": "/images/departments/consultation-cta.jpg",
  "habit-breaking": "/images/departments/orthodontics.jpg",
  "milk-tooth-extractions": "/images/services-images-for-7-services/Pediatric Dentistry.jpeg",
  "kids-crowns": "/images/departments/endodontics.jpg",

  // Periodontics
  "scaling-polishing": "/images/services-images-for-7-services/Periodontics.jpeg",
  "root-planing": "/images/departments/periodontics.jpg",
  "gummy-smile": "/images/departments/general-consultation.jpg",
  "mobile-teeth": "/images/departments/consultation-cta.jpg",
  "bone-regeneration": "/images/services-images-for-7-services/Oral & Maxillofacial Surgery.png",
  "gingivectomy": "/images/services-images-for-7-services/Periodontics.jpeg",
  "gum-depigmentation": "/images/departments/orthodontics.jpg",

  // Oral Medicine & Clinical Diagnosis
  "oral-cancer-screening-diagnosis": "/images/services-images-for-7-services/ORAL Medicine.jpeg",
  "precancerous-lesion-management": "/images/departments/oral-medicine.jpg",
  "osmf-management": "/images/services-images-for-7-services/Oral Medicine & Diagnosis.jpeg",
  "recurrent-aphthous-ulcer": "/images/departments/consultation-cta.jpg",
  "oral-lichen-planus": "/images/services-images-for-7-services/ORAL Medicine.jpeg",
  "burning-mouth-syndrome": "/images/departments/general-consultation.jpg",
  "oral-biopsy-consultation": "/images/departments/oral-surgery.jpg",
  "salivary-gland-disorder": "/images/departments/oral-medicine.jpg",

  // General Consultation & Diagnostics
  "comprehensive-exam": "/images/services-images-for-7-services/Consultation.jpeg",
  "opg-xray": "/images/departments/general-consultation.jpg",
  "3d-intraoral-scan": "/images/departments/consultation-cta.jpg",
  "pain-emergency": "/images/departments/endodontics.jpg",
  "second-opinion": "/images/services-images-for-7-services/Consultation.jpeg",
  "preventive-screening": "/images/departments/pediatric.jpg",
  "oral-hygiene-guide": "/images/services-images-for-7-services/Periodontics.jpeg",
};

interface SubServiceShowcaseProps {
  subServices: SubService[];
  department: Department;
}

export function SubServiceShowcase({
  subServices,
  department,
}: SubServiceShowcaseProps) {
  const { t, isBn } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const activeSub = useMemo(() => {
    if (!subServices || subServices.length === 0) return null;
    return subServices[activeIndex] || subServices[0];
  }, [subServices, activeIndex]);

  if (!activeSub) return null;

  const handleSelectSub = (index: number) => {
    if (index === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + subServices.length) % subServices.length;
    handleSelectSub(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % subServices.length;
    handleSelectSub(nextIdx);
  };

  const getSubImage = (sub: SubService, index: number) => {
    return (
      SUB_SERVICE_IMAGE_MAP[sub.id] ||
      department.imageUrl ||
      "/images/services-images-for-7-services/Orthodontics.jpeg"
    );
  };

  return (
    <section id="treatment-list" className="w-full py-16 sm:py-20 lg:py-24 bg-[#E9E8F0] text-zinc-900 transition-colors duration-300 relative overflow-hidden border-b border-zinc-300/80 scroll-mt-10">
      {/* Section Header */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 mb-10 sm:mb-14">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-zinc-300/80 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-800 mb-3.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isBn ? "ক্লিনিক্যাল সেবা ও নির্দেশিকা" : "Clinical Procedures & Guidance"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.15]">
            {isBn
              ? `${t(department.name)}: সকল চিকিৎসা পদ্ধতি ও কার্যকারিতা`
              : `${t(department.name)}: Procedures, Indications & Benefits`}
          </h2>

          <p className="text-base sm:text-lg text-zinc-700 mt-4 leading-relaxed font-normal max-w-3xl mx-auto">
            {isBn
              ? "নিচের যে-কোনো চিকিৎসা পদ্ধতিতে ক্লিক করে বিস্তারিত বিবরণ, কেন প্রয়োজন, কখন করাবেন এবং স্বাস্থ্যগত সুবিধাসমূহ জেনে নিন।"
              : "Select any procedure to explore clinical indications, timely reasons, and patient benefits in full clinical depth."}
          </p>
        </div>
      </div>

      {/* Main Interactive Showcase: INVERTED LAYOUT (Left = Big Image, Middle = Thumbnails, Right = Text/Details) */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
        
        {/* LEFT COLUMN: Large Showcase Image + Thumbnail Strip */}
        <div className="w-full lg:w-1/2 xl:w-[52%] flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch px-4 sm:px-8 lg:pl-0 lg:pr-6 order-2 lg:order-1">
          
          {/* Big Showcase Image: Full Bleed to the Left on Desktop */}
          <div className="order-1 flex-1 relative rounded-2xl sm:rounded-3xl lg:rounded-r-3xl lg:rounded-l-none overflow-hidden bg-zinc-200 border border-zinc-300/80 lg:border-l-0 shadow-2xl min-h-[340px] sm:min-h-[460px] lg:min-h-[560px] xl:min-h-[620px]">
            <img
              key={activeSub.id}
              src={getSubImage(activeSub, activeIndex)}
              alt={t(activeSub.name)}
              className={`w-full h-full object-cover object-center transition-all duration-500 ${
                isTransitioning ? "opacity-40 scale-102" : "opacity-100 scale-100"
              }`}
            />

            {/* Gradient Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Top Floating Badge on Image */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/85 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-md">
                <DepartmentIcon name={department.iconName} className="w-3.5 h-3.5 text-zinc-100" />
                <span>{t(activeSub.name)}</span>
              </div>

              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                {isBn ? "ক্লিনিক্যাল বিশেষত্ব" : "Clinical Specialty"}
              </span>
            </div>

            {/* Bottom Floating Info Card */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 p-3.5 sm:p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-between gap-3 shadow-xl">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  {isBn ? "বিশেষায়িত চিকিৎসা" : "Specialized Care"}
                </p>
                <p className="text-xs sm:text-sm font-bold text-white truncate">
                  {t(activeSub.name)}
                </p>
              </div>
              <Link
                href={`/appointment?department=${department.slug}&procedure=${activeSub.id}`}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-bold transition-colors shadow-xs"
              >
                <span>{isBn ? "বুকিং" : "Book Now"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Middle: Vertical Thumbnail Strip (Sits between the big image and right text column) */}
          <div className="order-2 flex sm:flex-col gap-2.5 sm:gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[560px] xl:max-h-[620px] py-1 px-1 shrink-0 scrollbar-thin">
            {subServices.map((sub, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleSelectSub(idx)}
                  title={t(sub.name)}
                  className={`group relative rounded-xl overflow-hidden transition-all duration-200 text-left shrink-0 sm:shrink cursor-pointer ${
                    isActive
                      ? "ring-2 ring-zinc-900 ring-offset-2 ring-offset-[#E9E8F0] shadow-xl scale-[1.03] opacity-100"
                      : "opacity-75 hover:opacity-100 hover:scale-[1.03] border border-zinc-300/80 shadow-2xs"
                  }`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-20 lg:h-20 xl:w-22 xl:h-22 relative bg-zinc-200">
                    <img
                      src={getSubImage(sub, idx)}
                      alt={t(sub.name)}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Overlay gradient */}
                    <div
                      className={`absolute inset-0 transition-opacity ${
                        isActive ? "bg-black/10" : "bg-black/25 group-hover:bg-black/10"
                      }`}
                    />
                    {/* Miniature Number Badge */}
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-zinc-950/85 backdrop-blur-xs text-white text-[10px] font-bold shadow-2xs border border-white/20">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    {/* Active Indicator Bar */}
                    {isActive && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-zinc-900" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: Sub-Service Content & Details (Title, Why, When, Benefits, Booking) */}
        <div
          className={`w-full lg:w-1/2 xl:w-[48%] flex flex-col justify-center px-4 sm:px-8 lg:pl-6 lg:pr-12 xl:pl-8 xl:pr-16 2xl:pl-12 2xl:pr-24 py-2 lg:py-0 specialized-showcase-lift transition-all duration-300 order-1 lg:order-2 ${
            isTransitioning ? "opacity-30" : "opacity-100"
          }`}
        >
          <div>
            {/* Topic / Sub-Service Pill with Left/Right Arrows */}
            <div className="flex items-center gap-2 mb-5 sm:mb-6">
              <div className="inline-flex items-center bg-white/80 hover:bg-white border border-zinc-300/80 rounded-full px-2.5 py-1 transition-colors shadow-2xs">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous Procedure"
                  className="p-1 rounded-full text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 text-xs sm:text-sm font-bold text-zinc-900 tracking-wide select-none">
                  {t(activeSub.name)}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next Procedure"
                  className="p-1 rounded-full text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-xs font-semibold text-zinc-600">
                {String(activeIndex + 1).padStart(2, "0")} / {String(subServices.length).padStart(2, "0")}
              </span>
            </div>

            {/* Bold Headline in High-Contrast Dark Typography */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight leading-[1.15] mb-5">
              {t(activeSub.name)}
            </h3>

            {/* 3 Structured Clinical Cards: Why Needed, When Needed, Key Benefits */}
            <div className="space-y-3 mb-8">
              
              {/* Card 1: Why Needed (কেন প্রয়োজন) */}
              <div className="p-4 rounded-xl bg-white border border-zinc-300/80 shadow-2xs hover:border-zinc-400 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1.5">
                  <div className="p-1 rounded-md bg-amber-100 text-amber-800">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <span>{isBn ? "চিকিৎসাটি কেন প্রয়োজন?" : "Why Is This Treatment Needed?"}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed pl-7">
                  {t(activeSub.why)}
                </p>
              </div>

              {/* Card 2: When Needed (কখন করাবেন) */}
              <div className="p-4 rounded-xl bg-white border border-zinc-300/80 shadow-2xs hover:border-zinc-400 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1.5">
                  <div className="p-1 rounded-md bg-sky-100 text-sky-800">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span>{isBn ? "কখন এই চিকিৎসা করাবেন?" : "When Should You Get This Done?"}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed pl-7">
                  {t(activeSub.when)}
                </p>
              </div>

              {/* Card 3: Expected Benefits (সুবিধাসমূহ) */}
              <div className="p-4 rounded-xl bg-white border border-zinc-300/80 shadow-2xs hover:border-zinc-400 transition-colors">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1.5">
                  <div className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{isBn ? "কী কী স্বাস্থ্যগত সুবিধা পাবেন?" : "Key Clinical Benefits & Results"}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed pl-7">
                  {t(activeSub.benefit)}
                </p>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-300/80">
            <Link
              href={`/appointment?department=${department.slug}&procedure=${activeSub.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2D3134] hover:bg-zinc-900 active:bg-black text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 group"
            >
              <span>{isBn ? "এই চিকিৎসা বুক করুন" : "Book This Treatment"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href={`/appointment?department=${department.slug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/80 hover:bg-white text-zinc-900 border border-zinc-300/80 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-2xs"
            >
              <Calendar className="w-4 h-4 text-zinc-700" />
              <span>{isBn ? "বিভাগীয় সিরিয়াল নিন" : "Book Department Appointment"}</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
