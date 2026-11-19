# BLOOMCARE AI — MOTION GUIDELINES & PHYSICS
**Standard:** Kinetic Fluidity & Organic Inertia  
**Physics Engine:** GSAP 3 + Lenis + CSS Hardware-Accelerated Transforms  

---

## 1. EASING CURVES & TIMING

Every animation in BloomCare must feel weighted, organic, and intentional—never mechanical or abrupt.

### 1.1 The Signature Curve: Quartic Out
* **CSS Value:** `cubic-bezier(0.22, 1, 0.36, 1)`
* **GSAP Equivalent:** `"power3.out"` or `"expo.out"`
* **Character:** Starts with crisp momentum and decelerates into an exceptionally soft, luxurious settle.

### 1.2 Duration Standards
| Interaction Tier | Duration | Use Case |
| :--- | :--- | :--- |
| **Micro-interaction** | `200ms – 320ms` | Button hover, icon rotation, tag scale |
| **Pill / Capsule Expand** | `350ms – 480ms` | Voice capsule focus, modal reveal |
| **Scene Transition** | `700ms – 1000ms` | ScrollTrigger narrative reveals, page transitions |
| **Continuous Ambient** | `18s – 36s` | 3D orbital ring rotation, ambient breathing drift |

---

## 2. KINETIC PATTERNS

### 2.1 The Staggered Text Mask Reveal
* Headlines reveal word-by-word or line-by-line using `overflow: hidden` container masks.
* Words translate `Y: 100% ➔ 0%` while opacity transitions `0 ➔ 1`.
* Stagger interval: `0.08s – 0.12s` between words.

### 2.2 3D Orbital Physics
* The ring rotates smoothly with variable drag:
  * Default: `12 – 16 deg/sec` continuous orbit.
  * Pointer Hover: Smooth deceleration into pause (friction coefficient `0.88`).
  * Mouse Parallax: Subtle tilt along X and Y axes (`±12px` to `±16px`) reacting to mouse movement.

### 2.3 Audio-Visual Synchronization
* When a voice capsule is triggered:
  1. Instantaneous optical border bloom (`0ms`).
  2. Four-note ascending crystal chime played via Web Audio synthesizer (`0ms - 220ms`).
  3. Modal smoothly expands (`180ms - 400ms`).
  4. Thai voice synthesis begins speech (`220ms`).

---

## 3. ACCESSIBILITY & REDUCED MOTION

BloomCare treats accessibility as a first-class citizen:
* All scroll triggers and continuous rotations bind to `useSyncReducedMotion()`.
* When `prefers-reduced-motion: reduce` is detected:
  * Lenis smooth scrolling is immediately disabled.
  * Rotating 3D rings and pulsing auras become static, beautifully balanced compositions.
  * Text reveals immediately at 100% opacity without translation.
  * Voice synthesis and modal interactions remain 100% accessible via click/keyboard.
