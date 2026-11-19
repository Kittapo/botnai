"use client";

import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brand";
import { COMPLIANCE_COPY } from "@/config/compliance";
import { COPY_TH } from "@/content/copy.th";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="relative z-10 overflow-hidden border-t border-white/65"
      style={{
        background:
          "linear-gradient(180deg, rgba(250, 247, 242, 0.85) 0%, rgba(239, 225, 250, 0.94) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 pt-16 pb-10">
        {/* Top Swiss Editorial Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Brand Essence */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="editorial-tag text-[10px] font-bold text-[#6D28D9] bg-white/75 px-3 py-1 rounded-full border border-white/90">
                BLOOMCARE // EDITION 2026
              </span>
              <span className="text-[11px] font-semibold text-emerald-700">
                ✓ 100% Private Sanctuary
              </span>
            </div>

            <p className="font-thai-serif text-base sm:text-lg leading-relaxed text-[#24112E] max-w-[46ch]">
              {COMPLIANCE_COPY.brandStatement}
            </p>
          </div>

          {/* Curated Navigation */}
          <nav
            aria-label={COPY_TH.a11y.footerNav}
            className="lg:col-span-4 flex flex-col gap-2"
          >
            <span className="editorial-tag text-[10px] text-[#664A73] mb-2">
              EXPLORE SANCTUARY
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/", label: "01 · Sanctuary" },
                { href: "/ai", label: "02 · Lumi AI" },
                { href: "/shop", label: "03 · Boutique" },
                { href: "/knowledge", label: "04 · Archive" },
                { href: "/cart", label: "05 · Discreet Cart" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-cursor="interactive"
                  className="inline-flex items-center py-1.5 text-sm font-medium text-[#3A1448] hover:text-[#6D28D9] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Back to Top Magnetic Action */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-between">
            <button
              type="button"
              onClick={scrollToTop}
              data-cursor-label="TOP ↑"
              className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass-prismatic-pill text-xs font-bold text-[#24112E] cursor-pointer"
            >
              <span className="editorial-tag text-[10px]">BACK TO TOP</span>
              <span className="group-hover:-translate-y-1 transition-transform">
                ↑
              </span>
            </button>

            <p className="mt-6 text-[11px] font-mono tracking-wider text-[#664A73] lg:text-right">
              13.75°N · 100.50°E — BANGKOK
            </p>
          </div>
        </div>

        {/* Privacy, Discreet Packaging & Compliance Disclaimers */}
        <div className="mt-12 border-t border-[#24112E]/10 pt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-10">
          <div className="space-y-2.5">
            <p className="text-xs leading-relaxed text-[#5C3275]">
              {COMPLIANCE_COPY.privacyAndPackaging}
            </p>
            <p className="text-xs leading-relaxed text-[#5C3275]">
              {COMPLIANCE_COPY.purchaseAndAgeDisclaimer}
            </p>
          </div>
          <div className="space-y-2.5">
            <p className="text-xs leading-relaxed text-[#5C3275]">
              {COMPLIANCE_COPY.medicalDisclaimer}
            </p>
            <p className="text-[11px] leading-relaxed text-[#7A618C]">
              {COMPLIANCE_COPY.trademarkNotice}
            </p>
          </div>
        </div>

        {/* MONUMENTAL AWWWARDS EDITORIAL WORDMARK */}
        <div className="mt-10 pt-6 border-t border-[#24112E]/10 flex flex-col items-center">
          <Link
            href="/"
            data-cursor-label="HOME"
            className="font-display-luxury text-[clamp(4rem,13.5vw,11.5rem)] font-semibold tracking-[-0.04em] leading-[0.86] text-[#24112E]/90 hover:text-[#6D28D9] transition-colors duration-500 select-none text-center"
          >
            {BRAND_CONFIG.wordmark}
          </Link>
        </div>
      </div>
    </footer>
  );
}
