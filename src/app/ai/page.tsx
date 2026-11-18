import { COPY_TH } from "@/content/copy.th";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function AiPlaceholderPage() {
  return (
    <div className="flex min-h-[100svh] flex-col justify-between bg-background pt-24">
      <main
        id="main-content"
        className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-12 sm:px-8 lg:px-12"
      >
        <div className="max-w-[680px]">
          <span className="inline-flex rounded-full bg-secondary/75 px-3.5 py-1 text-[0.8125rem] font-medium text-primary-strong">
            {COPY_TH.placeholders.phaseBadge}
          </span>

          <h1 className="mt-4 text-[clamp(1.85rem,3.2vw,2.65rem)] font-semibold text-text leading-[1.35]">
            {COPY_TH.placeholders.ai.title}
          </h1>

          {/* Honest AI connection status per Rule A7 */}
          <div
            role="status"
            className="mt-6 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-cream px-3.5 py-1.5 text-[0.875rem] font-semibold text-[#4C4757]">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-primary-strong"
              />
              <span>{COPY_TH.placeholders.ai.statusNotConnected}</span>
            </div>

            <p className="mt-4 text-[1rem] text-[#45424F] leading-[1.72]">
              {COPY_TH.placeholders.ai.description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/" variant="secondary" size="md">
              {COPY_TH.nav.backHome}
            </Button>
            <Button href="/shop" variant="primary" size="md">
              {COPY_TH.scene01.secondaryCta}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
