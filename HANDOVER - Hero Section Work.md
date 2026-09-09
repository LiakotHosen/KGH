# KGH Dental — Hero Section Work: Session Handover Brief
Start a new Claude Code session with its working directory set to THIS folder (`Updated Developer Work of KGH`) and paste this file's content (or point Claude at this file) to continue.

---

## 1. What This Folder Is

This is a **git clone** of the developer's live repo: `https://github.com/LiakotHosen/KGH.git`
- Cloned 2026-09-08 into: `CLIENTS/15. KGH Dental_Multiple Doctors_Dr Bappy/Updated Developer Work of KGH/`
- Note: repo has `core.longpaths=true` set locally — required on Windows because of long nested file paths (e.g. `public/images/services-images-for-7-services/...`). Don't remove this config.
- This is a Next.js project (App Router) with Supabase wired in (`src/`, `public/`, `supabase/`, `package.json` present, plus `AGENTS.md`/`CLAUDE.md`/`README.md` at root — check those for the developer's own notes/conventions before making changes).
- **This clone is now the priority/source-of-truth codebase for KGH Dental.** All further hero-section (and future) work should happen here, not in a fresh scaffold.
- Verified working: `npm install` + `npm run dev` runs clean on Next.js 16 (Turbopack), serves at `http://localhost:3000`. No errors on startup. (If data like doctors/services doesn't render, check for missing `.env`/`.env.local` — Supabase env vars may need to be supplied.)

**Ground rule for the next session:** Only touch the **Home page Hero section**. Do not modify anything else in the app (other pages, admin panel, services pages, booking system, etc.) unless separately instructed — the rest of the site is the developer's finished/in-progress work and must stay intact.

---

## 2. Project Context (for anyone picking this up cold)

KGH Dental = new multi-doctor dental chamber website, ground-up build, Next.js + Supabase, White/Grey/Black minimal-premium palette (NOT any other client's locked color system). Full background lives in these files in the parent client folder (one level up from this one):
- `00. Master Plan.md`
- `01. Services and Sub-Services (Final).docx` / `.md`
- `02. Developer Handover Brief.md`
- `03-06. Website Copy (Draft)` files (Home, Departments, Doctors/Appointment/Gallery/Contact, Blog topics)

Current state: 8 departments now locked (7 original + newly added **Oral Medicine & Diagnosis**, 10 sub-services), 8th doctor added (**Dr. Rifat Rahman**, Oral Medicine Specialist, Fri 5–8 PM at KGH). Full department/doctor/service data — see prior chat history or the files above.

---

## 3. Hero Section — What's Been Discussed So Far (this is the active work item)

**Client's core ask:** A unique, scroll-based hero animation for the KGH Dental homepage that is (a) visually jaw-dropping, (b) genuinely educational about oral health, and (c) ties back to KGH's core value: multiple specialists under one roof solving different problems.

### Reference image provided by client
An ultra-realistic macro close-up photo of healthy upper front teeth (natural photography, not 3D render) — perfect enamel, natural gum texture, soft white background. This image is the anchor/starting visual for the hero concept. (Image was shared in chat, not yet saved as a file in this repo — retrieve from the client if needed for asset production, or regenerate via AI image prompt using the same ultra-realistic specification style discussed below.)

### Animation idea directions explored (brainstormed, not yet chosen/locked)
1. **Zoom-Through Anatomy Reveal** — scroll zooms/cross-sections into the tooth (enamel → dentin → pulp/nerve → root/bone), each layer reveals a short educational fact via label fade-in.
2. **360° Rotate + Fact Reveal** — tooth image slowly rotates on scroll (front → side → occlusal view), each angle reveals a fact card.
3. **Healthy → Problem → Solution Morph** — same tooth image morphs through decay/gum recession → KGH treatment fixing it → back to healthy.
4. **Split-Screen Before/After** — scroll wipes between "problem" and "perfect" (this image) states, could extend to per-department before/afters.
5. **Labelled Diagram Overlay** — animated SVG line-drawing/labels appear over the real photo (Enamel, Gumline, Root, etc.) like a medical infographic.
6. **Particle/Shine Reveal + Micro-Story** — surgical-light-style reveal, then a "day in the life of your tooth" narrative across scroll stages.

**Recommended direction (given during brainstorm, not yet finalized):** Combine #1 (zoom-through anatomy, educational core) with #3's ending (converges into a KGH/CTA moment).

### LATEST refined concept — "One Tooth. Every Specialist You'll Ever Need." (most recent, most developed idea)
A 6-scene scroll flow using the same base tooth image throughout (continuity via subtle overlay/morph per scene, not full new images each time):

1. **Scene 1 — Hook:** The reference image as-is (perfect healthy teeth). Text: "This is what a healthy smile looks like." / "But every smile faces different challenges — and needs different experts."
2. **Scene 2 — Orthodontics pain point:** Same image, subtle crowding/misalignment overlay on one tooth, highlight ring. Text: "Crooked or crowded teeth?" → "Our Orthodontist straightens it."
3. **Scene 3 — Conservative & Endodontics pain point:** Zoom shows a dark decay spot. Text: "A hidden cavity turning into pain?" → "Our Endodontist saves it with root canal care."
4. **Scene 4 — Prosthodontics pain point:** A tooth fades to a gap, then a crown/implant morphs in (reuses the implant-placement sequence concept from earlier hero brainstorming). Text: "Lost a tooth?" → "Our Prosthodontist rebuilds it — crown, bridge, or implant."
5. **Scene 5 — Periodontics + Oral & Maxillofacial Surgery pain points:** Gumline redness/swelling highlighted. Text: "Swollen or bleeding gums?" → "Our Periodontist protects the foundation of your smile." Then (same or next sub-beat): "Impacted wisdom tooth or facial trauma?" → "Our Oral & Maxillofacial Surgeon handles it — safely, precisely."
6. **Scene 6 — Convergence/CTA:** Image zooms back out to full healthy smile, small department badges (all 8, or a curated set) orbit/converge toward center. Headline: "One Chamber. Every Specialist. Every Problem, Solved." CTA: "Meet Our Specialists" / "Book an Appointment."

**Why this direction:** Each scroll beat is a concrete problem→solution→specialist unit (genuinely educational, not just pretty motion), uses one consistent base image (keeps production simpler and visually coherent), and the final scene visually delivers KGH's actual value proposition (multi-specialty under one roof) rather than just ending on a generic CTA.

### Image generation notes (established earlier in this same brainstorming thread, applies to any hero visuals produced)
- Target format: **9:16 vertical** (portrait) for now — 16:9 may be needed later, not yet.
- Style bar: **ultra-realistic**, not stylized/cartoon/clipart. Full PBR-quality photorealistic rendering if 3D-generated, or true macro photography quality if photo-based.
- Consistency rules across any multi-frame sequence (established during the implant-placement 5-stage brainstorm earlier in this project, and carried into the hero concept): same camera angle, same lighting direction/quality, same background treatment (pure white, centered subject, soft consistent shadow), same scale/proportions frame-to-frame — so scroll transitions read as one continuous subject evolving, not disconnected images.
- An example ultra-detailed 9:16 prompt was already written for an earlier (separate) implant-placement sequence concept — same level of prompt detail/rigor should be applied when writing prompts for whichever hero direction gets locked.

---

## 4. What Is NOT Yet Decided (don't assume, ask the client)
- Which of the 6 brainstormed directions (or the "One Tooth, Every Specialist" flow specifically) is FINAL — client had not explicitly locked it as of this handover, only said it was the strongest idea discussed.
- Whether Oral Medicine (8th dept) gets its own scene or just appears in the final convergence badges.
- Exact copy/wording for each scene (drafted above is illustrative, not client-approved final copy).
- Whether images will be AI-generated (per the ultra-realistic prompt approach) or the client will supply/commission real photography matching the reference image style.
- Technical implementation approach: GSAP ScrollTrigger (pin + scrub) was assumed/discussed as the mechanism, matching the rest of this agency's animation stack — confirm this matches what the existing repo already uses (check `src/` for existing animation libraries already installed, e.g. package.json, before introducing a new one).

## 5. Immediate Next Step
Pick up by: (1) confirming the hero direction with the client if not already locked, (2) inspecting this repo's existing Home page component structure to find where the current hero lives, (3) writing the frame-by-frame image prompts once direction is confirmed, (4) implementing the scroll animation in the existing Next.js codebase — touching only the hero section.
