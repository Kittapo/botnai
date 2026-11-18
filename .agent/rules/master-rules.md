# BloomCare — Master Rules (PART A)

## A0. Role and context
- Production-quality, demo-ready prototype for a Thai-language, privacy-first sexual-wellness e-commerce site with an AI consultant.
- Working brand name is `BloomCare`, kept in a single constant (`src/config/brand.ts`) and never hardcoded elsewhere.
- Reads as a general wellness / lifestyle brand: no explicit imagery, no explicit language in headlines, hero, or navigation.
- Tone: premium, warm, human, modern, friendly, trustworthy, elegant, never judgmental.
- Record all assumptions in `ASSUMPTIONS.md`.

## A1. Product and business truths (non-negotiable)
- Only two products exist in the demo catalog:
  1. Durex Kingtex (`ถุงยางอนามัย ดูเร็กซ์ คิงเท็ค`, pack of 3, size `null`)
  2. Durex Comfort (`ถุงยางอนามัย ดูเร็กซ์ คอมฟอร์ท`, large 56 mm, pack of 3)
- Do not add products, brands, or categories with items.
- Never invent price, review text, review counts, specifications, usage instructions, warnings, ingredients, or claims.
  - Missing `price` -> `null` in data -> UI renders `รอระบุราคา`
  - Missing `usage` / `warnings` -> `null` in data -> UI renders `รอข้อมูลจากผู้จัดจำหน่าย`
  - Missing `sizeMm` -> `null` in data -> hide the size row
- Star ratings: UI demo only when `NEXT_PUBLIC_SHOW_DEMO_RATING` (default `true`), with visible `Demo` badge and tooltip `ตัวอย่างหน้าตา ไม่ใช่รีวิวจริง`, no review count.
- Real payment disabled. Checkout disabled while any item has `price === null` with explanation `ยังไม่เปิดระบบชำระเงิน`.
- Categories (data-driven): `ถุงยางอนามัย`, `เจลหล่อลื่น`, `ชุดตรวจ HIV`, `ผลิตภัณฑ์ทำความสะอาดจุดซ่อนเร้น`, `Sex Box Set`. Empty categories show `เร็ว ๆ นี้`.
- Age rule: purchase actions require age confirmation step. `MIN_PURCHASE_AGE` in `src/config/compliance.ts` is `null` until confirmed. Never state a specific legal age.
- Privacy: minimal data collection, no third-party trackers, no analytics in Phase 1, discreet-packaging messaging.
- Product images: only the two supplied box photos in `./_inbox/durex-kingtex.jpg` and `./_inbox/durex-comfort.jpg`. Do not alter logos.

## A2. Stack
- Next.js (App Router) + TypeScript + Tailwind CSS, npm.
- Fonts via `next/font/google`: `Anuphan` (Thai) and `Plus Jakarta Sans` (Latin).
- 3D: `three`, `@react-three/fiber`, `@react-three/drei`.
- Motion: `gsap` + `ScrollTrigger`, `lenis`. No Framer Motion.
- State: `zustand`.
- Secrets only in `.env.local`; ship `.env.example`.

## A3. Visual design system
- Tokens:
  - `primary`: `#E24C91`
  - `primary-strong`: `#B8296B` (>= 4.5:1 contrast for small pink text and button labels < 18px)
  - `secondary`: `#F8D7E7`
  - `background`: `#FFFAFC`
  - `surface`: `#FFFFFF`
  - `text`: `#252B3A`
  - `muted`: `#85838C` (18px+ or non-essential decorative text only)
  - `border`: `#F0E5EB`
  - `accent-cream`: `#FFF3E6`
  - `accent-beige`: `#F2E4D8`
- Typography: headings weight 500–600, fluid `clamp()`, Thai body line-height >= 1.6, display >= 1.25.
- No emoji as imagery; no stock robot illustrations; open editorial layout (cards only for products and chat).

## A4. Motion rules
- Single persistent fixed WebGL canvas behind DOM content. Mutable scroll progress updated by a single `ScrollTrigger` and read inside `useFrame` (never in React state).
- Animate `transform` and `opacity` only in DOM.
- Respect `prefers-reduced-motion: reduce` and persistent `ลดแอนิเมชัน` toggle.

## A5. Responsive rules
- Mobile (375, 390, 430), Tablet (768, 820, 1024), Desktop (1280, 1440, 1920).
- Use `svh` / `dvh`, never `100vh`. No horizontal overflow. Minimum 44px tap targets (48px primary CTAs).

## A6. Performance & Fallback
- Dynamic-import canvas (`ssr: false`), quality tiers (`high`, `mid`, `low`) + `PerformanceMonitor`, procedural `RoomEnvironment` (no network HDRI), `InstancedMesh`, proper disposal.
- Error boundary + WebGL fallback (`CssFallbackScene`) when WebGL is unavailable or context is lost.

## A7. Working method
- Keep all user-facing copy in `src/content/copy.th.ts`.
- Run `lint`, `typecheck`, and `build` at the end of each phase and report honestly.
