"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingLumiButton() {
  const pathname = usePathname();

  // Hide on Homepage (Lumi is already center stage) and AI page (already inside chat)
  if (pathname === "/" || pathname.startsWith("/ai")) {
    return null;
  }

  return (
    <Link
      href="/ai"
      data-cursor-label="TALK ✦"
      aria-label="เปิดห้องปรึกษากับ Lumi AI Companion"
      className="group fixed bottom-20 right-5 sm:right-6 z-40 flex items-center gap-2.5 rounded-full p-1.5 pr-4 glass-prismatic-pill shadow-[0_14px_35px_rgba(109,40,217,0.22)]"
    >
      <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-[#E9D5FF] to-white border border-white shadow-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/lumi-3d-model.png"
          alt="Lumi AI"
          className="h-9 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
        />
        <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
      </div>

      <div className="hidden sm:flex flex-col text-left">
        <span className="editorial-tag text-[9px] text-[#6D28D9] leading-none">
          LUMI AI ✦
        </span>
        <span className="text-xs font-bold text-[#24112E] mt-0.5">
          มีข้อสงสัย? ถามฉันได้นะ
        </span>
      </div>
    </Link>
  );
}
