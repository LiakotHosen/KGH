"use client";

import React from "react";
import { Star, QrCode, Quote, CheckCircle2, ExternalLink } from "lucide-react";
import { REVIEWS } from "@/data/reviews";
import { useLanguage } from "@/context/LanguageContext";
import { UI_STRINGS } from "@/data/translations";
import { CLINIC_SETTINGS } from "@/data/settings";

export function GoogleReviews() {
  const { t, isBn } = useLanguage();

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-zinc-50 border-b border-zinc-200">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        
        {/* Side-by-Side Layout: Left (Header + Reviews) & Right (Leave Google Review QR Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT SIDE: Header & Patient Reviews (Cols 1 to 7 / 8)                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Header */}
            <div className="mb-8 sm:mb-10">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-zinc-800">
                  {isBn ? "৫.০ গুগল রেটিং" : "5.0 Google Rating"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight">
                {isBn ? UI_STRINGS.reviewsSection.title.bn : UI_STRINGS.reviewsSection.title.en}
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-2xl leading-relaxed">
                {isBn ? UI_STRINGS.reviewsSection.subtitle.bn : UI_STRINGS.reviewsSection.subtitle.en}
              </p>
            </div>

            {/* Reviews Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
              {REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-zinc-500 font-medium">
                        {rev.date}
                      </span>
                    </div>

                    <Quote className="w-5 h-5 text-zinc-300 mb-2" />

                    <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed italic mb-4">
                      &ldquo;{t(rev.comment)}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                        <span>{rev.authorName}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </h4>
                      {rev.treatment && (
                        <span className="text-[11px] text-zinc-500 block mt-0.5">
                          {t(rev.treatment)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded-md">
                      Google Review
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT SIDE: Permanent Google Review QR Card (Cols 8/9 to 12)             */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
            <div className="relative w-full p-6 sm:p-8 bg-white rounded-3xl shadow-lg border border-zinc-200/90 text-center flex flex-col items-center">
              
              {/* QR Icon Badge */}
              <div className="inline-flex p-3 bg-zinc-100 rounded-2xl text-zinc-800 mb-3 shadow-2xs">
                <QrCode className="w-7 h-7" />
              </div>

              {/* 5 Stars */}
              <div className="flex justify-center items-center gap-1 mb-2 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight mb-2">
                {isBn ? "গুগলে আপনার অভিজ্ঞতা শেয়ার করুন" : "Leave Us a Google Review"}
              </h3>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-zinc-600 mb-5 leading-relaxed max-w-xs">
                {isBn
                  ? "আপনার মূল্যবান মতামত আমাদের সেবার মান উন্নত করতে এবং অন্যান্য রোগীদের সঠিক সিদ্ধান্ত নিতে সাহায্য করে।"
                  : "Your feedback helps us maintain exceptional dental care standards and guides new patients to the right specialists."}
              </p>

              {/* QR Code Container */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl inline-block mb-5 shadow-inner">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    CLINIC_SETTINGS.googleReviewUrl
                  )}`}
                  alt="Google Review QR Code"
                  className="w-36 h-36 sm:w-40 sm:h-40 object-contain mx-auto"
                />
                <span className="block mt-2 text-xs text-zinc-500 font-medium">
                  {isBn ? "মোবাইল ক্যামেরা দিয়ে স্ক্যান করুন" : "Scan with phone camera"}
                </span>
              </div>

              {/* Direct Link Action Button */}
              <a
                href={CLINIC_SETTINGS.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-white bg-[#474B4E] hover:bg-[#373a3c] active:bg-[#2b2d2f] rounded-xl transition-all shadow-sm hover:shadow-md active:scale-98"
              >
                <span>{isBn ? "সরাসরি লিংক খুলুন" : "Open Direct Link"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
