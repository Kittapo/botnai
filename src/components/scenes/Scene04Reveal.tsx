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
        "relative z-10 flex w-full items-end lg:items-center overflow-hidden",
        reducedMotion ? "py-24 md:py-32" : "min-h-[115svh] py-24 lg:py-32",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
        {/* Section Editorial Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="editorial-tag text-[11px] font-bold text-[#6D28D9] bg-white/70 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/90 shadow-sm">
              04 // EXHIBITION SANCTUARY
            </span>
            <span className="text-xs text-[#664A73] font-medium tracking-wider uppercase">
              VETTED & DISCREET SELECTION
            </span>
          </div>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#24112E] leading-tight">
            คัดสรรด้วยความประณีต
            <br />
            <span className="italic font-normal text-[#4D2862]">
              เพื่อความปลอดภัยสูงสุดของคุณ
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end lg:items-center lg:gap-14">
          {/* Left / Upper Pedestal Stage */}
          <div className="flex flex-col items-center justify-end md:col-span-6 lg:col-span-7">
            {showStaticProductStage ? (
              <div
                className="relative mb-8 flex h-[340px] w-full max-w-[380px] flex-col items-center justify-center rounded-3xl p-6 transition-all duration-300 sm:h-[380px]"
                style={{
                  background: "rgba(255, 255, 255, 0.65)",
                  backdropFilter: "blur(28px)",
                  WebkitBackdropFilter: "blur(28px)",
                  border: "1.5px solid rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 20px 50px rgba(90, 30, 130, 0.12)",
                }}
              >
                {!staticImgFailed[activeProduct.id] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={activeProduct.imageCutout}
                    alt={activeProduct.nameTh}
                    width={250}
                    height={310}
                    onError={() =>
                      setStaticImgFailed((prev) => ({
                        ...prev,
                        [activeProduct.id]: true,
                      }))
                    }
                    className="max-h-[250px] w-auto object-contain drop-shadow-[0_16px_30px_rgba(40,10,60,0.25)] hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="flex h-[210px] w-[170px] flex-col items-center justify-center rounded-2xl border border-white/60 bg-white/70 px-4 text-center">
                    <span className="text-[0.95rem] font-semibold text-[#24112E] leading-[1.5]">
                      {activeProduct.nameTh}
                    </span>
                    <span className="mt-2 text-[0.78rem] text-[#664A73] leading-[1.55]">
                      {COPY_TH.scene04.awaitingImageNotice}
                    </span>
                  </div>
                )}
                {/* Static soft CSS pedestal cap */}
                <div
                  aria-hidden="true"
                  className="mt-5 h-4 w-48 rounded-full bg-white/90 shadow-md"
                />
              </div>
            ) : (
              /* Open viewport window over the 3D Pedestal & Floating ProductBillboard */
              <div
                aria-hidden="true"
                className="h-[44svh] w-full sm:h-[48svh] md:h-[52svh] lg:h-[56svh]"
              />
            )}

            {/* Circular Thumbnail Selector below the Pedestal */}
            <div
              role="radiogroup"
              aria-label={COPY_TH.a11y.productSwitcher}
              onKeyDown={handleKeyDown}
              className="inline-flex items-center gap-4 rounded-full border border-white/90 bg-white/75 px-5 py-3 shadow-[0_10px_30px_rgba(90,30,130,0.12)] backdrop-blur-md"
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
                      "relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-200 cursor-pointer",
                      selected
                        ? "scale-110 border-[#8B5CF6] shadow-[0_0_0_4px_rgba(233,213,255,0.9)]"
                        : "border-white/60 opacity-75 hover:scale-105 hover:opacity-100",
                    ].join(" ")}
                    style={{ backgroundColor: theme.ambientTint }}
                  >
                    {!thumbFailed[product.id] ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={product.imageCutout}
                        alt=""
                        width={46}
                        height={46}
                        onError={() =>
                          setThumbFailed((prev) => ({
                            ...prev,
                            [product.id]: true,
                          }))
                        }
                        className="max-h-[46px] w-auto object-contain"
                      />
                    ) : (
                      <span className="font-mono text-xs font-bold text-[#6D28D9]">
                        {shortCode}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="mt-3.5 text-center text-xs text-[#664A73] leading-[1.6]">
              <span className="hidden lg:inline">
                {COPY_TH.scene04.interactionHintDesktop}
              </span>
              <span className="lg:hidden">
                {COPY_TH.scene04.interactionHintMobile}
              </span>
            </p>
          </div>

          {/* Right / Bottom Product Information Card */}
          <div className="md:col-span-6 lg:col-span-5">
            <article
              aria-live="polite"
              className="rounded-3xl p-7 sm:p-9 shadow-[0_25px_60px_rgba(70,20,110,0.14)]"
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1.5px solid rgba(255, 255, 255, 0.95)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="editorial-tag text-[10px] font-bold text-[#6D28D9]">
                  {COPY_TH.scene04.eyebrow} · {activeProduct.brand}
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ✓ มั่นใจแท้ 100%
                </span>
              </div>

              <h3 className="font-editorial-serif text-2xl sm:text-3xl font-semibold text-[#24112E] leading-snug mt-2">
                {activeProduct.nameTh}
              </h3>

              <p className="font-sans text-xs sm:text-sm text-[#664A73] mt-0.5">
                {activeProduct.nameEn}
              </p>

              <div className="mt-3.5">
                <DemoRating show={activeProduct.showDemoRating} />
              </div>

              {/* Data Specifications Table */}
              <dl className="mt-6 divide-y divide-purple-100 border-y border-purple-100 text-sm">
                <div className="flex items-center justify-between py-3.5">
                  <dt className="text-[#664A73]">จำนวนบรรจุ</dt>
                  <dd className="font-semibold text-[#24112E]">
                    {COPY_TH.scene04.packFormat(activeProduct.packCount)}
                  </dd>
                </div>

                {activeProduct.sizeMm !== null && (
                  <div className="flex items-center justify-between py-3.5">
                    <dt className="text-[#664A73]">
                      {COPY_TH.scene04.sizeLabel}
                    </dt>
                    <dd className="font-semibold text-[#24112E]">
                      {COPY_TH.scene04.sizeFormat(activeProduct.sizeMm)}
                    </dd>
                  </div>
                )}

                <div className="flex items-center justify-between py-3.5">
                  <dt className="text-[#664A73]">
                    {COPY_TH.scene04.priceLabel}
                  </dt>
                  <dd>
                    <PriceTag price={activeProduct.price} size="md" />
                  </dd>
                </div>
              </dl>

              {/* Discreet Packaging Guarantee Badge */}
              <div className="mt-5 p-3.5 rounded-2xl bg-[#F8EFFC] border border-[#E9D5FF] flex items-start gap-2.5">
                <span className="text-lg">📦</span>
                <div className="text-xs text-[#4D2862] leading-relaxed">
                  <strong className="text-[#24112E] block mb-0.5">
                    100% Discreet Packaging
                  </strong>
                  พัสดุทุกกล่องแพ็กมิดชิด ไร้ชื่อสินค้าหรือชื่อแบรนด์บนหน้ากล่อง ปลอดภัย สบายใจสูงสุด
                </div>
              </div>

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
