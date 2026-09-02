"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Tag,
  Search,
  X,
  CheckCircle2,
} from "lucide-react";
import { BLOG_POSTS } from "@/data/blog";
import { BlogPost } from "@/types";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState<BlogPost>({
    id: "",
    slug: "",
    title: { en: "", bn: "" },
    excerpt: { en: "", bn: "" },
    departmentSlug: "orthodontics",
    departmentName: { en: "Orthodontics", bn: "অর্থোডন্টিক্স" },
    readTime: "5 min read",
    date: "September 2026",
    targetKeyword: "dental health",
    content: {
      hook: { en: "", bn: "" },
      overview: { en: "", bn: "" },
      symptomsOrOptions: [],
      procedureOrExpectations: { en: "", bn: "" },
      preventionOrAftercare: { en: "", bn: "" },
    },
  });

  const handleOpenAdd = () => {
    setEditingPost(null);
    setFormData({
      id: `post-${Date.now()}`,
      slug: `article-${Date.now()}`,
      title: { en: "", bn: "" },
      excerpt: { en: "", bn: "" },
      departmentSlug: "orthodontics",
      departmentName: { en: "Orthodontics", bn: "অর্থোডন্টিক্স" },
      readTime: "5 min read",
      date: "September 2026",
      targetKeyword: "dental health",
      content: {
        hook: { en: "", bn: "" },
        overview: { en: "", bn: "" },
        symptomsOrOptions: [],
        procedureOrExpectations: { en: "", bn: "" },
        preventionOrAftercare: { en: "", bn: "" },
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog article?")) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      setPosts(posts.map((p) => (p.id === editingPost.id ? formData : p)));
    } else {
      setPosts([formData, ...posts]);
    }
    setIsModalOpen(false);
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.bn.includes(searchQuery) ||
      p.departmentName.en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            SEO Content Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
            Blog Articles ({posts.length})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Manage evidence-based patient guides, SEO topics, clinical advice, and faqs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New SEO Article</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by title or department..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-zinc-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-zinc-950 shadow-xs"
        />
      </div>

      {/* Articles Table */}
      <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Article Title</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Read Time</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-zinc-950 leading-snug">{post.title.en}</div>
                    <div className="text-zinc-500 text-xs mt-0.5">{post.title.bn}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800">
                      <Tag className="w-3 h-3 text-zinc-500" />
                      <span>{post.departmentName.en}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-zinc-600 flex items-center gap-1 pt-5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{post.readTime}</span>
                  </td>
                  <td className="py-4 px-4 text-zinc-500">{post.date}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="p-1.5 text-zinc-600 hover:text-zinc-950 rounded-lg hover:bg-zinc-100"
                        title="Edit Article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <h3 className="text-lg font-bold text-zinc-950">
                {editingPost ? "Edit SEO Article" : "Create New SEO Article"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-900 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300"
                />
              </div>

              {/* Excerpt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Excerpt (English)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.excerpt.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        excerpt: { ...formData.excerpt, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Excerpt (Bengali)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.excerpt.bn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        excerpt: { ...formData.excerpt, bn: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              {/* Clinical Hook */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Clinical Hook / Callout (English)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.content.hook.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          hook: { ...formData.content.hook, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Clinical Hook / Callout (Bengali)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.content.hook.bn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          hook: { ...formData.content.hook, bn: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              {/* Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Detailed Overview (English)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.content.overview.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          overview: { ...formData.content.overview, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Detailed Overview (Bengali)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.content.overview.bn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          overview: { ...formData.content.overview, bn: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-zinc-950 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
