"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { UI_STRINGS } from "@/data/translations";

export function Hero() {
  const { isBn } = useLanguage();
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Scroll Progress Tracking for Smooth Scroll-Driven Zoom
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      // Calculate scroll progress from window scroll for universal mobile & desktop support
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const progress = Math.min(Math.max(scrollY / (windowH * 0.8), 0), 1);
      setScrollProgress(progress);
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Shared Animation Parameters
  const imageScale = 1.0 + scrollProgress * 0.15;
  const desktopTopLeftTranslateX = scrollProgress * -15;
  const desktopTopRightTranslateX = scrollProgress * 15;
  const desktopBottomSlideX = (1 - Math.min(1, 0.4 + scrollProgress * 1.2)) * 20;
  const desktopBottomOpacity = Math.min(1, 0.75 + scrollProgress * 0.25);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE & TABLET (< lg): Full Bleed, Zero Dead Gaps, Natural Snug Flow */}
      {/* ========================================================================= */}
      <section className="block lg:hidden relative w-full bg-[#181a1c] text-white overflow-hidden border-b border-white/10 pt-3 pb-5">
        
        {/* Subtle ambient backdrop */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <img
            src="/images/doctors/doctor_team.jpeg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover blur-3xl opacity-20 scale-125"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center text-center">
          
          {/* TITLE BLOCK: Sits comfortably under navbar, tight and snug directly above photo */}
          <div className="w-full max-w-xl px-4 sm:px-6 space-y-1.5 mb-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-zinc-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{isBn ? "অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক দল" : "Multi-Specialty Dental Care in One Chamber"}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-[1.18] drop-shadow-md">
              {isBn ? "আপনার হাসির যত্নে আছি আমরা পুরো একটি টিম" : "A Full Team of Dedicated Specialists for Your Smile"}
            </h1>
          </div>

          {/* 100% FULL-BLEED PHOTO: Bleeds edge-to-edge with NO gaps, NO borders, shows all 4 doctors with scroll zoom! */}
          <div className="w-full relative aspect-[16/9] overflow-hidden my-0 select-none">
            <img
              src="/images/doctors/doctor_team.jpeg"
              alt="KGH Dental Specialist Doctors Team"
              style={{
                transform: `scale(${imageScale})`,
                transformOrigin: "center 45%",
                transition: "transform 100ms cubic-bezier(0.2, 0.8, 0.4, 1)",
              }}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* DESCRIPTION: Snug right below photo floor, NO CARD CONTAINER, clean unboxed text! */}
          <div className="w-full max-w-xl px-4 sm:px-6 mt-1.5">
            <p className="text-xs sm:text-sm text-zinc-200 font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              {isBn
                ? "অর্থোডন্টিক্স থেকে শুরু করে ওরাল সার্জারি — কেজিএইচ ডেন্টালে প্রতিটি বিভাগের জন্য আছেন আলাদা বিশেষজ্ঞ ডাক্তার। তাই আপনার প্রতিটি চিকিৎসাই হবে সেই বিষয়ে সত্যিকারের অভিজ্ঞ একজনের হাতে।"
                : "From orthodontics to oral surgery, KGH Dental brings together specialist dentists across every field — so every treatment you need is handled by someone who's an expert in exactly that."}
            </p>
          </div>

          {/* BUTTONS: Snug right below description */}
          <div className="w-full max-w-xl px-4 sm:px-6 flex items-center justify-center gap-2.5 mt-3">
            <Link
              href="/appointment"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#474B4E] hover:bg-[#373a3c] text-white text-xs sm:text-sm font-bold shadow-lg border border-white/20 transition-all active:scale-98"
            >
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span>{isBn ? UI_STRINGS.hero.primaryCta.bn : UI_STRINGS.hero.primaryCta.en}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/services"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98"
            >
              <span>{isBn ? UI_STRINGS.hero.secondaryCta.bn : UI_STRINGS.hero.secondaryCta.en}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* TRUST BADGES */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 px-4 text-[10px] sm:text-xs font-medium text-zinc-300">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{isBn ? "কোনো লুকানো খরচ নেই" : "No Hidden Costs"}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{isBn ? "জীবাণুমুক্ত আধুনিক চেম্বার" : "Clean & Sterile Chamber"}</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DESKTOP LAYOUT (>= lg): Pinned 4-Corner Cinematic Scroll Zoom          */}
      {/* ========================================================================= */}
      <div
        ref={desktopContainerRef}
        className="hidden lg:block relative w-full h-[200vh] bg-zinc-950"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
          
          {/* Desktop Full-Bleed Background Layer with Scroll-Driven Zoom */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <img
              src="/images/doctors/doctor_team.jpeg"
              alt="KGH Dental Specialist Doctors Team"
              style={{
                transform: `scale(${imageScale})`,
                transformOrigin: "center 45%",
                transition: "transform 100ms cubic-bezier(0.2, 0.8, 0.4, 1)",
              }}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/15 backdrop-brightness-95" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_45%,_rgba(0,0,0,0.55)_100%)]" />
            <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-black/70 via-black/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
          </div>

          {/* 4-CORNER CONTENT CONTAINER */}
          <div className="relative z-20 w-full h-full px-8 lg:px-12 xl:px-16 2xl:px-24 pt-28 lg:pt-32 pb-10 lg:pb-14 flex flex-col justify-between pointer-events-none">
            
            {/* TOP ROW: Top-Left Title & Top-Right Description */}
            <div className="grid grid-cols-12 gap-6 items-start relative z-20">
              <div
                style={{
                  transform: `translateX(${desktopTopLeftTranslateX}px)`,
                  transition: "transform 150ms ease-out",
                }}
                className="col-span-7 xl:col-span-6 pointer-events-auto space-y-3.5"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 shadow-lg text-white text-xs sm:text-sm font-semibold">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>{isBn ? "অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক দল" : "Multi-Specialty Dental Care in One Chamber"}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                  {isBn ? "আপনার হাসির যত্নে আছি আমরা পুরো একটি টিম" : "A Full Team of Dedicated Specialists for Your Smile"}
                </h1>
              </div>

              <div
                style={{
                  transform: `translateX(${desktopTopRightTranslateX}px)`,
                  transition: "transform 150ms ease-out",
                }}
                className="col-span-5 xl:col-span-6 text-right pointer-events-auto flex justify-end"
              >
                <p className="max-w-xl text-base lg:text-lg text-white font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  {isBn
                    ? "অর্থোডন্টিক্স থেকে শুরু করে ওরাল সার্জারি — কেজিএইচ ডেন্টালে প্রতিটি বিভাগের জন্য আছেন আলাদা বিশেষজ্ঞ ডাক্তার। তাই আপনার প্রতিটি চিকিৎসাই হবে সেই বিষয়ে সত্যিকারের অভিজ্ঞ একজনের হাতে।"
                    : "From orthodontics to oral surgery, KGH Dental brings together specialist dentists across every field — so every treatment you need is handled by someone who's an expert in exactly that."}
                </p>
              </div>
            </div>

            {/* BOTTOM ROW: Bottom-Left Button & Bottom-Right Button */}
            <div className="grid grid-cols-12 gap-6 items-end relative z-20">
              <div
                style={{
                  transform: `translateX(-${desktopBottomSlideX}px)`,
                  opacity: desktopBottomOpacity,
                  transition: "transform 180ms ease-out, opacity 180ms ease-out",
                }}
                className="col-span-6 pointer-events-auto space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Link
                    href="/appointment"
                    className="inline-flex items-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl bg-[#474B4E] hover:bg-[#373a3c] active:bg-[#2b2d2f] text-white text-sm sm:text-base font-bold transition-all shadow-xl hover:shadow-2xl active:scale-98 border border-white/20 backdrop-blur-sm group"
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span>{isBn ? UI_STRINGS.hero.primaryCta.bn : UI_STRINGS.hero.primaryCta.en}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-medium text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{isBn ? "কোনো লুকানো খরচ নেই" : "No Hidden Costs"}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{isBn ? "জীবাণুমুক্ত আধুনিক চেম্বার" : "Clean & Sterile Chamber"}</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  transform: `translateX(${desktopBottomSlideX}px)`,
                  opacity: desktopBottomOpacity,
                  transition: "transform 180ms ease-out, opacity 180ms ease-out",
                }}
                className="col-span-6 text-right pointer-events-auto flex justify-end"
              >
                <div className="space-y-2.5">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-sm sm:text-base font-bold transition-all shadow-xl hover:shadow-2xl active:scale-98 border border-white/60 group"
                  >
                    <span>{isBn ? UI_STRINGS.hero.secondaryCta.bn : UI_STRINGS.hero.secondaryCta.en}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="text-xs text-zinc-200 font-medium text-right flex items-center justify-end gap-1.5 drop-shadow-sm">
                    <span>{isBn ? "স্ক্রল করে ডাক্তারদের সাথে পরিচিত হন" : "Scroll to explore our clinic"}</span>
                    <span className="animate-bounce">↓</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Scroll Progress Bar indicator along the bottom */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/15 z-30">
            <div
              style={{ width: `${scrollProgress * 100}%` }}
              className="h-full bg-white transition-all duration-75 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
          </div>

        </div>
      </div>
    </>
  );
}
