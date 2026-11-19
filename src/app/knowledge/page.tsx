"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SizingCalculator } from "@/components/knowledge/SizingCalculator";

const ARTICLES = [
  {
    id: "sizing-guide",
    category: "CLINICAL GUIDE",
    readTime: "4 นาที",
    badge: "บทความยอดนิยม ⭐",
    title: "วิทยาศาสตร์แห่งการเลือกขนาด: คู่มือวัดไซส์ถุงยางอนามัยที่แม่นยำที่สุด",
    excerpt:
      "ทำไมการเลือกไซส์ตามความยาวจึงเป็นความเข้าใจผิดที่อันตราย? เรียนรู้วิธีวัดรอบวงขณะแข็งตัวเต็มที่เพื่อความกระชับ ไม่บีบรัด และไม่หลุดเลื่อนขณะมีเพศสัมพันธ์",
    keyPoints: [
      "วัดความกว้าง (Nominal Width) ไม่ใช่ความยาว",
      "ไซส์ 49, 52, 54, 56 มม. มีความต่างอย่างมีนัยสำคัญ",
      "การใส่ไซส์คับเกินไปเพิ่มโอกาสฉีกขาด",
    ],
    verifiedBy: "คณะที่ปรึกษาสุขภาวะทางเพศ BloomCare",
    date: "พฤศจิกายน 2026",
  },
  {
    id: "lubricants-101",
    category: "WELLNESS CARE",
    readTime: "3 นาที",
    badge: "ความรู้พื้นฐาน",
    title: "สารหล่อลื่นจำเป็นไหม? เปรียบเทียบสูตรน้ำ vs สูตรซิลิโคน",
    excerpt:
      "สารหล่อลื่นไม่ใช่แค่เรื่องของความฝืดเคือง แต่คือหัวใจของการลดรอยถลอกและป้องกันการฉีกขาดของถุงยางอนามัย เจาะลึกจุดเด่นของแต่ละสูตร",
    keyPoints: [
      "สูตรน้ำ (Water-based) ล้างออกง่าย ปลอดภัยกับถุงยางทุกชนิด",
      "ห้ามใช้น้ำมันพืช โลชั่น หรือวาสลีนกับถุงยางลาเท็กซ์เด็ดขาด",
      "ช่วยสร้างความผ่อนคลายและลดอาการเจ็บได้อย่างมีประสิทธิภาพ",
    ],
    verifiedBy: "ฝ่ายวิจัยผลิตภัณฑ์สุขอนามัย",
    date: "พฤศจิกายน 2026",
  },
  {
    id: "discreet-privacy",
    category: "PRIVACY & TRUST",
    readTime: "2 นาที",
    badge: "นโยบายความเป็นส่วนตัว",
    title: "สิทธิในการเข้าถึงสุขภาวะ: ทำไมการแพ็กของแบบมิดชิดจึงสำคัญ",
    excerpt:
      "การดูแลตัวเองไม่ใช่เรื่องน่าอาย แต่ความสบายใจของผู้รับคือสิ่งสูงสุด เรียนรู้มาตรฐานกล่องพัสดุนิรนาม (Discreet Packaging) ของ BloomCare",
    keyPoints: [
      "ไม่มีการพิมพ์ชื่อสินค้าหรือแบรนด์บนหน้ากล่องพัสดุ 100%",
      "ผู้ส่งหรือผู้รับแทนไม่มีทางทราบสิ่งที่อยู่ภายใน",
      "คุ้มครองความเป็นส่วนตัวระดับสากล",
    ],
    verifiedBy: "ทีมรักษาความปลอดภัยข้อมูล BloomCare",
    date: "พฤศจิกายน 2026",
  },
  {
    id: "consent-communication",
    category: "RELATIONSHIP",
    readTime: "5 นาที",
    badge: "ความสัมพันธ์",
    title: "ศิลปะแห่งการสื่อสาร: วิธีเปิดใจคุยเรื่องเซฟเซ็กส์กับคนรักอย่างราบรื่น",
    excerpt:
      "วิธีชวนคุยเรื่องการตรวจสุขภาพและการป้องกันแบบไม่ให้อีกฝ่ายรู้สึกถูกสงสัย เพื่อสร้างความผูกพันที่มั่นใจและปลอดภัยทั้งสองฝ่าย",
    keyPoints: [
      "สื่อสารความต้องการด้วยความเคารพซึ่งกันและกัน",
      "การพกถุงยางไม่ใช่เรื่องน่าสงสัย แต่คือความรับผิดชอบ",
      "สร้างความมั่นใจก่อนมีความสัมพันธ์ทุกครั้ง",
    ],
    verifiedBy: "นักจิตวิทยาความสัมพันธ์ BloomCare",
    date: "ตุลาคม 2026",
  },
];

export default function KnowledgePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredArticles =
    selectedCategory === "ALL"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <div
      className="flex min-h-[100svh] flex-col justify-between pt-24 selection:bg-[#E9D5FF] selection:text-[#24112E]"
      style={{
        background:
          "radial-gradient(circle at 65% 20%, #FAF2FF 0%, #EFE1FA 45%, #E3D1F5 75%, #D4BAEC 100%)",
      }}
    >
      <Header />

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 sm:px-10 lg:px-16 py-10 sm:py-14">
        {/* Editorial Masthead */}
        <header className="max-w-3xl mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="editorial-tag text-[10px] font-bold text-[#6D28D9] bg-white/75 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/90 shadow-sm">
              02 // THE EDITORIAL ARCHIVE
            </span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50/85 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ✓ แหล่งข้อมูลอ้างอิงทางการแพทย์
            </span>
          </div>

          <h1 className="font-editorial-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#24112E] leading-tight">
            คลังความรู้สุขภาวะ
            <br />
            <span className="italic font-normal text-[#4D2862]">
              และความสัมพันธ์ที่ถูกต้อง
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#5C3275]">
            รวบรวมคำตอบและบทความเชิงวิชาการที่ย่อยง่าย เพื่อให้คุณเข้าใจสรีระ ร่างกาย
            และการดูแลสุขภาวะทางเพศของตนเองอย่างมั่นใจ ปลอดภัย และไร้ความกังวล
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {[
              { label: "บทความทั้งหมด", value: "ALL" },
              { label: "คู่มือเลือกขนาด", value: "CLINICAL GUIDE" },
              { label: "สุขอนามัย & สารหล่อลื่น", value: "WELLNESS CARE" },
              { label: "ความปลอดภัย & ข้อมูลส่วนตัว", value: "PRIVACY & TRUST" },
              { label: "ความสัมพันธ์", value: "RELATIONSHIP" },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
                  selectedCategory === cat.value
                    ? "bg-[#6D28D9] text-white shadow-md scale-105"
                    : "bg-white/70 text-[#4D2862] hover:bg-white hover:text-[#24112E] border border-white/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </header>

        {/* Interactive Condom Sizing Calculator */}
        <SizingCalculator />

        {/* Featured Editorial Article Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredArticles.map((article, idx) => (
            <article
              key={article.id}
              className="group relative flex flex-col justify-between p-8 sm:p-10 rounded-[2rem] transition-all duration-300 hover:-translate-y-1.5 shadow-[0_20px_50px_rgba(70,20,110,0.1)]"
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1.5px solid rgba(255, 255, 255, 0.95)",
              }}
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="editorial-tag text-[10px] text-[#6D28D9] font-bold">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-[#887499]">·</span>
                    <span className="text-xs text-[#664A73] font-medium">
                      ⏱ {article.readTime}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-[#5C3275] bg-[#F5EEF8] px-2.5 py-1 rounded-full border border-purple-100">
                    {article.badge}
                  </span>
                </div>

                {/* Article Headline */}
                <h2 className="font-editorial-serif text-2xl sm:text-3xl font-semibold text-[#24112E] leading-snug group-hover:text-[#6D28D9] transition-colors">
                  {article.title}
                </h2>

                {/* Excerpt */}
                <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-[#4D2862]">
                  {article.excerpt}
                </p>

                {/* Key Points Takeaway */}
                <div className="mt-6 p-4 rounded-2xl bg-white/70 border border-purple-100/70">
                  <span className="editorial-tag text-[9px] font-bold text-[#6D28D9] block mb-2">
                    KEY TAKEAWAYS // สาระสำคัญ
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#3A1448]">
                    {article.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#8B5CF6] font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Verification & CTA Bar */}
              <div className="mt-8 pt-5 border-t border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-[#664A73]">
                  <span>ตรวจทานโดย: </span>
                  <strong className="text-[#24112E]">{article.verifiedBy}</strong>
                </div>

                <Link
                  href="/ai"
                  className="font-bold text-[#6D28D9] hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>ปรึกษา Lumi AI เรื่องนี้</span>
                  <span>➔</span>
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* Bridge to Lumi AI Consultation Banner */}
        <section
          className="mt-16 sm:mt-20 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_25px_60px_rgba(70,20,110,0.14)] flex flex-col md:flex-row items-center justify-between gap-8"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(243,232,255,0.75) 100%)",
            backdropFilter: "blur(28px)",
            border: "1.5px solid rgba(255, 255, 255, 0.98)",
          }}
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white/80 p-2 shadow-md border border-white flex-shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/lumi-3d-model.png"
                alt="Lumi 3D"
                className="w-16 h-auto drop-shadow-md animate-gentle-float"
              />
            </div>
            <div>
              <span className="editorial-tag text-[10px] font-bold text-[#6D28D9]">
                CANNOT FIND WHAT YOU ARE LOOKING FOR?
              </span>
              <h3 className="font-editorial-serif text-2xl sm:text-3xl font-semibold text-[#24112E] mt-1">
                อ่านแล้วยังมีข้อสงสัยที่ค้างคาใจ?
              </h3>
              <p className="text-xs sm:text-sm text-[#4D2862] mt-1">
                เปิดห้องคุยแบบส่วนตัวกับน้อง Lumi AI ได้ทันที ไร้การตัดสิน 100%
              </p>
            </div>
          </div>

          <Link
            href="/ai"
            className="px-8 py-4 rounded-full font-bold text-sm text-white shadow-lg hover:scale-105 transition-all flex items-center gap-2 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            }}
          >
            <span>เปิดห้องคุยกับ Lumi AI</span>
            <span>➔</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
