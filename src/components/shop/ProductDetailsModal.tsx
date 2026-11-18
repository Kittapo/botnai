"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { COPY_TH } from "@/content/copy.th";
import { useCartStore } from "@/store/cart";
import { PriceTag } from "@/components/ui/PriceTag";
import { DemoRating } from "@/components/ui/DemoRating";
import { Product3DViewer } from "@/components/shop/Product3DViewer";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailsModal({
  product,
  onClose,
}: ProductDetailsModalProps) {
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!product) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product.id, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs sm:p-6"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-[620px] overflow-y-auto rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={COPY_TH.shop.closeModal}
          data-cursor="interactive"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text transition-colors hover:bg-secondary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong sm:right-6 sm:top-6"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Interactive 3D Box Packaging Model */}
        <div className="w-full">
          <Product3DViewer
            product={product}
            height="320px"
            showHint={true}
          />
        </div>

        <div className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-strong">
            {product.brand}
          </span>
          <h2
            id="product-details-title"
            className="mt-1 text-[clamp(1.4rem,2.2vw,1.85rem)] font-semibold text-text leading-[1.35]"
          >
            {product.nameTh}
          </h2>
          <p className="mt-1 font-sans text-xs text-[#5D5A68]">
            {product.nameEn}
          </p>

          <div className="mt-3.5">
            <DemoRating show={product.showDemoRating} />
          </div>

          {/* Specifications Table */}
          <div className="mt-6 border-t border-border pt-5">
            <h3 className="text-sm font-semibold text-text">
              {COPY_TH.shop.specHeading}
            </h3>
            <dl className="mt-3 divide-y divide-border border-y border-border text-[0.92rem]">
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-[#5B5768]">{COPY_TH.shop.packLabel}</dt>
                <dd className="font-medium text-text">
                  {COPY_TH.scene04.packFormat(product.packCount)}
                </dd>
              </div>

              {product.sizeMm !== null && (
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-[#5B5768]">{COPY_TH.scene04.sizeLabel}</dt>
                  <dd className="font-medium text-text">
                    {COPY_TH.scene04.sizeFormat(product.sizeMm)}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between py-2.5">
                <dt className="text-[#5B5768]">{COPY_TH.scene04.priceLabel}</dt>
                <dd>
                  <PriceTag price={product.price} size="sm" />
                </dd>
              </div>
            </dl>
          </div>

          {/* Honest Notice & Fallbacks (Rule A1) */}
          <div className="mt-5 space-y-2 rounded-2xl bg-accent-cream/60 p-4 text-xs text-[#575363] leading-[1.6]">
            <p className="font-semibold text-text">
              {COPY_TH.shop.noticeHeading}
            </p>
            <p>
              คำแนะนำและการใช้งาน:{" "}
              {product.usage ?? COPY_TH.productFallbacks.infoPending}
            </p>
            <p>
              คำเตือน:{" "}
              {product.warnings && product.warnings.length > 0
                ? product.warnings.join(", ")
                : COPY_TH.productFallbacks.infoPending}
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}
