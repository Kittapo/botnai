"use client";

import { useEffect, useRef, useState } from "react";

const QA_ITEMS = [
  {
    id: 0,
    tag: "100% PRIVATE",
    icon: "🔒",
    title: "ไม่กล้าถามใคร... คุยที่นี่ปลอดภัยไหม?",
    detail: "ปลอดภัย 100% เลยนะ! BloomCare ถูกสร้างขึ้นมาเพื่อเป็นพื้นที่ปลอดภัย ไร้การตัดสิน ไม่มีการบันทึกตัวตนหรือข้อมูลส่วนตัว สามารถอ่านความรู้และสอบถามข้อข้องใจได้อย่างสบายใจที่สุดเลย ✨",
    speech: "ปลอดภัยหนึ่งร้อยเปอร์เซ็นต์เลยนะ! ที่นี่เป็นพื้นที่ปลอดภัย ไร้การตัดสิน ไม่มีการเก็บข้อมูลตัวตน สามารถอ่านและปรึกษาได้อย่างสบายใจที่สุดเลยนะ",
    baseAngle: 0,
  },
  {
    id: 1,
    tag: "SIZING GUIDE",
    icon: "📐",
    title: "เลือกไซส์ถุงยางยังไง ให้พอดีและปลอดภัย?",
    detail: "การเลือกไซส์ที่ถูกต้อง ดูจาก 'ความกว้างตอนแข็งตัวเต็มที่' (เช่น 49 มม., 52 มม. หรือ 54 มม.) ไม่ใช่ดูแค่ความยาว เพื่อไม่ให้บีบรัดเจ็บหรือหลุดเลื่อนขณะมีเพศสัมพันธ์นะ 📐",
    speech: "การเลือกไซส์ที่ถูกต้อง ให้ดูจากความกว้างตอนแข็งตัวเต็มที่ เช่น 49 มิลลิเมตร หรือ 52 มิลลิเมตร เพื่อความกระชับ และไม่หลุดเลื่อนนะ",
    baseAngle: 90,
  },
  {
    id: 2,
    tag: "DISCREET PACKAGING",
    icon: "📦",
    title: "สั่งซื้อของ คนส่งจะรู้ไหมว่าคืออะไร?",
    detail: "หมดห่วงได้เลยจ้า! พัสดุทุกกล่องถูกแพ็กมิดชิด 'ไม่ระบุชื่อสินค้า' และ 'ไม่ระบุชื่อแบรนด์' บนหน้ากล่องพัสดุเด็ดขาด คนส่งหรือคนรับแทนไม่มีทางรู้แน่นอน เป็นความลับขั้นสูงสุด 📦🔒",
    speech: "หมดห่วงได้เลยจ้า! พัสดุทุกกล่องแพ็กมิดชิด ไม่ระบุชื่อสินค้า และไม่ระบุชื่อแบรนด์บนหน้ากล่องเด็ดขาด ไม่มีใครรู้แน่นอนจ้า",
    baseAngle: 180,
  },
  {
    id: 3,
    tag: "WELLNESS CARE",
    icon: "💧",
    title: "สารหล่อลื่นจำเป็นไหม และเลือกแบบไหนดี?",
    detail: "จำเป็นและมีประโยชน์มากนะ! สารหล่อลื่นช่วยลดการเสียดสีและการบาดเจ็บ โดยสูตรน้ำ (Water-based) จะปลอดภัยต่อถุงยางอนามัย ล้างออกง่าย และอ่อนโยนต่อจุดซ่อนเร้นที่สุด 💧",
    speech: "จำเป็นและมีประโยชน์มากนะ สารหล่อลื่นช่วยลดการเสียดสี แนะนำสูตรน้ำเพราะปลอดภัยต่อถุงยาง และล้างออกง่ายที่สุดจ้า",
    baseAngle: 270,
  },
];

export function Scene01Hero() {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [bunnyGreeting, setBunnyGreeting] = useState("สวัสดีนะ! ยินดีต้อนรับสู่ BloomCare... พื้นที่ปลอดภัยของคุณ ✨");
  const [voiceOn] = useState(true);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });
  const animRef = useRef<number | null>(null);

  // Smooth continuous 3D rotating ring orbit
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isPaused) {
        setOrbitAngle((prev) => (prev + dt * 14) % 360);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPaused]);

  // Subtle 3D mouse parallax tilt
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 16;
    const y = (clientY / innerHeight - 0.5) * 12;
    setMouseParallax({ x, y });
  };

  // Celestial crystal chime synthesizer
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      [659.25, 830.61, 987.77, 1318.51].forEach((freq, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.38);
        }, i * 65);
      });
    } catch {
      // Audio fallback
    }
  };

  // Web Speech API Thai Text-To-Speech
  const speakThai = (text: string) => {
    if (!voiceOn || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "th-TH";
    utterance.rate = 1.05;
    utterance.pitch = 1.25;
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectCapsule = (id: number) => {
    playChime();
    setActiveItem(id);
    setIsPaused(true);
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
    setIsPaused(false);
  };

  const handleWaveBunny = () => {
    playChime();
    const welcome = "สวัสดีค่ะ! ยินดีต้อนรับสู่บลูมแคร์นะคะ มีอะไรให้ฉันช่วยไหมคะ";
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

  // 3D Orbital ring dimensions
  const orbitRadius = 290;
  const tiltAngleX = 64;

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative w-full flex flex-col justify-between pt-24 pb-8 px-6 sm:px-12 md:px-16 overflow-hidden select-none"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 65% 45%, #F0E3FC 0%, #D8C4EE 40%, #CBB5E5 75%, #BDA0DD 100%)",
        color: "#2D143D",
      }}
    >
      {/* 1. MASTER VIBRANT CELESTIAL AURORA BACKGROUND (EMPHASIZING GORGEOUS LIGHTING & COLORS) */}
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/vibrant-celestial-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.98,
          zIndex: 0,
          transform: `translate3d(${mouseParallax.x * 0.35}px, ${mouseParallax.y * 0.35}px, 0)`,
          transition: "transform 0.4s ease-out",
        }}
      />

      {/* Radiant Volumetric Aurora Light Bloom (Magenta + Violet + Cyan + Gold) */}
      <div
        className="pointer-events-none animate-pulse"
        style={{
          position: "absolute",
          top: "10%",
          right: "15%",
          width: "620px",
          height: "620px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.32) 0%, rgba(168, 85, 247, 0.25) 40%, rgba(56, 189, 248, 0.18) 70%, transparent 100%)",
          filter: "blur(65px)",
          zIndex: 1,
        }}
      />

      {/* Shimmering Liquid Light Caustics (Bottom Ambient Horizon) */}
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "360px",
          background: "linear-gradient(to top, rgba(240, 227, 252, 0.6) 0%, rgba(216, 196, 238, 0.25) 50%, transparent 100%)",
          zIndex: 1,
        }}
      />

      {/* CAROUSEL ARROWS (< and > on screen edges matching reference) */}
      <button
        onClick={scrollToShop}
        aria-label="Previous Slide"
        className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-[#1A0B26]/80 hover:bg-[#1A0B26] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
      >
        <span className="text-base font-bold">‹</span>
      </button>

      <button
        onClick={scrollToShop}
        aria-label="Next Slide"
        className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-[#1A0B26]/80 hover:bg-[#1A0B26] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
      >
        <span className="text-base font-bold">›</span>
      </button>

      {/* 2. SPLIT EDITORIAL HERO COMPOSITION (100% MATCHING REFERENCE) */}
      <div
        className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto"
        style={{ position: "relative", zIndex: 20, minHeight: "560px" }}
      >
        {/* LEFT COLUMN: EDITORIAL TYPOGRAPHY & CALL TO ACTION */}
        <div className="lg:col-span-6 flex flex-col justify-center items-start space-y-4 sm:space-y-6 pt-4 lg:pt-0">
          <div className="space-y-1 sm:space-y-2">
            {/* 'BloomCare' in Giant High-Contrast White Serif */}
            <h1
              className="font-editorial-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[1.08]"
              style={{
                textShadow: "0 4px 30px rgba(90, 30, 130, 0.35), 0 1px 2px rgba(0, 0, 0, 0.15)",
              }}
            >
              BloomCare
            </h1>

            {/* 'The Future of Intimate Wellness' in Rich Deep Plum Serif */}
            <h2
              className="font-editorial-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-medium leading-[1.25]"
              style={{
                color: "#351543",
                textShadow: "0 2px 20px rgba(255, 255, 255, 0.4)",
              }}
            >
              The Future of
              <br />
              Intimate Wellness
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#46235B] max-w-md leading-relaxed font-normal">
            พื้นที่สำหรับดูแลสุขภาวะทางเพศอย่างอบอุ่น ปลอดภัย ไร้การตัดสิน
            ด้วยระบบดิจิทัลและ AI Companion ที่เข้าใจคุณ
          </p>

          {/* Frosted Glass CTA Button: 'Begin Your Journey' (Matching Reference Pill) */}
          <div className="pt-2 sm:pt-4">
            <button
              onClick={scrollToShop}
              className="px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold text-[#2D143D] cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1.5px solid rgba(255, 255, 255, 0.85)",
                boxShadow: "0 10px 30px rgba(130, 60, 180, 0.22), inset 0 1px 3px rgba(255, 255, 255, 0.9)",
              }}
            >
              <span>Begin Your Journey</span>
              <span className="ml-2 font-bold text-xs opacity-75">➔</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D PRISMATIC CRYSTAL HALO & MASCOT (LUMI) */}
        <div
          className="lg:col-span-6 flex items-center justify-center"
          style={{
            position: "relative",
            minHeight: "520px",
            perspective: "1200px",
          }}
        >
          {/* --- 3D ROTATING PRISMATIC CRYSTAL RING --- */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              if (activeItem === null) setIsPaused(false);
            }}
            className="absolute flex items-center justify-center"
            style={{
              width: `${orbitRadius * 2}px`,
              height: `${orbitRadius * 2}px`,
              transformStyle: "preserve-3d",
              transform: `rotateX(${tiltAngleX}deg) rotateY(${mouseParallax.x * 0.35}deg) rotateZ(${orbitAngle}deg)`,
              transition: isPaused ? "transform 0.2s ease-out" : "none",
              zIndex: 10,
            }}
          >
            {/* Visual Prismatic Glass Ring Track (Multi-layered Iridescent Sheen) */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: "3px solid rgba(255, 255, 255, 0.85)",
                boxShadow: "0 0 50px rgba(255, 255, 255, 0.65), inset 0 0 35px rgba(233, 213, 255, 0.45)",
                background: `conic-gradient(from ${orbitAngle * 2}deg, rgba(255, 255, 255, 0.2), rgba(233, 213, 255, 0.5), rgba(244, 114, 182, 0.3), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2))`,
              }}
            />

            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: "16px",
                border: "1.5px dashed rgba(255, 255, 255, 0.65)",
              }}
            />

            {/* 4 INTERACTIVE FROSTED-GLASS VOICE CAPSULES (MATCHING REFERENCE PILLS) */}
            {QA_ITEMS.map((item) => {
              const angleRad = (item.baseAngle * Math.PI) / 180;
              const x = Math.cos(angleRad) * orbitRadius;
              const y = Math.sin(angleRad) * orbitRadius;

              const worldAngle = (item.baseAngle + orbitAngle) % 360;
              const isFront = worldAngle > 20 && worldAngle < 200;

              return (
                <div
                  key={item.id}
                  className="absolute flex items-center justify-center"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `translate3d(${x}px, ${y}px, 0)`,
                    zIndex: isFront ? 35 : 8,
                  }}
                >
                  {/* Counter-rotate the capsule so its text remains perfectly upright facing camera */}
                  <button
                    onClick={() => handleSelectCapsule(item.id)}
                    className="p-3 sm:p-3.5 rounded-full text-left cursor-pointer transition-all duration-300 hover:scale-110 group pointer-events-auto shadow-md"
                    style={{
                      transform: `rotateZ(${-orbitAngle}deg) rotateX(${-tiltAngleX}deg)`,
                      background: "rgba(255, 255, 255, 0.58)",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      border: "1.5px solid rgba(255, 255, 255, 0.88)",
                      boxShadow: "0 10px 30px rgba(110, 50, 160, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.9)",
                      maxWidth: "235px",
                      minWidth: "185px",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm drop-shadow-[0_0_6px_#FFF]">{item.icon}</span>
                      <span className="text-[10px] font-mono text-[#582173] font-bold uppercase tracking-wider">
                        {item.tag}
                      </span>
                      <span className="text-[10px] text-[#A855F7] group-hover:scale-125 transition-transform">
                        🔊
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#2D143D] leading-snug">
                      {item.title}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* 3D LUMI MASCOT (THE CENTER COMPANION - INSIDE THE RING) */}
          <div
            onClick={handleWaveBunny}
            className="flex flex-col items-center cursor-pointer group select-none"
            style={{
              position: "relative",
              zIndex: 15,
              transform: `translate3d(${mouseParallax.x * -0.35}px, ${mouseParallax.y * -0.35}px, 0)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            {/* Welcome Speech Balloon (เปิดเข้ามาทักทายก่อน!) */}
            <div
              className="mb-2 px-4 py-2 rounded-full text-xs font-bold text-[#2D143D] shadow-[0_8px_25px_rgba(140,70,190,0.25)] flex items-center gap-2 animate-bounce"
              style={{
                background: "rgba(255, 255, 255, 0.78)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1.5px solid rgba(255, 255, 255, 0.95)",
              }}
            >
              <span className="text-sm">👋</span>
              <span>{bunnyGreeting}</span>
            </div>

            {/* THE AUTHENTIC 3D CHARACTER MODEL (LUMI) */}
            <div className="relative group-hover:scale-105 transition-transform duration-300">
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(255, 255, 255, 0.75) 0%, rgba(233, 213, 255, 0.4) 50%, transparent 75%)",
                  filter: "blur(30px)",
                  transform: "scale(1.15)",
                }}
              />

              <img
                src="/images/lumi-3d-model.png"
                alt="Lumi 3D Astronaut Bunny"
                className="relative w-56 sm:w-68 h-auto drop-shadow-[0_20px_45px_rgba(80,30,120,0.3)] pointer-events-none"
                style={{
                  filter: "drop-shadow(0 0 25px rgba(255, 255, 255, 0.6))",
                }}
              />
            </div>

            {/* Mascot Name Badge */}
            <div
              className="mt-1 px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm"
              style={{
                background: "rgba(255, 255, 255, 0.65)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.9)",
                color: "#3D184E",
              }}
            >
              <span className="font-extrabold text-[#2D143D]">LUMI</span>
              <span className="text-[#582173]">✦ AI COMPANION (คลิกเพื่อคุย)</span>
            </div>
          </div>

          {/* EXPANDED FROSTED GLASS ANSWER MODAL */}
          {activeItem !== null && (
            <div
              className="glass-prismatic-modal absolute inset-x-2 sm:inset-x-6 z-50 p-6 sm:p-7 rounded-3xl animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{QA_ITEMS[activeItem].icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#582173] font-bold uppercase tracking-wider">
                        {QA_ITEMS[activeItem].tag}
                      </span>
                      <span className="text-[10px] text-[#A855F7] animate-pulse font-mono font-bold">
                        [LUMI SPEAKING ✦ กำลังพูด]
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#2D143D]">
                      {QA_ITEMS[activeItem].title}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full text-[#2D143D] font-bold flex items-center justify-center text-sm bg-white/60 hover:bg-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p
                className="text-xs sm:text-sm text-[#3D184E] leading-relaxed mb-4 p-4 rounded-2xl"
                style={{
                  background: "rgba(255, 255, 255, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.9)",
                }}
              >
                {QA_ITEMS[activeItem].detail}
              </p>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                <button
                  onClick={() => speakThai(QA_ITEMS[activeItem].speech)}
                  className="text-xs text-[#582173] flex items-center gap-1.5 font-bold hover:underline cursor-pointer"
                >
                  <span>🔄</span>
                  <span>กดเพื่อให้น้องพูดคำตอบซ้ำอีกรอบ</span>
                </button>

                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-full font-bold text-xs shadow-md transition-all hover:scale-105 cursor-pointer bg-white text-[#2D143D] border border-white"
                >
                  เข้าใจแล้ว ขอบคุณนะ ✨
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTTOM FOOTER BAR (18+ & SCROLL TEASER) */}
      <div
        className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"
        style={{
          position: "relative",
          zIndex: 30,
          borderTop: "1px solid rgba(255, 255, 255, 0.35)",
        }}
      >
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#582173]">
          <span className="font-bold">AGE VERIFICATION: 18+</span>
          <span className="opacity-40">|</span>
          <span className="text-[#2D143D] font-semibold">ZERO-JUDGMENT SANCTUARY</span>
        </div>

        {/* Scroll to Shop Indicator */}
        <button
          onClick={scrollToShop}
          className="flex items-center gap-2 text-xs font-semibold text-[#3D184E] hover:text-[#2D143D] transition-colors cursor-pointer"
        >
          <span>SCROLL DOWN TO ENTER STORE</span>
          <span className="animate-bounce font-bold">↓</span>
        </button>
      </div>
    </section>
  );
}
