"use client";

import { useEffect, useRef } from "react";
import { COPY_TH } from "@/content/copy.th";
import { useReducedMotion } from "@/lib/reducedMotion";
import { useUiStore } from "@/store/ui";

export function MotionToggle() {
  const reducedMotion = useReducedMotion();
  const toggleForceReducedMotion = useUiStore(
    (s) => s.toggleForceReducedMotion
  );
  const cursorRef = useRef<HTMLDivElement | null>(null);

  // Desktop-only subtle cursor ring (disabled on coarse pointers & reduced motion, Rule B6)
  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const el = cursorRef.current;
    if (!el) return;

    let targetX = -100;
    let targetY = -100;
    let currX = -100;
    let currY = -100;
    let hovered = false;
    let visible = false;
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        currX = targetX;
        currY = targetY;
        visible = true;
      }

      const targetNode = e.target as Element | null;
      hovered = Boolean(
        targetNode?.closest(
          'a, button, [role="button"], input, select, textarea, [data-cursor="interactive"]'
        )
      );
    };

    const onPointerLeave = () => {
      visible = false;
    };

    const render = () => {
      currX += (targetX - currX) * 0.22;
      currY += (targetY - currY) * 0.22;
      const scale = hovered ? 1.65 : 1;
      el.style.opacity = visible ? "1" : "0";
      el.style.transform = `translate3d(${currX - 14}px, ${currY - 14}px, 0) scale(${scale})`;
      rafId = window.requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    rafId = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  return (
    <>
      <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
        <button
          type="button"
          data-cursor="interactive"
          aria-pressed={reducedMotion}
          onClick={toggleForceReducedMotion}
          className={[
            "inline-flex min-h-[44px] items-center gap-2.5 rounded-full border px-4 py-2 text-[0.84rem] font-medium leading-[1.4] shadow-sm backdrop-blur-md transition-colors duration-150",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong",
            reducedMotion
              ? "border-primary-strong bg-primary-strong text-surface"
              : "border-border bg-surface/90 text-text hover:border-primary-strong/45 hover:bg-secondary/55",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={[
              "inline-block h-2.5 w-2.5 rounded-full border",
              reducedMotion
                ? "border-surface bg-surface"
                : "border-primary-strong bg-transparent",
            ].join(" ")}
          />
          <span>{COPY_TH.a11y.motionToggleLabel}</span>
          <span className="sr-only">
            {reducedMotion
              ? COPY_TH.a11y.motionToggleActiveSr
              : COPY_TH.a11y.motionToggleInactiveSr}
          </span>
        </button>
      </div>

      {!reducedMotion && (
        <div
          ref={cursorRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-50 hidden h-7 w-7 rounded-full border border-primary-strong/45 bg-secondary/15 opacity-0 transition-[opacity] duration-150 lg:block"
          style={{ willChange: "transform, opacity" }}
        />
      )}
    </>
  );
}
