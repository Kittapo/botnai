"use client";

import { useState } from "react";
import Link from "next/link";
import { COPY_TH } from "@/content/copy.th";
import { getProductById } from "@/data/products";
import { useCartStore } from "@/store/cart";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/PriceTag";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"promptpay" | "credit" | "cod">("promptpay");
  const [orderPlaced, setOrderPlaced] = useState<{ id: string; date: string } | null>(null);

  const subtotal = items.reduce((sum, item) => {
    const p = getProductById(item.productId);
    return sum + (p && typeof p.price === "number" ? p.price * item.quantity : 0);
  }, 0);

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `BC-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setOrderPlaced({ id: orderId, date: now });
    clearCart();
  };

  return (
    <div
      className="flex min-h-[100svh] flex-col justify-between pt-24 selection:bg-[#E9D5FF] selection:text-[#24112E]"
      style={{
        background:
          "radial-gradient(circle at 65% 20%, #FAF2FF 0%, #EFE1FA 45%, #E3D1F5 75%, #D4BAEC 100%)",
      }}
    >
      <Header />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[1440px] flex-1 px-6 sm:px-10 lg:px-16 py-10 sm:py-14"
      >
        <div className="max-w-[820px] mx-auto">
          {/* Editorial Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="editorial-tag text-[10px] font-bold text-[#6D28D9] bg-white/75 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/90 shadow-sm">
                03 // SECURE CHECKOUT
              </span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50/85 px-2.5 py-0.5 rounded-full border border-emerald-200">
                🔒 100% Discreet Delivery
              </span>
            </div>

            <h1 className="font-editorial-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#24112E] leading-tight">
              {COPY_TH.placeholders.cart.title}
            </h1>

            <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#5C3275]">
              {COPY_TH.placeholders.cart.description}
            </p>
          </div>

          {/* Cart Items Container */}
          <div
            className="rounded-[2rem] p-7 sm:p-10 shadow-[0_25px_60px_rgba(70,20,110,0.12)]"
            style={{
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1.5px solid rgba(255, 255, 255, 0.95)",
            }}
          >
            {items.length === 0 && !orderPlaced ? (
              <div className="py-12 text-center">
                <span className="text-5xl block mb-4">🛍️</span>
                <p className="font-editorial-serif text-xl font-semibold text-[#24112E]">
                  {COPY_TH.placeholders.cart.empty}
                </p>
                <p className="text-xs sm:text-sm text-[#664A73] mt-2 mb-6">
                  เลือกชมสินค้าคุณภาพที่ผ่านการคัดสรรแล้วจาก BloomCare
                </p>
                <Button href="/shop" variant="primary" size="md">
                  ไปที่ร้านค้า ➔
                </Button>
              </div>
            ) : orderPlaced ? (
              /* Success Order Confirmation Card */
              <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-4xl mb-4 shadow-sm">
                  🎉
                </div>

                <span className="editorial-tag text-[10px] text-emerald-700 font-bold block mb-1">
                  ORDER CONFIRMED // สั่งซื้อสำเร็จ
                </span>
                <h2 className="font-editorial-serif text-2xl sm:text-3xl font-bold text-[#24112E]">
                  ขอบคุณที่ไว้วางใจ BloomCare
                </h2>

                <div className="mt-5 p-5 rounded-2xl bg-white/85 border border-purple-100 max-w-md mx-auto text-left shadow-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-purple-100 text-xs">
                    <span className="text-[#664A73]">หมายเลขคำสั่งซื้อ:</span>
                    <strong className="font-mono text-sm text-[#6D28D9]">
                      {orderPlaced.id}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-purple-100 text-xs">
                    <span className="text-[#664A73]">วันที่สั่งซื้อ:</span>
                    <span className="font-medium text-[#24112E]">{orderPlaced.date}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 text-xs">
                    <span className="text-[#664A73]">สถานะการจัดส่ง:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      เตรียมพัสดุนิรนาม (1-2 วัน)
                    </span>
                  </div>
                </div>

                <div className="mt-5 p-4 rounded-2xl bg-[#F8EFFC] border border-[#E9D5FF] max-w-md mx-auto flex items-start gap-3 text-left">
                  <span className="text-xl">📦</span>
                  <div className="text-xs text-[#4D2862] leading-relaxed">
                    <strong>100% Discreet Packaging:</strong> พัสดุจะถูกบรรจุในกล่องเรียบ
                    ไม่มีระบุชื่อสินค้าหรือแบรนด์ใดๆ ทั้งสิ้น สบายใจได้ 100%
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-3">
                  <Button href="/shop" variant="secondary" size="md">
                    เลือกชมสินค้าต่อ
                  </Button>
                  <Button href="/" variant="primary" size="md">
                    กลับสู่หน้าหลัก
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <ul className="divide-y divide-purple-100">
                  {items.map((item) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;
                    return (
                      <li
                        key={item.productId}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-purple-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.imageCutout}
                              alt={product.nameTh}
                              className="max-h-12 w-auto object-contain"
                            />
                          </div>

                          <div>
                            <p className="font-semibold text-[#24112E] leading-snug">
                              {product.nameTh}
                            </p>
                            <p className="text-xs text-[#664A73]">
                              {product.brand} · {product.packCount} ชิ้น/กล่อง
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 pl-20 sm:pl-0">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-2 bg-white/80 px-2.5 py-1 rounded-full border border-purple-100 shadow-sm">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              className="w-6 h-6 rounded-full hover:bg-purple-100 text-[#24112E] font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="font-semibold text-xs text-[#24112E] px-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              className="w-6 h-6 rounded-full hover:bg-purple-100 text-[#24112E] font-bold text-xs"
                            >
                              +
                            </button>
                          </div>

                          <PriceTag
                            price={
                              typeof product.price === "number"
                                ? product.price * item.quantity
                                : null
                            }
                            size="md"
                          />

                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-xs text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
                          >
                            ลบ
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Subtotal Bar */}
                <div className="mt-8 flex items-center justify-between border-t border-purple-100 pt-6">
                  <div>
                    <span className="font-bold text-[#24112E] text-base sm:text-lg">
                      {COPY_TH.placeholders.cart.subtotalLabel}
                    </span>
                    <span className="text-xs text-emerald-700 block font-medium">
                      ✓ รวมภาษีมูลค่าเพิ่มและส่งฟรีพัสดุนิรนามทั่วประเทศ
                    </span>
                  </div>
                  <span className="font-editorial-serif text-2xl sm:text-3xl font-bold text-[#6D28D9]">
                    ฿{subtotal.toLocaleString()}
                  </span>
                </div>

                {/* 100% Discreet Packaging Guarantee Card */}
                <div className="mt-6 p-4 rounded-2xl bg-[#F8EFFC] border border-[#E9D5FF] flex items-start gap-3">
                  <span className="text-2xl">📦</span>
                  <div className="text-xs text-[#4D2862] leading-relaxed">
                    <strong className="text-[#24112E] block mb-0.5">
                      รับประกันความเป็นส่วนตัวสูงสุด (Discreet Packaging)
                    </strong>
                    กล่องพัสดุภายนอกเป็นกล่องลูกฟูกธรรมดา ไม่มีการพิมพ์ชื่อสินค้า
                    ไม่มีการพิมพ์ชื่อแบรนด์ BloomCare มิดชิด ปลอดภัย ไร้กังวล 100%
                  </div>
                </div>

                {/* Checkout Trigger Action */}
                <div className="mt-8 space-y-3">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 rounded-full font-bold text-sm text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                    }}
                  >
                    <span>ดำเนินการสั่งซื้อแบบนิรนาม (Checkout)</span>
                    <span>➔</span>
                  </button>

                  <p className="text-center text-xs text-[#664A73]">
                    รองรับ PromptPay QR Code, บัตรเครดิต, และเก็บเงินปลายทาง (COD)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- DISCREET CHECKOUT MODAL --- */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24112E]/40 backdrop-blur-md animate-in fade-in duration-200">
            <div
              className="glass-prismatic-modal relative w-full max-w-lg p-6 sm:p-8 rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto"
              style={{
                background: "rgba(255, 255, 255, 0.94)",
              }}
            >
              <div className="flex justify-between items-start mb-5">
                <div>
                  <span className="editorial-tag text-[10px] text-[#6D28D9] font-bold block mb-1">
                    DISCREET CHECKOUT // สั่งซื้อนิรนาม
                  </span>
                  <h3 className="font-editorial-serif text-2xl font-bold text-[#24112E]">
                    ข้อมูลจัดส่งแบบมิดชิด
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-8 h-8 rounded-full bg-purple-100 text-[#24112E] font-bold flex items-center justify-center hover:bg-purple-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmOrder} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-[#24112E] mb-1.5">
                    ชื่อผู้รับ (ใช้นามแฝงได้):
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="เช่น คุณสมชาย หรือ นามแฝงที่คุณสะดวก"
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-200 bg-white text-[#24112E] outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#24112E] mb-1.5">
                    เบอร์โทรศัพท์ติดต่อสำหรับจัดส่ง:
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08X-XXX-XXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-purple-200 bg-white text-[#24112E] outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#24112E] mb-1.5">
                    ที่อยู่จัดส่ง:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="บ้านเลขที่, อาคาร, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"
                    className="w-full px-4 py-2 rounded-xl border border-purple-200 bg-white text-[#24112E] outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#24112E] mb-2">
                    เลือกวิธีชำระเงิน:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "promptpay", label: "📱 PromptPay" },
                      { id: "credit", label: "💳 บัตรเครดิต" },
                      { id: "cod", label: "📦 เก็บเงินปลายทาง" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as "promptpay" | "credit" | "cod")}
                        className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                          paymentMethod === m.id
                            ? "bg-[#6D28D9] text-white border-[#6D28D9] shadow-sm"
                            : "bg-white text-[#3A1448] border-purple-200 hover:bg-purple-50"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total and Guarantee Review */}
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between">
                  <span className="font-semibold text-[#24112E]">ยอดชำระทั้งหมด:</span>
                  <span className="font-editorial-serif text-xl font-bold text-[#6D28D9]">
                    ฿{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                  <span>🔒</span>
                  <span>ยืนยันพัสดุนิรนาม ไม่ระบุชื่อสินค้าบนหน้ากล่องเด็ดขาด</span>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-1/3 py-3 rounded-full font-bold text-xs border border-purple-200 text-[#4D2862] hover:bg-purple-50"
                  >
                    ยกเลิก
                  </button>

                  <button
                    type="submit"
                    className="w-2/3 py-3 rounded-full font-bold text-xs text-white shadow-md hover:scale-105 transition-all"
                    style={{
                      background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                    }}
                  >
                    ยืนยันคำสั่งซื้อ ➔
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
