"use client";

import React, { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, Calendar, ShieldCheck, UserCheck, ArrowRight } from "lucide-react";
import { DEPARTMENTS } from "@/data/departments";
import { DOCTORS } from "@/data/doctors";
import { Doctor, Department } from "@/types";
import { fetchLiveDoctors, fetchLiveDepartments } from "@/lib/api/db";
import { DepartmentIcon } from "@/components/shared/DepartmentIcon";
import { SubServiceShowcase } from "@/components/services/SubServiceShowcase";
import { useLanguage } from "@/context/LanguageContext";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function DepartmentDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { t, isBn } = useLanguage();
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(DOCTORS);
  const [department, setDepartment] = useState<Department | undefined>(() =>
    DEPARTMENTS.find((d) => d.slug === slug)
  );

  useEffect(() => {
    fetchLiveDoctors().then((docs) => {
      if (docs && docs.length > 0) {
        setDoctorsList(docs);
      }
    });

    fetchLiveDepartments().then((depts) => {
      if (depts && depts.length > 0) {
        const liveDept = depts.find((d) => d.slug === slug);
        if (liveDept) {
          setDepartment(liveDept);
        }
      }
    });
  }, [slug]);

  if (!department) {
    notFound();
  }

  // Find linked lead specialist if available
  const leadDoctor = doctorsList.find((doc) => doc.id === department.leadDoctorId);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <section className="bg-zinc-100 border-b border-zinc-200 py-12 sm:py-16">
        <div className="w-full max-w-[2200px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-black mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{isBn ? "সকল সেবার তালিকায় ফিরে যান" : "Back to All Departments"}</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-200/80 text-zinc-800 text-xs font-bold">
                <DepartmentIcon name={department.iconName} className="w-3.5 h-3.5" />
                <span>
                  {isBn ? "বিশেষায়িত চিকিৎসা অন্তর্ভুক্ত" : "Specialized Treatments Included"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight">
                {t(department.name)}
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl">
                {t(department.shortDesc)}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/appointment?department=${department.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#474B4E] hover:bg-[#373a3c] active:bg-[#2b2d2f] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isBn ? "এই বিভাগে সিরিয়াল নিন" : "Book Department Appointment"}</span>
                </Link>

                <a
                  href="#treatment-list"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                >
                  <span>{isBn ? "সেবাসমূহের তালিকা দেখুন" : "View Treatment Details"}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Specialist Consultant Callout Card */}
            {leadDoctor && (
              <div className="lg:col-span-4">
                <div className="p-5 rounded-2xl bg-white border border-zinc-300 shadow-md space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                    <UserCheck className="w-4 h-4 text-zinc-900" />
                    <span>{isBn ? "বিভাগীয় বিশেষজ্ঞ কনসালটেন্ট" : "Specialist Consultant"}</span>
                  </div>

                  <div className="flex items-center gap-3.5 pt-1">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-200 border border-zinc-300 shrink-0">
                      <img
                        src={leadDoctor.photoUrl}
                        alt={t(leadDoctor.name)}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-950">
                        {t(leadDoctor.name)}
                      </h4>
                      <p className="text-xs text-zinc-600 line-clamp-1 mt-0.5">
                        {t(leadDoctor.degrees)}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-700 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                    <span className="font-semibold block text-zinc-900">
                      {isBn ? "চেম্বারের সময়সূচি:" : "Clinic Availability:"}
                    </span>
                    <span>{isBn ? leadDoctor.schedule.availableDaysBn : leadDoctor.schedule.availableDaysEn}</span>{" "}
                    ({t(leadDoctor.schedule.note)})
                  </div>

                  <Link
                    href={`/appointment?doctor=${leadDoctor.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#474B4E] hover:bg-[#373a3c] active:bg-[#2b2d2f] text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    <span>{isBn ? "সরাসরি সিরিয়াল বুক করুন" : "Book Directly with Specialist"}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Interactive Sub-Services Showcase (Mirrored/Inverted Showcase) */}
      <SubServiceShowcase
        subServices={department.subServices}
        department={department}
      />

      <CtaBanner />
    </div>
  );
}
