"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart";

const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function Header() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const isHydrated = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot
  );

  const [voiceOn, setVoiceOn] = useState(true);

  const totalCount = isHydrated
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-6 sm:px-12 py-5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo (Ref Matching: Clean Elegant Serif 'BloomCare') */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-editorial-serif text-2xl sm:text-3xl font-semibold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(80,30,120,0.25)]">
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
                ? "bg-white/70 text-[#2D143D] font-bold shadow-sm"
                : "text-[#4A205E] hover:text-[#2D143D]"
            }`}
          >
            Cover
          </Link>

          <Link
            href="/shop"
            className={`px-4 py-2 rounded-full glass-prismatic-pill transition-all ${
              pathname.startsWith("/shop")
                ? "bg-white/70 text-[#2D143D] font-bold shadow-sm"
                : "text-[#4A205E] hover:text-[#2D143D]"
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
