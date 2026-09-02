"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Users,
  Building2,
  BookOpen,
  Image as ImageIcon,
  ArrowRight,
  Plus,
  Clock,
} from "lucide-react";
import { DOCTORS } from "@/data/doctors";
import { DEPARTMENTS } from "@/data/departments";
import { BLOG_POSTS } from "@/data/blog";

export default function AdminDashboardPage() {
  const [appointmentsCount, setAppointmentsCount] = useState(14);
  const [pendingCount, setPendingCount] = useState(3);

  return (
    <div className="space-y-8">
      {/* Top Banner: Welcome & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
            Welcome to KGH Dental CMS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Full control over appointments, doctor schedules, clinical departments, and media assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/appointments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Manage Appointments</span>
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-all"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Media Library</span>
          </Link>
        </div>
      </div>


      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Appointments Card */}
        <Link
          href="/admin/appointments"
          className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white transition-colors text-zinc-900">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {pendingCount} Pending
            </span>
          </div>
          <div className="text-2xl font-extrabold text-zinc-950">{appointmentsCount}</div>
          <div className="text-xs font-bold text-zinc-700 mt-1">Total Patient Bookings</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Online Chamber Reservations</div>
        </Link>

        {/* Doctors Card */}
        <Link
          href="/admin/doctors"
          className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white transition-colors text-zinc-900">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>
          <div className="text-2xl font-extrabold text-zinc-950">{DOCTORS.length}</div>
          <div className="text-xs font-bold text-zinc-700 mt-1">Specialist Doctors</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">3 Confirmed + 3 Placeholder</div>
        </Link>

        {/* Departments Card */}
        <Link
          href="/admin/departments"
          className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white transition-colors text-zinc-900">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
              56 Services
            </span>
          </div>
          <div className="text-2xl font-extrabold text-zinc-950">{DEPARTMENTS.length}</div>
          <div className="text-xs font-bold text-zinc-700 mt-1">Clinical Departments</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">With Why/When/Benefit breakdown</div>
        </Link>

        {/* Blog Posts Card */}
        <Link
          href="/admin/blog"
          className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white transition-colors text-zinc-900">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
              SEO Guides
            </span>
          </div>
          <div className="text-2xl font-extrabold text-zinc-950">{BLOG_POSTS.length}</div>
          <div className="text-xs font-bold text-zinc-700 mt-1">Published Articles</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Educational Patient Topics</div>
        </Link>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 text-white rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950">Add or Edit Doctors</h3>
              <p className="text-[11px] text-zinc-500">Update chamber schedules and degrees</p>
            </div>
          </div>
          <Link
            href="/admin/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:underline pt-2"
          >
            <span>Open Doctors Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 text-white rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950">Media Library & Uploads</h3>
              <p className="text-[11px] text-zinc-500">Upload chamber & doctor photos</p>
            </div>
          </div>
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:underline pt-2"
          >
            <span>Upload or Manage Assets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 text-white rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950">Clinic Settings</h3>
              <p className="text-[11px] text-zinc-500">Change hotline and working hours</p>
            </div>
          </div>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:underline pt-2"
          >
            <span>Edit Clinic Settings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
