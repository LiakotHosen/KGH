import { Doctor } from "@/types";

export const DOCTORS: Doctor[] = [
  {
    id: "dr-diean",
    slug: "dr-ahamed-diean-sammir",
    name: {
      en: "Dr. Ahamed Diean Sammir",
      bn: "ডা. আহমেদ দিয়ান সাম্মির",
    },
    specialty: {
      en: "Prosthodontist & Implantologist",
      bn: "প্রস্থোডন্টিক্স ও ইমপ্ল্যান্ট বিশেষজ্ঞ",
    },
    departmentId: "prosthodontics",
    degrees: {
      en: "BDS (BDC), MS - Prosthodontics (BSMMU)",
      bn: "বিডিএস (বিডিসি), এমএস - প্রস্থোডন্টিক্স (বিএসএমএমইউ)",
    },
    designation: {
      en: "Consultant Prosthodontist & Faculty",
      bn: "কনসালটেন্ট প্রস্থোডন্টিস্ট ও সাবেক শিক্ষক",
    },
    institution: {
      en: "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
      bn: "বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয়",
    },
    bmdcReg: "Verified",
    photoUrl: "/images/doctors/dr-diean.jpg",
    bio: {
      en: "Dr. Ahamed Diean Sammir specializes in prosthodontics, with advanced training in dental implants, fixed and removable prostheses, and full mouth rehabilitation. He holds an MS in Prosthodontics from Bangabandhu Sheikh Mujib Medical University and a BDS from Bangladesh Dental College, and has taught as faculty at several dental colleges alongside his clinical practice.",
      bn: "ডা. আহমেদ দিয়ান সাম্মির প্রস্থোডন্টিক্সে বিশেষজ্ঞ, ডেন্টাল ইমপ্ল্যান্ট, ফিক্সড ও রিমুভেবল প্রস্থেসিস এবং ফুল মাউথ রিহ্যাবিলিটেশনে উন্নত প্রশিক্ষণপ্রাপ্ত। তিনি বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয় থেকে প্রস্থোডন্টিক্সে এমএস এবং বাংলাদেশ ডেন্টাল কলেজ থেকে বিডিএস সম্পন্ন করেছেন। ক্লিনিক্যাল প্র্যাকটিসের পাশাপাশি তিনি বিভিন্ন ডেন্টাল কলেজে শিক্ষকতাও করেছেন।",
    },
    experience: {
      en: "Over 10 years of specialized restorative & implant clinical experience.",
      bn: "১০ বছরেরও বেশি বিশেষায়িত রিস্টোরেটিভ ও ইমপ্ল্যান্ট ক্লিনিক্যাল অভিজ্ঞতা।",
    },
    schedule: {
      availableDaysEn: "Every day except Tuesday",
      availableDaysBn: "মঙ্গলবার ব্যতীত প্রতিদিন",
      daysOfWeek: [0, 1, 3, 4, 5, 6], // Sun, Mon, Wed, Thu, Fri, Sat (Tue=2 excluded)
      startTime: "17:00",
      endTime: "21:30",
      slotDurationMinutes: 30,
      note: {
        en: "5:00 PM – 9:30 PM (30-minute intervals)",
        bn: "বিকাল ৫:০০ – রাত ৯:৩০ (প্রতি ৩০ মিনিট অন্তর)",
      },
    },
    isConfirmed: true,
  },
  {
    id: "dr-sanwar",
    slug: "dr-md-sanwar-hossain",
    name: {
      en: "Dr. Md. Sanwar Hossain",
      bn: "ডা. মো. সানোয়ার হোসেন",
    },
    specialty: {
      en: "Oral & Maxillofacial Surgeon",
      bn: "ওরাল অ্যান্ড ম্যাক্সিলোফেসিয়াল সার্জন",
    },
    departmentId: "oral-surgery",
    degrees: {
      en: "BDS, FCPS (Oral & Maxillofacial Surgery)",
      bn: "বিডিএস, এফসিপিএস (ওরাল অ্যান্ড ম্যাক্সিলোফেসিয়াল সার্জারি)",
    },
    designation: {
      en: "Assistant Professor",
      bn: "সহকারী অধ্যাপক",
    },
    institution: {
      en: "Kumudini Women's Medical College & Hospital",
      bn: "কুমুদিনী উইমেন'স মেডিকেল কলেজ",
    },
    photoUrl: "/images/doctors/dr-diean.jpg", // fallback placeholder until additional photo provided
    bio: {
      en: "Dr. Md. Sanwar Hossain is a fellowship-trained oral and maxillofacial surgeon (FCPS) with extensive experience in oral cancer surgery, facial trauma management, and complex dental surgeries. He currently serves as Assistant Professor at Kumudini Women's Medical College and has published research in oral and maxillofacial pathology.",
      bn: "ডা. মো. সানোয়ার হোসেন একজন ফেলোশিপপ্রাপ্ত ওরাল ও ম্যাক্সিলোফেসিয়াল সার্জন (এফসিপিএস), যার রয়েছে মুখের ক্যান্সার সার্জারি, মুখমণ্ডলের আঘাত চিকিৎসা এবং জটিল দাঁতের সার্জারিতে বিস্তৃত অভিজ্ঞতা। বর্তমানে তিনি কুমুদিনী উইমেন'স মেডিকেল কলেজে সহকারী অধ্যাপক হিসেবে কর্মরত এবং ওরাল ও ম্যাক্সিলোফেসিয়াল প্যাথলজিতে গবেষণাও প্রকাশ করেছেন।",
    },
    experience: {
      en: "Fellowship-trained surgeon with high-level trauma & oncological surgery track record.",
      bn: "মুখমণ্ডলের জটিল সার্জারি ও ক্যান্সার চিকিৎসায় ফেলোশিপপ্রাপ্ত বিশেষজ্ঞ।",
    },
    schedule: {
      availableDaysEn: "Saturday only",
      availableDaysBn: "শুধুমাত্র শনিবার",
      daysOfWeek: [6], // Saturday
      startTime: "17:30",
      endTime: "21:00",
      slotDurationMinutes: 30,
      note: {
        en: "5:30 PM – 9:00 PM (30-minute intervals)",
        bn: "বিকাল ৫:৩০ – রাত ৯:০০ (প্রতি ৩০ মিনিট অন্তর)",
      },
    },
    isConfirmed: true,
  },
  {
    id: "dr-fatema",
    slug: "dr-fatema-tasrin-madhubi",
    name: {
      en: "Dr. Fatema Tasrin Madhubi",
      bn: "ডা. ফাতেমা তাসরিন মাধুবী",
    },
    specialty: {
      en: "Orthodontist & Clear Aligner Specialist",
      bn: "অর্থোডন্টিস্ট ও ক্লিয়ার অ্যালাইনার বিশেষজ্ঞ",
    },
    departmentId: "orthodontics",
    degrees: {
      en: "BDS (RMC), MS - Orthodontics (BSMMU)",
      bn: "বিডিএস (রামেক), এমএস - অর্থোডন্টিকস (বিএসএমএমইউ)",
    },
    designation: {
      en: "Dental Surgeon",
      bn: "ডেন্টাল সার্জন",
    },
    institution: {
      en: "Govt. Employee Hospital, Fulbaria, Dhaka",
      bn: "সরকারি কর্মচারী হাসপাতাল, ফুলবাড়িয়া, ঢাকা",
    },
    bmdcReg: "6150",
    photoUrl: "/images/doctors/dr-fatema.jpg",
    bio: {
      en: "Dr. Fatema Tasrin Madhubi is an orthodontist with an MS in Orthodontics from Bangladesh Medical University and a BDS from Rajshahi Medical College. She specializes in clear aligner treatment and correcting dental malocclusions for patients of all ages, with a focus on precise, comfortable, patient-centered care.",
      bn: "ডা. ফাতেমা তাসরিন মাধুবী একজন অর্থোডন্টিস্ট, বাংলাদেশ মেডিকেল বিশ্ববিদ্যালয় থেকে অর্থোডন্টিক্সে এমএস এবং রাজশাহী মেডিকেল কলেজ থেকে বিডিএস সম্পন্ন করেছেন। তিনি ক্লিয়ার অ্যালাইনার চিকিৎসা এবং সব বয়সের রোগীর দাঁতের অসামঞ্জস্য সংশোধনে বিশেষজ্ঞ, নিখুঁত ও আরামদায়ক রোগী-কেন্দ্রিক চিকিৎসায় মনোযোগী।",
    },
    experience: {
      en: "Certified in clear aligners and specialized in adolescent & adult teeth realignment.",
      bn: "ক্লিয়ার অ্যালাইনার সার্টিফায়েড এবং শিশু ও প্রাপ্তবয়স্কদের দাঁত সোজা করার অভিজ্ঞ চিকিৎসক।",
    },
    schedule: {
      availableDaysEn: "Tuesday only",
      availableDaysBn: "শুধুমাত্র মঙ্গলবার",
      daysOfWeek: [2], // Tuesday
      startTime: "17:00",
      endTime: "21:00",
      slotDurationMinutes: 30,
      note: {
        en: "5:00 PM – 9:00 PM (30-minute intervals)",
        bn: "বিকাল ৫:০০ – রাত ৯:০০ (প্রতি ৩০ মিনিট অন্তর)",
      },
    },
    isConfirmed: true,
  },
  {
    id: "dr-bappy",
    slug: "dr-md-muhtashim-chowdhury-bappy",
    name: {
      en: "Dr. Md. Muhtashim Chowdhury (Bappy)",
      bn: "ডা. মো. মুহতাসিম চৌধুরী (বাপ্পী)",
    },
    specialty: {
      en: "Oral and Dental Surgeon",
      bn: "ওরাল অ্যান্ড ডেন্টাল সার্জন",
    },
    departmentId: "endodontics",
    degrees: {
      en: "BDS (DU), MPH (NSU), PGT (Conservative Dentistry & Maxillofacial Surgery)",
      bn: "বিডিএস (ঢাবি), এমপিএইচ (এনএসইউ), পিজিটি (কনজারভেটিভ ডেন্টিস্ট্রি ও ম্যাক্সিলোফেসিয়াল সার্জারি)",
    },
    designation: {
      en: "Oral and Dental Surgeon",
      bn: "ওরাল অ্যান্ড ডেন্টাল সার্জন",
    },
    institution: {
      en: "BSMMU (Ex-PG Hospital)",
      bn: "বিএসএমএমইউ (সাবেক পিজি হাসপাতাল)",
    },
    photoUrl: "/images/doctors/dr-diean.jpg",
    bio: {
      en: "Dr. Md. Muhtashim Chowdhury (Bappy) is an Oral and Dental Surgeon holding BDS from Dhaka University (DU) and MPH from North South University (NSU). He completed Post Graduate Training (PGT) in Conservative Dentistry & Maxillofacial Surgery at BSMMU (Ex-PG Hospital). Dr. Bappy has attained Advance Implant Training from USC (USA) and Advance Endodontic Training from Japan, specializing in modern painless root canals, dental implants, and maxillofacial procedures.",
      bn: "ডা. মো. মুহতাসিম চৌধুরী (বাপ্পী) একজন দক্ষ ওরাল অ্যান্ড ডেন্টাল সার্জন। তিনি ঢাকা বিশ্ববিদ্যালয় (ঢাবি) থেকে বিডিএস এবং নর্থ সাউথ বিশ্ববিদ্যালয় (এনএসইউ) থেকে এমপিএইচ সম্পন্ন করেছেন। তিনি বিএসএমএমইউ (সাবেক পিজি হাসপাতাল) থেকে কনজারভেটিভ ডেন্টিস্ট্রি ও ম্যাক্সিলোফেসিয়াল সার্জারিতে পিজিটি সম্পন্ন করেন। এছাড়া তিনি আমেরিকার ইউএসসি (USC, USA) থেকে অ্যাডভান্স ইমপ্ল্যান্ট ট্রেনিং এবং জাপান থেকে অ্যাডভান্স এন্ডোডন্টিক ট্রেনিং প্রাপ্ত। তিনি আধুনিক ব্যথামুক্ত রুট ক্যানেল, ডেন্টাল ইমপ্ল্যান্ট ও ম্যাক্সিলোফেসিয়াল চিকিৎসায় অভিজ্ঞ।",
    },
    experience: {
      en: "Advance Implant Training (USC, USA) • Advance Endodontic Training (Japan) • PGT (BSMMU, Ex-PG Hospital)",
      bn: "অ্যাডভান্স ইমপ্ল্যান্ট ট্রেনিং (ইউএসসি, আমেরিকা) • অ্যাডভান্স এন্ডোডন্টিক ট্রেনিং (জাপান) • পিজিটি (বিএসএমএমইউ, সাবেক পিজি হাসপাতাল)",
    },
    schedule: {
      availableDaysEn: "Every day except Tuesday",
      availableDaysBn: "মঙ্গলবার ব্যতীত প্রতিদিন",
      daysOfWeek: [0, 1, 3, 4, 5, 6],
      startTime: "11:00",
      endTime: "14:00",
      slotDurationMinutes: 30,
      note: {
        en: "11:00 AM – 2:00 PM",
        bn: "সকাল ১১:০০ – দুপুর ২:০০",
      },
    },
    isConfirmed: true,
  },
  {
    id: "dr-ratina",
    slug: "dr-jesinta-islam",
    name: {
      en: "Dr. Jesinta Islam",
      bn: "ডা. জেসিন্টা ইসলাম",
    },
    specialty: {
      en: "Oral and Dental Surgeon",
      bn: "ওরাল অ্যান্ড ডেন্টাল সার্জন",
    },
    departmentId: "endodontics",
    degrees: {
      en: "BDS (DU), MPH (NSU), PGT (Conservative Dentistry & Endodontics)",
      bn: "বিডিএস (ঢাবি), এমপিএইচ (এনএসইউ), পিজিটি (কনজারভেটিভ ডেন্টিস্ট্রি ও এন্ডোডন্টিক্স)",
    },
    designation: {
      en: "Oral and Dental Surgeon",
      bn: "ওরাল অ্যান্ড ডেন্টাল সার্জন",
    },
    institution: {
      en: "BSMMU (Ex-PG Hospital)",
      bn: "বিএসএমএমইউ (সাবেক পিজি হাসপাতাল)",
    },
    photoUrl: "/images/doctors/dr-fatema.jpg",
    bio: {
      en: "Dr. Jesinta Islam is an accomplished Oral and Dental Surgeon holding BDS from Dhaka University (DU) and MPH from North South University (NSU). She completed Post Graduate Training (PGT) in Conservative Dentistry & Endodontics at BSMMU (Ex-PG Hospital) and received Advance Implant Training in Rome, Italy. She specializes in precision root canal therapy, aesthetic dentistry, conservative treatments, and dental implant solutions with patient-centered care.",
      bn: "ডা. জেসিন্টা ইসলাম একজন নিবেদিতপ্রাণ ওরাল অ্যান্ড ডেন্টাল সার্জন। তিনি ঢাকা বিশ্ববিদ্যালয় (ঢাবি) থেকে বিডিএস এবং নর্থ সাউথ বিশ্ববিদ্যালয় (এনএসইউ) থেকে এমপিএইচ ডিগ্রি অর্জন করেছেন। তিনি বিএসএমএমইউ (সাবেক পিজি হাসপাতাল) থেকে কনজারভেটিভ ডেন্টিস্ট্রি ও এন্ডোডন্টিক্সে পিজিটি সম্পন্ন করেছেন এবং ইতালির রোম থেকে অ্যাডভান্স ইমপ্ল্যান্ট ট্রেনিং সম্পন্ন করেছেন। তিনি আধুনিক রুট ক্যানেল, নান্দনিক ডেন্টিস্ট্রি ও ডেন্টাল ইমপ্ল্যান্ট চিকিৎসায় বিশেষভাবে পারদর্শী।",
    },
    experience: {
      en: "Advance Implant Training (Rome, Italy) • PGT in Conservative Dentistry & Endodontics (BSMMU, Ex-PG Hospital)",
      bn: "অ্যাডভান্স ইমপ্ল্যান্ট ট্রেনিং (রোম, ইতালি) • পিজিটি (কনজারভেটিভ ডেন্টিস্ট্রি ও এন্ডোডন্টিক্স, বিএসএমএমইউ, সাবেক পিজি হাসপাতাল)",
    },
    schedule: {
      availableDaysEn: "Tuesday only",
      availableDaysBn: "শুধুমাত্র মঙ্গলবার",
      daysOfWeek: [2],
      startTime: "11:00",
      endTime: "14:00",
      slotDurationMinutes: 30,
      note: {
        en: "11:00 AM – 2:00 PM",
        bn: "সকাল ১১:০০ – দুপুর ২:০০",
      },
    },
    isConfirmed: true,
  },
  {
    id: "dr-joy",
    slug: "dr-md-sanowar-hossain-joy",
    name: {
      en: "Dr. Md. Sanowar Hossain Joy",
      bn: "ডা. মো. সানোয়ার হোসেন জয়",
    },
    specialty: {
      en: "Dental Specialist",
      bn: "ডেন্টাল বিশেষজ্ঞ",
    },
    degrees: {
      en: "BDS, Advanced Clinical Training",
      bn: "বিডিএস, অ্যাডভান্সড ক্লিনিক্যাল ট্রেনিং",
    },
    designation: {
      en: "Consultant Dental Surgeon",
      bn: "কনসালটেন্ট ডেন্টাল সার্জন",
    },
    photoUrl: "/images/doctors/dr-diean.jpg",
    bio: {
      en: "Specializing in gentle dental care and preventive treatments. Dedicated to high-precision restorative dentistry at KGH Dental.",
      bn: "যত্নশীল চিকিৎসা ও প্রতিরোধমূলক ডেন্টাল কেয়ারে প্রশিক্ষিত চিকিৎসক। পূর্ণাঙ্গ তথ্য প্রক্রিয়াধীন।",
    },
    schedule: {
      availableDaysEn: "Saturday only",
      availableDaysBn: "শুধুমাত্র শনিবার",
      daysOfWeek: [6],
      startTime: "17:30",
      endTime: "21:00",
      slotDurationMinutes: 30,
      note: {
        en: "5:30 PM – 9:00 PM",
        bn: "বিকাল ৫:৩০ – রাত ৯:০০",
      },
    },
    isConfirmed: false,
  },
];
