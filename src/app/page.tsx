"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { COPY_TH } from "@/content/copy.th";
import { useSyncReducedMotion } from "@/lib/reducedMotion";
import {
  getSceneIndexFromProgress,
  scrollState,
  setActiveLenis,
} from "@/lib/scroll";
import { useUiStore } from "@/store/ui";
import { CssFallbackScene } from "@/components/fallback/CssFallbackScene";
import { SceneDots } from "@/components/layout/SceneDots";
import { Footer } from "@/components/layout/Footer";
import { Scene01Hero } from "@/components/scenes/Scene01Hero";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

// Dynamic-import WebGL canvas (ssr: false) so Hero DOM paints first (Rule A6 & B7 #7)
const SceneCanvas = dynamic(
  () => import("@/components/three/SceneCanvas"),
  {
    ssr: false,
    loading: () => null,
  }
);

// Lazy-load below-the-fold scenes (Rule A6)
const Scene02Discover = dynamic(() =>
  import("@/components/scenes/Scene02Discover").then((m) => m.Scene02Discover)
);
const Scene03Philosophy = dynamic(() =>
  import("@/components/scenes/Scene03Philosophy").then(
    (m) => m.Scene03Philosophy
  )
);
const Scene04Reveal = dynamic(() =>
  import("@/components/scenes/Scene04Reveal").then((m) => m.Scene04Reveal)
);

export default function HomePage() {
  const reducedMotion = useSyncReducedMotion();
  const setActiveSceneIndex = useUiStore((s) => s.setActiveSceneIndex);
  const scrollRootRef = useRef<HTMLDivElement>(null);

  // Wire Lenis smooth scroll to GSAP ticker & clean up on unmount (disabled in reduced motion)
  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") {
      setActiveLenis(null);
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
    });
    setActiveLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (timeSeconds: number) => {
      lenis.raf(timeSeconds * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      setActiveLenis(null);
    };
  }, [reducedMotion]);

  // Single master ScrollTrigger writing mutable progress p [0..1] (Rule A4)
  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root || typeof window === "undefined") return;

    if (reducedMotion) {
      scrollState.progress = 0;
      scrollState.smoothed = 0;
      return;
    }

    let prevSceneIdx = -1;

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollState.progress = self.progress;
        scrollState.velocity = self.getVelocity();

        const nextSceneIdx = getSceneIndexFromProgress(self.progress);
        if (nextSceneIdx !== prevSceneIdx) {
          prevSceneIdx = nextSceneIdx;
          setActiveSceneIndex(nextSceneIdx);
        }
      },
    });

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);

    return () => {
      window.clearTimeout(refreshTimer);
      trigger.kill();
    };
  }, [reducedMotion, setActiveSceneIndex]);

  // Passive desktop pointer tracking into mutable scrollState (zero React re-renders)
  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") {
      scrollState.pointerX = 0;
      scrollState.pointerY = 0;
      return;
    }

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      scrollState.pointerX = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      scrollState.pointerY =
        -((e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [reducedMotion]);

  return (
    <div ref={scrollRootRef} className="relative min-h-[100svh] w-full">
      {/* Persistent Fixed Background WebGL World (or CSS Fallback) */}
      <SceneCanvas />

      {/* Desktop Right-Edge Vertical Scene Dots */}
      <SceneDots />

      {/* Scrollable Cinematic Narrative (~460-500 svh in motion mode, stacked static in reduced motion) */}
      <main id="main-content" className="relative z-10 w-full">
        <Scene01Hero />
        <Scene02Discover />
        <Scene03Philosophy />
        <Scene04Reveal />

        {/* Closing Calm Tonal Settle (p 0.85 - 1.0) */}
        <section className="relative z-10 flex min-h-[56svh] w-full items-center py-20 lg:py-28">
          <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="max-w-[680px] rounded-3xl bg-background/78 p-6 backdrop-blur-md sm:p-10">
              <p className="text-[0.875rem] font-medium tracking-[0.04em] text-primary-strong leading-[1.6]">
                {COPY_TH.closing.eyebrow}
              </p>
              <h2 className="mt-3 text-[clamp(1.55rem,2.8vw,2.35rem)] font-semibold text-text leading-[1.38]">
                {COPY_TH.closing.headline}
              </h2>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="/ai" variant="primary" size="lg" fullWidthMobile>
                  {COPY_TH.closing.primaryCta}
                </Button>
                <Button
                  href="/shop"
                  variant="secondary"
                  size="lg"
                  fullWidthMobile
                >
                  {COPY_TH.closing.secondaryCta}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
