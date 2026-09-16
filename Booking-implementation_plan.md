# Implementation Plan - Custom In-House Booking & Calendar Engine (Method 1)

Transform the existing 4-step wizard into an enterprise, production-grade, in-house dental appointment booking system without external third-party dependencies (Cal.com / Calendly).

---

## User Review Required

> [!IMPORTANT]
> **Commit Policy**: As per your instruction, **NO code will ever be pushed to GitHub without your prior review and explicit command**. Everything will be built, tested, and verified locally first.

> [!NOTE]
> **No Cal.com / Calendly Required**: This solution builds a 100% proprietary calendar and slot booking system directly into KGH Dental. It supports English and Bengali seamlessly, connects directly to Supabase, and incurs zero monthly fees.

---

## Key Features in This Upgrade

1. **Interactive Visual Month Calendar (`CalendarMonthView`)**:
   - Replaces the simple sequential date list with a full month calendar grid (Sun–Sat / রবি–শনি).
   - Past dates are disabled; doctor's active chamber days are highlighted with an availability indicator.
   - Doctor off-days and blocked holidays are visually distinct.
   - Month-by-month navigation (Previous / Next month) with instant responsive rendering.

2. **Real-Time Slot Collision & Double-Booking Prevention**:
   - When a patient selects an available date, the system queries Supabase (and local cache) for all existing active appointments (`status IN ('pending', 'confirmed')`) for that doctor on that date.
   - Already booked time slots are marked as **"Booked / বুকড"** and disabled, preventing two patients from booking the same slot.
   - Real-time slot count badge (e.g., "5 slots remaining / ৫টি স্লট বাকি").

3. **Doctor Holiday & Blocked Dates Management (Admin)**:
   - In `/admin/appointments`, add an **Off-Days & Exceptions** manager.
   - Admin can block a specific date or time range for any doctor (e.g., doctor on leave, emergency surgery, clinic closed for Eid/Puja).
   - Blocked dates automatically reflect on the public patient calendar in real time.

4. **Public Appointment Tracking Page (`/appointment/track`)**:
   - Patients can enter their Mobile Number or Reference Code (`KGH-XXXXXX`).
   - Displays live status:
     - 🟡 **Pending Verification** (অপেক্ষমাণ - রিসেপশন থেকে কল করা হবে)
     - 🟢 **Confirmed** (নিশ্চিত - নির্ধারিত সময়ে উপস্থিত থাকুন)
     - 🔵 **Completed** (সম্পন্ন)
     - 🔴 **Cancelled** (বাতিল)
   - Download / Print printable digital appointment slip.
   - Quick one-click WhatsApp and Phone call to clinic reception.

5. **Notification & Verification Workflows**:
   - Instant rich WhatsApp confirmation link with complete booking payload (Ref, Doctor, Date, Time, Patient Name).
   - Modular server route (`/api/appointment/notify`) ready for SMS gateway integration (e.g. Greenweb, ElitBuzz, Twilio).

---

## Proposed Changes

### 1. Database & API Layer

#### [MODIFY] [db.ts](file:///F:/kgh/src/lib/api/db.ts)
- Add `fetchBookedSlots(doctorId: string, date: string): Promise<string[]>`: Queries Supabase for booked slots on a specific date for a doctor.
- Add `fetchDoctorBlockedDates(doctorId: string): Promise<string[]>`: Retrieves blocked holidays/off-days for a doctor.
- Add `createDoctorBlockedDate(doctorId: string, date: string, reason?: string)` and `deleteDoctorBlockedDate(id: string)`.
- Add `fetchAppointmentByRefOrPhone(query: string): Promise<AppointmentRecord[]>`.

#### [NEW] [supabase/booking_engine_update.sql](file:///F:/kgh/supabase/booking_engine_update.sql)
- Schema for `doctor_blocked_dates` (table storing doctor leaves, clinic holidays).
- Indexes on `appointments(doctor_id, appointment_date, status)` for sub-millisecond slot queries.

---

### 2. Appointment Booking Frontend (`/appointment`)

#### [NEW] [CalendarMonthView.tsx](file:///F:/kgh/src/components/appointment/CalendarMonthView.tsx)
- Reusable monthly visual calendar grid.
- Bilingual day names & month headers.
- Next/Previous month controls.
- Availability markers matching the doctor's weekly active schedule (`schedule.daysOfWeek`).
- Disables past dates and blocked dates.

#### [MODIFY] [BookingWizard.tsx](file:///F:/kgh/src/components/appointment/BookingWizard.tsx)
- Integrate `CalendarMonthView` into Step 2.
- Fetch booked slots whenever a date is clicked and disable booked slots in the slot grid.
- Display remaining slot counters and morning/evening group chips for clean UX.
- Step 4 enhancements: Add "Track Status" link and print slip button.

---

### 3. Patient Tracking System (`/appointment/track`)

#### [NEW] [src/app/appointment/track/page.tsx](file:///F:/kgh/src/app/appointment/track/page.tsx)
- Patient self-service tracking portal.
- Search by Reference Code (`KGH-XXXXXX`) or Mobile Number (`017XXXXXXXX`).
- Displays detailed appointment card with live status indicator, doctor details, and clinic preparation guidelines.
- Printable Appointment Pass / Slip modal.

---

### 4. Admin Management (`/admin/appointments`)

#### [MODIFY] [src/app/admin/appointments/page.tsx](file:///F:/kgh/src/app/admin/appointments/page.tsx)
- Add a new tab / section: **"Leave & Chamber Schedule Manager"** (ছুটি ও সময়সূচি নিয়ন্ত্রণ).
- Allows admin to select a doctor, pick dates to block, and set an optional reason ("Attending conference", "Personal leave").
- Instant status toggle with quick WhatsApp dispatch button to send confirmation message directly to patient's WhatsApp.

---

## Verification Plan

### Automated & Unit Checks
- Run Next.js compilation check:
  ```powershell
  npx next build --no-lint
  ```
  (or check dev server logs on task-17).

### Manual Verification Flows
1. **Calendar Navigation**:
   - Open `http://localhost:3000/appointment`.
   - Select Dr. Ahamed Diean Sammir.
   - Verify that Tuesdays are disabled (since Dr. Diean's chamber is every day except Tuesday).
   - Select Dr. Md. Sanwar Hossain.
   - Verify that only Saturdays are enabled (since Dr. Sanwar sits on Saturdays).
2. **Double-Booking Prevention**:
   - Book a slot (e.g. Dr. Diean on next Wednesday at 5:30 PM).
   - Refresh or open another browser/incognito window to the same doctor and date.
   - Verify that 5:30 PM is marked as "Booked" and cannot be clicked.
3. **Tracking Portal**:
   - Go to `http://localhost:3000/appointment/track`.
   - Enter the generated reference code or mobile number.
   - Verify that the appointment card loads with full details and correct status.
4. **Admin Panel**:
   - Open `http://localhost:3000/admin/appointments`.
   - Block a date for a doctor.
   - Go to public `/appointment` and verify that the date is disabled.
