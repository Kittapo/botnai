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
  const stageRef = useRef<HTMLDivElement>(null);
  const pillarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closingLineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
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
      gsap.set(pillars, { opacity: 0.12, y: 24 });
      if (closingEl) {
        gsap.set(closingEl, { opacity: 0, y: 16 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: "top 75%",
          end: "bottom 80%",
          scrub: 0.5,
        },
      });

      pillars.forEach((pillar, idx) => {
        tl.to(
          pillar,
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power3.out",
          },
          idx * 0.22
        );
      });

      if (closingEl) {
        tl.to(
          closingEl,
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: "power3.out",
          },
          0.75
        );
      }
    }, outer);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id={SCENE_ANCHOR_IDS[2]}
      ref={outerRef}
      className="relative z-10 w-full overflow-hidden"
    >
      <div
        ref={stageRef}
        className={[
          "relative flex w-full items-center py-24 sm:py-32",
          reducedMotion ? "min-h-auto" : "min-h-[105svh]",
        ].join(" ")}
      >
        {/* Soft Ambient Radial Caustics */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-10%] top-[20%] h-[600px] w-[600px] rounded-full blur-[100px] opacity-45"
          style={{
            background:
              "radial-gradient(circle, rgba(254, 215, 170, 0.4) 0%, rgba(233, 213, 255, 0.3) 50%, transparent 75%)",
          }}
        />

        {/* Editorial Luxury Magazine Spread */}
        <div className="relative mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
          {/* Section Header */}
          <div className="max-w-2xl mb-12 sm:mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="editorial-tag text-[11px] font-bold text-[#6D28D9] bg-white/70 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/90 shadow-sm">
                03 // CORE PHILOSOPHY
              </span>
              <span className="text-xs text-[#664A73] font-medium tracking-wider uppercase">
                {COPY_TH.scene03.eyebrow}
              </span>
            </div>

            <h2 className="font-thai-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#24112E] leading-tight">
              เสาหลักแห่งความไว้วางใจ
              <br />
              <span className="font-normal text-[#4D2862]">
                เพื่อสุขภาวะที่งดงามในทุกมิติ
              </span>
            </h2>
          </div>

          {/* 3 Staggered Editorial Pillar Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {COPY_TH.scene03.pillars.map((pillar, idx) => (
              <div
                key={pillar.id}
                ref={(el) => {
                  pillarRefs.current[idx] = el;
                }}
                className="group relative p-7 sm:p-9 rounded-3xl transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  background: "rgba(255, 255, 255, 0.62)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1.5px solid rgba(255, 255, 255, 0.88)",
                  boxShadow:
                    "0 12px 35px rgba(90, 30, 130, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.95)",
                }}
              >
                {/* Large Subtle Watermark Cormorant Garamond Italic Numeral */}
                <div className="font-display-luxury italic text-6xl sm:text-7xl font-light text-[#6D28D9]/25 group-hover:text-[#6D28D9]/50 transition-colors mb-3 leading-none">
                  {pillar.number}
                </div>

                <h3 className="font-thai-serif text-xl sm:text-2xl font-semibold text-[#24112E] leading-snug mb-3">
                  {pillar.title}
                </h3>

                <p className="text-sm sm:text-base text-[#4D2862] leading-relaxed">
                  {pillar.body}
                </p>

                {/* Decorative Bottom Bar */}
                <div className="mt-6 h-[2px] w-12 bg-gradient-to-r from-[#8B5CF6] to-transparent rounded-full group-hover:w-20 transition-all duration-300" />
              </div>
            ))}
          </div>

          {/* Closing Statement */}
          <div className="mt-14 max-w-2xl">
            <p
              ref={closingLineRef}
              className="font-editorial-serif text-xl sm:text-2xl font-medium text-[#24112E] italic leading-relaxed"
            >
              &ldquo;{COPY_TH.scene03.closingLine}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
