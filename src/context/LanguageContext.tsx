"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, BilingualText } from "@/types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (content: BilingualText | string | undefined) => string;
  isBn: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("kgh_dental_lang") as Language;
    if (saved === "en" || saved === "bn") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("kgh_dental_lang", lang);
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "bn" : "en";
    setLanguage(next);
  };

  const t = (content: BilingualText | string | undefined): string => {
    if (!content) return "";
    if (typeof content === "string") return content;
    return language === "bn" ? content.bn || content.en : content.en || content.bn;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isBn: language === "bn",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
