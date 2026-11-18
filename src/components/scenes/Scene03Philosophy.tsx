"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COPY_TH } from "@/content/copy.th";
import { useReducedMotion } from "@/lib/reducedMotion";
import { SCENE_ANCHOR_IDS } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export function Scene03Philosophy() {
  const reducedMotion = useReducedMotion();
  const outerRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const pillarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closingLineRef = useRef<HTMLParagraphElement>(null);
  const shape1Ref = useRef<SVGSVGElement>(null);
  const shape2Ref = useRef<SVGSVGElement>(null);
  const shape3Ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const stage = pinStageRef.current;
    if (!outer || !stage) return;

    const pillars = pillarRefs.current.filter(
      (el): el is HTMLDivElement => el !== null
    );
    const closingEl = closingLineRef.current;

    if (reducedMotion) {
      gsap.set([...pillars, closingEl].filter(Boolean), {
        opacity: 1,
        y: 0,
        clearProps: "all",
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(pillars, { opacity: 0.14, y: 18 });
      if (closingEl) {
        gsap.set(closingEl, { opacity: 0, y: 14 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          pin: stage,
          start: "top top",
          end: "+=115%",
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      pillars.forEach((pillar, idx) => {
        tl.to(
          pillar,
          {
            opacity: 1,
            y: 0,
            duration: 0.24,
            ease: "power2.out",
          },
          idx * 0.25
        );
      });

      if (closingEl) {
        tl.to(
          closingEl,
          {
            opacity: 1,
            y: 0,
            duration: 0.22,
            ease: "power2.out",
          },
          0.76
        );
      }

      // Three layered translucent organic shapes drifting at subtle speeds (<20% amplitude)
      if (shape1Ref.current) {
        tl.to(shape1Ref.current, { y: -36, x: 14, duration: 1, ease: "none" }, 0);
      }
      if (shape2Ref.current) {
        tl.to(shape2Ref.current, { y: 28, x: -18, duration: 1, ease: "none" }, 0);
      }
      if (shape3Ref.current) {
        tl.to(shape3Ref.current, { y: -22, x: -10, duration: 1, ease: "none" }, 0);
      }
    }, outer);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id={SCENE_ANCHOR_IDS[2]}
      ref={outerRef}
      className="relative z-10 w-full"
    >
      <div
        ref={pinStageRef}
        className={[
          "relative flex w-full items-center overflow-hidden",
          reducedMotion ? "py-20 md:py-28" : "min-h-[100svh] py-20",
        ].join(" ")}
      >
        {/* Layered translucent organic SVG petals (3 speeds, zero stock photos) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <svg
            ref={shape1Ref}
            viewBox="0 0 320 320"
            className="absolute -left-16 top-[12%] h-64 w-64 opacity-45 sm:h-80 sm:w-80"
          >
            <ellipse
              cx="160"
              cy="160"
              rx="135"
              ry="92"
              transform="rotate(-24 160 160)"
              fill="#F8D7E7"
            />
          </svg>
          <svg
            ref={shape2Ref}
            viewBox="0 0 360 360"
            className="absolute right-[4%] top-[18%] h-72 w-72 opacity-50 sm:h-96 sm:w-96"
          >
            <ellipse
              cx="180"
              cy="180"
              rx="145"
              ry="102"
              transform="rotate(32 180 180)"
              fill="#FFF3E6"
            />
          </svg>
          <svg
            ref={shape3Ref}
            viewBox="0 0 280 280"
            className="absolute bottom-[8%] left-[38%] h-56 w-56 opacity-40 sm:h-72 sm:w-72"
          >
            <ellipse
              cx="140"
              cy="140"
              rx="118"
              ry="84"
              transform="rotate(-12 140 140)"
              fill="#F2E4D8"
            />
          </svg>
        </div>

        {/* Open Asymmetric Editorial Layout (not a card grid, Rule A3 & B5) */}
        <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">
            {/* Editorial Section Header */}
            <div className="md:col-span-4 lg:col-span-4">
              <p className="text-[0.875rem] font-medium tracking-[0.04em] text-primary-strong leading-[1.6]">
                {COPY_TH.scene03.eyebrow}
              </p>
              <div
                aria-hidden="true"
                className="mt-4 h-[1px] w-16 bg-primary-strong/35"
              />
            </div>

            {/* Three Staggered Editorial Pillars */}
            <div className="space-y-7 md:col-span-8 lg:col-span-7 lg:col-start-6 lg:space-y-8">
              {COPY_TH.scene03.pillars.map((pillar, idx) => {
                const indentClass =
                  idx === 1
                    ? "lg:pl-10"
                    : idx === 2
                      ? "lg:pl-20"
                      : "";

                return (
                  <div
                    key={pillar.id}
                    ref={(el) => {
                      pillarRefs.current[idx] = el;
                    }}
                    className={`border-t border-border/90 pt-5 ${indentClass}`}
                    style={{
                      willChange: reducedMotion ? "auto" : "transform, opacity",
                    }}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-sans text-[0.85rem] font-medium text-primary-strong">
                        {pillar.number}
                      </span>
                      <h3 className="text-[clamp(1.35rem,2.2vw,1.85rem)] font-semibold text-text leading-[1.38]">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="mt-2 max-w-[48ch] pl-9 text-[1rem] text-[#413E4B] leading-[1.72]">
                      {pillar.body}
                    </p>
                  </div>
                );
              })}

              <p
                ref={closingLineRef}
                className="pt-4 text-[clamp(1.2rem,2vw,1.6rem)] font-semibold text-primary-strong leading-[1.45]"
                style={{
                  willChange: reducedMotion ? "auto" : "transform, opacity",
                }}
              >
                {COPY_TH.scene03.closingLine}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
