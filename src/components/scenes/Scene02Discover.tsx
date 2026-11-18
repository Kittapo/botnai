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
      gsap.set(words, { opacity: 0.18, y: 10 });

      // Completes well before the user reaches the reading center (Rule A4 & B5)
      gsap.to(words, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          end: "top 34%",
          scrub: 0.4,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id={SCENE_ANCHOR_IDS[1]}
      ref={sectionRef}
      className={[
        "relative z-10 flex w-full items-center",
        reducedMotion ? "py-20 md:py-28" : "min-h-[105svh] py-24",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[920px] rounded-3xl bg-background/58 px-6 py-10 text-center backdrop-blur-sm sm:px-10 sm:py-14 md:text-left lg:mx-0 lg:max-w-[820px] lg:bg-background/48">
          <p className="text-[0.875rem] font-medium tracking-[0.04em] text-primary-strong leading-[1.6]">
            {COPY_TH.scene02.eyebrow}
          </p>

          <h2 className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-2 text-[clamp(1.65rem,3.3vw,2.75rem)] font-medium tracking-[-0.01em] text-text leading-[1.42] md:justify-start">
            {COPY_TH.scene02.words.map((word, index) => (
              <span
                key={word}
                ref={(el) => {
                  wordRefs.current[index] = el;
                }}
                className="inline-block py-0.5"
                style={{ willChange: reducedMotion ? "auto" : "transform, opacity" }}
              >
                {word}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}
