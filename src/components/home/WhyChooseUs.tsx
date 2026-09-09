"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  Sparkles,
  FileText,
  CalendarCheck2,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  Info,
  X,
  Layers,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { UI_STRINGS } from "@/data/translations";
import { WhyChooseCard } from "@/types";
import { fetchLiveWhyChooseCards, DEFAULT_WHY_CHOOSE_CARDS } from "@/lib/api/db";

interface CardItem {
  id: string;
  tag: { en: string; bn: string };
  stat: { en: string; bn: string };
  title: { en: string; bn: string };
  desc: { en: string; bn: string };
  highlights?: { en: string[]; bn: string[] };
  cta?: { en: string; bn: string };
  ctaLink?: string;
  image?: string;
}

const EXTENDED_DETAILS: Record<
  string,
  {
    en: { subtitle: string; points: string[]; guarantee: string };
    bn: { subtitle: string; points: string[]; guarantee: string };
  }
> = {
  specialists: {
    en: {
      subtitle:
        "Every dental department at KGH is led exclusively by qualified specialist surgeons (FCPS, MS, PhD) who focus 100% on their specialized discipline.",
      points: [
        "Certified postgraduate specialists for orthodontic, endodontic, maxillofacial, and restorative procedures.",
        "Collaborative multi-specialty clinical board for multi-step or complex aesthetic cases.",
        "Continuous dental education adhering to international clinical treatment guidelines.",
      ],
      guarantee: "100% Specialist-Led Diagnosis — No Generalist Guesswork",
    },
    bn: {
      subtitle:
        "কেজিএইচ ডেন্টালের প্রতিটি বিভাগ শুধুমাত্র উচ্চশিক্ষিত ও সার্টিফায়েড বিশেষজ্ঞ ডাক্তারদের (FCPS, MS, PhD) তত্ত্বাবধানে পরিচালিত হয়।",
      points: [
        "অর্থোডন্টিক্স, রুট ক্যানেল, সার্জারি ও প্রস্থোডন্টিক্সে স্বতন্ত্র ডিগ্রিধারী কনসালটেন্ট।",
        "জটিল কেসগুলোতে একাধিক বিশেষজ্ঞ চিকিৎসকের সমন্বিত বোর্ড রিভিউ ও পরিকল্পনা।",
        "আন্তর্জাতিক মানদণ্ড ও আধুনিক চিকিৎসা গাইডলাইন অনুসারে সঠিক চিকিৎসা নিশ্চয়তা।",
      ],
      guarantee: "১০০% বিশেষজ্ঞ চিকিৎসকের পরামর্শ — কোনো অনুমাননির্ভর চিকিৎসা নয়",
    },
  },
  chamber: {
    en: {
      subtitle:
        "We designed our clinic from the ground up to replace medical anxiety with absolute calm, hygiene, and hospital-grade sterilization.",
      points: [
        "Class-B Vacuum Autoclaves operating at 134°C for 100% sterile and sealed dental instruments.",
        "Ergonomic memory-foam dental chairs designed to reduce back strain during longer appointments.",
        "Quiet acoustic design with soothing ambient lighting and spotless clinical hygiene protocols.",
      ],
      guarantee: "Strict European Class-B Sterilization Protocol for Every Patient",
    },
    bn: {
      subtitle:
        "রোগীর ভয় ও অস্বস্তি দূর করে একটি শান্ত, মনোরম ও আন্তর্জাতিক মানের স্বাস্থ্যকর পরিবেশ নিশ্চিত করতে আমাদের চেম্বারটি সাজানো।",
      points: [
        "১৩৪° সেলসিয়াস তাপমাত্রার ইউরোপীয় ক্লাস-বি ভ্যাকুয়াম অটোক্লেভ দ্বারা প্রতিটি ইন্সট্রুমেন্ট জীবাণুমুক্ত।",
        "দীর্ঘ চিকিৎসার সময়ও সর্বোচ্চ আরামের জন্য আরামদায়ক মেমোরি ফোম ডেন্টাল চেয়ার।",
        "শান্ত মনোরম পরিবেশ, আধুনিক ইন্টেরিয়র এবং সার্বক্ষণিক পরিচ্ছন্নতার নিশ্চয়তা।",
      ],
      guarantee: "প্রতিটি রোগীর জন্য কঠোর ইউরোপীয় ক্লাস-বি স্টেরিলাইজেশন প্রোটোকল",
    },
  },
  plans: {
    en: {
      subtitle:
        "We believe healthcare should have complete clarity. We show you the exact clinical condition and transparent costs before touching a tooth.",
      points: [
        "HD Intraoral camera display allows you to clearly see the exact dental condition on the monitor.",
        "Detailed written treatment plan with transparent itemized pricing — zero surprise bills.",
        "Comprehensive explanation of alternative treatment options with their pros and cons.",
      ],
      guarantee: "Full Cost & Clinical Transparency — Zero Hidden Charges",
    },
    bn: {
      subtitle:
        "আমরা বিশ্বাস করি চিকিৎসার প্রতিটি ধাপে স্বচ্ছতা জরুরি। চিকিৎসা শুরুর আগেই দাঁতের প্রকৃত অবস্থা ও খরচের স্পষ্ট ধারণা দেওয়া হয়।",
      points: [
        "এইচডি ইন্ট্রাওরাল ক্যামেরা ও ডিজিটাল ডিসপ্লেতে রোগী নিজেই তার দাঁতের সমস্যা সরাসরি দেখতে পারেন।",
        "চিকিৎসার লিখিত পরিকল্পনা ও নির্ধারিত ফি — কোনো লুকানো বা অপ্রত্যাশিত খরচ নেই।",
        "বিকল্প চিকিৎসা পদ্ধতির সুযোগ ও তার ভালো-মন্দ দিক বিস্তারিতভাবে বুঝিয়ে বলা হয়।",
      ],
      guarantee: "চিকিৎসা ও খরচে ১০০% স্বচ্ছতা — কোনো গোপন চার্জ নেই",
    },
  },
  booking: {
    en: {
      subtitle:
        "No endless phone calls or crowded waiting rooms. Our digital booking system respects your busy schedule with precision time slots.",
      points: [
        "Book online in under 2 minutes: select your doctor, select your preferred day, and confirm.",
        "Automated WhatsApp and SMS confirmation with full appointment details and location pin.",
        "Dedicated clinic coordinator on standby for rapid rescheduling or emergency support.",
      ],
      guarantee: "Guaranteed Dedicated Time Slot — Minimized Waiting Time",
    },
    bn: {
      subtitle:
        "বারবার ফোন করার ঝামেলা কিংবা চেম্বারে বসে ঘণ্টার পর ঘণ্টা অপেক্ষা করার দিন শেষ। ডিজিটাল পদ্ধতিতে দ্রুততম সময়ে সিরিয়াল নিন।",
      points: [
        "মাত্র ২ মিনিটে অনলাইন বুকিং: পছন্দের বিশেষজ্ঞ ও সুবিধাজনক দিন বেছে নিয়ে সহজেই বুক করুন।",
        "তাৎক্ষণিক হোয়াটসঅ্যাপ নিশ্চিতকরণ মেসেজ ও চেম্বার লোকেশন লিংক প্রাপ্তি।",
        "জরুরি সিরিয়াল পরিবর্তন বা যে কোনো তথ্যের জন্য সার্বক্ষণিক ডেডিকেটেড কোঅর্ডিনেটর সাপোর্ট।",
      ],
      guarantee: "নির্দিষ্ট সময়ে সিরিয়াল কনফার্মেশন — দীর্ঘ অপেক্ষার অবসান",
    },
  },
};

export function WhyChooseUs() {
  const { isBn } = useLanguage();
  const [liveCards, setLiveCards] = useState<WhyChooseCard[]>(DEFAULT_WHY_CHOOSE_CARDS);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<CardItem | null>(null);
  const [isNavVisible, setIsNavVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchLiveWhyChooseCards().then((cards) => {
      if (cards && cards.length > 0) setLiveCards(cards);
    });
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const icons = [UserCheck, Sparkles, FileText, CalendarCheck2];

  const items: CardItem[] = liveCards.map((c, idx) => {
    const staticItem = (UI_STRINGS.whyChooseUs.items as unknown as CardItem[])[idx] || {};
    return {
      id: c.id,
      tag: c.badge || staticItem.tag || { en: "Standard", bn: "মানদণ্ড" },
      stat: staticItem.stat || { en: `0${idx + 1}`, bn: `০${idx + 1}` },
      title: c.title || staticItem.title,
      desc: c.subtitle || staticItem.desc,
      highlights: {
        en: c.bullets?.map((b) => b.en) || staticItem.highlights?.en || [],
        bn: c.bullets?.map((b) => b.bn) || staticItem.highlights?.bn || [],
      },
      cta: staticItem.cta || { en: "Explore", bn: "বিস্তারিত" },
      ctaLink: staticItem.ctaLink || "/appointment",
      image: c.image || staticItem.image,
    };
  });

  const getExtendedDetails = (cardId: string) => {
    const card = liveCards.find((c) => c.id === cardId);
    if (!card) return EXTENDED_DETAILS[cardId];
    return {
      en: {
        subtitle: card.protocolSubtitle?.en || EXTENDED_DETAILS[cardId]?.en?.subtitle || "",
        points: card.protocolSteps?.map((s) => `${s.title.en}: ${s.detail.en}`) || EXTENDED_DETAILS[cardId]?.en?.points || [],
        guarantee: card.protocolGuarantees?.[0]?.en || EXTENDED_DETAILS[cardId]?.en?.guarantee || "",
      },
      bn: {
        subtitle: card.protocolSubtitle?.bn || EXTENDED_DETAILS[cardId]?.bn?.subtitle || "",
        points: card.protocolSteps?.map((s) => `${s.title.bn}: ${s.detail.bn}`) || EXTENDED_DETAILS[cardId]?.bn?.points || [],
        guarantee: card.protocolGuarantees?.[0]?.bn || EXTENDED_DETAILS[cardId]?.bn?.guarantee || "",
      },
    };
  };

  // Update active index based on scroll position and section bounds
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sRect = sectionRef.current.getBoundingClientRect();
      const inView = sRect.top <= 120 && sRect.bottom >= 300;
      setIsNavVisible(inView);

      const scrollPosition = window.scrollY + window.innerHeight * 0.45;
      cardRefs.current.forEach((ref, idx) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;
        if (scrollPosition >= top && scrollPosition <= bottom) {
          setActiveCardIndex(idx);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to a specific card on click
  const scrollToCard = (index: number) => {
    const targetRef = cardRefs.current[index];
    if (targetRef) {
      const yOffset = -20;
      const y = targetRef.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveCardIndex(index);
    }
  };

  const nextCard = () => {
    const nextIdx = Math.min(activeCardIndex + 1, items.length - 1);
    scrollToCard(nextIdx);
  };

  const prevCard = () => {
    const prevIdx = Math.max(activeCardIndex - 1, 0);
    scrollToCard(prevIdx);
  };

  return (
    <section ref={sectionRef} className="relative w-full bg-zinc-950 text-zinc-900">
      {/* Intro Header Section */}
      <div className="pt-20 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-950 text-center relative z-10 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-zinc-700 animate-ping" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-700">
              {isBn ? "আমাদের বিশেষত্ব ও মানদণ্ড" : "Our Clinical Standard"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight">
            {isBn ? UI_STRINGS.whyChooseUs.title.bn : UI_STRINGS.whyChooseUs.title.en}
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 mt-4 max-w-2xl mx-auto leading-relaxed">
            {isBn ? UI_STRINGS.whyChooseUs.subtitle.bn : UI_STRINGS.whyChooseUs.subtitle.en}
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <Layers className="w-4 h-4 text-zinc-700" />
              {isBn
                ? "স্ক্রোল করুন বা বাটনে ক্লিক করে প্রতিটি ধাপ দেখুন"
                : "Scroll or use arrows to navigate full-screen standards"}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Sticky Navigation Bar for Quick Click-Switching */}
      <aside
        aria-label="Clinical standard steps"
        className={`fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-2 transition-all duration-300 ${
          isNavVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-200/90 shadow-2xl">
          {/* Card Indicator Buttons */}
          <div className="flex items-center gap-1 px-1">
            {items.map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => scrollToCard(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  activeCardIndex === idx
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                <span>0{idx + 1}</span>
                {activeCardIndex === idx && (
                  <span className="hidden md:inline font-semibold text-[11px] max-w-[120px] truncate">
                    {isBn ? item.tag?.bn || item.title.bn : item.tag?.en || item.title.en}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-zinc-200 mx-1" />

          {/* Up & Down Arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={prevCard}
              disabled={activeCardIndex === 0}
              aria-label="Previous standard"
              className="p-1.5 rounded-lg text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={nextCard}
              disabled={activeCardIndex === items.length - 1}
              aria-label="Next standard"
              className="p-1.5 rounded-lg text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* The 4 Full-Bleed Stacking Cards */}
      <div className="relative w-full">
        {items.map((item, index) => {
          const Icon = icons[index] || Sparkles;
          const isFirst = index === 0;

          const itemImage =
            item.image ||
            (index === 0
              ? "/images/why-choose-us/specialist-care.jpg"
              : index === 1
              ? "/images/why-choose-us/modern-chamber.jpg"
              : index === 2
              ? "/images/why-choose-us/transparent-plans-hd.jpeg"
              : "/images/why-choose-us/easy-booking.jpg");

          const highlights = item.highlights
            ? isBn
              ? item.highlights.bn
              : item.highlights.en
            : [];

          return (
            <div
              key={item.id || index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              id={`clinical-card-${index}`}
              style={{
                zIndex: index + 10,
              }}
              className={`sticky top-0 min-h-screen w-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
                !isFirst
                  ? "rounded-t-[36px] sm:rounded-t-[48px] shadow-[0_-25px_60px_rgba(0,0,0,0.55)] border-t border-white/20"
                  : ""
              }`}
            >
              {/* Full-Bleed High Definition Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={itemImage}
                  alt={isBn ? item.title.bn : item.title.en}
                  className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
                />

                {/* Balanced Contrast Vignette so the photo is vibrant and text is readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
              </div>

              {/* Card Sequence Indicator in Corner */}
              <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-20 flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white shadow-lg text-xs font-bold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>
                    0{index + 1} / 0{items.length}
                  </span>
                </div>
                {item.tag && (
                  <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-bold tracking-wide shadow-md border border-white/20">
                    {isBn ? item.tag.bn : item.tag.en}
                  </span>
                )}
              </div>

              {/* Top Right Stat Pill */}
              {item.stat && (
                <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold tracking-wide shadow-lg backdrop-blur-sm border border-white/30">
                    {isBn ? item.stat.bn : item.stat.en}
                  </span>
                </div>
              )}

              {/* Centered Middle-Aligned 95% Transparent Card (টেক্সটের ব্যাকগ্রাউন্ড ৯৫% স্বচ্ছ) */}
              <div className="relative z-20 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center">
                <div className="w-full rounded-3xl sm:rounded-[36px] bg-white/[0.05] border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-6 sm:p-10 md:p-12 text-center flex flex-col items-center relative transition-all duration-300">
                  {/* Icon Circle */}
                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/20 text-white shadow-lg mb-4">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>

                  {/* Category Pill */}
                  <div className="mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-200 bg-white/15 px-3.5 py-1 rounded-full border border-white/25 shadow-xs">
                      {isBn ? item.tag?.bn || "ক্লিনিক্যাল স্ট্যান্ডার্ড" : item.tag?.en || "Clinical Standard"}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3 sm:mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                    {isBn ? item.title.bn : item.title.en}
                  </h3>

                  {/* Main Description */}
                  <p className="text-sm sm:text-base text-zinc-100 font-medium leading-relaxed max-w-xl mx-auto mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {isBn ? item.desc.bn : item.desc.en}
                  </p>

                  {/* Micro-Highlights (3 Checkmark Points) - 95% Transparent Pills */}
                  {highlights.length > 0 && (
                    <div className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
                      {highlights.map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/30 border border-white/20 text-xs sm:text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons Row */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
                    {item.ctaLink && (
                      <Link
                        href={item.ctaLink}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs sm:text-sm tracking-wide shadow-xl transition-all duration-200 hover:scale-[1.03]"
                      >
                        <span>
                          {item.cta
                            ? isBn
                              ? item.cta.bn
                              : item.cta.en
                            : isBn
                            ? "দেখুন"
                            : "Explore"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}

                    <button
                      onClick={() => setSelectedItem(item)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-black/30 hover:bg-black/45 text-white font-semibold text-xs sm:text-sm border border-white/25 transition-all duration-200 shadow-sm"
                    >
                      <Info className="w-4 h-4 text-zinc-300" />
                      <span>{isBn ? "বিস্তারিত প্রোটোকল" : "Detailed Protocol"}</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Scroll Hint for Non-Final Cards */}
                {index < items.length - 1 && (
                  <button
                    onClick={nextCard}
                    className="mt-6 inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-semibold drop-shadow-md transition-colors animate-bounce"
                  >
                    <span>{isBn ? "পরবর্তী স্ট্যান্ডার্ড দেখতে স্ক্রোল করুন" : "Scroll to see next standard"}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Trust & Quality Assurance Bar */}
      <div className="relative z-30 p-6 sm:p-8 lg:p-10 bg-white border-t border-zinc-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-zinc-950 text-white shadow-sm flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-zinc-300" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-zinc-950">
                {isBn
                  ? "কেজিএইচ ক্লিনিক্যাল গ্যারান্টি ও নিরাপত্তা"
                  : "KGH Clinical Safety & Quality Guarantee"}
              </p>
              <p className="text-xs sm:text-sm text-zinc-500">
                {isBn
                  ? "আন্তর্জাতিক মেডিকেল স্ট্যান্ডার্ড মেনে প্রতিটি চিকিৎসা পরিচালিত হয়"
                  : "All procedures follow strict European sterilisation & digital diagnostic standards"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-zinc-700">
            <span className="px-3.5 py-2 rounded-xl bg-zinc-100 border border-zinc-200/70">
              ✓ {isBn ? "ক্লাস-বি অটোক্লেভ" : "Class-B Autoclave"}
            </span>
            <span className="px-3.5 py-2 rounded-xl bg-zinc-100 border border-zinc-200/70">
              ✓ {isBn ? "ডিজিটাল ওপিজি এক্স-রে" : "Low-Dose Digital X-Ray"}
            </span>
            <span className="px-3.5 py-2 rounded-xl bg-zinc-100 border border-zinc-200/70">
              ✓ {isBn ? "স্বচ্ছ লিখিত ফি" : "Transparent Written Fee"}
            </span>
            <Link
              href="/appointment"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold transition-colors shadow-sm"
            >
              <span>{isBn ? "সিরিয়াল নিন" : "Book Consultation"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Detail Modal / Sheet */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/75 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-zinc-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Image */}
            <div className="relative h-48 sm:h-52 w-full bg-zinc-900 overflow-hidden">
              <img
                src={
                  selectedItem.image ||
                  "/images/why-choose-us/specialist-care.jpg"
                }
                alt={isBn ? selectedItem.title.bn : selectedItem.title.en}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider border border-white/30 mb-2 inline-block">
                  {selectedItem.tag ? (isBn ? selectedItem.tag.bn : selectedItem.tag.en) : "Standard"}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {isBn ? selectedItem.title.bn : selectedItem.title.en}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-sm font-medium text-zinc-700 leading-relaxed">
                  {getExtendedDetails(selectedItem.id)?.[isBn ? "bn" : "en"]
                    ?.subtitle ||
                    (isBn ? selectedItem.desc.bn : selectedItem.desc.en)}
                </p>
              </div>

              {/* Detailed Points */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {isBn ? "আমাদের সুনির্দিষ্ট মানদণ্ড" : "Our Clinical Standard Points"}
                </h4>
                <div className="space-y-2.5">
                  {(
                    getExtendedDetails(selectedItem.id)?.[isBn ? "bn" : "en"]
                      ?.points ||
                    (selectedItem.highlights
                      ? isBn
                        ? selectedItem.highlights.bn
                        : selectedItem.highlights.en
                      : [])
                  ).map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-zinc-800 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantee Box */}
              {getExtendedDetails(selectedItem.id)?.[isBn ? "bn" : "en"]
                ?.guarantee && (
                <div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-zinc-700 flex-shrink-0" />
                  <p className="text-xs font-semibold text-zinc-900">
                    {
                      getExtendedDetails(selectedItem.id)?.[isBn ? "bn" : "en"]
                        ?.guarantee
                    }
                  </p>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-100">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
                >
                  {isBn ? "বন্ধ করুন" : "Close"}
                </button>
                <Link
                  href={selectedItem.ctaLink || "/appointment"}
                  onClick={() => setSelectedItem(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold tracking-wide shadow-md transition-all"
                >
                  <span>
                    {selectedItem.cta
                      ? isBn
                        ? selectedItem.cta.bn
                        : selectedItem.cta.en
                      : isBn
                      ? "সিরিয়াল নিন"
                      : "Book Now"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
