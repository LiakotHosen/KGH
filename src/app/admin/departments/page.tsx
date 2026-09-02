"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Edit2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Search,
  Check,
} from "lucide-react";
import { DEPARTMENTS } from "@/data/departments";
import { Department, SubService } from "@/types";
import { DepartmentIcon } from "@/components/shared/DepartmentIcon";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import {
  fetchLiveDepartments,
  saveLiveDepartment,
  saveLiveSubService,
  deleteLiveSubService,
} from "@/lib/api/db";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [selectedDeptId, setSelectedDeptId] = useState<string>("orthodontics");
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // Sub-service modal
  const [isSubServiceModalOpen, setIsSubServiceModalOpen] = useState(false);
  const [editingSubService, setEditingSubService] = useState<SubService | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    fetchLiveDepartments().then((depts) => {
      if (depts && depts.length > 0) {
        setDepartments(depts);
      }
    });
  }, []);

  // Media Picker state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"dept" | null>(null);

  // Form State for Department
  const [deptForm, setDeptForm] = useState<Department>(DEPARTMENTS[0]);

  // Form State for Sub-Service
  const [subForm, setSubForm] = useState<SubService>({
    id: "",
    number: 1,
    name: { en: "", bn: "" },
    why: { en: "", bn: "" },
    when: { en: "", bn: "" },
    benefit: { en: "", bn: "" },
  });

  const activeDepartment = departments.find((d) => d.id === selectedDeptId) || departments[0];

  const handleEditDept = (dept: Department) => {
    setEditingDept(dept);
    setDeptForm(dept);
    setIsDeptModalOpen(true);
  };

  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = departments.map((d) => (d.id === deptForm.id ? deptForm : d));
    setDepartments(updated);
    setIsDeptModalOpen(false);
    await saveLiveDepartment(deptForm);
  };

  const handleOpenAddSubService = () => {
    setEditingSubService(null);
    setSubForm({
      id: `service-${Date.now()}`,
      number: activeDepartment.subServices.length + 1,
      name: { en: "", bn: "" },
      why: { en: "", bn: "" },
      when: { en: "", bn: "" },
      benefit: { en: "", bn: "" },
    });
    setIsSubServiceModalOpen(true);
  };

  const handleOpenEditSubService = (sub: SubService) => {
    setEditingSubService(sub);
    setSubForm(sub);
    setIsSubServiceModalOpen(true);
  };

  const handleDeleteSubService = async (subId: string) => {
    if (confirm("Are you sure you want to delete this sub-service? This will update the live website immediately.")) {
      const updatedSubs = activeDepartment.subServices.filter((s) => s.id !== subId);
      const updatedDepts = departments.map((d) =>
        d.id === activeDepartment.id ? { ...d, subServices: updatedSubs } : d
      );
      setDepartments(updatedDepts);
      await deleteLiveSubService(subId);
    }
  };

  const handleSaveSubService = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedSubs: SubService[];

    if (editingSubService) {
      updatedSubs = activeDepartment.subServices.map((s) =>
        s.id === editingSubService.id ? subForm : s
      );
    } else {
      updatedSubs = [...activeDepartment.subServices, subForm];
    }

    const updatedDepts = departments.map((d) =>
      d.id === activeDepartment.id ? { ...d, subServices: updatedSubs } : d
    );
    setDepartments(updatedDepts);
    setIsSubServiceModalOpen(false);
    await saveLiveSubService(activeDepartment.id, subForm);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Clinical Catalog
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
          Departments & 56 Sub-Services
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600">
          Edit clinical department information, banner photos, and the Why/When/Benefit breakdown for all 56 treatments.
        </p>
      </div>

      {/* Two Column Layout: Left Column = Department Selector; Right Column = Sub-services Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: 7 Departments List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              7 Clinical Departments
            </h3>
          </div>

          <div className="space-y-2">
            {departments.map((dept) => {
              const isSelected = dept.id === selectedDeptId;
              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-white border-zinc-950 shadow-md ring-2 ring-zinc-950/10"
                      : "bg-white/80 border-zinc-200 hover:border-zinc-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2.5 rounded-xl transition-colors ${
                        isSelected ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      <DepartmentIcon name={dept.iconName} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-zinc-950 truncate">
                        {dept.name.en}
                      </h4>
                      <p className="text-xs text-zinc-500 truncate">
                        {dept.subServices.length} Treatments • {dept.name.bn}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditDept(dept);
                    }}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
                    title="Edit Department Info & Banner"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Active Department Banner & Sub-Services */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Department Header Banner */}
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                <img
                  src={activeDepartment.imageUrl}
                  alt={activeDepartment.name.en}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-zinc-950">
                    {activeDepartment.name.en}
                  </h2>
                  <span className="text-xs font-semibold text-zinc-500">
                    ({activeDepartment.name.bn})
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed max-w-lg">
                  {activeDepartment.shortDesc.en}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => handleEditDept(activeDepartment)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-xs font-semibold text-zinc-800"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Banner</span>
              </button>

              <button
                onClick={handleOpenAddSubService}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Sub-Service</span>
              </button>
            </div>
          </div>

          {/* Sub-Services List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Sub-Services ({activeDepartment.subServices.length})
              </h3>
            </div>

            <div className="space-y-3">
              {activeDepartment.subServices.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xs hover:shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-zinc-100 text-zinc-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {sub.number}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-950">{sub.name.en}</h4>
                        <span className="text-xs text-zinc-500">{sub.name.bn}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditSubService(sub)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
                        title="Edit sub-service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubService(sub.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete sub-service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Why / When / Benefit Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs border-t border-zinc-100">
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                      <span className="font-bold text-zinc-900 block mb-1">Why Needed:</span>
                      <p className="text-zinc-600">{sub.why.en}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                      <span className="font-bold text-zinc-900 block mb-1">When to Consult:</span>
                      <p className="text-zinc-600">{sub.when.en}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                      <span className="font-bold text-zinc-900 block mb-1">Clinical Benefit:</span>
                      <p className="text-zinc-600">{sub.benefit.en}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Department Modal */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <h3 className="text-lg font-bold text-zinc-950">Edit Department</h3>
              <button
                onClick={() => setIsDeptModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-900 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDept} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Department Card Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-300 shrink-0">
                    <img
                      src={deptForm.imageUrl}
                      alt="Dept Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget("dept");
                        setIsMediaPickerOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold border border-zinc-200 flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Change Image</span>
                    </button>
                    <span className="text-[11px] text-zinc-500 mt-1 block truncate max-w-xs">
                      {deptForm.imageUrl}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Name (English)
                </label>
                <input
                  type="text"
                  required
                  value={deptForm.name.en}
                  onChange={(e) =>
                    setDeptForm({
                      ...deptForm,
                      name: { ...deptForm.name, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Name (Bengali)
                </label>
                <input
                  type="text"
                  required
                  value={deptForm.name.bn}
                  onChange={(e) =>
                    setDeptForm({
                      ...deptForm,
                      name: { ...deptForm.name, bn: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Short Description (English)
                </label>
                <textarea
                  rows={2}
                  value={deptForm.shortDesc.en}
                  onChange={(e) =>
                    setDeptForm({
                      ...deptForm,
                      shortDesc: { ...deptForm.shortDesc, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Short Description (Bengali)
                </label>
                <textarea
                  rows={2}
                  value={deptForm.shortDesc.bn}
                  onChange={(e) =>
                    setDeptForm({
                      ...deptForm,
                      shortDesc: { ...deptForm.shortDesc, bn: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 text-white text-xs font-bold rounded-xl"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sub-Service Modal */}
      {isSubServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="text-lg font-bold text-zinc-950">
                {editingSubService ? "Edit Sub-Service" : "Add New Sub-Service"}
              </h3>
              <button
                onClick={() => setIsSubServiceModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-900 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubService} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={subForm.name.en}
                    onChange={(e) =>
                      setSubForm({
                        ...subForm,
                        name: { ...subForm.name, en: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Name (Bengali) *
                  </label>
                  <input
                    type="text"
                    required
                    value={subForm.name.bn}
                    onChange={(e) =>
                      setSubForm({
                        ...subForm,
                        name: { ...subForm.name, bn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              {/* Why */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Why Needed (English)
                  </label>
                  <textarea
                    rows={2}
                    value={subForm.why.en}
                    onChange={(e) =>
                      setSubForm({
                        ...subForm,
                        why: { ...subForm.why, en: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Why Needed (Bengali)
                  </label>
                  <textarea
                    rows={2}
                    value={subForm.why.bn}
                    onChange={(e) =>
                      setSubForm({
                        ...subForm,
                        why: { ...subForm.why, bn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              {/* When */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    When to Consult (English)
                  </label>
                  <textarea
                    rows={2}
                    value={subForm.when.en}
                    onChange={(e) =>
                      setSubForm({
                        ...subForm,
                        when: { ...subForm.when, en: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    When to Consult (Bengali)
                  </label>
                  <textarea
                    rows={2}
                    value={subForm.when.bn}
                    onChange={(e) =>
                      setSubForm({
                        ...subForm,
                        when: { ...subForm.when, bn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              {/* Benefit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Clinical Benefit (English)
                  </label>
                  <textarea
                    rows={2}
                    value={subForm.benefit.en}
                    onChange={(e) =>
                      setSubForm({
                        ...subForm,
                        benefit: { ...subForm.benefit, en: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Clinical Benefit (Bengali)
                  </label>
                  <textarea
                    rows={2}
                    value={subForm.benefit.bn}
                    onChange={(e) =>
                      setSubForm({
                        ...subForm,
                        benefit: { ...subForm.benefit, bn: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubServiceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 text-white text-xs font-bold rounded-xl"
                >
                  Save Sub-Service
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
        onSelect={(url) => setDeptForm({ ...deptForm, imageUrl: url })}
        title="Select Department Banner Image"
        currentValue={deptForm.imageUrl}
      />
    </div>
  );
}
