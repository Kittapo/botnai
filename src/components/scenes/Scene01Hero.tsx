"use client";

import { useEffect, useRef, useState } from "react";
import { useUiStore } from "@/store/ui";

const QA_ITEMS = [
  {
    id: 0,
    tag: "100% PRIVATE",
    icon: "🔒",
    title: "ไม่กล้าถามใคร... คุยที่นี่ปลอดภัยไหม?",
    detail:
      "ปลอดภัย 100% เลยนะ! BloomCare ถูกสร้างขึ้นมาเพื่อเป็นพื้นที่ปลอดภัย ไร้การตัดสิน ไม่มีการบันทึกตัวตนหรือข้อมูลส่วนตัว สามารถอ่านความรู้และสอบถามข้อข้องใจได้อย่างสบายใจที่สุดเลย ✨",
    speech:
      "ปลอดภัยหนึ่งร้อยเปอร์เซ็นต์เลยนะ! ที่นี่เป็นพื้นที่ปลอดภัย ไร้การตัดสิน ไม่มีการเก็บข้อมูลตัวตน สามารถอ่านและปรึกษาได้อย่างสบายใจที่สุดเลยนะ",
    baseAngle: 0,
  },
  {
    id: 1,
    tag: "SIZING GUIDE",
    icon: "📐",
    title: "เลือกไซส์ถุงยางยังไง ให้พอดีและปลอดภัย?",
    detail:
      "การเลือกไซส์ที่ถูกต้อง ดูจาก 'ความกว้างตอนแข็งตัวเต็มที่' (เช่น 49 มม., 52 มม. หรือ 54 มม.) ไม่ใช่ดูแค่ความยาว เพื่อไม่ให้บีบรัดเจ็บหรือหลุดเลื่อนขณะมีเพศสัมพันธ์นะ 📐",
    speech:
      "การเลือกไซส์ที่ถูกต้อง ให้ดูจากความกว้างตอนแข็งตัวเต็มที่ เช่น 49 มิลลิเมตร หรือ 52 มิลลิเมตร เพื่อความกระชับ และไม่หลุดเลื่อนนะ",
    baseAngle: 90,
  },
  {
    id: 2,
    tag: "DISCREET PACKAGING",
    icon: "📦",
    title: "สั่งซื้อของ คนส่งจะรู้ไหมว่าคืออะไร?",
    detail:
      "หมดห่วงได้เลยจ้า! พัสดุทุกกล่องถูกแพ็กมิดชิด 'ไม่ระบุชื่อสินค้า' และ 'ไม่ระบุชื่อแบรนด์' บนหน้ากล่องพัสดุเด็ดขาด คนส่งหรือคนรับแทนไม่มีทางรู้แน่นอน เป็นความลับขั้นสูงสุด 📦🔒",
    speech:
      "หมดห่วงได้เลยจ้า! พัสดุทุกกล่องแพ็กมิดชิด ไม่ระบุชื่อสินค้า และไม่ระบุชื่อแบรนด์บนหน้ากล่องเด็ดขาด ไม่มีใครรู้แน่นอนจ้า",
    baseAngle: 180,
  },
  {
    id: 3,
    tag: "WELLNESS CARE",
    icon: "💧",
    title: "สารหล่อลื่นจำเป็นไหม และเลือกแบบไหนดี?",
    detail:
      "จำเป็นและมีประโยชน์มากนะ! สารหล่อลื่นช่วยลดการเสียดสีและการบาดเจ็บ โดยสูตรน้ำ (Water-based) จะปลอดภัยต่อถุงยางอนามัย ล้างออกง่าย และอ่อนโยนต่อจุดซ่อนเร้นที่สุด 💧",
    speech:
      "จำเป็นและมีประโยชน์มากนะ สารหล่อลื่นช่วยลดการเสียดสี แนะนำสูตรน้ำเพราะปลอดภัยต่อถุงยาง และล้างออกง่ายที่สุดจ้า",
    baseAngle: 270,
  },
];

const ORBIT_RADIUS = 295;
const TILT_ANGLE_X = 64;

export function Scene01Hero() {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [bunnyGreeting, setBunnyGreeting] = useState(
    "สวัสดีนะ! ยินดีต้อนรับสู่ BloomCare... พื้นที่ปลอดภัยของคุณ ✨"
  );
  const voiceOn = useUiStore((s) => s.voiceEnabled);

  // Preload browser speech voices so cute female Thai voices are ready immediately
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.getVoices();
    const handleVoicesChanged = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged
      );
    };
  }, []);

  // Direct DOM refs — ZERO React re-renders during 60fps animation or mouse movement!
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lumiWrapRef = useRef<HTMLDivElement>(null);
  const lumiModelRef = useRef<HTMLDivElement>(null);
  const lumiShadowRef = useRef<HTMLDivElement>(null);
  const starPetRef = useRef<HTMLDivElement>(null);
  const capsuleWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const capsuleBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Mutable animation physics state
  const isHoveredRef = useRef(false);
  const activeItemRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const orbitAngleRef = useRef(0);
  const speedRef = useRef(13);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    activeItemRef.current = activeItem;
  }, [activeItem]);

  // Pause Hero RAF automatically when scrolled out of viewport so Scenes 02-04 & WebGL get 100% GPU
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Single 60fps GPU-accelerated physics loop (Zero React setState!)
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.06);
      lastTime = now;

      if (isVisibleRef.current) {
        elapsed += dt;

        // 1. Smooth spring lerp for mouse parallax
        const mx = (mouseCurrentRef.current.x +=
          (mouseTargetRef.current.x - mouseCurrentRef.current.x) *
          Math.min(dt * 7, 1));
        const my = (mouseCurrentRef.current.y +=
          (mouseTargetRef.current.y - mouseCurrentRef.current.y) *
          Math.min(dt * 7, 1));

        // 2. Smooth velocity damping for orbital ring
        const targetSpeed =
          activeItemRef.current !== null
            ? 0.7
            : isHoveredRef.current
              ? 2.6
              : 13;
        speedRef.current +=
          (targetSpeed - speedRef.current) * Math.min(dt * 4.2, 1);
        orbitAngleRef.current =
          (orbitAngleRef.current + dt * speedRef.current) % 360;
        const angle = orbitAngleRef.current;

        // 3. Apply parallax to background
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(${mx * 0.35}px, ${my * 0.35}px, 0) scale(1.04)`;
        }

        // 4. Apply 3D transform to orbital ring
        if (ringRef.current) {
          ringRef.current.style.transform = `rotateX(${TILT_ANGLE_X}deg) rotateY(${mx * 0.35}deg) rotateZ(${angle}deg)`;
        }

        // 5. Counter-rotate each capsule so text stays upright + depth sort
        for (let i = 0; i < QA_ITEMS.length; i++) {
          const item = QA_ITEMS[i];
          const wrap = capsuleWrapRefs.current[i];
          const btn = capsuleBtnRefs.current[i];
          const worldAngle = (item.baseAngle + angle) % 360;
          const isFront = worldAngle > 20 && worldAngle < 200;

          if (wrap) {
            wrap.style.zIndex = isFront ? "35" : "8";
          }
          if (btn) {
            btn.style.transform = `rotateZ(${-angle}deg) rotateX(${-TILT_ANGLE_X}deg)`;
          }
        }

        // 6. Living organic 3D float & tilt for Lumi Mascot + Contact Shadow + Orbiting Star Pet
        const floatY = Math.sin(elapsed * 1.55) * 10;
        const swayRot = Math.cos(elapsed * 0.95) * 2.2;

        if (lumiWrapRef.current) {
          lumiWrapRef.current.style.transform = `translate3d(${mx * -0.4}px, ${my * -0.35}px, 0)`;
        }
        if (lumiModelRef.current) {
          lumiModelRef.current.style.transform = `translate3d(0, ${floatY}px, 0) rotateZ(${swayRot}deg) rotateY(${mx * 0.65}deg) rotateX(${-my * 0.45}deg)`;
        }
        if (lumiShadowRef.current) {
          const shadowScale = 1 - floatY * 0.014;
          const shadowOpacity = 0.42 - floatY * 0.012;
          lumiShadowRef.current.style.transform = `scale(${shadowScale})`;
          lumiShadowRef.current.style.opacity = `${Math.max(0.18, shadowOpacity)}`;
        }
        if (starPetRef.current) {
          const starX = Math.cos(elapsed * 1.3) * 14;
          const starY = Math.sin(elapsed * 2.1) * 12;
          const starRot = Math.sin(elapsed * 1.1) * 18;
          starPetRef.current.style.transform = `translate3d(${starX}px, ${starY}px, 0) rotate(${starRot}deg)`;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Zero-re-render mouse tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 18;
    const y = (e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 14;
    mouseTargetRef.current.x = x;
    mouseTargetRef.current.y = y;
  };

  // Cute sparkling music-box / celesta chime (Web Audio API)
  const playChime = () => {
    if (!voiceOn) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      // Sparkling high-octave dreamy bell arpeggio (C6, E6, G6, B6, C7)
      [1046.5, 1318.51, 1567.98, 1975.53, 2093.0].forEach((freq, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const overtone = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          overtone.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          overtone.frequency.setValueAtTime(freq * 2, ctx.currentTime);

          gain.gain.setValueAtTime(0.065, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.55
          );

          const overtoneGain = ctx.createGain();
          overtoneGain.gain.setValueAtTime(0.015, ctx.currentTime);
          overtoneGain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.35
          );

          osc.connect(gain);
          overtone.connect(overtoneGain);
          overtoneGain.connect(ctx.destination);
          gain.connect(ctx.destination);

          osc.start();
          overtone.start();
          osc.stop(ctx.currentTime + 0.55);
          overtone.stop(ctx.currentTime + 0.35);
        }, i * 48);
      });
    } catch {
      // AudioContext fallback
    }
  };

  // Speak Thai in Lumi's cute, gentle female voice (Explicitly avoids deep male voices like Pattara/Niwat)
  const speakThai = (text: string) => {
    if (!voiceOn) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "th-TH";
    utterance.rate = 1.04;
    utterance.pitch = 1.32; // Sweet, bright, adorable bunny companion tone

    const voices = window.speechSynthesis.getVoices();
    const thaiVoices = voices.filter(
      (v) => v.lang === "th-TH" || v.lang.toLowerCase().startsWith("th")
    );

    const cuteFemaleVoice =
      // 1. Edge / Windows Natural Female (Premwadee Online)
      thaiVoices.find((v) => /premwadee.*natural|premwadee/i.test(v.name)) ||
      // 2. Chrome Smooth Female (Google ภาษาไทย / Google Thai)
      thaiVoices.find((v) => /google/i.test(v.name)) ||
      // 3. macOS / iOS Soft Female (Kanya, Narisa, Achara)
      thaiVoices.find((v) => /kanya|narisa|achara|female/i.test(v.name)) ||
      // 4. Any Thai voice that is NOT a known deep male voice (Pattara / Niwat)
      thaiVoices.find((v) => !/pattara|niwat|male/i.test(v.name)) ||
      thaiVoices[0];

    if (cuteFemaleVoice) {
      utterance.voice = cuteFemaleVoice;
      // If browser only has a male voice fallback, raise pitch gently to soften it
      if (/pattara|niwat/i.test(cuteFemaleVoice.name)) {
        utterance.pitch = 1.55;
      }
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleSelectCapsule = (id: number) => {
    playChime();
    setActiveItem(id);
    const item = QA_ITEMS[id];
    setTimeout(() => {
      speakThai(item.speech);
    }, 220);
  };

  const handleCloseModal = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setActiveItem(null);
  };

  const handleWaveBunny = () => {
    playChime();
    const welcome =
      "สวัสดีค่ะ! ยินดีต้อนรับสู่บลูมแคร์นะคะ มีอะไรให้ฉันช่วยไหมคะ";
    setBunnyGreeting("ดีใจจังที่คุณแวะมา! ลองกดดูคำถามที่หมุนรอบวงแหวนสิ ✨");
    speakThai(welcome);
  };

  const scrollToShop = () => {
    const el = document.getElementById("shop-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full flex flex-col justify-between pt-24 pb-8 px-6 sm:px-12 md:px-16 overflow-hidden select-none"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 62% 40%, #FAF2FF 0%, #EFE1FA 35%, #DEC7F2 70%, #CCAEE6 100%)",
        color: "#24112E",
      }}
    >
      {/* 1. MASTER CELESTIAL AURORA BACKGROUND WITH MORNING SUNBEAM */}
      <div
        ref={bgRef}
        className="pointer-events-none will-change-transform"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/vibrant-celestial-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.95,
          zIndex: 0,
          transform: "scale(1.04)",
        }}
      />

      {/* Volumetric Warm Sunlight Glow (Peach + Gold + Rose Aura) */}
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          top: "6%",
          right: "18%",
          width: "680px",
          height: "680px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(254, 215, 170, 0.45) 0%, rgba(244, 114, 182, 0.22) 40%, rgba(192, 132, 252, 0.18) 70%, transparent 100%)",
          filter: "blur(65px)",
          zIndex: 1,
        }}
      />

      {/* Shimmering Liquid Light Caustics (Bottom Horizon Mist) */}
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "360px",
          background:
            "linear-gradient(to top, rgba(250, 242, 255, 0.8) 0%, rgba(239, 225, 250, 0.35) 50%, transparent 100%)",
          zIndex: 1,
        }}
      />

      {/* CAROUSEL ARROWS (< and > on screen edges) */}
      <button
        onClick={scrollToShop}
        aria-label="Previous Slide"
        data-cursor-label="SCROLL"
        className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-[#1F0C2E]/80 hover:bg-[#1F0C2E] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(31,12,46,0.35)] transition-all duration-300 hover:scale-110 cursor-pointer border border-white/20 backdrop-blur-md"
      >
        <span className="text-lg font-bold">‹</span>
      </button>

      <button
        onClick={scrollToShop}
        aria-label="Next Slide"
        data-cursor-label="SCROLL"
        className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-[#1F0C2E]/80 hover:bg-[#1F0C2E] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(31,12,46,0.35)] transition-all duration-300 hover:scale-110 cursor-pointer border border-white/20 backdrop-blur-md"
      >
        <span className="text-lg font-bold">›</span>
      </button>

      {/* AWWWARDS EDITORIAL ARCHITECTURAL CORNER MARKERS */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:flex items-center justify-between w-full max-w-7xl mx-auto pt-2 pb-1 text-[10px] font-mono tracking-[0.22em] text-[#4D2862]/65 uppercase relative z-20 border-b border-white/35"
      >
        <span>+ VOL. 01 // DIGITAL SANCTUARY</span>
        <span>EDITION 2026 — INTIMATE WELLNESS ARCHIVE</span>
        <span>13.75°N · 100.50°E +</span>
      </div>

      {/* 2. SPLIT EDITORIAL HERO COMPOSITION (AWWWARDS-LEVEL ASYMMETRY) */}
      <div
        className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto"
        style={{ position: "relative", zIndex: 20, minHeight: "580px" }}
      >
        {/* LEFT COLUMN: EDITORIAL TYPOGRAPHY & CALL TO ACTION */}
        <div className="lg:col-span-6 flex flex-col justify-center items-start space-y-5 sm:space-y-6 pt-4 lg:pt-0">
          {/* Editorial Index Badge */}
          <div className="flex items-center gap-2.5 animate-editorial-reveal">
            <span className="editorial-tag text-[10px] font-bold text-[#6D28D9] bg-white/75 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/90 shadow-[0_2px_12px_rgba(109,40,217,0.12)]">
              01 // LIVING SANCTUARY
            </span>
            <span className="hidden sm:inline text-[10px] text-[#5C3275] font-semibold tracking-[0.18em] uppercase">
              EMPATHETIC AI × EDITORIAL CARE
            </span>
          </div>

          <div className="space-y-1 sm:space-y-2 animate-editorial-reveal-delay-1">
            {/* 'BloomCare' in Colossal Cormorant Garamond Luxury Display Serif */}
            <h1
              className="font-display-luxury text-6xl sm:text-7xl md:text-8xl lg:text-[6.6rem] font-semibold tracking-[-0.03em] text-white leading-[0.94]"
              style={{
                textShadow:
                  "0 8px 40px rgba(80, 24, 120, 0.36), 0 2px 4px rgba(0, 0, 0, 0.14)",
              }}
            >
              BloomCare
            </h1>

            {/* 'The Future of Intimate Wellness' in Razor-Sharp Editorial Italic Contrast */}
            <h2
              className="font-display-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[3.35rem] font-normal leading-[1.12] pt-1"
              style={{
                color: "#24112E",
                textShadow: "0 2px 25px rgba(255, 255, 255, 0.65)",
              }}
            >
              The Future of <br />
              <span className="italic font-light text-[#3A1448] tracking-[-0.01em]">
                Intimate Wellness
              </span>
            </h2>
          </div>

          {/* Poetic Thai Statement in Noto Serif Thai */}
          <p className="font-thai-serif text-sm sm:text-[1.0625rem] text-[#3D1D52] max-w-lg leading-[1.8] font-normal animate-editorial-reveal-delay-2 border-l border-[#6D28D9]/35 pl-4">
            วิหารดิจิทัลสำหรับเรียนรู้และดูแลสุขภาวะทางเพศอย่างอบอุ่น ละเมียดละไม
            ปลอดภัย 100% ไร้การตัดสิน ด้วยระบบ AI Companion ที่พร้อมรับฟังคุณตลอด 24
            ชั่วโมง
          </p>

          {/* Frosted Glass CTA Button: 'Begin Your Journey' (Elevated Prismatic Pill) */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4 animate-editorial-reveal-delay-3">
            <button
              onClick={scrollToShop}
              data-cursor-label="EXPLORE"
              className="group px-9 py-4 rounded-full text-sm sm:text-base font-semibold text-[#24112E] cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3"
              style={{
                background: "rgba(255, 255, 255, 0.72)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1.5px solid rgba(255, 255, 255, 0.95)",
                boxShadow:
                  "0 12px 35px rgba(110, 40, 150, 0.22), inset 0 1.5px 3px rgba(255, 255, 255, 1)",
              }}
            >
              <span className="font-display-luxury text-lg italic font-semibold tracking-wide">
                Begin Your Journey
              </span>
              <span className="font-bold text-xs group-hover:translate-x-1.5 transition-transform">
                ➔
              </span>
            </button>

            {/* Trust Micro-badge */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#4D2862] font-medium bg-white/50 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/70 tracking-wide">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>100% Anonymous &amp; Secure</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D PRISMATIC CRYSTAL HALO & MASCOT (LUMI) */}
        <div
          className="lg:col-span-6 flex items-center justify-center"
          style={{
            position: "relative",
            minHeight: "540px",
            perspective: "1200px",
          }}
        >
          {/* DELICATE CELESTIAL ASTROLABE HAIRLINE SVG GRAPHIC */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center z-0 opacity-55"
          >
            <svg
              viewBox="0 0 600 600"
              className="w-[460px] h-[460px] sm:w-[560px] sm:h-[560px] animate-astrolabe"
              fill="none"
            >
              <circle
                cx="300"
                cy="300"
                r="272"
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="0.75"
                strokeDasharray="3 8"
              />
              <circle
                cx="300"
                cy="300"
                r="245"
                stroke="rgba(109,40,217,0.22)"
                strokeWidth="0.75"
              />
              <path
                d="M300 20 L303 28 L311 31 L303 34 L300 42 L297 34 L289 31 L297 28 Z"
                fill="rgba(255,255,255,0.9)"
              />
              <path
                d="M300 558 L303 566 L311 569 L303 572 L300 580 L297 572 L289 569 L297 566 Z"
                fill="rgba(255,255,255,0.85)"
              />
              <circle cx="572" cy="300" r="3" fill="rgba(254,215,170,0.95)" />
              <circle cx="28" cy="300" r="3" fill="rgba(255,255,255,0.9)" />
            </svg>
            <svg
              viewBox="0 0 600 600"
              className="absolute w-[380px] h-[380px] sm:w-[440px] sm:h-[440px] animate-astrolabe-reverse"
              fill="none"
            >
              <circle
                cx="300"
                cy="300"
                r="210"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="0.75"
                strokeDasharray="1 10"
              />
              <line
                x1="300"
                y1="75"
                x2="300"
                y2="95"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="0.75"
              />
              <line
                x1="300"
                y1="505"
                x2="300"
                y2="525"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="0.75"
              />
              <line
                x1="75"
                y1="300"
                x2="95"
                y2="300"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="0.75"
              />
              <line
                x1="505"
                y1="300"
                x2="525"
                y2="300"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="0.75"
              />
            </svg>
          </div>

          {/* --- 3D ROTATING PRISMATIC CRYSTAL RING (GPU DIRECT TRANSFORM) --- */}
          <div
            ref={ringRef}
            onMouseEnter={() => {
              isHoveredRef.current = true;
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false;
            }}
            className="absolute flex items-center justify-center will-change-transform"
            style={{
              width: `${ORBIT_RADIUS * 2}px`,
              height: `${ORBIT_RADIUS * 2}px`,
              transformStyle: "preserve-3d",
              transform: `rotateX(${TILT_ANGLE_X}deg) rotateZ(0deg)`,
              zIndex: 10,
            }}
          >
            {/* Visual Prismatic Glass Ring Track */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: "3.5px solid rgba(255, 255, 255, 0.92)",
                boxShadow:
                  "0 0 55px rgba(255, 255, 255, 0.72), inset 0 0 40px rgba(233, 213, 255, 0.52)",
                background:
                  "conic-gradient(from 45deg, rgba(255, 255, 255, 0.25), rgba(233, 213, 255, 0.55), rgba(254, 215, 170, 0.4), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.25))",
              }}
            />

            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: "18px",
                border: "1.5px dashed rgba(255, 255, 255, 0.72)",
              }}
            />

            {/* 4 INTERACTIVE FROSTED-GLASS VOICE CAPSULES */}
            {QA_ITEMS.map((item, idx) => {
              const angleRad = (item.baseAngle * Math.PI) / 180;
              const x = Math.cos(angleRad) * ORBIT_RADIUS;
              const y = Math.sin(angleRad) * ORBIT_RADIUS;

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    capsuleWrapRefs.current[idx] = el;
                  }}
                  className="absolute flex items-center justify-center"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `translate3d(${x}px, ${y}px, 0)`,
                    zIndex: 20,
                  }}
                >
                  <button
                    ref={(el) => {
                      capsuleBtnRefs.current[idx] = el;
                    }}
                    onClick={() => handleSelectCapsule(item.id)}
                    data-cursor-label="LISTEN"
                    className="p-3.5 sm:p-4 rounded-full text-left cursor-pointer transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(109,40,217,0.28)] group pointer-events-auto shadow-[0_10px_28px_rgba(90,30,130,0.16)] will-change-transform"
                    style={{
                      transform: `rotateZ(0deg) rotateX(${-TILT_ANGLE_X}deg)`,
                      background: "rgba(255, 255, 255, 0.78)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      border: "1.5px solid rgba(255, 255, 255, 0.96)",
                      boxShadow:
                        "0 10px 30px rgba(90, 30, 130, 0.18), inset 0 1.5px 2px rgba(255, 255, 255, 1)",
                      maxWidth: "245px",
                      minWidth: "195px",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm drop-shadow-[0_0_8px_#FFF]">
                        {item.icon}
                      </span>
                      <span className="editorial-tag text-[10px] text-[#6D28D9] font-bold">
                        {item.tag}
                      </span>
                      <span className="text-[11px] text-[#8B5CF6] group-hover:scale-125 transition-transform ml-auto">
                        🔊
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#24112E] leading-snug">
                      {item.title}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* 3D LUMI MASCOT (ORGANIC LIVING 3D LEVITATION & TILT) */}
          <div
            ref={lumiWrapRef}
            onClick={handleWaveBunny}
            data-cursor-label="TALK ✦"
            className="flex flex-col items-center cursor-pointer group select-none will-change-transform"
            style={{
              position: "relative",
              zIndex: 15,
            }}
          >
            {/* Welcome Speech Balloon - Neatly auto-hides when a modal is active */}
            <div
              className={`mb-3 px-4 py-2 rounded-full text-xs font-bold text-[#24112E] shadow-[0_8px_25px_rgba(109,40,217,0.22)] flex items-center gap-2 transition-all duration-300 ${
                activeItem !== null
                  ? "opacity-0 -translate-y-2 pointer-events-none"
                  : "opacity-100 translate-y-0"
              }`}
              style={{
                background: "rgba(255, 255, 255, 0.88)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1.5px solid rgba(255, 255, 255, 0.98)",
              }}
            >
              <span className="text-sm">👋</span>
              <span className="font-extrabold text-[#6D28D9]">✦ LUMI:</span>
              <span className="font-medium text-[#24112E]">{bunnyGreeting}</span>
            </div>

            {/* THE AUTHENTIC 3D CHARACTER MODEL (LUMI) WITH LIVING LEVITATION */}
            <div className="relative" style={{ perspective: "800px" }}>
              {/* Soft Environmental Backlight Aura */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(233, 213, 255, 0.5) 45%, rgba(254, 215, 170, 0.3) 70%, transparent 85%)",
                  filter: "blur(28px)",
                  transform: "scale(1.2)",
                }}
              />

              {/* Orbiting Star Companion (⭐ Pet with organic bobbing physics) */}
              <div
                ref={starPetRef}
                className="absolute -right-5 top-1/3 z-20 text-2xl pointer-events-none filter drop-shadow-[0_0_12px_#FDE047] will-change-transform"
              >
                ⭐
              </div>

              <div
                ref={lumiModelRef}
                className="will-change-transform transition-transform duration-75"
                style={{ transformStyle: "preserve-3d" }}
              >
                <img
                  src="/images/lumi-3d-model.png"
                  alt="Lumi 3D Astronaut Bunny"
                  className="relative w-56 sm:w-72 h-auto drop-shadow-[0_24px_50px_rgba(70,20,110,0.3)] pointer-events-none group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    filter: "drop-shadow(0 0 28px rgba(255, 255, 255, 0.72))",
                  }}
                />
              </div>

              {/* Dynamic Soft Ground Contact Shadow (scales with Lumi's height!) */}
              <div
                ref={lumiShadowRef}
                className="w-40 h-6 mx-auto -mt-2 rounded-full pointer-events-none will-change-transform"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(60, 15, 90, 0.55) 0%, transparent 75%)",
                  filter: "blur(8px)",
                  opacity: 0.4,
                }}
              />
            </div>
          </div>

          {/* EXPANDED FROSTED GLASS ANSWER MODAL */}
          {activeItem !== null && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in zoom-in-95 duration-200">
              <div
                onClick={handleCloseModal}
                className="absolute inset-0 bg-[#24112E]/20 backdrop-blur-sm rounded-3xl cursor-pointer"
              />

              <div className="glass-prismatic-modal relative z-10 w-full max-w-md p-6 sm:p-7 rounded-3xl shadow-[0_25px_70px_rgba(50,15,80,0.32)]">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-white/70 shadow-sm">
                      {QA_ITEMS[activeItem].icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="editorial-tag text-[10px] text-[#6D28D9] font-bold">
                          {QA_ITEMS[activeItem].tag}
                        </span>
                        <span className="text-[10px] text-[#8B5CF6] animate-pulse font-mono font-bold">
                          [LUMI ✦ กำลังพูด]
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-extrabold text-[#24112E] mt-0.5">
                        {QA_ITEMS[activeItem].title}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={handleCloseModal}
                    aria-label="Close dialog"
                    className="w-8 h-8 rounded-full text-[#24112E] font-bold flex items-center justify-center text-sm bg-white/80 hover:bg-white transition-all hover:scale-105 cursor-pointer shadow-sm border border-white/90"
                  >
                    ✕
                  </button>
                </div>

                <div
                  className="text-xs sm:text-sm text-[#3A1448] leading-relaxed mb-4 p-4 rounded-2xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    border: "1px solid rgba(255, 255, 255, 0.95)",
                  }}
                >
                  {QA_ITEMS[activeItem].detail}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                  <button
                    onClick={() => speakThai(QA_ITEMS[activeItem].speech)}
                    className="text-xs text-[#6D28D9] flex items-center gap-1.5 font-bold hover:underline cursor-pointer bg-white/60 px-3.5 py-2 rounded-full border border-white/70"
                  >
                    <span>🔄</span>
                    <span>กดเพื่อให้น้องพูดซ้ำ</span>
                  </button>

                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 rounded-full font-bold text-xs shadow-md transition-all hover:scale-105 cursor-pointer bg-white text-[#24112E] border border-white/90"
                  >
                    เข้าใจแล้ว ขอบคุณนะ ✨
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM FOOTER BAR */}
      <div
        className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"
        style={{
          position: "relative",
          zIndex: 30,
          borderTop: "1px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#5C3275]">
          <span className="font-bold">AGE VERIFICATION: 18+</span>
          <span className="opacity-40">|</span>
          <span className="text-[#24112E] font-semibold">
            100% PRIVATE SANCTUARY
          </span>
        </div>

        <button
          onClick={scrollToShop}
          data-cursor-label="SCROLL"
          className="flex items-center gap-2 text-xs font-semibold text-[#3A1448] hover:text-[#24112E] transition-colors cursor-pointer"
        >
          <span>SCROLL DOWN TO ENTER STORE</span>
          <span className="animate-bounce font-bold">↓</span>
        </button>
      </div>
    </section>
  );
}
