"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/reducedMotion";

export function AwwwardsAtmosphere() {
  const reducedMotion = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [cursorLabel, setCursorLabel] = useState<string>("");
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;
    // Only activate custom fluid cursor on fine-pointer (desktop mouse) devices
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest(
        'a, button, [role="button"], [data-cursor="interactive"], [data-cursor-label]'
      ) as HTMLElement | null;

      if (interactiveEl) {
        setIsHovering(true);
        const label = interactiveEl.getAttribute("data-cursor-label") || "";
        setCursorLabel(label);
      } else {
        setIsHovering(false);
        setCursorLabel("");
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const tick = () => {
      // Smooth spring-like lerp for the outer ring
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  return (
    <>
      {/* 1. SUBTLE FINE-ART FILM GRAIN OVERLAY (Removes flat digital plastic feel) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] opacity-[0.032] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
        }}
      />

      {/* 2. FLUID EDITORIAL MAGNETIC CURSOR (Desktop Only, Never Blocks Clicks) */}
      {!reducedMotion && (
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed inset-0 z-[95] hidden md:block transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Trailing Optical Ring / Lens */}
          <div
            ref={ringRef}
            className="fixed left-0 top-0 flex items-center justify-center rounded-full transition-[width,height,background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: cursorLabel ? "76px" : isHovering ? "48px" : "30px",
              height: cursorLabel ? "76px" : isHovering ? "48px" : "30px",
              backgroundColor: cursorLabel
                ? "rgba(255, 255, 255, 0.78)"
                : isHovering
                  ? "rgba(139, 92, 246, 0.12)"
                  : "transparent",
              backdropFilter: cursorLabel ? "blur(12px)" : "none",
              border: cursorLabel
                ? "1px solid rgba(255, 255, 255, 0.95)"
                : isHovering
                  ? "1.5px solid rgba(109, 40, 217, 0.55)"
                  : "1px solid rgba(109, 40, 217, 0.35)",
              boxShadow: cursorLabel
                ? "0 8px 24px rgba(109, 40, 217, 0.18)"
                : "none",
            }}
          >
            {cursorLabel && (
              <span className="editorial-tag text-[9px] font-bold tracking-[0.14em] text-[#24112E]">
                {cursorLabel}
              </span>
            )}
          </div>

          {/* Crisp Center Star Dot */}
          <div
            ref={dotRef}
            className="fixed left-0 top-0 rounded-full transition-opacity duration-200"
            style={{
              width: "5px",
              height: "5px",
              backgroundColor: "#6D28D9",
              opacity: cursorLabel ? 0 : 0.85,
            }}
          />
        </div>
      )}
    </>
  );
}
