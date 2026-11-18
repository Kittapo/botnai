import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brand";
import { COMPLIANCE_COPY } from "@/config/compliance";
import { COPY_TH } from "@/content/copy.th";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-background/94 backdrop-blur-sm">
      <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-16 sm:px-8 lg:px-12 lg:pb-20 lg:pt-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand Statement */}
          <div className="lg:col-span-6">
            <Link
              href="/"
              data-cursor="interactive"
              className="inline-flex min-h-[44px] items-center font-sans text-[1.35rem] font-semibold tracking-[-0.02em] text-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-strong"
            >
              <span>{BRAND_CONFIG.wordmark}</span>
              <span
                aria-hidden="true"
                className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary"
              />
            </Link>
            <p className="mt-4 max-w-[54ch] text-[1rem] leading-[1.75] text-[#45424F]">
              {COMPLIANCE_COPY.brandStatement}
            </p>
          </div>

          {/* Placeholder Route Links */}
          <nav
            aria-label={COPY_TH.a11y.footerNav}
            className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4 lg:col-span-6 lg:justify-end lg:items-start"
          >
            {[
              { href: "/shop", label: COPY_TH.nav.shop },
              { href: "/ai", label: COPY_TH.nav.ai },
              { href: "/knowledge", label: COPY_TH.nav.knowledge },
              { href: "/cart", label: COPY_TH.nav.cart },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-cursor="interactive"
                className="inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-[0.95rem] font-medium leading-[1.5] text-text transition-colors duration-150 hover:bg-secondary/50 hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Privacy, Discreet Packaging & Compliance Disclaimers */}
        <div className="mt-12 border-t border-border pt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-10">
          <div className="space-y-3">
            <p className="text-[0.875rem] leading-[1.75] text-[#4A4754]">
              {COMPLIANCE_COPY.privacyAndPackaging}
            </p>
            <p className="text-[0.875rem] leading-[1.75] text-[#4A4754]">
              {COMPLIANCE_COPY.purchaseAndAgeDisclaimer}
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-[0.875rem] leading-[1.75] text-[#4A4754]">
              {COMPLIANCE_COPY.medicalDisclaimer}
            </p>
            <p className="text-[0.8125rem] leading-[1.7] text-[#575462]">
              {COMPLIANCE_COPY.trademarkNotice}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
