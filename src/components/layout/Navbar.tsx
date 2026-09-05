"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  Calendar,
  Globe,
} from "lucide-react";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { useLanguage } from "@/context/LanguageContext";
import { UI_STRINGS } from "@/data/translations";

export function Navbar() {
  const pathname = usePathname();
  const { language, toggleLanguage, isBn } = useLanguage();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mega-menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { href: "/", label: UI_STRINGS.nav.home },
    {
      href: "/services",
      label: UI_STRINGS.nav.services,
      hasMegaMenu: true,
    },
    { href: "/doctors", label: UI_STRINGS.nav.doctors },
    { href: "/appointment", label: UI_STRINGS.nav.appointment },
    { href: "/gallery", label: UI_STRINGS.nav.gallery },
    { href: "/blog", label: UI_STRINGS.nav.blog },
    { href: "/contact", label: UI_STRINGS.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Main Glassmorphic Navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/98 backdrop-blur-md shadow-sm py-2.5 sm:py-3 border-b border-zinc-200"
            : "bg-white/95 backdrop-blur-md border-b border-zinc-200/80 py-3 sm:py-4"
        }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group py-0.5">
            <img
              src="/images/logos/kgh-logo-transparent.png"
              alt="KGH Dental"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-102 duration-200"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 relative" ref={megaMenuRef}>
            {navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              if (item.hasMegaMenu) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                  >
                    <button
                      onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        isActive || isMegaMenuOpen
                          ? "text-zinc-950 bg-zinc-100"
                          : "text-zinc-700 hover:text-black hover:bg-zinc-100/70"
                      }`}
                    >
                      <span>{isBn ? item.label.bn : item.label.en}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isMegaMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Interactive Glassmorphism MegaMenu */}
                    <MegaMenu
                      isOpen={isMegaMenuOpen}
                      onClose={() => setIsMegaMenuOpen(false)}
                    />
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive
                      ? "text-zinc-950 bg-zinc-100"
                      : "text-zinc-700 hover:text-black hover:bg-zinc-100/70"
                  }`}
                >
                  {isBn ? item.label.bn : item.label.en}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Language Switcher & Book Now CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-zinc-300 hover:border-zinc-500 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 transition-all shadow-2xs"
              title="Switch Language / ভাষা পরিবর্তন"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-500" />
              <span className={language === "en" ? "font-bold text-black" : "text-zinc-600"}>
                EN
              </span>
              <span className="text-zinc-300">|</span>
              <span className={language === "bn" ? "font-bold text-black" : "text-zinc-600"}>
                বাং
              </span>
            </button>

            {/* Book Appointment CTA */}
            <Link
              href="/appointment"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-xs lg:text-sm font-bold text-white bg-[#474B4E] hover:bg-[#373a3c] active:bg-[#2b2d2f] rounded-xl transition-all shadow-xs hover:shadow-md active:scale-98"
            >
              <Calendar className="w-4 h-4" />
              <span>{isBn ? UI_STRINGS.nav.bookNow.bn : UI_STRINGS.nav.bookNow.en}</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-xl"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </header>
  );
}
