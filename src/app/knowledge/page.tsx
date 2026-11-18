import { COPY_TH } from "@/content/copy.th";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function KnowledgePlaceholderPage() {
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
            {COPY_TH.placeholders.knowledge.title}
          </h1>

          <p className="mt-4 text-[1rem] text-[#45424F] leading-[1.72]">
            {COPY_TH.placeholders.knowledge.description}
          </p>

          <div className="mt-8">
            <Button href="/" variant="secondary" size="md">
              {COPY_TH.nav.backHome}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
