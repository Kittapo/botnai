"use client";

import { useState } from "react";
import { SHOW_DEMO_RATING } from "@/config/compliance";
import { COPY_TH } from "@/content/copy.th";

interface DemoRatingProps {
  show?: boolean;
  className?: string;
}

export function DemoRating({ show = true, className = "" }: DemoRatingProps) {
  const [openTooltip, setOpenTooltip] = useState(false);

  if (!SHOW_DEMO_RATING || !show) {
    return null;
  }

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        data-cursor="interactive"
        onClick={() => setOpenTooltip((prev) => !prev)}
        onMouseEnter={() => setOpenTooltip(true)}
        onMouseLeave={() => setOpenTooltip(false)}
        onFocus={() => setOpenTooltip(true)}
        onBlur={() => setOpenTooltip(false)}
        title={COPY_TH.productFallbacks.demoTooltip}
        aria-label={`${COPY_TH.productFallbacks.demoBadge}: ${COPY_TH.productFallbacks.demoTooltip}`}
        className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-surface/85 px-3 py-1.5 text-left transition-colors duration-150 hover:border-primary-strong/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
      >
        <span className="inline-flex items-center gap-0.5 text-primary" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((index) => (
            <svg
              key={index}
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill={index < 4 ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M10 2.2l2.28 4.62 5.1.74-3.69 3.6.87 5.08L10 13.84l-4.56 2.4.87-5.08-3.69-3.6 5.1-.74L10 2.2z" />
            </svg>
          ))}
        </span>
        <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[0.75rem] font-semibold tracking-wide text-primary-strong">
          {COPY_TH.productFallbacks.demoBadge}
        </span>
      </button>

      {openTooltip && (
        <span
          role="status"
          className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 w-max max-w-[240px] rounded-xl border border-border bg-surface px-3 py-2 text-[0.8125rem] leading-[1.55] text-text shadow-md"
        >
          {COPY_TH.productFallbacks.demoTooltip}
        </span>
      )}
    </div>
  );
}
