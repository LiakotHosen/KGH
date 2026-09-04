import { ClinicSettings } from "@/types";

export const CLINIC_SETTINGS: ClinicSettings = {
  name: "KGH Dental",
  tagline: {
    en: "Multi-Specialty Dental Care In One Chamber",
    bn: "একটি চেম্বারে সব ধরনের বিশেষায়িত ডেন্টাল কেয়ার",
  },
  phoneNumbers: ["+880 1700-000000", "+880 1800-000000"],
  emergencyPhone: "+880 1700-000000",
  email: "care@kghdental.com",
  address: {
    en: "[Address to be updated — Central Dhaka Location, Dhaka, Bangladesh]",
    bn: "[ঠিকানা শীঘ্রই আপডেট করা হবে — সেন্ট্রাল ঢাকা লোকেশন, ঢাকা, বাংলাদেশ]",
  },
  isAddressPlaceholder: true,
  workingHours: [
    {
      days: {
        en: "Saturday – Thursday",
        bn: "শনিবার – বৃহস্পতিবার",
      },
      hours: {
        en: "11:00 AM – 2:00 PM & 5:00 PM – 9:30 PM",
        bn: "সকাল ১১:০০ – দুপুর ২:০০ ও বিকাল ৫:০০ – রাত ৯:৩০",
      },
    },
    {
      days: {
        en: "Friday",
        bn: "শুক্রবার",
      },
      hours: {
        en: "5:00 PM – 9:30 PM",
        bn: "বিকাল ৫:০০ – রাত ৯:৩০",
      },
    },
  ],
  googleReviewUrl: "https://g.page/r/kgh-dental-review",
  socialLinks: {
    facebook: "https://facebook.com/kghdental",
    whatsapp: "https://wa.me/8801700000000",
  },
};
