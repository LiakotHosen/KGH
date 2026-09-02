"use client";

import React, { useState, useEffect } from "react";
import { Play, Image as ImageIcon, Sparkles, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CtaBanner } from "@/components/home/CtaBanner";
import { fetchLiveGalleryItems, INITIAL_GALLERY } from "@/lib/api/db";
import { GalleryItem } from "@/types";

export default function GalleryPage() {
  const { isBn } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY);

  useEffect(() => {
    fetchLiveGalleryItems().then((items) => {
      if (items && items.length > 0) {
        setGalleryItems(items);
      }
    });
  }, []);

  const categories = [
    { id: "all", label: { en: "All", bn: "সকল ছবি" } },
    { id: "chamber", label: { en: "Chamber & Setup", bn: "চেম্বার ও পরিবেশ" } },
    { id: "treatments", label: { en: "Clinical Treatments", bn: "চিকিৎসা ও আধুনিক প্রযুক্তি" } },
    { id: "sterilization", label: { en: "Sterilization Units", bn: "জীবাণুমুক্তকরণ ব্যবস্থা" } },
  ];

  const filteredItems =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-zinc-50 border-b border-zinc-200 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              {isBn ? "ভিজ্যুয়াল গ্যালারি" : "Visual Tour"}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 mt-1 tracking-tight">
              {isBn ? "কেজিএইচ ডেন্টালের ভেতরের এক ঝলক" : "Inside KGH Dental"}
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 mt-3 leading-relaxed">
              {isBn
                ? "আমাদের আধুনিক চেম্বার, টিম, উন্নত সরঞ্জাম এবং রোগীর সেবার নানা মুহূর্ত।"
                : "A look inside KGH Dental — our clinical suites, advanced sterilization systems, and patient care moments."}
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat.id
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-100"
                  }`}
                >
                  {isBn ? cat.label.bn : cat.label.en}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid Showcase */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Visual Image Banner */}
                <div className="relative h-60 bg-zinc-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={isBn ? item.title.bn : item.title.en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider mb-1 border border-white/20">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-zinc-950 mb-1.5">
                      {isBn ? item.title.bn : item.title.en}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      {isBn ? item.desc.bn : item.desc.en}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Facebook Video Chamber Tour Banner */}
          <div className="mt-14 p-8 rounded-3xl bg-zinc-950 text-white border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isBn ? "ভিডিও সফর" : "Video Walkthrough"}</span>
              </span>
              <h3 className="text-xl font-bold text-white">
                {isBn ? "কেজিএইচ ডেন্টালের ভিডিও ট্যুর ও কেস স্টাডিজ" : "Chamber Video Tour & Case Highlights"}
              </h3>
              <p className="text-xs text-zinc-400 max-w-md">
                {isBn
                  ? "আমাদের ফেসবুক পেজে নিয়মিত ক্লিনিক্যাল কেস, ওরাল হেলথ টিপস ও চেম্বারের ভিডিও প্রকাশিত হয়।"
                  : "Watch video walkthroughs, patient recovery interviews, and expert hygiene guides on our official channel."}
              </p>
            </div>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>{isBn ? "ফেসবুকে ভিডিও দেখুন" : "Watch Videos on Facebook"}</span>
            </a>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
