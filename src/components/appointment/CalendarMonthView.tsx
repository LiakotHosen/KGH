"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, Info } from "lucide-react";
import { Doctor } from "@/types";

interface CalendarMonthViewProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  doctor: Doctor;
  blockedDates?: string[]; // YYYY-MM-DD
  isBn: boolean;
}

export function CalendarMonthView({
  selectedDate,
  onSelectDate,
  doctor,
  blockedDates = [],
  isBn,
}: CalendarMonthViewProps) {
  // Current view month/year
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split("-").map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const monthNamesEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthNamesBn = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];

  const dayHeadersEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayHeadersBn = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Determine if previous month is before current month
  const isPrevDisabled = useMemo(() => {
    return (
      currentYear < today.getFullYear() ||
      (currentYear === today.getFullYear() && currentMonth <= today.getMonth())
    );
  }, [currentYear, currentMonth, today]);

  // Max 3 months ahead navigation limit
  const isNextDisabled = useMemo(() => {
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    return viewDate >= maxDate;
  }, [viewDate, today]);

  // Calendar cells generation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sun..6=Sat
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const cells: {
      dayNumber: number;
      dateString: string;
      isCurrentMonth: boolean;
      isAvailable: boolean;
      isBlocked: boolean;
      isPast: boolean;
      isToday: boolean;
      isSelected: boolean;
    }[] = [];

    // Empty padding slots for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({
        dayNumber: 0,
        dateString: "",
        isCurrentMonth: false,
        isAvailable: false,
        isBlocked: false,
        isPast: true,
        isToday: false,
        isSelected: false,
      });
    }

    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      const dayOfWeek = dateObj.getDay();
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      const isPast = dateString < todayStr;
      const isToday = dateString === todayStr;
      const isSelected = dateString === selectedDate;

      // Doctor's weekly active schedule check
      const matchesSchedule = doctor?.schedule?.daysOfWeek?.includes(dayOfWeek) ?? true;
      const isBlocked = blockedDates.includes(dateString);
      const isAvailable = !isPast && matchesSchedule && !isBlocked;

      cells.push({
        dayNumber: d,
        dateString,
        isCurrentMonth: true,
        isAvailable,
        isBlocked,
        isPast,
        isToday,
        isSelected,
      });
    }

    return cells;
  }, [currentYear, currentMonth, today, selectedDate, doctor, blockedDates]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm p-4 sm:p-5">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-zinc-100 text-zinc-800">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-zinc-950">
              {isBn ? monthNamesBn[currentMonth] : monthNamesEn[currentMonth]} {currentYear}
            </h4>
            <p className="text-[11px] text-zinc-500">
              {isBn ? "চেম্বারের তারিখ নির্বাচন করুন" : "Pick an active chamber date"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
            className={`p-2 rounded-xl border transition-all ${
              isPrevDisabled
                ? "border-zinc-100 text-zinc-300 cursor-not-allowed bg-zinc-50"
                : "border-zinc-200 text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 hover:border-zinc-300"
            }`}
            title={isBn ? "পূর্ববর্তী মাস" : "Previous Month"}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            disabled={isNextDisabled}
            className={`p-2 rounded-xl border transition-all ${
              isNextDisabled
                ? "border-zinc-100 text-zinc-300 cursor-not-allowed bg-zinc-50"
                : "border-zinc-200 text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 hover:border-zinc-300"
            }`}
            title={isBn ? "পরবর্তী মাস" : "Next Month"}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day of Week Headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center mb-2">
        {(isBn ? dayHeadersBn : dayHeadersEn).map((dayName, idx) => {
          // Highlight Friday (idx 5) or Sunday (idx 0)
          const isFri = idx === 5;
          return (
            <div
              key={idx}
              className={`text-[11px] font-bold py-1.5 uppercase tracking-wider ${
                isFri ? "text-emerald-700" : "text-zinc-500"
              }`}
            >
              {dayName}
            </div>
          );
        })}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {calendarDays.map((cell, index) => {
          if (!cell.isCurrentMonth) {
            return <div key={`empty-${index}`} className="h-11 sm:h-12" />;
          }

          const isClickable = cell.isAvailable;

          let btnClass = "";
          if (cell.isSelected) {
            btnClass =
              "bg-zinc-950 text-white font-extrabold shadow-md ring-2 ring-zinc-950 ring-offset-2 scale-102 z-10";
          } else if (cell.isAvailable) {
            btnClass =
              "bg-emerald-50/70 text-emerald-950 border border-emerald-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 font-bold transition-all cursor-pointer hover:shadow-xs active:scale-95";
          } else if (cell.isBlocked) {
            btnClass =
              "bg-rose-50/50 text-rose-300 border border-dashed border-rose-200 cursor-not-allowed font-medium line-through";
          } else {
            // Off-day or past date
            btnClass =
              "bg-zinc-50/60 text-zinc-300 border border-zinc-100 cursor-not-allowed font-normal";
          }

          return (
            <button
              key={cell.dateString}
              type="button"
              disabled={!isClickable}
              onClick={() => cell.isAvailable && onSelectDate(cell.dateString)}
              className={`relative h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center text-xs transition-all ${btnClass}`}
              title={
                cell.isBlocked
                  ? isBn
                    ? "ডাক্তার ছুটিতে আছেন"
                    : "Doctor on leave"
                  : cell.isAvailable
                  ? isBn
                    ? "চেম্বার খোলা (স্লট পাওয়া যাবে)"
                    : "Chamber open"
                  : isBn
                  ? "চেম্বার বন্ধ"
                  : "Chamber closed"
              }
            >
              <span className="text-xs sm:text-sm">{cell.dayNumber}</span>

              {/* Indicator Dot */}
              {cell.isAvailable && !cell.isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5" />
              )}
              {cell.isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend & Doctor Schedule Note */}
      <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-600">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 inline-block" />
            <span>{isBn ? "চেম্বার খোলা" : "Chamber Open"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-950 inline-block" />
            <span>{isBn ? "নির্বাচিত" : "Selected"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 inline-block" />
            <span>{isBn ? "বন্ধ / ছুটি" : "Off / Leave"}</span>
          </div>
        </div>

        <div className="text-[11px] font-medium text-zinc-700 bg-zinc-100/80 px-2.5 py-1 rounded-lg">
          {isBn ? doctor?.schedule?.availableDaysBn : doctor?.schedule?.availableDaysEn}
        </div>
      </div>
    </div>
  );
}
