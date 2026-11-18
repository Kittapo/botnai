"use client";

import { useEffect } from "react";
import { useUiStore } from "@/store/ui";

export function useReducedMotion(): boolean {
  const forceReducedMotion = useUiStore((s) => s.forceReducedMotion);
  const systemReducedMotion = useUiStore((s) => s.systemReducedMotion);
  return forceReducedMotion || systemReducedMotion;
}

/**
 * Synchronizes OS-level `prefers-reduced-motion: reduce` and the user's
 * persistent "ลดแอนิเมชัน" toggle with Zustand and `<html data-reduced-motion>`.
 */
export function useSyncReducedMotion(): boolean {
  const forceReducedMotion = useUiStore((s) => s.forceReducedMotion);
  const systemReducedMotion = useUiStore((s) => s.systemReducedMotion);
  const setSystemReducedMotion = useUiStore((s) => s.setSystemReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setSystemReducedMotion]);

  const effectiveReduced = forceReducedMotion || systemReducedMotion;

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.reducedMotion = effectiveReduced
      ? "true"
      : "false";
  }, [effectiveReduced]);

  return effectiveReduced;
}
