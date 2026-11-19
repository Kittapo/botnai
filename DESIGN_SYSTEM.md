# BLOOMCARE AI — DESIGN SYSTEM SPECIFICATION
**Version:** 2.0.0 (Award-Winning Editorial Wellness Standard)  
**Concept:** *A Living Digital Sanctuary (วิหารดิจิทัลแห่งสุขภาวะ)*  
**Status:** Living Document  

---

## 1. BRAND IDENTITY & ARTISTIC ESSENCE

BloomCare is designed as an intimate, safe, and dignified digital sanctuary for sexual and intimate wellness education, empathetic AI consultation, and discreet health commerce.

### Core Brand Pillars:
* **Sanctuary (พื้นที่ปลอดภัย):** Warm, gentle, non-judgmental, serene, and embracing.
* **Editorial Elegance (ความสง่างามระดับสิ่งพิมพ์ลักชัวรี):** Oversized typography, deliberate negative space, asymmetric balance, and refined proportion.
* **Physical Authenticity (มิติที่สัมผัสได้จริง):** Believable studio lighting, optical prismatic glass, soft contact shadows, and organic depth.
* **Technological Empathy (เทคโนโลยีที่เข้าใจมนุษย์):** Living 3D character companion (Lumi), natural Thai voice synthesis, and responsive micro-interactions.

---

## 2. COLOR SYSTEM & DESIGN TOKENS

The color system departs from cold clinical blues or synthetic hyper-saturated purples, grounding itself in organic wellness tones:

### 2.1 The Sacred Palette
| Token Name | Hex Code | Purpose & Application |
| :--- | :--- | :--- |
| `--color-canvas-ivory` | `#FAF7F2` | Primary breathing space; warm ivory, soft daylight feel |
| `--color-canvas-fog` | `#F3ECF8` | Morning lilac mist; atmospheric depth and subtle layering |
| `--color-ink-deep` | `#24112E` | High-contrast editorial ink; deep plum-black for headlines |
| `--color-ink-forest` | `#1A2C24` | Secondary editorial ink; grounding deep forest green |
| `--color-ink-muted` | `#664A73` | Subtitles, editorial metadata, and supporting descriptions |
| `--color-lavender-soft` | `#E8D5F5` | Dusty lavender aura; gentle celestial halo and caustics |
| `--color-amethyst-royal`| `#8B5CF6` | Primary interactive brand color; voice indicators & active state |
| `--color-sage-emerald` | `#059669` | Trust & scientific validation; security seals and verified badges |
| `--color-peach-sunlit` | `#FED7AA` | Warm organic accent; morning sunlit glow and highlights |
| `--color-cream-pure` | `#FFFDF9` | Pure illuminated surface; pristine card highlights |

### 2.2 Translucent Glass Tokens
* **Prismatic Glass Surface:** `rgba(255, 255, 255, 0.62)` with `backdrop-filter: blur(24px)`
* **Glass Border:** `1.5px solid rgba(255, 255, 255, 0.85)`
* **Prismatic Specular Rim:** `inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 12px 36px rgba(110, 50, 160, 0.16)`

---

## 3. TYPOGRAPHIC HIERARCHY

BloomCare combines high-fashion classical serif display with crisp, legible modern Thai and Latin sans-serif typography.

### 3.1 Type Families
* **Display Serif:** `'Playfair Display', Georgia, Cambria, serif` (Editorial authority, emotion, grandeur)
* **Thai Body & Headings:** `'Anuphan', system-ui, sans-serif` (Warm, human, highly legible Thai font)
* **Latin Technical & UI:** `'Plus Jakarta Sans', system-ui, sans-serif` (Clean geometric clarity)

### 3.2 Scale & Hierarchy
| Level | Font Family | Size (Fluid Desktop / Mobile) | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | Playfair Display | `clamp(3.5rem, 7vw, 6.25rem)` | 700 / Bold | 1.06 | `-0.02em` |
| **Hero Subtitle** | Playfair Display | `clamp(1.75rem, 3.2vw, 2.85rem)` | 500 / Medium | 1.22 | `-0.01em` |
| **Section Title** | Playfair Display | `clamp(2rem, 3.8vw, 3.25rem)` | 600 / SemiBold | 1.20 | `-0.01em` |
| **Editorial Index**| Plus Jakarta Sans | `0.75rem - 0.875rem` | 700 / Bold | 1.00 | `+0.12em` |
| **Lead Body** | Anuphan / Jakarta | `1.125rem - 1.25rem` | 400 / Regular | 1.70 | `normal` |
| **Standard Body** | Anuphan / Jakarta | `0.9375rem - 1.0rem` | 400 / Regular | 1.65 | `normal` |
| **Micro Caption** | Anuphan / Jakarta | `0.8125rem` | 500 / Medium | 1.50 | `+0.02em` |

---

## 4. SPACING, GRID & ASYMMETRIC COMPOSITION

* **Container Max Width:** `1440px` (fluid with `px-5 sm:px-8 lg:px-12`)
* **Asymmetric Baseline:**
  * 60/40 Split between Left Editorial Headline and Right 3D Visual Stage
  * Intentional overlap of floating optical capsules across section boundaries
  * Ample breathing room (`min-h-[100svh]` per major act)
* **Border Radii:**
  * Fluid Organic Pills: `9999px` (Rounded Full)
  * Sculptural Surfaces: `28px – 36px` (`rounded-3xl` / `rounded-[2rem]`)

---

## 5. COMPONENT SYSTEM GUIDELINES

1. **Voice Capsules (แคปซูลเสียงกระจกแก้ว):**
   * Tactile rounded pills with micro-metadata icon, category tag, and Thai title.
   * Floating along 3D elliptical orbits with individual depth sorting (`translateZ`).
   * Multi-sensory feedback: Hover gleam + Web Audio chime + Web Speech Thai narration.
2. **Buttons & CTAs:**
   * High-tactile frosted glass pills with specular edge highlight.
   * Subtle kinetic translation of arrow indicator on hover (`➔`).
3. **Lumi AI Companion Card / Stage:**
   * Never just a flat image; surrounded by volumetric lighting aura and floating star companion.
   * Ambient breathing float and mouse-parallax responsiveness.
