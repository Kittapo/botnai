export type QualityTier = "high" | "mid" | "low";

export interface QualityConfig {
  tier: QualityTier;
  dpr: [number, number];
  instanceCount: number;
  enableTransmission: boolean;
  enableShadows: boolean;
  petalSegments: [number, number];
}

export const QUALITY_CONFIGS: Record<QualityTier, QualityConfig> = {
  high: {
    tier: "high",
    dpr: [1, 2],
    instanceCount: 40,
    enableTransmission: true,
    enableShadows: true,
    petalSegments: [28, 38],
  },
  mid: {
    tier: "mid",
    dpr: [1, 1.5],
    instanceCount: 20,
    enableTransmission: false,
    enableShadows: true,
    petalSegments: [20, 26],
  },
  low: {
    tier: "low",
    dpr: [1, 1],
    instanceCount: 8,
    enableTransmission: false,
    enableShadows: false,
    petalSegments: [14, 18],
  },
};

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

export function detectInitialQualityTier(): QualityTier {
  if (typeof window === "undefined") return "mid";

  const nav = window.navigator as NavigatorWithMemory;
  const memory = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency ?? 4;
  const isCoarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const width = window.innerWidth;

  if (memory <= 2 || cores <= 2 || (isCoarsePointer && width < 400 && memory <= 4)) {
    return "low";
  }

  if (isCoarsePointer || width < 900 || memory <= 4 || cores <= 4) {
    return "mid";
  }

  return "high";
}

export function stepDownQualityTier(current: QualityTier): QualityTier {
  if (current === "high") return "mid";
  return "low";
}

/**
 * Runs a short (~18 frames) non-blocking rAF probe to measure actual frame pacing
 * and steps down quality tier if the device struggles right out of the gate.
 */
export function probeFrameTimeTier(
  initialTier: QualityTier,
  onResolved: (tier: QualityTier) => void
): () => void {
  if (typeof window === "undefined" || initialTier === "low") {
    return () => {};
  }

  let rafId = 0;
  let cancelled = false;
  const deltas: number[] = [];
  let lastTime = performance.now();
  let frameCount = 0;
  const totalProbeFrames = 18;

  const tick = (now: number) => {
    if (cancelled) return;

    if (document.visibilityState === "visible") {
      const dt = now - lastTime;
      // Ignore first 2 warm-up frames and tab-switch outliers
      if (frameCount >= 2 && dt > 0 && dt < 250) {
        deltas.push(dt);
      }
      frameCount += 1;
    }
    lastTime = now;

    if (frameCount < totalProbeFrames) {
      rafId = window.requestAnimationFrame(tick);
      return;
    }

    if (deltas.length >= 6) {
      const sorted = [...deltas].sort((a, b) => a - b);
      const medianDt = sorted[Math.floor(sorted.length / 2)];
      if (medianDt > 34) {
        onResolved("low");
      } else if (medianDt > 22 && initialTier === "high") {
        onResolved("mid");
      }
    }
  };

  rafId = window.requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    window.cancelAnimationFrame(rafId);
  };
}

export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false });
    if (!gl) return false;
    const loseExt = gl.getExtension("WEBGL_lose_context");
    loseExt?.loseContext();
    return true;
  } catch {
    return false;
  }
}
