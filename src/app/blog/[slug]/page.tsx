"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog";
import { useLanguage } from "@/context/LanguageContext";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { t, isBn } = useLanguage();

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <section className="bg-zinc-50 border-b border-zinc-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isBn ? "সকল গাইডে ফিরে যান" : "Back to All Guides"}</span>
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-200 text-zinc-800">
              <Tag className="w-3 h-3 text-zinc-600" />
              <span>{t(post.departmentName)}</span>
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
            <span className="text-xs text-zinc-400">• {post.date}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            {t(post.title)}
          </h1>

          <p className="text-base text-zinc-600 mt-4 leading-relaxed">
            {t(post.excerpt)}
          </p>
        </div>
      </section>

      {/* Article Body */}
      <article className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Hook Callout */}
          <div className="p-6 rounded-2xl bg-zinc-100 border-l-4 border-zinc-950 text-zinc-800 text-base font-medium italic leading-relaxed">
            &ldquo;{t(post.content.hook)}&rdquo;
          </div>

          {/* Overview */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-950">
              {isBn ? "বিষয়টির সাধারণ পর্যালোচনা ও মূল সত্য" : "Clinical Overview & Key Facts"}
            </h2>
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
              {t(post.content.overview)}
            </p>
          </div>

          {/* Key Points or Symptoms */}
          {post.content.symptomsOrOptions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-950">
                {isBn ? "গুরুত্বপূর্ণ বিষয় ও লক্ষণসমূহ" : "Key Insights & Patient Options"}
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {post.content.symptomsOrOptions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <p className="text-sm text-zinc-800 leading-relaxed">
                      {t(item)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Procedure or Expectations */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-950">
              {isBn ? "চিকিৎসার সময় কী প্রত্যাশা করবেন?" : "What to Expect During Clinical Treatment"}
            </h2>
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
              {t(post.content.procedureOrExpectations)}
            </p>
          </div>

          {/* Aftercare & Prevention */}
          <div className="p-6 rounded-2xl bg-zinc-950 text-white space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                {isBn ? "প্রতিরোধ ও চিকিৎসা পরবর্তী যত্ন" : "Prevention & Post-Treatment Care"}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {t(post.content.preventionOrAftercare)}
            </p>
          </div>

          {/* Department Booking Callout */}
          <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-zinc-950">
                {isBn ? "এই বিষয়ে বিশেষজ্ঞের পরামর্শ প্রয়োজন?" : "Need an In-Person Specialist Evaluation?"}
              </h3>
              <p className="text-xs text-zinc-600 mt-1">
                {isBn
                  ? "কেজিএইচ ডেন্টালের অভিজ্ঞ চিকিৎসকদের সাথে সরাসরি কনসালটেশন শিডিউল করুন।"
                  : "Book a personalized clinical session with our board-certified dental consultants."}
              </p>
            </div>

            <Link
              href={`/appointment?department=${post.departmentSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>{isBn ? "কনসালটেশন বুক করুন" : "Schedule Appointment"}</span>
            </Link>
          </div>
        </div>
      </article>

      <CtaBanner />
    </div>
  );
}
