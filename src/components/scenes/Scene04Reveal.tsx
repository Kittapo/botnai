"use client";

import { useRef, useState } from "react";
import { COPY_TH } from "@/content/copy.th";
import { getProductById, PRODUCT_THEMES, PRODUCTS } from "@/data/products";
import { useReducedMotion } from "@/lib/reducedMotion";
import { SCENE_ANCHOR_IDS } from "@/lib/scroll";
import { useUiStore } from "@/store/ui";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/PriceTag";
import { DemoRating } from "@/components/ui/DemoRating";

export function Scene04Reveal() {
  const reducedMotion = useReducedMotion();
  const activeProductId = useUiStore((s) => s.activeProductId);
  const setActiveProductId = useUiStore((s) => s.setActiveProductId);
  const cycleProduct = useUiStore((s) => s.cycleProduct);
  const webglFallback = useUiStore((s) => s.webglFallback);

  const [thumbFailed, setThumbFailed] = useState<Record<string, boolean>>({});
  const [staticImgFailed, setStaticImgFailed] = useState<Record<string, boolean>>(
    {}
  );

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const activeProduct = getProductById(activeProductId) ?? PRODUCTS[0];
  const activeTheme =
    PRODUCT_THEMES[activeProduct.id] ?? PRODUCT_THEMES[PRODUCTS[0].id];

  // Show a static 2D product stage whenever WebGL is disabled OR reduced motion holds camera in Scene 01
  const showStaticProductStage = webglFallback || reducedMotion;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      cycleProduct(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      cycleProduct(-1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length !== 1) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) {
      return;
    }
    const endTouch = e.changedTouches[0];
    if (!endTouch) return;

    const dx = endTouch.clientX - touchStartXRef.current;
    const dy = endTouch.clientY - touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // Horizontal swipe switches product on mobile (Rule A5 & B5)
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      cycleProduct(dx < 0 ? 1 : -1);
    }
  };

  return (
    <section
      id={SCENE_ANCHOR_IDS[3]}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={[
        "relative z-10 flex w-full items-end lg:items-center",
        reducedMotion ? "py-20 md:py-28" : "min-h-[115svh] py-20 lg:py-28",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end lg:items-center lg:gap-12">
          {/* Left / Upper Pedestal Stage + Estée-style Circular Thumbnail Switcher */}
          <div className="flex flex-col items-center justify-end md:col-span-6 lg:col-span-7">
            {showStaticProductStage ? (
              <div
                className="relative mb-6 flex h-[320px] w-full max-w-[360px] flex-col items-center justify-center rounded-3xl border border-border p-6 transition-colors duration-200 sm:h-[360px]"
                style={{ backgroundColor: activeTheme.ambientTint }}
              >
                {!staticImgFailed[activeProduct.id] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={activeProduct.imageCutout}
                    alt={activeProduct.nameTh}
                    width={240}
                    height={300}
                    onError={() =>
                      setStaticImgFailed((prev) => ({
                        ...prev,
                        [activeProduct.id]: true,
                      }))
                    }
                    className="max-h-[230px] w-auto object-contain drop-shadow-md"
                  />
                ) : (
                  <div className="flex h-[210px] w-[170px] flex-col items-center justify-center rounded-2xl border border-border bg-surface/90 px-4 text-center">
                    <span className="text-[0.95rem] font-semibold text-text leading-[1.5]">
                      {activeProduct.nameTh}
                    </span>
                    <span className="mt-2 text-[0.78rem] text-[#555261] leading-[1.55]">
                      {COPY_TH.scene04.awaitingImageNotice}
                    </span>
                  </div>
                )}
                {/* Static soft CSS pedestal cap */}
                <div
                  aria-hidden="true"
                  className="mt-4 h-4 w-44 rounded-full bg-surface/90 shadow-sm"
                />
              </div>
            ) : (
              /* Open viewport window over the 3D Pedestal & Floating ProductBillboard */
              <div
                aria-hidden="true"
                className="h-[44svh] w-full sm:h-[48svh] md:h-[52svh] lg:h-[56svh]"
              />
            )}

            {/* Estée-style Circular Thumbnail Selector below the Pedestal */}
            <div
              role="radiogroup"
              aria-label={COPY_TH.a11y.productSwitcher}
              onKeyDown={handleKeyDown}
              className="inline-flex items-center gap-4 rounded-full border border-border bg-surface/88 px-4 py-2.5 shadow-sm backdrop-blur-md"
            >
              {PRODUCTS.map((product) => {
                const selected = product.id === activeProduct.id;
                const theme =
                  PRODUCT_THEMES[product.id] ?? PRODUCT_THEMES[PRODUCTS[0].id];
                const shortCode =
                  product.id === "durex-kingtex" ? "KT" : "CF";

                return (
                  <button
                    key={product.id}
                    type="button"
                    role="radio"
                    data-cursor="interactive"
                    aria-checked={selected}
                    aria-label={product.nameTh}
                    onClick={() => setActiveProductId(product.id)}
                    className={[
                      "relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 transition-[transform,border-color,box-shadow] duration-150",
                      "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-strong",
                      selected
                        ? "scale-105 border-primary-strong shadow-[0_0_0_4px_rgba(248,215,231,0.85)]"
                        : "border-border opacity-80 hover:scale-105 hover:opacity-100",
                    ].join(" ")}
                    style={{ backgroundColor: theme.ambientTint }}
                  >
                    {!thumbFailed[product.id] ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={product.imageCutout}
                        alt=""
                        width={44}
                        height={44}
                        onError={() =>
                          setThumbFailed((prev) => ({
                            ...prev,
                            [product.id]: true,
                          }))
                        }
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <span
                        className="font-sans text-[0.8rem] font-semibold tracking-wider"
                        style={{ color: theme.badgeRing }}
                      >
                        {shortCode}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-center text-[0.8125rem] text-[#524E5E] leading-[1.6]">
              <span className="hidden lg:inline">
                {COPY_TH.scene04.interactionHintDesktop}
              </span>
              <span className="lg:hidden">
                {COPY_TH.scene04.interactionHintMobile}
              </span>
            </p>
          </div>

          {/* Right / Bottom Product Information Card (Cards allowed for products per Rule A3) */}
          <div className="md:col-span-6 lg:col-span-5">
            <article
              aria-live="polite"
              className="rounded-3xl border border-border bg-surface/92 p-6 shadow-[0_20px_50px_-24px_rgba(37,43,58,0.14)] backdrop-blur-md sm:p-8"
            >
              <p className="text-[0.84rem] font-medium tracking-[0.04em] text-primary-strong leading-[1.6]">
                {COPY_TH.scene04.eyebrow} · {activeProduct.brand}
              </p>

              <h2 className="mt-2 text-[clamp(1.45rem,2.4vw,2rem)] font-semibold text-text leading-[1.38]">
                {activeProduct.nameTh}
              </h2>

              <p className="mt-1 font-sans text-[0.9rem] text-[#585463] leading-[1.5]">
                {activeProduct.nameEn}
              </p>

              <div className="mt-4">
                <DemoRating show={activeProduct.showDemoRating} />
              </div>

              {/* Strictly data-only specification rows: hide size when null (Rule A1 & B5) */}
              <dl className="mt-6 divide-y divide-border border-y border-border text-[0.95rem]">
                <div className="flex items-center justify-between py-3.5">
                  <dt className="text-[#524E5E] leading-[1.6]">จำนวนบรรจุ</dt>
                  <dd className="font-medium text-text leading-[1.6]">
                    {COPY_TH.scene04.packFormat(activeProduct.packCount)}
                  </dd>
                </div>

                {activeProduct.sizeMm !== null && (
                  <div className="flex items-center justify-between py-3.5">
                    <dt className="text-[#524E5E] leading-[1.6]">
                      {COPY_TH.scene04.sizeLabel}
                    </dt>
                    <dd className="font-medium text-text leading-[1.6]">
                      {COPY_TH.scene04.sizeFormat(activeProduct.sizeMm)}
                    </dd>
                  </div>
                )}

                <div className="flex items-center justify-between py-3.5">
                  <dt className="text-[#524E5E] leading-[1.6]">
                    {COPY_TH.scene04.priceLabel}
                  </dt>
                  <dd>
                    <PriceTag price={activeProduct.price} size="md" />
                  </dd>
                </div>
              </dl>

              <div className="mt-7">
                <Button href="/shop" variant="primary" size="lg" fullWidthMobile>
                  {COPY_TH.scene04.cta}
                </Button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
