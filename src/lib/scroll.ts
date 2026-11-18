import type Lenis from "lenis";

/**
 * Mutable scroll & pointer state read directly inside R3F's useFrame.
 * Never store continuous scroll progress in React state (Rule A4).
 */
export const scrollState = {
  /** Normalized master scroll progress [0..1] */
  progress: 0,
  /** Damped progress [0..1] smoothed per frame */
  smoothed: 0,
  /** Scroll velocity estimate */
  velocity: 0,
  /** Normalized pointer coordinates [-1..1] for subtle desktop parallax */
  pointerX: 0,
  pointerY: 0,
  /** Intro load-sequence unfurl progress [0..1] */
  introUnfurl: 1,
};

export const SCENE_RANGES = {
  scene01: { start: 0.0, end: 0.18 },
  scene02: { start: 0.18, end: 0.4 },
  scene03: { start: 0.4, end: 0.62 },
  scene04: { start: 0.62, end: 0.85 },
  closing: { start: 0.85, end: 1.0 },
} as const;

export const SCENE_ANCHOR_IDS = [
  "scene-01-hero",
  "scene-02-discover",
  "scene-03-philosophy",
  "scene-04-reveal",
] as const;

let activeLenisInstance: Lenis | null = null;

export function setActiveLenis(instance: Lenis | null): void {
  activeLenisInstance = instance;
}

export function getActiveLenis(): Lenis | null {
  return activeLenisInstance;
}

export function scrollToSceneId(id: string, reducedMotion: boolean): void {
  if (typeof document === "undefined") return;
  const target = document.getElementById(id);
  if (!target) return;

  if (!reducedMotion && activeLenisInstance) {
    activeLenisInstance.scrollTo(target, { duration: 1.1 });
  } else {
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }
}

export function clamp01(value: number): number {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function rangeProgress(p: number, start: number, end: number): number {
  if (end <= start) return 0;
  return clamp01((p - start) / (end - start));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function getSceneIndexFromProgress(p: number): number {
  if (p < SCENE_RANGES.scene02.start) return 0;
  if (p < SCENE_RANGES.scene03.start) return 1;
  if (p < SCENE_RANGES.scene04.start) return 2;
  return 3;
}
