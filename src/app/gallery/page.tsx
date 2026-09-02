"use client";

import React, { useState } from "react";
import { Play, Image as ImageIcon, Sparkles, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function GalleryPage() {
  const { isBn } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: { en: "All", bn: "সকল ছবি" } },
    { id: "chamber", label: { en: "Chamber & Setup", bn: "চেম্বার ও পরিবেশ" } },
    { id: "treatments", label: { en: "Clinical Treatments", bn: "চিকিৎসা ও আধুনিক প্রযুক্তি" } },
    { id: "sterilization", label: { en: "Sterilization Units", bn: "জীবাণুমুক্তকরণ ব্যবস্থা" } },
  ];

  const galleryItems = [
    {
      id: 1,
      title: { en: "Modern Dental Operatory Suite", bn: "আধুনিক ডেন্টাল চেয়ার ও ক্লিনিক্যাল রুম" },
      category: "chamber",
      desc: { en: "Ergonomic clinical chairs with integrated digital display systems.", bn: "রোগীর সর্বোচ্চ আরামদায়ক পরিবেশ ও ডিজিটাল মনিটরিং ব্যবস্থা।" },
    },
    {
      id: 2,
      title: { en: "Digital 3D Intraoral Scanner", bn: "ডিজিটাল থ্রিডি ইন্ট্রাওরাল স্ক্যানার" },
      category: "treatments",
      desc: { en: "Micron-precise digital impression taking without silicone putty.", bn: "কোনো আঠালো পেস্ট ছাড়াই সেকেন্ডে দাঁতের ডিজিটাল থ্রিডি মডেল।" },
    },
    {
      id: 3,
      title: { en: "Hospital-Grade Class-B Autoclave", bn: "ক্লাস-বি অটোক্লেভ জীবাণুমুক্তকরণ ইউনিট" },
      category: "sterilization",
      desc: { en: "100% bacterial and viral eradication for every surgical instrument.", bn: "আন্তর্জাতিক মান অনুযায়ী প্রতিটি যন্ত্রের শতভাগ জীবাণুমুক্তকরণ।" },
    },
    {
      id: 4,
      title: { en: "Clear Aligners Precision Planning", bn: "ক্লিয়ার অ্যালাইনার পরিকল্পনা" },
      category: "treatments",
      desc: { en: "Computerized orthodontic progression from initial visit to final smile.", bn: "কম্পিউটার নিয়ন্ত্রিত সুনির্দিষ্ট দাঁত সোজা করার পরিকল্পনা।" },
    },
    {
      id: 5,
      title: { en: "Digital OPG & Panoramic Radiography", bn: "ডিজিটাল ওপিজি ও প্যানোরামিক এক্স-রে" },
      category: "treatments",
      desc: { en: "Ultra-low radiation high definition jaw imaging suite.", bn: "স্বল্পমাত্রার রেডিয়েশনসহ চোয়ালের উচ্চমানের ডিজিটাল প্রতিচ্ছবি।" },
    },
    {
      id: 6,
      title: { en: "Patient Consultation Lounge", bn: "রোগী ও পরিবারের আরামদায়ক লাউঞ্জ" },
      category: "chamber",
      desc: { en: "Serene, quiet waiting environment designed for patient peace of mind.", bn: "মানসিক প্রশান্তিদায়ক শান্ত ও স্নিগ্ধ অপেক্ষার পরিবেশ।" },
    },
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
                className="group rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50 hover:shadow-lg transition-all duration-300"
              >
                {/* Visual Placeholder / Mock Chamber Representation */}
                <div className="relative h-56 bg-zinc-900 overflow-hidden flex items-center justify-center text-zinc-400">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  
                  {/* Subtle graphical backdrop */}
                  <div className="text-center p-6 space-y-2 relative z-20 text-white">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto border border-white/20">
                      <Sparkles className="w-5 h-5 text-zinc-200" />
                    </div>
                    <span className="text-xs font-bold tracking-wider uppercase text-zinc-300 block">
                      {isBn ? item.title.bn : item.title.en}
                    </span>
                  </div>
                </div>

                <div className="p-5 bg-white">
                  <h3 className="text-sm font-bold text-zinc-950 mb-1">
                    {isBn ? item.title.bn : item.title.en}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {isBn ? item.desc.bn : item.desc.en}
                  </p>
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
