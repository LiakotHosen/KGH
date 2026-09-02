"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Search,
  Loader2,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  source: "supabase" | "local";
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
  currentValue?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = "Select or Upload Image",
  currentValue,
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "gallery">("gallery");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string>(currentValue || "");

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch media library when opened
  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      if (currentValue) {
        setSelectedUrl(currentValue);
      }
    }
  }, [isOpen, currentValue]);

  const fetchMedia = async () => {
    setIsLoadingMedia(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.media) {
        setMediaList(data.media);
      }
    } catch (err) {
      console.error("Failed to load media list:", err);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFile(file);
      setUploadPreview(URL.createObjectURL(file));
      setUploadError("");
    }
  };

  const handleUploadAndSelect = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      onSelect(data.url);
      onClose();
      // Reset upload state
      setUploadFile(null);
      setUploadPreview(null);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmGallerySelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl bg-white border border-zinc-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-900 text-white">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950">{title}</h3>
              <p className="text-xs text-zinc-500">
                Upload from local disk or choose an existing photo from the gallery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 border-b border-zinc-200 flex gap-4 bg-white">
          <button
            onClick={() => setActiveTab("gallery")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "gallery"
                ? "border-zinc-950 text-zinc-950"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Select from Gallery ({mediaList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "upload"
                ? "border-zinc-950 text-zinc-950"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload from Device</span>
          </button>
        </div>

        {/* Tab 1: Gallery Picker */}
        {activeTab === "gallery" && (
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images by filename..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              {isLoadingMedia ? (
                <div className="py-16 flex flex-col items-center justify-center text-zinc-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-700" />
                  <span className="text-xs">Loading media assets...</span>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="py-16 text-center text-zinc-500">
                  <p className="text-sm font-semibold">No images found</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Upload a new photo from your device using the &ldquo;Upload from Device&rdquo; tab.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedUrl === item.url;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedUrl(item.url)}
                        className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all ${
                          isSelected
                            ? "border-zinc-950 ring-2 ring-zinc-950/20 shadow-md"
                            : "border-zinc-200 hover:border-zinc-400"
                        }`}
                      >
                        <div className="aspect-4/3 w-full bg-zinc-100 overflow-hidden relative">
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 p-1 rounded-full bg-zinc-950 text-white shadow-xs">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <span className="block text-[11px] font-medium text-zinc-700 truncate">
                            {item.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Gallery Confirmation Footer */}
            <div className="mt-4 pt-4 border-t border-zinc-200 flex items-center justify-between">
              <span className="text-xs text-zinc-500 truncate max-w-sm">
                {selectedUrl ? (
                  <span className="font-semibold text-zinc-800">
                    Selected: {selectedUrl.split("/").pop()}
                  </span>
                ) : (
                  "Click an image to select it"
                )}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmGallerySelect}
                  disabled={!selectedUrl}
                  className="px-5 py-2 bg-zinc-950 hover:bg-black disabled:bg-zinc-300 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Upload from Device */}
        {activeTab === "upload" && (
          <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              {uploadError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-300 hover:border-zinc-950 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-zinc-50/50 hover:bg-zinc-50 flex flex-col items-center justify-center gap-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="p-3.5 rounded-2xl bg-zinc-200 text-zinc-700">
                  <Upload className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm font-bold text-zinc-900">
                    Click to browse or drag and drop image here
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Supports PNG, JPG, JPEG, and WebP (Up to 10MB)
                  </p>
                </div>
              </div>

              {/* Upload Preview */}
              {uploadPreview && (
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-200 shrink-0 border border-zinc-300">
                    <img
                      src={uploadPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 truncate">
                      {uploadFile?.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {uploadFile?.size
                        ? `${(uploadFile.size / 1024).toFixed(1)} KB`
                        : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadFile(null);
                      setUploadPreview(null);
                    }}
                    className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-zinc-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Upload Action Footer */}
            <div className="mt-6 pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadAndSelect}
                disabled={!uploadFile || isUploading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-950 hover:bg-black disabled:bg-zinc-300 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Select</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
