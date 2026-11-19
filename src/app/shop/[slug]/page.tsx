import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { COPY_TH } from "@/content/copy.th";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/PriceTag";
import { DemoRating } from "@/components/ui/DemoRating";
import { Product3DViewer } from "@/components/shop/Product3DViewer";
import { AddToCartSection } from "@/components/shop/AddToCartSection";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex min-h-[100svh] flex-col justify-between bg-background selection:bg-secondary selection:text-text">
      <Header />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[1440px] flex-1 px-5 pt-28 pb-20 sm:px-8 lg:px-12"
      >
        <div className="mb-6 flex items-center gap-2 text-xs text-[#635F70]">
          <Link href="/shop" className="hover:text-primary-strong">
            {COPY_TH.nav.shop}
          </Link>
          <span>/</span>
          <span className="text-text">{product.nameTh}</span>
        </div>

        <div className="grid grid-cols-1 gap-10 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-10 md:grid-cols-12 lg:gap-14">
          <div className="md:col-span-5">
            <Product3DViewer
              product={product}
              height="400px"
              showHint={true}
            />
          </div>

          <div className="flex flex-col justify-between md:col-span-7">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-strong">
                {product.brand}
              </span>
              <h1 className="mt-1 text-[clamp(1.6rem,2.8vw,2.2rem)] font-semibold text-text leading-[1.32]">
                {product.nameTh}
              </h1>
              <p className="mt-1 font-sans text-xs text-[#5D5A68]">
                {product.nameEn}
              </p>

              <div className="mt-4">
                <DemoRating show={product.showDemoRating} />
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <dl className="divide-y divide-border border-y border-border text-[0.95rem]">
                  <div className="flex items-center justify-between py-3">
                    <dt className="text-[#5B5768]">{COPY_TH.shop.packLabel}</dt>
                    <dd className="font-medium text-text">
                      {COPY_TH.scene04.packFormat(product.packCount)}
                    </dd>
                  </div>

                  {product.sizeMm !== null && (
                    <div className="flex items-center justify-between py-3">
                      <dt className="text-[#5B5768]">{COPY_TH.scene04.sizeLabel}</dt>
                      <dd className="font-medium text-text">
                        {COPY_TH.scene04.sizeFormat(product.sizeMm)}
                      </dd>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-3">
                    <dt className="text-[#5B5768]">{COPY_TH.scene04.priceLabel}</dt>
                    <dd>
                      <PriceTag price={product.price} size="md" />
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-5 space-y-2 rounded-2xl bg-accent-cream/60 p-4 text-xs text-[#575363] leading-[1.6]">
                <p className="font-semibold text-text">
                  {COPY_TH.shop.noticeHeading}
                </p>
                <p>
                  คำแนะนำและการใช้งาน:{" "}
                  {product.usage ?? COPY_TH.productFallbacks.infoPending}
                </p>
                <p>
                  คำเตือน:{" "}
                  {product.warnings && product.warnings.length > 0
                    ? product.warnings.join(", ")
                    : COPY_TH.productFallbacks.infoPending}
                </p>
              </div>
              <div className="mt-6">
                <AddToCartSection product={product} />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/shop" variant="secondary" size="md">
                ← กลับไปยังร้านค้า
              </Button>
              <Button href="/cart" variant="primary" size="md">
                ดูตะกร้าสินค้า ({product.brand})
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}
