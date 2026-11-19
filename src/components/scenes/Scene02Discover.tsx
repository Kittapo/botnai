"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COPY_TH } from "@/content/copy.th";
import { useReducedMotion } from "@/lib/reducedMotion";
import { SCENE_ANCHOR_IDS } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export function Scene02Discover() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = wordRefs.current.filter(
      (el): el is HTMLSpanElement => el !== null
    );
    if (words.length === 0) return;

    if (reducedMotion) {
      gsap.set(words, { opacity: 1, y: 0, clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0.15, y: 22 });

      // Kinetic typography reveal staggered across scroll
      gsap.to(words, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 25%",
          scrub: 0.45,
        },
      });

      // Subtle background aura expansion
      if (auraRef.current) {
        gsap.fromTo(
          auraRef.current,
          { scale: 0.85, opacity: 0.3 },
          {
            scale: 1.25,
            opacity: 0.75,
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "bottom 30%",
              scrub: true,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id={SCENE_ANCHOR_IDS[1]}
      ref={sectionRef}
      className={[
        "relative z-10 flex w-full items-center overflow-hidden",
        reducedMotion ? "py-24 md:py-32" : "min-h-[110svh] py-28",
      ].join(" ")}
    >
      {/* Volumetric Soft Aura Light in Background */}
      <div
        ref={auraRef}
        className="pointer-events-none absolute -left-20 top-1/4 h-[550px] w-[550px] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(233, 213, 255, 0.45) 0%, rgba(254, 215, 170, 0.25) 50%, transparent 75%)",
        }}
      />

      {/* Free-Breathing Asymmetric Editorial Layout (No boxy card) */}
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="max-w-[960px]">
          {/* Editorial Index Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="editorial-tag text-[11px] font-bold text-[#6D28D9] bg-white/70 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/90 shadow-sm">
              02 // THE SILENT QUESTION
            </span>
            <span className="text-xs text-[#664A73] font-medium tracking-wider uppercase">
              {COPY_TH.scene02.eyebrow}
            </span>
          </div>

          {/* Kinetic Typography Sculpture in Luxury Thai Serif */}
          <h2 className="flex flex-wrap gap-x-4 gap-y-3 font-thai-serif text-[clamp(2.2rem,4.5vw,3.9rem)] font-medium text-[#24112E] leading-[1.35] tracking-[-0.015em]">
            {COPY_TH.scene02.words.map((word, index) => (
              <span
                key={word}
                ref={(el) => {
                  wordRefs.current[index] = el;
                }}
                className="inline-block py-0.5"
                style={{
                  willChange: reducedMotion ? "auto" : "transform, opacity",
                }}
              >
                {word}
              </span>
            ))}
          </h2>

          {/* Editorial Reflection Quote */}
          <div className="mt-10 max-w-xl border-l-2 border-[#8B5CF6]/50 pl-5">
            <p className="text-sm sm:text-base text-[#4D2862] leading-relaxed">
              ไม่มีคำถามไหนที่แปลก และไม่มีเรื่องไหนที่น่าอาย...
              ในวิหารดิจิทัลแห่งนี้ ทุกความรู้สึกและความสงสัยของคุณคือเรื่องธรรมชาติที่สมควรได้รับการดูแลด้วยความเข้าใจ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
