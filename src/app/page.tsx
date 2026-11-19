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
import { EditorialMarquee } from "@/components/ui/EditorialMarquee";
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
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.1,
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
        <EditorialMarquee />
        <Scene02Discover />
        <Scene03Philosophy />
        <Scene04Reveal />

        {/* Closing Calm Tonal Settle (p 0.85 - 1.0) */}
        <section className="relative z-10 flex min-h-[58svh] w-full items-center py-24 lg:py-32">
          <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
            <div
              className="max-w-[720px] rounded-3xl p-8 sm:p-12 shadow-[0_25px_60px_rgba(70,20,110,0.15)]"
              style={{
                background: "rgba(255, 255, 255, 0.72)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1.5px solid rgba(255, 255, 255, 0.95)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="editorial-tag text-[11px] font-bold text-[#6D28D9] bg-white/70 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/90 shadow-sm">
                  05 // DIGITAL SANCTUARY
                </span>
                <span className="text-xs text-[#664A73] font-medium tracking-wider uppercase">
                  {COPY_TH.closing.eyebrow}
                </span>
              </div>

              <h2 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#24112E] leading-tight">
                {COPY_TH.closing.headline}
              </h2>

              <p className="mt-4 text-sm sm:text-base text-[#4D2862] leading-relaxed max-w-xl">
                เริ่มต้นสำรวจพื้นที่แห่งสุขภาวะที่ดี หรือพูดคุยปรึกษาเรื่องที่คุณกังวลใจกับน้อง Lumi AI ได้ทันทีอย่างปลอดภัย
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Button href="/ai" variant="primary" size="lg" fullWidthMobile>
                  ✦ {COPY_TH.closing.primaryCta}
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
