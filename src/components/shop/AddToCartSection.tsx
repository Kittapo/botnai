"use client";

import { useState } from "react";
import Link from "next/link";
import { type Product } from "@/data/products";
import { useCartStore } from "@/store/cart";

export function AddToCartSection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem(product.id, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 3500);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-purple-100">
      <div className="flex items-center gap-4">
        {/* Quantity selector */}
        <div className="flex items-center gap-3 bg-white/90 px-3.5 py-2 rounded-full border border-purple-200 shadow-sm">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-7 h-7 rounded-full hover:bg-purple-100 font-bold text-sm text-[#24112E] flex items-center justify-center transition-colors"
          >
            -
          </button>
          <span className="font-bold text-sm text-[#24112E] px-2">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-7 h-7 rounded-full hover:bg-purple-100 font-bold text-sm text-[#24112E] flex items-center justify-center transition-colors"
          >
            +
          </button>
        </div>

        {/* Add button */}
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 py-3.5 px-6 rounded-full font-bold text-sm text-white shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
          }}
        >
          <span>🛒</span>
          <span>ใส่ตะกร้าสินค้า</span>
        </button>
      </div>

      {/* Instant Feedback Toast */}
      {added && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>เพิ่ม {product.nameTh} ({quantity} ชิ้น) ลงในตะกร้าแล้ว!</span>
          </div>
          <Link
            href="/cart"
            className="underline font-bold text-[#6D28D9] hover:text-[#5B21B6]"
          >
            ไปที่ตะกร้า ➔
          </Link>
        </div>
      )}
    </div>
  );
}
