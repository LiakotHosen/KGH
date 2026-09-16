"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Quote,
  Sparkles,
  Save,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  Award,
  ChevronRight,
  ShieldCheck,
  Plus,
  Trash2,
  Sliders,
} from "lucide-react";
import { WhyChooseCard, ClinicalCreedData, CreedQuoteItem } from "@/types";
import {
  fetchLiveWhyChooseCards,
  saveLiveWhyChooseCards,
  DEFAULT_WHY_CHOOSE_CARDS,
  fetchLiveClinicalCreed,
  saveLiveClinicalCreed,
  DEFAULT_CLINICAL_CREED,
  DEFAULT_CLINICAL_CREED_QUOTES,
} from "@/lib/api/db";

export default function AdminHomepagePage() {
  const [activeTab, setActiveTab] = useState<"cards" | "creed">("cards");
  const [cards, setCards] = useState<WhyChooseCard[]>(DEFAULT_WHY_CHOOSE_CARDS);
  const [selectedCardIdx, setSelectedCardIdx] = useState<number>(0);
  const [creed, setCreed] = useState<ClinicalCreedData>(DEFAULT_CLINICAL_CREED);
  const [selectedCreedQuoteIdx, setSelectedCreedQuoteIdx] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchLiveWhyChooseCards().then((liveCards) => {
      if (liveCards && liveCards.length > 0) {
        setCards(liveCards);
      }
    });

    fetchLiveClinicalCreed().then((liveCreed) => {
      if (liveCreed) {
        setCreed({
          ...liveCreed,
          quotes:
            liveCreed.quotes && liveCreed.quotes.length > 0
              ? liveCreed.quotes
              : DEFAULT_CLINICAL_CREED_QUOTES,
        });
      }
    });
  }, []);

  const handleSaveCards = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    await saveLiveWhyChooseCards(cards);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveCreed = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    await saveLiveClinicalCreed(creed);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetCards = () => {
    if (confirm("Reset Why Choose Us cards to standard clinical defaults?")) {
      setCards(DEFAULT_WHY_CHOOSE_CARDS);
      saveLiveWhyChooseCards(DEFAULT_WHY_CHOOSE_CARDS);
    }
  };

  const handleResetCreed = () => {
    if (confirm("Reset Clinical Creed banner to original board quotation?")) {
      setCreed(DEFAULT_CLINICAL_CREED);
      saveLiveClinicalCreed(DEFAULT_CLINICAL_CREED);
    }
  };

  const currentCard = cards[selectedCardIdx] || cards[0];

  const updateCurrentCard = (updates: Partial<WhyChooseCard>) => {
    setCards((prev) => {
      const next = [...prev];
      next[selectedCardIdx] = { ...next[selectedCardIdx], ...updates };
      return next;
    });
  };

  const currentQuote =
    (creed.quotes && creed.quotes[selectedCreedQuoteIdx]) ||
    DEFAULT_CLINICAL_CREED_QUOTES[selectedCreedQuoteIdx] ||
    DEFAULT_CLINICAL_CREED_QUOTES[0];

  const updateCurrentQuote = (updates: Partial<CreedQuoteItem>) => {
    setCreed((prev) => {
      const existingQuotes =
        prev.quotes && prev.quotes.length > 0
          ? [...prev.quotes]
          : [...DEFAULT_CLINICAL_CREED_QUOTES];
      existingQuotes[selectedCreedQuoteIdx] = {
        ...existingQuotes[selectedCreedQuoteIdx],
        ...updates,
      };
      const next: ClinicalCreedData = {
        ...prev,
        quotes: existingQuotes,
      };
      if (selectedCreedQuoteIdx === 0) {
        if (updates.quote) next.quote = updates.quote;
        if (updates.highlight) next.subQuote = updates.highlight;
        if (updates.author) next.authority = updates.author;
        if (updates.role) next.designation = updates.role;
      }
      return next;
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Landing Page Content
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
            Homepage Showcase Sections
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Customize the 4 full-bleed stacking cards (Why Patients Choose Us) and the Clinical Creed banner.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Changes Saved to Live Site!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 space-x-2">
        <button
          onClick={() => setActiveTab("cards")}
          className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "cards"
              ? "border-zinc-950 text-zinc-950"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Why Choose Us (4 Stacking Cards)</span>
        </button>

        <button
          onClick={() => setActiveTab("creed")}
          className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "creed"
              ? "border-zinc-950 text-zinc-950"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Quote className="w-4 h-4" />
          <span>Our Clinical Creed Banner</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WHY CHOOSE US 4 STACKING CARDS                                     */}
      {/* ========================================================================= */}
      {activeTab === "cards" && (
        <form onSubmit={handleSaveCards} className="space-y-6">
          {/* Card Selector Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cards.map((c, idx) => {
              const isSel = idx === selectedCardIdx;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCardIdx(idx)}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSel
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-md ring-2 ring-zinc-950/20"
                      : "bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono font-bold ${isSel ? "text-zinc-400" : "text-zinc-500"}`}>
                      CARD {c.stepNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSel ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-700"
                    }`}>
                      {c.id}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold truncate">{c.title.en}</h4>
                  <p className={`text-[11px] truncate mt-0.5 ${isSel ? "text-zinc-300" : "text-zinc-500"}`}>
                    {c.title.bn}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Card Editor Details */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800 font-extrabold text-sm">
                  {currentCard.stepNumber}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-950">
                    Editing Card {currentCard.stepNumber}: {currentCard.title.en}
                  </h3>
                  <p className="text-xs text-zinc-500">ID: {currentCard.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetCards}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset All to Defaults</span>
              </button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Card Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={currentCard.title.en}
                  onChange={(e) =>
                    updateCurrentCard({
                      title: { ...currentCard.title, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Card Title (Bengali) *
                </label>
                <input
                  type="text"
                  required
                  value={currentCard.title.bn}
                  onChange={(e) =>
                    updateCurrentCard({
                      title: { ...currentCard.title, bn: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Header Badge (English)
                </label>
                <input
                  type="text"
                  value={currentCard.badge.en}
                  onChange={(e) =>
                    updateCurrentCard({
                      badge: { ...currentCard.badge, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Header Badge (Bengali)
                </label>
                <input
                  type="text"
                  value={currentCard.badge.bn}
                  onChange={(e) =>
                    updateCurrentCard({
                      badge: { ...currentCard.badge, bn: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                />
              </div>
            </div>

            {/* Description Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Subtitle Description (English) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={currentCard.subtitle.en}
                  onChange={(e) =>
                    updateCurrentCard({
                      subtitle: { ...currentCard.subtitle, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Subtitle Description (Bengali) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={currentCard.subtitle.bn}
                  onChange={(e) =>
                    updateCurrentCard({
                      subtitle: { ...currentCard.subtitle, bn: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                />
              </div>
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Background Photography Path or Image URL *
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  required
                  value={currentCard.image}
                  onChange={(e) => updateCurrentCard({ image: e.target.value })}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-300 font-mono text-xs"
                />
                <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                  <img
                    src={currentCard.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Feature Bullets (3 items) */}
            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Card Key Bullets (Highlights)
              </h4>
              {currentCard.bullets.map((b, bIdx) => (
                <div key={bIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 mb-1">
                      Bullet {bIdx + 1} (English)
                    </label>
                    <input
                      type="text"
                      value={b.en}
                      onChange={(e) => {
                        const updated = [...currentCard.bullets];
                        updated[bIdx] = { ...updated[bIdx], en: e.target.value };
                        updateCurrentCard({ bullets: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 mb-1">
                      Bullet {bIdx + 1} (Bengali)
                    </label>
                    <input
                      type="text"
                      value={b.bn}
                      onChange={(e) => {
                        const updated = [...currentCard.bullets];
                        updated[bIdx] = { ...updated[bIdx], bn: e.target.value };
                        updateCurrentCard({ bullets: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Protocol Guarantee statement */}
            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Modal Guarantee Statement
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                    Guarantee (English)
                  </label>
                  <input
                    type="text"
                    value={currentCard.protocolGuarantees[0]?.en || ""}
                    onChange={(e) => {
                      updateCurrentCard({
                        protocolGuarantees: [
                          {
                            en: e.target.value,
                            bn: currentCard.protocolGuarantees[0]?.bn || e.target.value,
                          },
                        ],
                      });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                    Guarantee (Bengali)
                  </label>
                  <input
                    type="text"
                    value={currentCard.protocolGuarantees[0]?.bn || ""}
                    onChange={(e) => {
                      updateCurrentCard({
                        protocolGuarantees: [
                          {
                            en: currentCard.protocolGuarantees[0]?.en || "",
                            bn: e.target.value,
                          },
                        ],
                      });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-950 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Why Choose Us Cards</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: OUR CLINICAL CREED BANNER                                          */}
      {/* ========================================================================= */}
      {activeTab === "creed" && (
        <form onSubmit={handleSaveCreed} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Quote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-950">
                    Our Clinical Creed (Philosophy Banner)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    The quote banner between Why Choose Us and Google Reviews.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetCreed}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            </div>

            {/* Badge & Short Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Banner Tag (English)
                </label>
                <input
                  type="text"
                  value={creed.tag.en}
                  onChange={(e) =>
                    setCreed({ ...creed, tag: { ...creed.tag, en: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Banner Tag (Bengali)
                </label>
                <input
                  type="text"
                  value={creed.tag.bn}
                  onChange={(e) =>
                    setCreed({ ...creed, tag: { ...creed.tag, bn: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-bold"
                />
              </div>
            </div>

            {/* 3 Quotations Selector Strip */}
            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Quotations & Background Images (3 Synchronized Slides)
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Select a quotation below to edit its unique background image and bilingual message.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-zinc-600">
                  Editing: Quote 0{selectedCreedQuoteIdx + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(creed.quotes && creed.quotes.length > 0
                  ? creed.quotes
                  : DEFAULT_CLINICAL_CREED_QUOTES
                ).map((q, idx) => {
                  const isSel = idx === selectedCreedQuoteIdx;
                  return (
                    <button
                      key={q.id || idx}
                      type="button"
                      onClick={() => setSelectedCreedQuoteIdx(idx)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                        isSel
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-md ring-2 ring-zinc-950/20"
                          : "bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-200 flex-shrink-0 relative border border-white/20">
                          {q.image ? (
                            <img
                              src={q.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-mono font-bold ${
                                isSel ? "text-zinc-400" : "text-zinc-500"
                              }`}
                            >
                              SLIDE 0{idx + 1}
                            </span>
                            {isSel && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs font-extrabold truncate mt-0.5">
                            {q.highlight?.en || `Quote 0${idx + 1}`}
                          </p>
                          <p
                            className={`text-[11px] truncate ${
                              isSel ? "text-zinc-300" : "text-zinc-500"
                            }`}
                          >
                            {q.author?.en || "KGH Advisory"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Quote Background Image Configuration */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-zinc-700" />
                    Background Image for Slide 0{selectedCreedQuoteIdx + 1}
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    This background image cross-fades into view when Slide 0{selectedCreedQuoteIdx + 1} is displayed on the homepage.
                  </p>
                </div>

                {currentQuote.image && (
                  <button
                    type="button"
                    onClick={() => updateCurrentQuote({ image: "" })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors self-start sm:self-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Image</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                {/* Live Image Preview */}
                <div className="relative h-36 rounded-xl overflow-hidden border border-zinc-300 bg-zinc-900 shadow-inner flex items-center justify-center">
                  {currentQuote.image ? (
                    <>
                      <img
                        src={currentQuote.image}
                        alt="Background Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                          Slide 0{selectedCreedQuoteIdx + 1} Preview
                        </span>
                        <p className="text-xs font-bold truncate">
                          {currentQuote.highlight?.en || "Philosophy Statement"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4 text-zinc-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <p className="text-xs font-semibold">No Image Configured</p>
                      <p className="text-[10px] text-zinc-500">
                        Default fallback image will display
                      </p>
                    </div>
                  )}
                </div>

                {/* URL Input & Presets */}
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      Image URL or Local Path:
                    </label>
                    <input
                      type="text"
                      value={currentQuote.image || ""}
                      onChange={(e) =>
                        updateCurrentQuote({ image: e.target.value })
                      }
                      placeholder="/images/why-choose-us/modern-chamber.jpg or https://..."
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1.5">
                      Quick Preset Images (Click to Apply):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateCurrentQuote({
                            image: "/images/why-choose-us/modern-chamber.jpg",
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          currentQuote.image ===
                          "/images/why-choose-us/modern-chamber.jpg"
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                        }`}
                      >
                        🏥 Modern Chamber
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateCurrentQuote({
                            image:
                              "/images/why-choose-us/transparent-plans-hd.jpeg",
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          currentQuote.image ===
                          "/images/why-choose-us/transparent-plans-hd.jpeg"
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                        }`}
                      >
                        🔬 Digital Scans & Diagnostics
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateCurrentQuote({
                            image: "/images/why-choose-us/specialist-care.jpg",
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          currentQuote.image ===
                          "/images/why-choose-us/specialist-care.jpg"
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                        }`}
                      >
                        🩺 Specialist Surgical Loupes
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateCurrentQuote({
                            image: "/images/why-choose-us/easy-booking.jpg",
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          currentQuote.image ===
                          "/images/why-choose-us/easy-booking.jpg"
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                        }`}
                      >
                        🤝 Consultation & Care
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Quote Content Editor */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Text Content for Slide 0{selectedCreedQuoteIdx + 1}
              </h4>

              {/* Highlight Pill */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Highlight Pill (English)
                  </label>
                  <input
                    type="text"
                    value={currentQuote.highlight?.en || ""}
                    onChange={(e) =>
                      updateCurrentQuote({
                        highlight: {
                          en: e.target.value,
                          bn: currentQuote.highlight?.bn || "",
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Highlight Pill (Bengali)
                  </label>
                  <input
                    type="text"
                    value={currentQuote.highlight?.bn || ""}
                    onChange={(e) =>
                      updateCurrentQuote({
                        highlight: {
                          en: currentQuote.highlight?.en || "",
                          bn: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Main Editorial Quote */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Editorial Quote (English) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={currentQuote.quote?.en || ""}
                    onChange={(e) =>
                      updateCurrentQuote({
                        quote: {
                          en: e.target.value,
                          bn: currentQuote.quote?.bn || "",
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-medium leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Editorial Quote (Bengali) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={currentQuote.quote?.bn || ""}
                    onChange={(e) =>
                      updateCurrentQuote({
                        quote: {
                          en: currentQuote.quote?.en || "",
                          bn: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs font-medium leading-relaxed"
                  />
                </div>
              </div>

              {/* Authority & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Authority / Council Name (English)
                  </label>
                  <input
                    type="text"
                    value={currentQuote.author?.en || ""}
                    onChange={(e) =>
                      updateCurrentQuote({
                        author: {
                          en: e.target.value,
                          bn: currentQuote.author?.bn || "",
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Authority / Council Name (Bengali)
                  </label>
                  <input
                    type="text"
                    value={currentQuote.author?.bn || ""}
                    onChange={(e) =>
                      updateCurrentQuote({
                        author: {
                          en: currentQuote.author?.en || "",
                          bn: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Designation / Subtitle (English)
                  </label>
                  <input
                    type="text"
                    value={currentQuote.role?.en || ""}
                    onChange={(e) =>
                      updateCurrentQuote({
                        role: {
                          en: e.target.value,
                          bn: currentQuote.role?.bn || "",
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Designation / Subtitle (Bengali)
                  </label>
                  <input
                    type="text"
                    value={currentQuote.role?.bn || ""}
                    onChange={(e) =>
                      updateCurrentQuote({
                        role: {
                          en: currentQuote.role?.en || "",
                          bn: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 3 Metrics */}
            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Key Statistical Highlights (3 Metrics)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {creed.stats.map((st, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2"
                  >
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1">
                        Metric {sIdx + 1} Value
                      </label>
                      <input
                        type="text"
                        value={st.value.en}
                        onChange={(e) => {
                          const updated = [...creed.stats];
                          updated[sIdx] = {
                            ...updated[sIdx],
                            value: { en: e.target.value, bn: e.target.value },
                          };
                          setCreed({ ...creed, stats: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 font-mono text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1">
                        Metric {sIdx + 1} Label (English)
                      </label>
                      <input
                        type="text"
                        value={st.label.en}
                        onChange={(e) => {
                          const updated = [...creed.stats];
                          updated[sIdx] = {
                            ...updated[sIdx],
                            label: {
                              en: e.target.value,
                              bn: updated[sIdx].label.bn || e.target.value,
                            },
                          };
                          setCreed({ ...creed, stats: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1">
                        Metric {sIdx + 1} Label (Bengali)
                      </label>
                      <input
                        type="text"
                        value={st.label.bn}
                        onChange={(e) => {
                          const updated = [...creed.stats];
                          updated[sIdx] = {
                            ...updated[sIdx],
                            label: {
                              en: updated[sIdx].label.en || "",
                              bn: e.target.value,
                            },
                          };
                          setCreed({ ...creed, stats: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-950 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Clinical Creed Banner</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
