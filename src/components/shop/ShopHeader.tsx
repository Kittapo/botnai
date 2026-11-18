"use client";

import { CATEGORIES } from "@/data/categories";
import { COPY_TH } from "@/content/copy.th";
import { useUiStore } from "@/store/ui";

interface ShopHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | "all";
  onSelectCategory: (category: string | "all") => void;
  resultCount: number;
}

export function ShopHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  resultCount,
}: ShopHeaderProps) {
  const shopMode = useUiStore((s) => s.shopMode);
  const setShopMode = useUiStore((s) => s.setShopMode);

  return (
    <div className="w-full space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[clamp(1.75rem,3vw,2.4rem)] font-semibold text-text leading-[1.32]">
            {COPY_TH.shop.title}
          </h1>
          <p className="mt-1.5 max-w-[58ch] text-[0.95rem] text-[#555261] leading-[1.65]">
            {COPY_TH.shop.subtitle}
          </p>
        </div>

        {/* View Mode Switcher (Persists in UI store without resetting search/category) */}
        <div
          role="radiogroup"
          aria-label={COPY_TH.shop.modeSwitchAria}
          className="inline-flex self-start rounded-full border border-border bg-surface p-1 shadow-xs sm:self-auto"
        >
          <button
            type="button"
            role="radio"
            aria-checked={shopMode === "grid"}
            onClick={() => setShopMode("grid")}
            data-cursor="interactive"
            className={[
              "inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-1.5 text-[0.84rem] font-medium transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong",
              shopMode === "grid"
                ? "bg-primary-strong text-surface shadow-xs"
                : "text-text hover:bg-secondary/45",
            ].join(" ")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            <span>{COPY_TH.shop.modeGrid}</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={shopMode === "3d"}
            onClick={() => setShopMode("3d")}
            data-cursor="interactive"
            className={[
              "inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-1.5 text-[0.84rem] font-medium transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong",
              shopMode === "3d"
                ? "bg-primary-strong text-surface shadow-xs"
                : "text-text hover:bg-secondary/45",
            ].join(" ")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>{COPY_TH.shop.mode3D}</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full max-w-[640px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#757182]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={COPY_TH.shop.searchPlaceholder}
          aria-label={COPY_TH.shop.searchPlaceholder}
          className="w-full rounded-2xl border border-border bg-surface py-3.5 pl-11 pr-11 text-[0.95rem] text-text placeholder:text-[#888494] shadow-xs transition-colors duration-150 focus:border-primary-strong focus:outline-hidden focus:ring-2 focus:ring-secondary"
        />

        {searchQuery.trim().length > 0 && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label={COPY_TH.shop.clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#757182] hover:text-text"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Category Filter Chips (Data-driven, first visit shows 'all') */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div className="no-scrollbar -mx-5 flex flex-nowrap items-center gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          <button
            type="button"
            onClick={() => onSelectCategory("all")}
            data-cursor="interactive"
            className={[
              "whitespace-nowrap rounded-full px-4 py-2 text-[0.875rem] font-medium transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong",
              selectedCategory === "all"
                ? "bg-secondary text-primary-strong font-semibold"
                : "border border-border bg-surface text-text hover:bg-secondary/40",
            ].join(" ")}
          >
            {COPY_TH.shop.allCategories}
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                data-cursor="interactive"
                className={[
                  "whitespace-nowrap rounded-full px-4 py-2 text-[0.875rem] font-medium transition-colors duration-150",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong",
                  isSelected
                    ? "bg-secondary text-primary-strong font-semibold"
                    : "border border-border bg-surface text-text hover:bg-secondary/40",
                ].join(" ")}
              >
                {cat.nameTh}
              </button>
            );
          })}
        </div>

        <span className="hidden whitespace-nowrap text-xs text-[#6B6777] sm:inline-block">
          {COPY_TH.shop.productCount(resultCount)}
        </span>
      </div>
    </div>
  );
}
