"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  Save,
  MessageSquareQuote,
} from "lucide-react";
import { GoogleReview } from "@/types";
import {
  fetchLiveReviews,
  saveLiveReview,
  deleteLiveReview,
} from "@/lib/api/db";
import { REVIEWS } from "@/data/reviews";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<GoogleReview[]>(REVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<GoogleReview | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchLiveReviews().then((live) => {
      if (live && live.length > 0) {
        setReviews(live);
      }
    });
  }, []);

  const [formData, setFormData] = useState<GoogleReview>({
    id: "",
    authorName: "",
    rating: 5,
    date: "1 month ago",
    comment: { en: "", bn: "" },
    treatment: { en: "General Consultation", bn: "সাধারণ কনসালটেশন" },
  });

  const handleOpenAdd = () => {
    setEditingReview(null);
    setFormData({
      id: `rev-${Date.now()}`,
      authorName: "",
      rating: 5,
      date: "Just now",
      comment: { en: "", bn: "" },
      treatment: { en: "General Consultation", bn: "সাধারণ কনসালটেশন" },
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (review: GoogleReview) => {
    setEditingReview(review);
    setFormData({
      id: review.id,
      authorName: review.authorName,
      rating: review.rating || 5,
      date: review.date || "1 month ago",
      comment: {
        en: review.comment?.en || "",
        bn: review.comment?.bn || "",
      },
      treatment: {
        en: review.treatment?.en || "",
        bn: review.treatment?.bn || "",
      },
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this patient review? It will be removed from the public website immediately.")) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      await deleteLiveReview(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReview) {
      setReviews((prev) => prev.map((r) => (r.id === editingReview.id ? formData : r)));
    } else {
      setReviews((prev) => [formData, ...prev]);
    }
    setIsModalOpen(false);
    setSaveSuccess(true);
    await saveLiveReview(formData);
    setTimeout(() => setSaveSuccess(false), 3000);

    const refreshed = await fetchLiveReviews();
    if (refreshed && refreshed.length > 0) {
      setReviews(refreshed);
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((rev) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      rev.authorName.toLowerCase().includes(query) ||
      rev.comment.en.toLowerCase().includes(query) ||
      rev.comment.bn.toLowerCase().includes(query) ||
      (rev.treatment?.en.toLowerCase().includes(query) ?? false);

    if (!matchesQuery) return false;
    if (selectedCategory === "all") return true;
    if (!rev.treatment) return false;

    const t = rev.treatment.en.toLowerCase();
    if (selectedCategory === "implants") return t.includes("implant") || t.includes("crown");
    if (selectedCategory === "aligners") return t.includes("aligner") || t.includes("ortho");
    if (selectedCategory === "root-canal") return t.includes("root canal") || t.includes("endodontic");
    if (selectedCategory === "surgery") return t.includes("surgery") || t.includes("extraction");
    if (selectedCategory === "medicine") return t.includes("medicine");
    return true;
  });

  const categories = [
    { id: "all", label: "All Reviews" },
    { id: "implants", label: "Implants & Crowns" },
    { id: "aligners", label: "Clear Aligners" },
    { id: "root-canal", label: "Root Canal" },
    { id: "surgery", label: "Wisdom Surgery" },
    { id: "medicine", label: "Oral Medicine" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Reputation & Feedback
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
            Patient Google Reviews ({reviews.length})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Manage authentic patient feedback, star ratings, and treatment tags shown on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Saved!
            </span>
          )}

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Review</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by patient name, review text, or treatment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-zinc-950 text-white"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header: Avatar, Name, Rating */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-100 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800 font-extrabold text-sm shadow-2xs">
                    {review.authorName.charAt(0) || "P"}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-1.5">
                      <span>{review.authorName}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                      <span>{review.treatment?.en || "Consultation"}</span>
                      <span>•</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-zinc-900 ml-1">
                    {(review.rating || 5).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-2 text-xs text-zinc-700 leading-relaxed mb-4">
                <p className="italic text-zinc-800">
                  &ldquo;{review.comment.en}&rdquo;
                </p>
                {review.comment.bn && (
                  <p className="text-[11px] text-zinc-500 font-serif">
                    বাংলা: &ldquo;{review.comment.bn}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
                ID: {review.id}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(review)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-red-50 hover:border-red-200 text-red-600 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white border border-zinc-200">
          <MessageSquareQuote className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-900">No reviews found</h3>
          <p className="text-xs text-zinc-500 mt-1">Try searching for something else or add a new review.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-5">
              <div>
                <h3 className="text-lg font-extrabold text-zinc-950">
                  {editingReview ? "Edit Patient Review" : "Add New Patient Review"}
                </h3>
                <p className="text-xs text-zinc-500">
                  Updates will instantly sync to the homepage Google Reviews section.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="e.g. Rafiqul Islam"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Star Rating (1-5) *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5.0 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4.0 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3.0 Stars)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Treatment Category (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.treatment?.en || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        treatment: {
                          en: e.target.value,
                          bn: formData.treatment?.bn || e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Zirconia Crown, Clear Aligners"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Treatment Category (Bengali)
                  </label>
                  <input
                    type="text"
                    value={formData.treatment?.bn || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        treatment: {
                          en: formData.treatment?.en || "",
                          bn: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. জারকোনিয়া ক্রাউন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Consultation Date / Period
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g. 1 month ago, 2 weeks ago"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Review Comment (English) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.comment.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      comment: { ...formData.comment, en: e.target.value },
                    })
                  }
                  placeholder="Enter the patient's verified review comment in English..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Review Comment (Bengali)
                </label>
                <textarea
                  rows={3}
                  value={formData.comment.bn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      comment: { ...formData.comment, bn: e.target.value },
                    })
                  }
                  placeholder="রোগীর রিভিউ বাংলায় লিখুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingReview ? "Save Changes" : "Create Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
