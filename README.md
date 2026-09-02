# KGH Dental — Multi-Specialty Dental Clinic

A high-performance, modern multi-specialty dental clinic web platform and content management system (CMS) built with **Next.js 16 (App Router)**, **Tailwind CSS**, and **Supabase (PostgreSQL & Storage)**.

Designed with clinical aesthetic excellence, bilingual support (Bengali & English), seamless appointment booking wizard, and a comprehensive Admin Portal for managing clinic operations in real time.

---

## 🌟 Key Features

### 1. Patient Experience & Public Website
- **Hero & Trust Architecture**: Centered, clean clinical landing page highlighting the clinic's 6 specialist doctors and 7 specialized departments.
- **Auto-Sliding Doctor Carousel**: Smooth, continuous right-to-left infinite marquee showcase with pause-on-hover capability and direct booking action.
- **7 Clinical Departments & 56 Sub-Services**:
  1. Orthodontics (আঁকাবাঁকা দাঁত ও ক্লিয়ার অ্যালাইনার)
  2. Oral & Maxillofacial Surgery (মুখ ও চোয়াল সার্জারি)
  3. Conservative Dentistry & Endodontics (রুট ক্যানেল ও ফিলিং)
  4. Prosthodontics (কৃত্রিম দাঁত ও ইমপ্ল্যান্ট)
  5. Pediatric Dentistry (শিশু দন্তচিকিৎসা)
  6. Periodontics (মাড়ির রোগ ও রক্তপাত)
  7. General Consultation & Diagnostics (ডিজিটাল চেকআপ ও এক্স-রে)
  - Every service includes transparent **Why Needed**, **When to Consult**, and **Clinical Benefit** breakdowns.
- **Direct Specialist Booking Wizard (`/appointment`)**:
  - 4-step wizard (Doctor selection, Date/time slot picker, Patient details, Instant booking reference).
  - WhatsApp confirmation integration with pre-filled message text.
- **10 SEO Evidence-Based Patient Guides (`/blog`)**: Detailed dental care articles with clinical hooks, symptoms, treatment procedures, and aftercare advice.
- **Chamber Visual Showcase (`/gallery`)**: High-resolution gallery of operatories, class-B autoclave sterilization, and patient consultation suites.

---

### 2. Clinic Administration Portal (`/admin`)
- **Dashboard (`/admin`)**: Real-time KPI monitoring for patient appointments, active specialists, departments, and live Supabase cloud status.
- **Appointments Management (`/admin/appointments`)**: Full patient registry with status updating (`Pending` ➔ `Confirmed` ➔ `Completed` ➔ `Cancelled`) and direct WhatsApp messaging.
- **Doctors Directory (`/admin/doctors`)**: Add, edit, and delete doctors with qualification editors, schedule builders, and photo pickers.
- **Departments & Services (`/admin/departments`)**: Full CRUD over all 7 departments and 56 specialized treatments.
- **Media Library & Asset Manager (`/admin/media`)**:
  - Drag-and-drop file uploader from local computer.
  - Media Gallery grid allowing one-click image selection across all admin forms.
  - Direct CDN link copying.
- **Clinic Settings (`/admin/settings`)**: Reception lines, emergency hotlines, weekly opening shifts, and chamber location address.

---

## 🔐 Admin Credentials

- **Admin Login URL**: `/admin/login`
- **Default Email**: `admin@kghdental.com`
- **Default Password**: `kghdental2026!`

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL & Supabase Storage)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript 5

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/LiakotHosen/KGH.git
cd KGH
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://kumltgqxafqjckbdnmnd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_topdg64bkRx3PAE-eM5cjA_NIi5Nhww
SUPABASE_SERVICE_ROLE_KEY=

ADMIN_EMAIL=admin@kghdental.com
ADMIN_PASSWORD=kghdental2026!
```

### 4. Supabase Database Schema
Run the SQL migration script located in [`supabase/schema.sql`](./supabase/schema.sql) inside the Supabase SQL Editor.

### 5. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── docs/                      # Master plans, briefs, and client copy
├── public/
│   └── images/
│       ├── departments/       # Department high-res visual assets
│       ├── doctors/           # Doctor profile photos
│       ├── logos/             # Transparent and white vector logos
│       └── uploads/           # Local media uploads fallback
├── src/
│   ├── app/                   # Next.js App Router (Public & Admin routes)
│   │   ├── admin/             # Admin CMS Portal (Dashboard, Doctors, etc.)
│   │   ├── api/               # Server API routes (Upload, Media)
│   │   ├── appointment/       # Booking Wizard
│   │   ├── blog/              # SEO Blog guides
│   │   ├── contact/           # Contact & Hours page
│   │   ├── doctors/           # Doctor Specialists directory
│   │   ├── gallery/           # Chamber visual tour
│   │   └── services/          # Department catalog & details
│   ├── components/            # Reusable UI & layout components
│   ├── context/               # Language Context (Bilingual toggle)
│   ├── data/                  # Seed data (Doctors, Departments, Blog)
│   ├── lib/                   # Supabase client & live API service layer
│   └── types/                 # TypeScript interfaces
└── supabase/
    └── schema.sql             # Turnkey database schema & RLS policies
```

---

## 📄 License
Private commercial project for KGH Dental Clinic. All rights reserved.
