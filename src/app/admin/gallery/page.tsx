"use client";

import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Tag,
  X,
  Upload,
  Search,
} from "lucide-react";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { GalleryItem } from "@/types";
import {
  fetchLiveGalleryItems,
  saveLiveGalleryItem,
  deleteLiveGalleryItem,
  INITIAL_GALLERY,
} from "@/lib/api/db";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  useEffect(() => {
    fetchLiveGalleryItems().then((liveItems) => {
      if (liveItems && liveItems.length > 0) {
        setItems(liveItems);
      }
    });
  }, []);

  const [formData, setFormData] = useState<GalleryItem>({
    id: "",
    title: { en: "", bn: "" },
    category: "chamber",
    desc: { en: "", bn: "" },
    imageUrl: "/images/departments/consultation-cta.jpg",
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: `gal-${Date.now()}`,
      title: { en: "", bn: "" },
      category: "chamber",
      desc: { en: "", bn: "" },
      imageUrl: "/images/departments/consultation-cta.jpg",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this gallery item? This will update the live website immediately.")) {
      setItems(items.filter((i) => i.id !== id));
      await deleteLiveGalleryItem(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map((i) => (i.id === editingItem.id ? formData : i)));
    } else {
      setItems([formData, ...items]);
    }
    setIsModalOpen(false);
    await saveLiveGalleryItem(formData);
    // Refetch to ensure synced IDs
    const refreshed = await fetchLiveGalleryItems();
    if (refreshed && refreshed.length > 0) {
      setItems(refreshed);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Chamber Visuals
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
            Gallery Showcase ({items.length})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Manage photos of operatory suites, sterilization units, and patient treatment moments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gallery Photo</span>
        </button>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="aspect-16/10 w-full bg-zinc-100 overflow-hidden relative">
              <img
                src={item.imageUrl}
                alt={item.title.en}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 text-white backdrop-blur-md">
                {item.category}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-950">{item.title.en}</h3>
                <p className="text-xs text-zinc-500">{item.title.bn}</p>
                <p className="text-xs text-zinc-600 pt-1 line-clamp-2">{item.desc.en}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-black"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-zinc-400 hover:text-red-600 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="text-lg font-bold text-zinc-950">
                {editingItem ? "Edit Gallery Item" : "Add Gallery Photo"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-900 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Image Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Gallery Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-300 shrink-0">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold border border-zinc-200 flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Upload or Pick Image</span>
                    </button>
                    <span className="text-[10px] text-zinc-500 mt-1 block truncate max-w-xs">
                      {formData.imageUrl}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as GalleryItem["category"],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-white"
                >
                  <option value="chamber">Chamber & Setup</option>
                  <option value="treatments">Clinical Treatments</option>
                  <option value="sterilization">Sterilization Units</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: { ...formData.title, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Title (Bengali) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title.bn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: { ...formData.title, bn: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Description (English)
                </label>
                <textarea
                  rows={2}
                  value={formData.desc.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      desc: { ...formData.desc, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                />
              </div>

              <div className="pt-3 border-t border-zinc-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => setFormData({ ...formData, imageUrl: url })}
        title="Select Gallery Image"
        currentValue={formData.imageUrl}
      />
    </div>
  );
}
