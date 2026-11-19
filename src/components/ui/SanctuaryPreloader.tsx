"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/reducedMotion";

export function SanctuaryPreloader() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [lifting, setLifting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;
    if (sessionStorage.getItem("bloomcare_sanctuary_entered") === "1") return;

    setVisible(true);
    sessionStorage.setItem("bloomcare_sanctuary_entered", "1");

    const start = performance.now();
    const duration = 950;
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // Smooth cubic ease-out progress
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setLifting(true);
          setTimeout(() => setVisible(false), 750);
        }, 120);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        lifting ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #FAF7F2 0%, #EFE1FA 52%, #DEC7F2 100%)",
      }}
    >
      {/* Subtle Astrolabe Star */}
      <div className="mb-4 text-2xl text-[#6D28D9]/70 animate-spin-slow">✦</div>

      {/* Editorial Wordmark */}
      <div className="font-display-luxury text-5xl sm:text-7xl font-semibold tracking-[-0.03em] text-[#24112E]">
        BloomCare
      </div>

      <p className="mt-2 editorial-tag text-[10px] tracking-[0.26em] text-[#664A73]">
        A LIVING DIGITAL SANCTUARY
      </p>

      {/* Hairline Progress Bar & Counter */}
      <div className="mt-8 w-56 sm:w-72">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-[#5C3275] mb-2">
          <span>ENTERING SANCTUARY</span>
          <span>{String(progress).padStart(3, "0")}%</span>
        </div>
        <div className="h-[1.5px] w-full bg-[#24112E]/15 overflow-hidden rounded-full">
          <div
            className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#6D28D9] to-[#F59E0B] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
