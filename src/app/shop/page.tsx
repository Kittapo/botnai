"use client";

import { useMemo, useState } from "react";
import { PRODUCTS, type Product } from "@/data/products";
import { useUiStore } from "@/store/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { Shop3D } from "@/components/shop/Shop3D";
import { ProductDetailsModal } from "@/components/shop/ProductDetailsModal";

export default function ShopPage() {
  const shopMode = useUiStore((s) => s.shopMode);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [active3dProduct, setActive3dProduct] = useState<Product>(PRODUCTS[0]);

  // Filter products by category and search keyword
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category match
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNameTh = product.nameTh.toLowerCase().includes(q);
        const matchesNameEn = product.nameEn.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesFeatures = product.features.some((f) =>
          f.toLowerCase().includes(q)
        );
        const matchesSize =
          product.sizeMm !== null && `${product.sizeMm}`.includes(q);

        return (
          matchesNameTh ||
          matchesNameEn ||
          matchesBrand ||
          matchesFeatures ||
          matchesSize
        );
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  // Check if selected category has zero products in total catalog
  const isCategoryEmpty = useMemo(() => {
    if (selectedCategory === "all") return false;
    const categoryExistsInCatalog = PRODUCTS.some(
      (p) => p.category === selectedCategory
    );
    return !categoryExistsInCatalog;
  }, [selectedCategory]);

  // Current 3D product (ensures it points to an item from filtered list if available)
  const current3dProduct = useMemo(() => {
    const found = filteredProducts.find((p) => p.id === active3dProduct.id);
    return found ?? filteredProducts[0] ?? PRODUCTS[0];
  }, [active3dProduct.id, filteredProducts]);

  return (
    <div
      className="flex min-h-[100svh] flex-col justify-between selection:bg-[#E9D5FF] selection:text-[#24112E]"
      style={{
        background:
          "radial-gradient(circle at 65% 20%, #FAF2FF 0%, #EFE1FA 45%, #E3D1F5 75%, #D4BAEC 100%)",
      }}
    >
      <Header />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[1440px] flex-1 px-5 pt-28 pb-20 sm:px-8 lg:px-12"
      >
        <ShopHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          resultCount={filteredProducts.length}
        />

        <div className="mt-8">
          {shopMode === "grid" ? (
            <ShopGrid
              products={filteredProducts}
              searchQuery={searchQuery}
              isCategoryEmpty={isCategoryEmpty}
              onOpenDetails={setDetailsProduct}
            />
          ) : (
            <Shop3D
              products={filteredProducts}
              selectedProduct={current3dProduct}
              onSelectProduct={setActive3dProduct}
              onOpenDetails={setDetailsProduct}
              isCategoryEmpty={isCategoryEmpty}
            />
          )}
        </div>
      </main>

      <ProductDetailsModal
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
      />

      <Footer />
    </div>
  );
}
