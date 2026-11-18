"use client";

import type { Product } from "@/data/products";
import { COPY_TH } from "@/content/copy.th";
import { ProductCard } from "@/components/shop/ProductCard";

interface ShopGridProps {
  products: readonly Product[];
  searchQuery: string;
  isCategoryEmpty: boolean;
  onOpenDetails?: (product: Product) => void;
}

export function ShopGrid({
  products,
  searchQuery,
  isCategoryEmpty,
  onOpenDetails,
}: ShopGridProps) {
  // Empty category state (data-driven categories with 0 items, Rule A1)
  if (isCategoryEmpty) {
    return (
      <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/60 p-8 text-center sm:p-12">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-cream text-primary-strong">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-text">
          {COPY_TH.shop.emptyCategoryTitle}
        </h3>
        <p className="mt-2 max-w-[42ch] text-[0.92rem] text-[#5B5768] leading-[1.65]">
          {COPY_TH.shop.emptyCategoryBody}
        </p>
      </div>
    );
  }

  // Empty search results state
  if (products.length === 0 && searchQuery.trim().length > 0) {
    return (
      <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/60 p-8 text-center sm:p-12">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary/70 text-primary-strong">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-text">
          {COPY_TH.shop.emptySearchTitle}
        </h3>
        <p className="mt-2 max-w-[42ch] text-[0.92rem] text-[#5B5768] leading-[1.65]">
          {COPY_TH.shop.emptySearchBody}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  );
}
