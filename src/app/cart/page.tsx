"use client";

import { COPY_TH } from "@/content/copy.th";
import { getProductById } from "@/data/products";
import { useCartStore } from "@/store/cart";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/PriceTag";

export default function CartPlaceholderPage() {
  const items = useCartStore((s) => s.items);
  const hasNullPrice = useCartStore((s) => s.hasNullPriceItem());

  return (
    <div className="flex min-h-[100svh] flex-col justify-between bg-background pt-24">
      <main
        id="main-content"
        className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-12 sm:px-8 lg:px-12"
      >
        <div className="max-w-[720px]">
          <span className="inline-flex rounded-full bg-secondary/75 px-3.5 py-1 text-[0.8125rem] font-medium text-primary-strong">
            {COPY_TH.placeholders.phaseBadge}
          </span>

          <h1 className="mt-4 text-[clamp(1.85rem,3.2vw,2.65rem)] font-semibold text-text leading-[1.35]">
            {COPY_TH.placeholders.cart.title}
          </h1>

          <p className="mt-3 text-[1rem] text-[#45424F] leading-[1.72]">
            {COPY_TH.placeholders.cart.description}
          </p>

          <div className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            {items.length === 0 ? (
              <p className="text-[1rem] text-[#524E5E] leading-[1.65]">
                {COPY_TH.placeholders.cart.empty}
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((item) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  return (
                    <li
                      key={item.productId}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div>
                        <p className="font-medium text-text leading-[1.5]">
                          {product.nameTh}
                        </p>
                        <p className="text-[0.875rem] text-[#555261]">
                          × {item.quantity}
                        </p>
                      </div>
                      <PriceTag price={product.price} size="sm" />
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <span className="font-medium text-text">
                {COPY_TH.placeholders.cart.subtotalLabel}
              </span>
              <PriceTag price={hasNullPrice ? null : 0} />
            </div>

            <div className="mt-6 space-y-2">
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled
                className="w-full"
              >
                {COPY_TH.placeholders.cart.checkoutButton}
              </Button>
              <p className="text-center text-[0.875rem] text-[#524E5E] leading-[1.6]">
                {COPY_TH.productFallbacks.checkoutDisabled}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Button href="/" variant="secondary" size="md">
              {COPY_TH.nav.backHome}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
