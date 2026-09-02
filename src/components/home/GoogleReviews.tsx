"use client";

import React, { useState } from "react";
import { Star, QrCode, Quote, CheckCircle2 } from "lucide-react";
import { REVIEWS } from "@/data/reviews";
import { useLanguage } from "@/context/LanguageContext";
import { UI_STRINGS } from "@/data/translations";
import { ReviewQrModal } from "@/components/shared/ReviewQrModal";

export function GoogleReviews() {
  const { t, isBn } = useLanguage();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  return (
    <section className="py-16 sm:py-20 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-800">
                5.0 Google Rating
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950">
              {isBn ? UI_STRINGS.reviewsSection.title.bn : UI_STRINGS.reviewsSection.title.en}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-xl">
              {isBn ? UI_STRINGS.reviewsSection.subtitle.bn : UI_STRINGS.reviewsSection.subtitle.en}
            </p>
          </div>

          {/* QR Code Action Button */}
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all self-start md:self-auto"
          >
            <QrCode className="w-4 h-4 text-zinc-700" />
            <span>{isBn ? UI_STRINGS.reviewsSection.leaveReviewBtn.bn : UI_STRINGS.reviewsSection.leaveReviewBtn.en}</span>
          </button>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-600 font-medium">
                    {rev.date}
                  </span>
                </div>

                <Quote className="w-6 h-6 text-zinc-300 mb-2" />

                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed italic mb-4">
                  &ldquo;{t(rev.comment)}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                    <span>{rev.authorName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  </h4>
                  {rev.treatment && (
                    <span className="text-[11px] text-zinc-600 block">
                      {t(rev.treatment)}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded-md">
                  Google Review
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review QR Modal */}
      <ReviewQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </section>
  );
}
