"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { DOCTORS } from "@/data/doctors";
import { Doctor } from "@/types";
import { fetchLiveDoctors } from "@/lib/api/db";
import { useLanguage } from "@/context/LanguageContext";

export function DoctorPreview() {
  const { t, isBn } = useLanguage();
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(DOCTORS);

  // Repeat array 5 times to form an infinite looping circular track
  const REPEAT_COUNT = 5;
  const extendedDoctors = Array.from({ length: REPEAT_COUNT }, () => doctorsList).flat();
  const baseCount = doctorsList.length;

  // Start with middle set (index = baseCount * 2) so we can slide left/right freely
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(baseCount * 2);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchLiveDoctors().then((docs) => {
      if (docs && docs.length > 0) {
        setDoctorsList(docs);
      }
    });
  }, []);

  // Measure container width
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Determine card width based on screen width
  // Desktop: 5 cards visible in container (each card ~20% minus gaps)
  // Tablet: 3 cards visible
  // Mobile: 1.2 cards visible
  const isDesktop = containerWidth >= 1024;
  const isTablet = containerWidth >= 640 && containerWidth < 1024;
  const visibleCards = isDesktop ? 5 : isTablet ? 3 : 1.25;
  const gap = isDesktop ? 20 : isTablet ? 16 : 12;
  const cardWidth = Math.max(
    180,
    (containerWidth - (Math.floor(visibleCards) - 1) * gap) / visibleCards
  );

  // Seamless infinite track reset when reaching boundaries
  const handleTransitionEnd = () => {
    if (baseCount === 0) return;
    // If we've drifted into the 4th set, silently snap back to 2nd set
    if (activeTrackIndex >= baseCount * 3) {
      setIsTransitioning(false);
      setActiveTrackIndex((prev) => prev - baseCount);
    } else if (activeTrackIndex < baseCount) {
      setIsTransitioning(false);
      setActiveTrackIndex((prev) => prev + baseCount);
    }
  };

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setActiveTrackIndex((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setActiveTrackIndex((prev) => prev - 1);
  }, []);

  // Auto-slide round-robin right-to-left every 4.5s
  useEffect(() => {
    if (isPaused || isDragging || baseCount === 0) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isDragging, baseCount, handleNext]);

  // Touch & Mouse Drag handlers for smooth tactile swipe
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartYRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);
  const pointerIdRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary button (left click) or touch
    if (e.pointerType === "mouse" && e.button !== 0) return;

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    pointerIdRef.current = e.pointerId;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const deltaX = currentX - dragStartXRef.current;
    const deltaY = currentY - dragStartYRef.current;

    // Check if user is scrolling vertically on touch screen
    if (!hasMovedRef.current && Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setDragOffset(0);
      try {
        if (
          pointerIdRef.current !== null &&
          (e.currentTarget as HTMLElement).hasPointerCapture(pointerIdRef.current)
        ) {
          (e.currentTarget as HTMLElement).releasePointerCapture(pointerIdRef.current);
        }
      } catch {
        // ignore
      }
      return;
    }

    if (Math.abs(deltaX) > 6) {
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        setIsDragging(true);
        setIsTransitioning(false);
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
      setDragOffset(deltaX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const didMove = hasMovedRef.current;
    const currentOffset = dragOffset;

    isDraggingRef.current = false;
    setIsDragging(false);
    setIsTransitioning(true);
    setDragOffset(0);

    try {
      if (
        pointerIdRef.current !== null &&
        (e.currentTarget as HTMLElement).hasPointerCapture(pointerIdRef.current)
      ) {
        (e.currentTarget as HTMLElement).releasePointerCapture(pointerIdRef.current);
      }
    } catch {
      // ignore
    }

    if (didMove) {
      // Responsive swipe trigger threshold (35px)
      if (currentOffset < -35) {
        // Swiped left -> advance next
        handleNext();
      } else if (currentOffset > 35) {
        // Swiped right -> advance prev
        handlePrev();
      }

      // Temporarily retain hasMoved flag so click events are ignored right after a drag
      setTimeout(() => {
        hasMovedRef.current = false;
      }, 100);
    } else {
      hasMovedRef.current = false;
    }
  };

  // Calculate translateX to keep activeTrackIndex centered
  const centerOffset = (containerWidth - cardWidth) / 2;
  const baseTranslate = -(activeTrackIndex * (cardWidth + gap)) + centerOffset;
  const currentTranslate = baseTranslate + dragOffset;

  // Active doctor normalized index (0 to 4)
  const currentDoctorIndex = baseCount > 0 ? activeTrackIndex % baseCount : 0;

  return (
    <section
      id="specialist-team"
      className="py-12 sm:py-16 lg:py-20 bg-white border-b border-zinc-200 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Section (Matching Reference Image) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div className="max-w-3xl">
            {/* Category Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-700 mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
              <span>
                {isBn
                  ? "অভিজ্ঞ চিকিৎসকগণ"
                  : "Specialist Doctors"}
              </span>
            </div>

            {/* Main Headline (Matching Reference Image) */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.14]">
              {isBn
                ? "বিশেষজ্ঞ চিকিৎসকদের তত্ত্বাবধানে পূর্ণাঙ্গ ও নির্ভরযোগ্য ডেন্টাল কেয়ার।"
                : "Comprehensive, specialist-led dental care across the full spectrum of oral health."}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-zinc-600 mt-2.5 font-normal max-w-2xl">
              {isBn
                ? "নিবেদিতপ্রাণ বিশেষজ্ঞ চিকিৎসক দল, লক্ষ্য একটাই — আপনার হাসির সুরক্ষা ও নিখুঁত চিকিৎসা।"
                : "Dedicated specialists with one shared commitment to your smile. Every department is led by a doctor trained specifically in that field."}
            </p>

            {/* Left Button (Matching Reference Image "All Courses" -> "View All Specialists") */}
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200 active:scale-98 group"
              >
                <span>{isBn ? "সকল বিশেষজ্ঞ চিকিৎসকদের তালিকা" : "View All Specialists"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Header Controls: Pause/Play & Left/Right Chevrons */}
          <div className="flex items-center gap-2 self-start lg:self-end">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
              title={isPaused ? "Play auto-sliding" : "Pause auto-sliding"}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-zinc-900" />
                  <span>{isBn ? "চালু করুন" : "Play"}</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current text-zinc-900" />
                  <span>{isBn ? "পজ করুন" : "Pause"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Doctor"
              className="p-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-black transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Doctor"
              className="p-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-black transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Continuous Smooth Circular Sliding Carousel Track */}
        <div
          ref={containerRef}
          style={{ touchAction: "pan-y" }}
          className="relative w-full overflow-hidden pt-2 pb-6 cursor-grab active:cursor-grabbing select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className="flex items-start"
            style={{
              transform: `translateX(${currentTranslate}px)`,
              transition: isTransitioning
                ? "transform 600ms cubic-bezier(0.25, 1, 0.5, 1)"
                : "none",
              gap: `${gap}px`,
              touchAction: "pan-y",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedDoctors.map((doc, idx) => {
              const isActive = idx === activeTrackIndex;

              if (isActive) {
                // ACTIVE / EXPANDED CARD (Exactly Matching "Sleep" in Reference Image)
                return (
                  <div
                    key={`doc-${idx}-${doc.id}`}
                    style={{ width: `${cardWidth}px` }}
                    className="shrink-0 bg-white rounded-2xl border-2 border-zinc-900 shadow-xl overflow-hidden transition-all duration-300 z-20 flex flex-col select-none"
                  >
                    {/* Top Eyebrow Bar: "Seminars" (left) | "22 Units" (right) in reference image */}
                    <div className="px-3.5 py-2.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-[11px] font-bold text-zinc-800">
                      <span className="uppercase tracking-wider flex items-center gap-1 text-zinc-900">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{isBn ? "বিশেষজ্ঞ" : "Specialist"}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-600 bg-white px-2 py-0.5 rounded-full border border-zinc-200 shadow-2xs shrink-0">
                        <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="truncate">
                          {isBn ? doc.schedule.availableDaysBn : doc.schedule.availableDaysEn}
                        </span>
                      </span>
                    </div>

                    {/* Doctor Photo - Natural Aspect Ratio (4/3), NOT Stretched! */}
                    <div className="relative w-full aspect-[4/3] bg-zinc-100 overflow-hidden border-b border-zinc-100">
                      <img
                        src={doc.photoUrl}
                        alt={t(doc.name)}
                        draggable={false}
                        className="w-full h-full object-cover object-top select-none pointer-events-none"
                      />
                      {doc.designation && (
                        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-zinc-900 shadow-xs border border-white/60">
                          {t(doc.designation)}
                        </div>
                      )}
                    </div>

                    {/* Content Flowing Downwards Below the Photo ("lekhata nicher dike chole jacche") */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Specialty Heading (Matching "Sleep" in Reference Image) */}
                        <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 tracking-tight leading-snug line-clamp-2">
                          {t(doc.specialty)}
                        </h3>

                        {/* Doctor Name (Matching "Module Overview" in Reference Image) */}
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-800 mt-1 mb-1">
                          {t(doc.name)}
                        </h4>

                        {/* Degrees */}
                        <p className="text-[11px] font-semibold text-zinc-600 mb-2 line-clamp-1">
                          {t(doc.degrees)}
                        </p>

                        {/* Bio Paragraph */}
                        <p className="text-[11px] text-zinc-600 leading-relaxed line-clamp-3 mb-4 font-normal">
                          {t(doc.bio)}
                        </p>
                      </div>

                      {/* Action Buttons: "Explore Course" -> "View Profile" + "Book Serial" */}
                      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                        <Link
                          href={`/doctors#${doc.id}`}
                          onClick={(e) => {
                            if (hasMovedRef.current) e.preventDefault();
                          }}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-950 hover:bg-black text-white text-[11px] font-bold shadow-xs hover:shadow-md transition-all active:scale-98 group shrink-0"
                        >
                          <span>{isBn ? "প্রোফাইল" : "View Profile"}</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>

                        <Link
                          href={`/appointment?doctor=${doc.id}`}
                          onClick={(e) => {
                            if (hasMovedRef.current) e.preventDefault();
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-[11px] font-bold transition-all active:scale-98 shrink-0"
                        >
                          <Calendar className="w-3 h-3 text-zinc-600" />
                          <span>{isBn ? "বুকিং" : "Book Serial"}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              // INACTIVE CARDS (Matching "Feedback Markers", "Mental Health", "Conditions" in Reference Image)
              return (
                <div
                  key={`doc-${idx}-${doc.id}`}
                  style={{ width: `${cardWidth}px` }}
                  onClick={() => {
                    if (hasMovedRef.current) return;
                    setIsTransitioning(true);
                    setActiveTrackIndex(idx);
                  }}
                  className="shrink-0 group cursor-pointer transition-all duration-300 flex flex-col select-none"
                >
                  {/* Photo with EXACT 4/3 Aspect Ratio - Compact, Clean, Never Stretched */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/90 group-hover:border-zinc-400 group-hover:shadow-md transition-all duration-300">
                    <img
                      src={doc.photoUrl}
                      alt={t(doc.name)}
                      draggable={false}
                      className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 group-hover:scale-104 transition-all duration-400 select-none pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    
                    {/* Small Doctor Number Badge */}
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-white/90 backdrop-blur-xs text-zinc-900 text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {(idx % baseCount) + 1}
                    </div>
                  </div>

                  {/* Compact Bottom Label Under Image (Matching Reference Image) */}
                  <div className="pt-2.5 px-1">
                    <p className="text-xs font-bold text-zinc-900 group-hover:text-black transition-colors line-clamp-1">
                      {t(doc.name)}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-medium line-clamp-1 mt-0.5">
                      {t(doc.specialty)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Pagination & Navigation Guide */}
        <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
          {/* Round-Robin Indicators */}
          <div className="flex items-center gap-1.5">
            {doctorsList.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIsTransitioning(true);
                  // Find closest matching index in track
                  const diff = i - currentDoctorIndex;
                  setActiveTrackIndex((prev) => prev + diff);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentDoctorIndex
                    ? "w-7 bg-zinc-950"
                    : "w-2 bg-zinc-300 hover:bg-zinc-400"
                }`}
                aria-label={`Go to doctor ${i + 1}`}
              />
            ))}
            <span className="ml-2 text-[11px] font-medium text-zinc-500">
              {currentDoctorIndex + 1} / {baseCount}
            </span>
          </div>

          <Link
            href="/doctors"
            className="font-semibold text-zinc-900 hover:underline inline-flex items-center gap-1 ml-auto"
          >
            <span>{isBn ? "সকল ডাক্তারের পূর্ণাঙ্গ শিডিউল" : "Complete Doctor Schedules"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
