"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Phone,
  Clock,
  MapPin,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { CLINIC_SETTINGS } from "@/data/settings";
import { ClinicSettings } from "@/types";
import { fetchLiveClinicSettings, saveLiveClinicSettings } from "@/lib/api/db";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ClinicSettings>(CLINIC_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchLiveClinicSettings().then((liveSet) => {
      if (liveSet) setSettings(liveSet);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    await saveLiveClinicSettings(settings);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddPhone = () => {
    setSettings({
      ...settings,
      phoneNumbers: [...settings.phoneNumbers, "+880 1700-000000"],
    });
  };

  const handleRemovePhone = (index: number) => {
    const updated = settings.phoneNumbers.filter((_, i) => i !== index);
    setSettings({ ...settings, phoneNumbers: updated });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Clinic Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
            Clinic Settings & Hours
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Configure chamber telephone lines, emergency hotlines, weekly opening shifts, and location address.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Phone Numbers Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <div className="p-2.5 bg-zinc-950 text-white rounded-xl">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950">Chamber Phone Lines</h3>
              <p className="text-xs text-zinc-500">Primary reception and booking hotlines</p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Emergency Hotline Number *
              </label>
              <input
                type="text"
                required
                value={settings.emergencyPhone}
                onChange={(e) =>
                  setSettings({ ...settings, emergencyPhone: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 font-mono text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Standard Phone Lines
                </label>
                <button
                  type="button"
                  onClick={handleAddPhone}
                  className="inline-flex items-center gap-1 text-xs font-bold text-zinc-900 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>

              <div className="space-y-2">
                {settings.phoneNumbers.map((phone, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        const updated = [...settings.phoneNumbers];
                        updated[idx] = e.target.value;
                        setSettings({ ...settings, phoneNumbers: updated });
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-300 font-mono text-sm"
                    />
                    {settings.phoneNumbers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhone(idx)}
                        className="p-2 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <div className="p-2.5 bg-zinc-950 text-white rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950">Chamber Hours & Shifts</h3>
              <p className="text-xs text-zinc-500">Weekly shift schedules shown on the website</p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            {settings.workingHours.map((wh, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-600 mb-1">
                    Days ({idx === 0 ? "Weekdays" : "Weekend"})
                  </label>
                  <input
                    type="text"
                    value={wh.days.en}
                    onChange={(e) => {
                      const updated = [...settings.workingHours];
                      updated[idx].days.en = e.target.value;
                      setSettings({ ...settings, workingHours: updated });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-600 mb-1">
                    Hours / Shifts
                  </label>
                  <input
                    type="text"
                    value={wh.hours.en}
                    onChange={(e) => {
                      const updated = [...settings.workingHours];
                      updated[idx].hours.en = e.target.value;
                      setSettings({ ...settings, workingHours: updated });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chamber Address Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <div className="p-2.5 bg-zinc-950 text-white rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950">Chamber Location</h3>
              <p className="text-xs text-zinc-500">Physical address and placeholder notice toggle</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <input
                type="checkbox"
                id="isAddressPlaceholder"
                checked={settings.isAddressPlaceholder}
                onChange={(e) =>
                  setSettings({ ...settings, isAddressPlaceholder: e.target.checked })
                }
                className="w-4 h-4 rounded text-zinc-950 focus:ring-zinc-950"
              />
              <label htmlFor="isAddressPlaceholder" className="text-xs font-semibold text-zinc-800">
                Mark address as placeholder (displays friendly &ldquo;To be finalized&rdquo; badge on website until final lease confirmed)
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Address (English)
                </label>
                <textarea
                  rows={3}
                  value={settings.address.en}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      address: { ...settings.address, en: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Address (Bengali)
                </label>
                <textarea
                  rows={3}
                  value={settings.address.bn}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      address: { ...settings.address, bn: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-950 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
