"use client";

import { useRef, useState } from "react";
import type { Product } from "@/data/products";
import { PRODUCT_THEMES, PRODUCTS } from "@/data/products";
import { COPY_TH } from "@/content/copy.th";
import { useCartStore } from "@/store/cart";
import { PriceTag } from "@/components/ui/PriceTag";
import { DemoRating } from "@/components/ui/DemoRating";
import { Product3DViewer } from "@/components/shop/Product3DViewer";

interface Shop3DProps {
  products: readonly Product[];
  selectedProduct: Product;
  onSelectProduct: (product: Product) => void;
  onOpenDetails?: (product: Product) => void;
  isCategoryEmpty: boolean;
}

export function Shop3D({
  products,
  selectedProduct,
  onSelectProduct,
  onOpenDetails,
  isCategoryEmpty,
}: Shop3DProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const handleAddToCart = () => {
    addItem(selectedProduct.id, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  const currentIndex = products.findIndex((p) => p.id === selectedProduct.id);

  const handlePrev = () => {
    if (products.length <= 1) return;
    const prevIdx =
      (currentIndex - 1 + products.length) % products.length;
    onSelectProduct(products[prevIdx]);
  };

  const handleNext = () => {
    if (products.length <= 1) return;
    const nextIdx = (currentIndex + 1) % products.length;
    onSelectProduct(products[nextIdx]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 42) {
      if (dx < 0) handleNext();
      else handlePrev();
    }
  };

  if (isCategoryEmpty) {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/60 p-8 text-center sm:p-12">
        <h3 className="text-lg font-semibold text-text">
          {COPY_TH.shop.emptyCategoryTitle}
        </h3>
        <p className="mt-2 text-[0.92rem] text-[#5B5768]">
          {COPY_TH.shop.emptyCategoryBody}
        </p>
      </div>
    );
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="outline-hidden"
    >
      <div className="grid grid-cols-1 gap-8 rounded-3xl border border-border bg-surface/85 p-6 backdrop-blur-md sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-10">
        {/* Left Column: 3D Pedestal Stage + Navigation Controls */}
        <div className="flex flex-col items-center justify-center lg:col-span-7">
          <div className="relative w-full max-w-[520px]">
            {/* Real 3D Physical Box Model */}
            <Product3DViewer
              product={selectedProduct}
              height={440}
              showHint={false}
              className="w-full"
            />

            {/* Next / Prev Floating Arrow Controls */}
            {products.length > 1 && (
              <>
                <button
                  type="button"
                  data-cursor="interactive"
                  onClick={handlePrev}
                  aria-label={COPY_TH.a11y.previousProduct}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/90 text-text shadow-xs backdrop-blur-xs transition-colors hover:bg-secondary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <button
                  type="button"
                  data-cursor="interactive"
                  onClick={handleNext}
                  aria-label={COPY_TH.a11y.nextProduct}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/90 text-text shadow-xs backdrop-blur-xs transition-colors hover:bg-secondary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Product Thumbnails Switcher below Pedestal */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {products.map((product) => {
              const isSelected = product.id === selectedProduct.id;
              const pTheme =
                PRODUCT_THEMES[product.id] ?? PRODUCT_THEMES[PRODUCTS[0].id];
              return (
                <button
                  key={product.id}
                  type="button"
                  data-cursor="interactive"
                  aria-label={product.nameTh}
                  aria-pressed={isSelected}
                  onClick={() => onSelectProduct(product)}
                  className={[
                    "relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 transition-[transform,border-color,box-shadow] duration-150",
                    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-strong",
                    isSelected
                      ? "scale-105 border-primary-strong shadow-[0_0_0_4px_rgba(248,215,231,0.85)]"
                      : "border-border opacity-75 hover:scale-105 hover:opacity-100",
                  ].join(" ")}
                  style={{ backgroundColor: pTheme.ambientTint }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.imageCutout}
                    alt=""
                    width={44}
                    height={44}
                    className="h-10 w-10 object-contain"
                  />
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-center text-xs text-[#635F6F] leading-[1.6]">
            {COPY_TH.shop.view3DHint}
          </p>
        </div>

        {/* Right Column: Slide-in / Persistent Info Panel */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-xs sm:p-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-strong">
              {selectedProduct.brand}
            </span>

            <h2 className="mt-1 text-[clamp(1.4rem,2.2vw,1.9rem)] font-semibold text-text leading-[1.35]">
              {selectedProduct.nameTh}
            </h2>

            <p className="mt-1 font-sans text-xs text-[#5D5A68]">
              {selectedProduct.nameEn}
            </p>

            <div className="mt-4">
              <DemoRating show={selectedProduct.showDemoRating} />
            </div>

            <dl className="mt-6 divide-y divide-border border-y border-border text-[0.95rem]">
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#5B5768]">
                  {COPY_TH.shop.packLabel}
                </dt>
                <dd className="font-medium text-text">
                  {COPY_TH.scene04.packFormat(selectedProduct.packCount)}
                </dd>
              </div>

              {selectedProduct.sizeMm !== null && (
                <div className="flex items-center justify-between py-3">
                  <dt className="text-[#5B5768]">
                    {COPY_TH.scene04.sizeLabel}
                  </dt>
                  <dd className="font-medium text-text">
                    {COPY_TH.scene04.sizeFormat(selectedProduct.sizeMm)}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between py-3">
                <dt className="text-[#5B5768]">
                  {COPY_TH.scene04.priceLabel}
                </dt>
                <dd>
                  <PriceTag price={selectedProduct.price} size="md" />
                </dd>
              </div>
            </dl>

            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                data-cursor="interactive"
                onClick={handleAddToCart}
                className={[
                  "inline-flex min-h-[48px] w-full items-center justify-center rounded-full font-medium text-surface shadow-xs transition-colors duration-150",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong",
                  justAdded
                    ? "bg-[#2E7D32]"
                    : "bg-primary-strong hover:bg-[#9D2059] active:bg-[#891B4D]",
                ].join(" ")}
              >
                {justAdded ? COPY_TH.shop.addedToCart : COPY_TH.shop.addToCart}
              </button>

              {onOpenDetails && (
                <button
                  type="button"
                  data-cursor="interactive"
                  onClick={() => onOpenDetails(selectedProduct)}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-border bg-surface text-[0.92rem] font-medium text-text transition-colors duration-150 hover:bg-secondary/45 hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
                >
                  {COPY_TH.shop.viewDetails}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
