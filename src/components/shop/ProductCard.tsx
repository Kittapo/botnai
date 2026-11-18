"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";
import { PRODUCT_THEMES, PRODUCTS } from "@/data/products";
import { COPY_TH } from "@/content/copy.th";
import { useCartStore } from "@/store/cart";
import { PriceTag } from "@/components/ui/PriceTag";
import { DemoRating } from "@/components/ui/DemoRating";

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export function ProductCard({ product, onOpenDetails }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const theme =
    PRODUCT_THEMES[product.id] ?? PRODUCT_THEMES[PRODUCTS[0].id];

  const handleAddToCart = () => {
    addItem(product.id, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article
      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_4px_20px_-8px_rgba(37,43,58,0.06)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-primary-strong/35 hover:shadow-[0_16px_36px_-12px_rgba(184,41,107,0.14)]"
    >
      {/* Top Image Preview Container */}
      <div
        className="relative flex h-52 w-full items-center justify-center overflow-hidden p-6 transition-colors duration-200 sm:h-60"
        style={{ backgroundColor: theme.ambientTint }}
      >
        {!imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.imageCutout}
            alt={product.nameTh}
            width={200}
            height={200}
            onError={() => setImgError(true)}
            className="max-h-full w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-36 w-32 flex-col items-center justify-center rounded-2xl border border-border/80 bg-surface/90 px-3 text-center">
            <span
              className="font-sans text-xs font-semibold tracking-wider"
              style={{ color: theme.badgeRing }}
            >
              {product.id === "durex-kingtex" ? "KINGTEX" : "COMFORT"}
            </span>
            <span className="mt-1 text-[0.72rem] leading-[1.4] text-[#555261]">
              {COPY_TH.scene04.awaitingImageNotice}
            </span>
          </div>
        )}

        {/* Brand tag pill */}
        <span className="absolute left-3.5 top-3.5 rounded-full bg-surface/90 px-3 py-1 font-sans text-xs font-medium text-text shadow-xs backdrop-blur-xs">
          {product.brand}
        </span>
      </div>

      {/* Product Content Body */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <h3 className="text-base font-semibold text-text leading-[1.4] sm:text-[1.08rem]">
            {product.nameTh}
          </h3>

          <p className="mt-1 font-sans text-xs text-[#5E5B6A] leading-[1.5]">
            {product.nameEn}
          </p>

          <div className="mt-2.5">
            <DemoRating show={product.showDemoRating} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.84rem] text-[#524E5E]">
            <span className="inline-flex rounded-md bg-secondary/50 px-2 py-0.5 font-medium text-primary-strong">
              {COPY_TH.scene04.packFormat(product.packCount)}
            </span>
            {product.sizeMm !== null && (
              <span className="inline-flex rounded-md bg-accent-cream px-2 py-0.5 font-medium text-[#4D4857]">
                {COPY_TH.scene04.sizeLabel} {COPY_TH.scene04.sizeFormat(product.sizeMm)}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Area */}
        <div className="mt-5 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#635F6F] leading-[1.5]">
              {COPY_TH.scene04.priceLabel}
            </span>
            <PriceTag price={product.price} size="md" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-2.5">
            {onOpenDetails ? (
              <button
                type="button"
                data-cursor="interactive"
                onClick={() => onOpenDetails(product)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border bg-surface px-3 py-2 text-[0.84rem] font-medium text-text transition-colors duration-150 hover:bg-secondary/45 hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
              >
                {COPY_TH.shop.viewDetails}
              </button>
            ) : (
              <Link
                href={`/shop/${product.slug}`}
                data-cursor="interactive"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border bg-surface px-3 py-2 text-[0.84rem] font-medium text-text transition-colors duration-150 hover:bg-secondary/45 hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
              >
                {COPY_TH.shop.viewDetails}
              </Link>
            )}

            <button
              type="button"
              data-cursor="interactive"
              onClick={handleAddToCart}
              className={[
                "inline-flex min-h-[44px] items-center justify-center rounded-full px-3 py-2 text-[0.84rem] font-medium text-surface transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong",
                justAdded
                  ? "bg-[#2E7D32]"
                  : "bg-primary-strong hover:bg-[#9D2059] active:bg-[#891B4D]",
              ].join(" ")}
            >
              {justAdded ? COPY_TH.shop.addedToCart : COPY_TH.shop.addToCart}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
