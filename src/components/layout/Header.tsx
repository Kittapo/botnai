"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useUiStore } from "@/store/ui";

const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function Header() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const voiceOn = useUiStore((s) => s.voiceEnabled);
  const toggleVoice = useUiStore((s) => s.toggleVoice);
  const isHydrated = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot
  );

  const totalCount = isHydrated
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-6 sm:px-12 py-5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo (Awwwards High-Fashion Luxury Display Serif) */}
        <Link href="/" className="flex items-center gap-2 group" data-cursor-label="HOME">
          <span className="font-display-luxury text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-white drop-shadow-[0_2px_12px_rgba(80,30,120,0.28)]">
            BloomCare
          </span>
        </Link>

        {/* Minimalist Translucent Nav Pills */}
        <nav className="flex items-center gap-2 sm:gap-3 text-xs font-medium">
          {/* Voice Toggle Button */}
          <button
            onClick={toggleVoice}
            id="global-voice-toggle"
            title="เปิด/ปิดเสียงพูดตอบภาษาไทยของน้อง Lumi"
            className="px-4 py-2 rounded-full glass-prismatic-pill text-[#3D184E] text-[11px] font-bold flex items-center gap-1.5 transition-all"
          >
            <span>{voiceOn ? "🔊" : "🔇"}</span>
            <span className="hidden sm:inline">
              {voiceOn ? "เสียงพูดน้อง: เปิด" : "เสียงพูดน้อง: ปิด"}
            </span>
          </button>

          <Link
            href="/"
            className={`px-4 py-2 rounded-full glass-prismatic-pill transition-all ${
              pathname === "/"
                ? "bg-white/80 text-[#24112E] font-bold shadow-sm"
                : "text-[#5C3275] hover:text-[#24112E]"
            }`}
          >
            Sanctuary
          </Link>

          <Link
            href="/ai"
            className={`px-4 py-2 rounded-full glass-prismatic-pill transition-all ${
              pathname.startsWith("/ai")
                ? "bg-white/80 text-[#24112E] font-bold shadow-sm"
                : "text-[#5C3275] hover:text-[#24112E]"
            }`}
          >
            <span>✦ Lumi AI</span>
          </Link>

          <Link
            href="/shop"
            className={`px-4 py-2 rounded-full glass-prismatic-pill transition-all ${
              pathname.startsWith("/shop")
                ? "bg-white/80 text-[#24112E] font-bold shadow-sm"
                : "text-[#5C3275] hover:text-[#24112E]"
            }`}
          >
            Store [ร้านค้า]
          </Link>

          <Link
            href="/knowledge"
            className={`hidden sm:inline-block px-4 py-2 rounded-full glass-prismatic-pill transition-all ${
              pathname.startsWith("/knowledge")
                ? "bg-white/70 text-[#2D143D] font-bold shadow-sm"
                : "text-[#4A205E] hover:text-[#2D143D]"
            }`}
          >
            Knowledge
          </Link>

          <Link
            href="/cart"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FFFFFF] to-[#F3E8FF] text-[#2D143D] font-bold text-xs shadow-md border border-white hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <span>🛒</span>
            <span>Cart ({totalCount})</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
