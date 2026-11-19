"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/store/ui";

const CHAPTERS = [
  { num: "01", title: "LIVING SANCTUARY" },
  { num: "02", title: "THE SILENT QUESTION" },
  { num: "03", title: "CORE PHILOSOPHY" },
  { num: "04", title: "PRODUCT EXHIBITION" },
];

export function ScrollProgressHUD() {
  const pathname = usePathname();
  const activeSceneIndex = useUiStore((s) => s.activeSceneIndex);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const updateProgress = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const pct = Math.min(Math.max((scrollTop / maxScroll) * 100, 0), 100);

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${pct / 100})`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  const currentChapter = CHAPTERS[activeSceneIndex] ?? CHAPTERS[0];

  return (
    <>
      {/* 1. Razor-Thin Top Luminous Scroll Progress Ribbon */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 right-0 z-[80] h-[2.5px] bg-white/25"
      >
        <div
          ref={barRef}
          className="h-full w-full origin-left will-change-transform"
          style={{
            transform: "scaleX(0)",
            background:
              "linear-gradient(90deg, #8B5CF6 0%, #C084FC 55%, #FDBA74 100%)",
          }}
        />
      </div>

      {/* 2. Floating Desktop Editorial Chapter Indicator (Homepage Only) */}
      {pathname === "/" && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-6 left-6 z-40 hidden lg:flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/85 shadow-[0_8px_25px_rgba(90,30,130,0.1)] transition-all duration-300"
        >
          <span className="font-display-luxury italic text-base font-semibold text-[#6D28D9] leading-none">
            {currentChapter.num}
          </span>
          <span className="h-3 w-[1px] bg-[#6D28D9]/30" />
          <span className="editorial-tag text-[9px] tracking-[0.18em] text-[#24112E]">
            {currentChapter.title}
          </span>
        </div>
      )}
    </>
  );
}
