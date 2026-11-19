"use client";

const MARQUEE_ITEMS = [
  { text: "A Living Digital Sanctuary", style: "font-display-luxury italic text-xl sm:text-2xl" },
  { text: "100% PRIVATE & ZERO JUDGMENT", style: "editorial-tag text-[11px] tracking-[0.2em]" },
  { text: "พื้นที่ปลอดภัยที่รับฟังด้วยหัวใจ", style: "font-thai-serif text-base sm:text-lg" },
  { text: "DISCREET PACKAGING GUARANTEE", style: "editorial-tag text-[11px] tracking-[0.2em]" },
  { text: "Intimate Wellness Elevated", style: "font-display-luxury italic text-xl sm:text-2xl" },
  { text: "EMPATHETIC LUMI AI COMPANION", style: "editorial-tag text-[11px] tracking-[0.2em]" },
];

export function EditorialMarquee() {
  return (
    <div
      aria-hidden="true"
      className="relative z-20 w-full overflow-hidden border-y border-white/60 py-4 sm:py-5 select-none group"
      style={{
        background: "rgba(255, 255, 255, 0.42)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="flex w-max items-center animate-editorial-marquee group-hover:[animation-play-state:paused]">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12">
            {MARQUEE_ITEMS.map((item, idx) => (
              <div key={`${dup}-${idx}`} className="flex items-center gap-8 sm:gap-12">
                <span className={`${item.style} text-[#24112E]/85 whitespace-nowrap`}>
                  {item.text}
                </span>
                <span className="text-[#8B5CF6] text-xs opacity-70">✦</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
