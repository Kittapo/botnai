"use client";

import { useState } from "react";
import Link from "next/link";

function calculateCondomSize(circumferenceCm: number) {
  if (circumferenceCm < 10.8) {
    return {
      sizeMm: 49,
      label: "ไซส์กระชับพอดี (Snug Fit)",
      tip: "เหมาะมากสำหรับความกระชับแนบสนิท ช่วยป้องกันอาการหลุดเลื่อนระหว่างมีเพศสัมพันธ์ได้อย่างมีประสิทธิภาพสูงสุด",
      badgeColor: "bg-purple-100 text-[#6D28D9] border-purple-200",
    };
  }
  if (circumferenceCm < 12.1) {
    return {
      sizeMm: 52,
      label: "ไซส์มาตรฐานยอดนิยม (Standard Fit)",
      tip: "ไซส์มาตรฐานที่คนไทยส่วนใหญ่ใส่สบายที่สุด กระชับพอดี ไม่รัดจนอึดอัด และหาซื้อง่ายทุกรุ่น",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }
  if (circumferenceCm < 13.0) {
    return {
      sizeMm: 54,
      label: "ไซส์กว้างสบาย (Comfort Fit)",
      tip: "ให้ความรู้สึกโปร่งสบาย ลดแรงบีบรัดบริเวณโคน ช่วยให้เลือดไหลเวียนดีและลดความเสี่ยงถุงยางฉีกขาด",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    };
  }
  return {
    sizeMm: 56,
    label: "ไซส์ใหญ่พิเศษ (Large Fit)",
    tip: "ออกแบบมาเพื่อความสบายสูงสุดสำหรับสรีระขนาดใหญ่ ป้องกันการรัดแน่นเกินไปและการแตกฉีกขาดขณะใช้งาน",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  };
}

export function SizingCalculator() {
  const [circumference, setCircumference] = useState(11.4);
  const result = calculateCondomSize(circumference);
  const inches = (circumference / 2.54).toFixed(2);

  return (
    <section
      aria-label="Interactive Condom Sizing Calculator"
      className="mb-14 sm:mb-16 rounded-[2.25rem] p-7 sm:p-10 lg:p-12 shadow-[0_24px_65px_rgba(70,20,110,0.13)]"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.86) 0%, rgba(248,239,252,0.78) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1.5px solid rgba(255, 255, 255, 0.98)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Interactive Slider Controls */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="editorial-tag text-[10px] font-bold text-[#6D28D9] bg-white px-3.5 py-1 rounded-full border border-purple-100 shadow-xs">
              INTERACTIVE TOOL // เครื่องมือคำนวณไซส์อัจฉริยะ
            </span>
            <span className="text-[11px] font-semibold text-emerald-700">
              🔒 คำนวณในเครื่องคุณ 100% ไม่ส่งข้อมูลออก
            </span>
          </div>

          <div>
            <h2 className="font-thai-serif text-2xl sm:text-3xl font-semibold text-[#24112E] leading-snug">
              วัดไซส์ที่ใช่... เพื่อความปลอดภัยและสบายตัวที่สุด
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[#5C3275] leading-relaxed">
              ใช้สายวัดหรือกระดาษพันรอบส่วนที่กว้างที่สุดขณะแข็งตัวเต็มที่
              แล้วเลื่อนแถบด้านล่างเพื่อดูขนาดถุงยางอนามัยที่เหมาะสมกับคุณ
            </p>
          </div>

          {/* Slider Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/85 border border-purple-100 shadow-xs space-y-4">
            <div className="flex items-end justify-between">
              <label
                htmlFor="sizing-slider"
                className="text-xs sm:text-sm font-bold text-[#24112E]"
              >
                เส้นรอบวงที่วัดได้ (Circumference)
              </label>
              <div className="text-right">
                <span className="font-display-luxury text-3xl sm:text-4xl font-semibold text-[#6D28D9]">
                  {circumference.toFixed(1)}
                </span>
                <span className="ml-1 text-xs font-bold text-[#5C3275]">
                  ซม.
                </span>
                <span className="ml-2 text-[11px] text-[#887499]">
                  ({inches} นิ้ว)
                </span>
              </div>
            </div>

            <input
              id="sizing-slider"
              type="range"
              min={9.5}
              max={14.5}
              step={0.1}
              value={circumference}
              onChange={(e) => setCircumference(parseFloat(e.target.value))}
              className="w-full h-2.5 rounded-full appearance-none cursor-pointer accent-[#6D28D9] bg-purple-100"
            />

            <div className="flex justify-between text-[10px] font-mono text-[#7A618C]">
              <span>9.5 ซม. (49 มม.)</span>
              <span>11.5 ซม. (52 มม.)</span>
              <span>12.5 ซม. (54 มม.)</span>
              <span>14.5 ซม. (56 มม.)</span>
            </div>
          </div>
        </div>

        {/* Right: Recommended Size Display Card */}
        <div
          className="lg:col-span-5 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center shadow-[0_16px_45px_rgba(109,40,217,0.12)]"
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            border: "1.5px solid rgba(233, 213, 255, 0.9)",
          }}
        >
          <span className="editorial-tag text-[10px] text-[#664A73] tracking-[0.2em]">
            RECOMMENDED NOMINAL WIDTH
          </span>

          <div className="my-2 flex items-baseline justify-center gap-1.5">
            <span className="font-display-luxury text-7xl sm:text-8xl font-semibold tracking-[-0.04em] text-[#24112E] leading-none">
              {result.sizeMm}
            </span>
            <span className="font-display-luxury italic text-2xl text-[#6D28D9] font-medium">
              mm
            </span>
          </div>

          <span
            className={`mt-1 px-3.5 py-1 rounded-full text-xs font-bold border ${result.badgeColor}`}
          >
            {result.label}
          </span>

          <p className="mt-4 text-xs sm:text-sm text-[#4D2862] leading-relaxed">
            {result.tip}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-2.5 w-full">
            <Link
              href="/shop"
              data-cursor-label="SHOP"
              className="flex-1 py-3 px-4 rounded-full text-xs font-bold text-white shadow-md hover:scale-105 transition-all text-center"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              }}
            >
              ดูสินค้าไซส์ {result.sizeMm} มม. ➔
            </Link>
            <Link
              href="/ai"
              className="py-3 px-4 rounded-full text-xs font-bold text-[#6D28D9] bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors text-center"
            >
              ถาม Lumi AI
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
