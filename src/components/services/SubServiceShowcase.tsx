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

// Curated image mappings for sub-services from public/images/SubServices-images
const SUB_SERVICE_IMAGE_MAP: Record<string, string> = {
  // 1. Orthodontics
  "metal-braces": "/images/SubServices-images/1. A. Metal Traditional Braces.png",
  "clear-aligners": "/images/SubServices-images/1. B. Clear Aligners.png",
  "smile-design": "/images/SubServices-images/1. c. Smile Design.png",
  "retainers": "/images/SubServices-images/1. d. Retainers.png",
  "space-maintainers": "/images/SubServices-images/1. e. Space Maintainers.png",
  "myofunctional-appliances": "/images/SubServices-images/1. f. Habit Correction Appliances.png",
  "interceptive-orthodontics": "/images/SubServices-images/1. g. KIDS orthodontics.png",

  // 2. Oral & Maxillofacial Surgery
  "simple-extraction": "/images/SubServices-images/2.1. Simple Tooth Extraction.png",
  "wisdom-tooth-surgery": "/images/SubServices-images/2.2. Impacted Wisdom Tooth.png",
  "dental-implant-surgery": "/images/SubServices-images/2.3. Dental Implant Surgery.png",
  "facial-trauma": "/images/SubServices-images/2.4. Facial Trauma & Fracture Treatment.png",
  "tmj-disorder": "/images/SubServices-images/2.5.  TMJ Jaw Joint Disorder Treatment.png",
  "cyst-tumor-removal": "/images/SubServices-images/2.6. Oral Cyst & Tumor Removal.png",
  "oral-biopsy": "/images/SubServices-images/2.7. Oral Biopsy.png",
  "abscess-management": "/images/SubServices-images/2.8. Space Infection Abscess Management.png",
  "oral-ulcer": "/images/SubServices-images/2.9. Oral Ulcer Management.png",

  // 3. Conservative Dentistry & Endodontics
  "root-canal": "/images/SubServices-images/3. 1. Root Canal Treatment.png",
  "re-root-canal": "/images/SubServices-images/3. 2. Re-Root Canal Treatment.png",
  "composite-filling": "/images/SubServices-images/3. 3. Composite (Tooth-Colored) Filling.png",
  "gic-filling": "/images/SubServices-images/3. 4. GIC (Glass Ionomer) Filling.png",
  "inlay-onlay": "/images/SubServices-images/3. 5. Inlay_Onlay Restoration.png",
  "cracked-tooth": "/images/SubServices-images/3. 6. Cracked Tooth Treatment.png",
  "apicoectomy": "/images/SubServices-images/3. 7. Post & Core Build-Up.png",
  "post-core": "/images/SubServices-images/3. 8. Post & Core Build-Up.png",
  "teeth-whitening": "/images/SubServices-images/3. 9. Toothe whitening.png",

  // 4. Prosthodontics
  "dental-crowns": "/images/SubServices-images/4. 1. Dental Crowns.png",
  "dental-bridges": "/images/SubServices-images/4. 2. Dental Bridges.png",
  "complete-dentures": "/images/SubServices-images/4. 3. Complete Dentures.png",
  "partial-dentures": "/images/SubServices-images/4. 4.  Partial Dentures.png",
  "implant-supported-crown": "/images/SubServices-images/4. 5. Implant-Supported Crown.png",
  "implant-supported-denture": "/images/SubServices-images/4.6. Implant-Supported Denture.png",
  "veneers": "/images/SubServices-images/4.7. Dental venners.png",
  "maxillofacial-prosthesis": "/images/SubServices-images/4.8. Maxillofacial Prosthesis.png",

  // 5. Pediatric Dentistry
  "pulpotomy": "/images/SubServices-images/5. 1. Pulpotomy.png",
  "pulpectomy": "/images/SubServices-images/5. 2. Pulpectomy.png",
  "pediatric-extraction": "/images/SubServices-images/5. 3. Pediatric Tooth Extraction.png",
  "pit-fissure-sealants": "/images/SubServices-images/5.4. Pit & Fissure Sealants.png",
  "kids-space-maintainer": "/images/SubServices-images/5. 5. Space Maintainers.png",
  "habit-breaking": "/images/SubServices-images/5.6. Habit-Breaking Appliances'.png",
  "early-caries": "/images/SubServices-images/5.7. Early Caries Management.png",
  "child-checkup": "/images/SubServices-images/5.8. Child Dental Check-up & Preventive Counselling.png",
  "pediatric-trauma": "/images/SubServices-images/5.9. Dental Trauma Management.png",

  // 6. Periodontics
  "scaling-polishing": "/images/SubServices-images/6. 1. Scaling & Polishing (Cleaning).jpeg",
  "deep-cleaning": "/images/SubServices-images/6.2. Deep Cleaning _ Root Planing.png",
  "periodontitis-treatment": "/images/SubServices-images/6. 3. Gum Disease.png",
  "gum-contouring": "/images/SubServices-images/6. 4. Gummy Smile Correction.png",
  "flap-surgery": "/images/SubServices-images/6. 5. Flap Surgery.png",
  "gum-grafting": "/images/SubServices-images/6. 6. Gum Grafting.png",
  "crown-lengthening": "/images/SubServices-images/6. 7. Crown Lengthening.png",
  "halitosis-management": "/images/SubServices-images/6. 8. Bad Breath (Halitosis) Management.png",
  "mobile-teeth-splinting": "/images/SubServices-images/6. 9. Management of Mobile Teeth by Splinting.png",

  // 7. Oral Medicine & Clinical Diagnosis
  "oral-cancer-screening-diagnosis": "/images/SubServices-images/7. 1. Oral Cancer Screening & Diagnosis.png",
  "precancerous-lesion-management": "/images/SubServices-images/7. 2. Precancerous Lesion Management (Leukoplakia, Erythroplakia).png",
  "osmf-management": "/images/SubServices-images/7. 3. Oral Submucous Fibrosis (OSMF) Management.png",
  "recurrent-oral-ulcers": "/images/SubServices-images/7. 4. Recurrent Oral Ulcer _ Aphthous Ulcer Management.png",
  "oral-lichen-planus": "/images/SubServices-images/7. 5. Oral Lichen Planus & Mucosal Lesion Management.png",
  "burning-mouth-syndrome": "/images/SubServices-images/7. 6. Burning Mouth Syndrome Management.png",
  "oral-biopsy-consultation": "/images/SubServices-images/7.7. Oral Biopsy & Diagnostic Consultation.png",
  "oral-manifestations-systemic": "/images/SubServices-images/7.8. Oral Manifestations of Systemic Disease Management.png",
  "salivary-gland-disorders": "/images/SubServices-images/7.9. Salivary Gland Disorder.png",
  "complex-oral-diagnosis": "/images/SubServices-images/7.10. Second Opinion _ Complex Oral Diagnosis Consultation.png",

  // 8. General Consultation & Diagnostics
  "general-checkup": "/images/SubServices-images/8.1 General Dental Check-up & Consultation.jpeg",
  "digital-xray-opg": "/images/SubServices-images/8. 2, Digital X-Ray.png",
  "intraoral-scanning": "/images/SubServices-images/8. 3. Intraoral Scanning (Digital Impression).png",
  "oral-cancer-screening": "/images/SubServices-images/8. 4. Oral Cancer Screening.png",
  "emergency-care": "/images/SubServices-images/8. 5. Emergency Dental Care.png",
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
      sub.imageUrl ||
      SUB_SERVICE_IMAGE_MAP[sub.id] ||
      sub.imagePlaceholder ||
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
