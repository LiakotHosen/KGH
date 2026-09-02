"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight, BookOpen, Tag } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog";
import { useLanguage } from "@/context/LanguageContext";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function BlogPage() {
  const { t, isBn } = useLanguage();
  const [selectedDept, setSelectedDept] = useState<string>("all");

  const departments = [
    { id: "all", label: { en: "All Topics", bn: "সকল বিষয়" } },
    { id: "endodontics", label: { en: "Root Canal & Fillings", bn: "রুট ক্যানেল ও ফিলিং" } },
    { id: "orthodontics", label: { en: "Braces & Aligners", bn: "ব্রেসেস ও অ্যালাইনার" } },
    { id: "oral-surgery", label: { en: "Oral Surgery & Wisdom Teeth", bn: "ওরাল সার্জারি ও আক্কেল দাঁত" } },
    { id: "prosthodontics", label: { en: "Implants & Crowns", bn: "ইমপ্ল্যান্ট ও ক্রাউন" } },
    { id: "pediatric", label: { en: "Kids Dentistry", bn: "শিশু দন্ত চিকিৎসা" } },
    { id: "periodontics", label: { en: "Gums & Bleeding", bn: "মাড়ির যত্ন ও রক্তপাত" } },
  ];

  const filteredPosts =
    selectedDept === "all"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.departmentSlug === selectedDept);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-zinc-50 border-b border-zinc-200 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              {isBn ? "ডেন্টাল স্বাস্থ্য জ্ঞান ও নির্দেশিকা" : "Dental Health Education & Guides"}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 mt-1 tracking-tight">
              {isBn ? "দাঁত ও মুখের যত্নে বিশেষজ্ঞ পরামর্শ" : "Evidence-Based Dental Guides"}
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 mt-3 leading-relaxed">
              {isBn
                ? "১০টি গুরুত্বপূর্ণ বিষয়ে আমাদের ডেন্টাল চিকিৎসকদের বাস্তবসম্মত তথ্য, ভুল ধারণা নিরসন ও চিকিৎসা পরামর্শ।"
                : "Explore 10 comprehensive clinical guides addressing common dental questions, treatments, myths, and proactive preventive care."}
            </p>

            {/* Department Filter Pills */}
            <div className="flex flex-wrap gap-2 mt-8">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedDept === dept.id
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-100"
                  }`}
                >
                  {isBn ? dept.label.bn : dept.label.en}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-zinc-200 text-zinc-800">
                      <Tag className="w-3 h-3 text-zinc-600" />
                      <span>{t(post.departmentName)}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-zinc-950 group-hover:text-black leading-snug mb-3">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {t(post.title)}
                    </Link>
                  </h2>

                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3 mb-6">
                    {t(post.excerpt)}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 font-medium">{post.date}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 group-hover:text-black group-hover:translate-x-0.5 transition-all"
                  >
                    <span>{isBn ? "সম্পূর্ণ পড়ুন" : "Read Guide"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
