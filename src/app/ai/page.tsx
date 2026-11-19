"use client";

import { useState, type FormEvent } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type Message = {
  role: "user" | "model";
  text: string;
};

const SUGGESTIONS = [
  "🔒 การคุยที่นี่เป็นความลับจริงไหม ปลอดภัยแค่ไหน?",
  "📐 วิธีเลือกไซส์ถุงยางอนามัยที่ถูกต้องและกระชับ",
  "💧 สารหล่อลื่นสูตรไหนปลอดภัยกับถุงยางที่สุด?",
  "🌸 อาการตกขาวแบบไหนที่ควรไปพบแพทย์ตรวจ?",
];

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(
    event?: FormEvent<HTMLFormElement>,
    suggestedText?: string
  ) {
    event?.preventDefault();

    const text = (suggestedText ?? input).trim();

    if (!text || loading) return;

    if (text.length > 4000) {
      setError("ข้อความยาวเกินไป กรุณาไม่เกิน 4,000 ตัวอักษร");
      return;
    }

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", text },
    ];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.slice(-20),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "ไม่สามารถเชื่อมต่อ AI ได้");
      }

      setMessages((previous) => [
        ...previous,
        { role: "model", text: data.answer },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งนะ"
      );
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    if (loading) return;

    setMessages([]);
    setInput("");
    setError("");
  }

  return (
    <div
      className="flex min-h-[100svh] flex-col justify-between pt-24 selection:bg-[#E9D5FF] selection:text-[#24112E]"
      style={{
        background:
          "radial-gradient(circle at 65% 25%, #FAF2FF 0%, #EFE1FA 40%, #E3D1F5 75%, #D4BAEC 100%)",
      }}
    >
      <Header />

      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col px-4 py-8 sm:px-8">
        {/* Editorial Sanctuary Header with Lumi Companion Preview */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-2.5">
              <span className="editorial-tag text-[10px] font-bold text-[#6D28D9] bg-white/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/90 shadow-sm">
                01 // PRIVATE SANCTUARY
              </span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                🔒 100% Anonymous & Zero Judgment
              </span>
            </div>

            <h1 className="font-editorial-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#24112E] leading-tight">
              พื้นที่ที่คุณพูดคุยได้
              <br />
              <span className="italic font-normal text-[#4D2862]">
                อย่างสนิทใจที่สุด
              </span>
            </h1>

            <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#5C3275]">
              เรื่องสุขภาพทางเพศ ไซส์ ความปลอดภัย หรือความสัมพันธ์...
              ถามน้อง Lumi AI ได้ทุกเรื่อง ไม่มีการตัดสิน และไม่มีการบันทึกตัวตนของคุณ
            </p>
          </div>

          {/* Lumi Interactive Presence Card */}
          <div className="flex items-center gap-4 p-3.5 sm:p-4 rounded-3xl bg-white/65 backdrop-blur-xl border border-white/90 shadow-[0_12px_30px_rgba(90,30,130,0.12)]">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E9D5FF] to-white flex items-center justify-center p-1 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/lumi-3d-model.png"
                  alt="Lumi AI Companion"
                  className="w-14 h-auto drop-shadow-md"
                />
              </div>
              <span className="absolute -top-1 -right-1 text-sm animate-pulse">⭐</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#24112E] text-sm">LUMI AI</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  ออนไลน์พร้อมรับฟัง
                </span>
              </div>
              <p className="text-xs text-[#664A73] mt-0.5">
                {loading ? "กำลังเรียบเรียงคำตอบ..." : "ทักทายฉันได้เลยนะ ✨"}
              </p>
            </div>

            <button
              type="button"
              onClick={clearChat}
              disabled={loading || messages.length === 0}
              className="ml-auto rounded-full border border-white/80 bg-white/60 px-3.5 py-1.5 text-xs font-semibold text-[#3A1448] transition hover:bg-white hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shadow-sm"
              title="เริ่มการสนทนาใหม่"
            >
              ล้างแชต
            </button>
          </div>
        </header>

        {/* Tactile Frosted Glass Chat Stage */}
        <section
          className="flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-[2rem] shadow-[0_25px_70px_rgba(70,20,110,0.15)]"
          style={{
            background: "rgba(255, 255, 255, 0.72)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1.5px solid rgba(255, 255, 255, 0.95)",
          }}
          aria-label="BloomCare AI chat"
        >
          {/* Messages Flow Area */}
          <div
            className="flex flex-1 flex-col gap-4 overflow-y-auto p-5 sm:p-8"
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <div className="m-auto w-full max-w-xl py-6 text-center">
                <div className="mb-4 inline-flex p-4 rounded-3xl bg-white/80 shadow-[0_10px_30px_rgba(109,40,217,0.15)] border border-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/lumi-3d-model.png"
                    alt="Lumi 3D"
                    className="w-20 h-auto animate-gentle-float drop-shadow-md"
                  />
                </div>

                <h2 className="font-editorial-serif text-2xl font-semibold text-[#24112E]">
                  สวัสดีนะ! ฉันคือ Lumi AI Companion ✨
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#5C3275]">
                  ถามเรื่องสุขภาพเพศ ไซส์ สารหล่อลื่น หรือความสัมพันธ์ได้ทุกข้อสงสัย
                  ไม่มีคำถามไหนแปลก และไม่มีใครรู้ตัวตนของคุณแน่นอน
                </p>

                {/* Suggested Questions Grid */}
                <div className="mt-8 grid gap-2.5 text-left sm:grid-cols-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendMessage(undefined, suggestion)}
                      disabled={loading}
                      className="group rounded-2xl p-4 text-xs sm:text-sm font-medium text-[#24112E] transition-all duration-200 hover:-translate-y-1 hover:border-[#8B5CF6] cursor-pointer shadow-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.82)",
                        border: "1px solid rgba(255, 255, 255, 0.95)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{suggestion}</span>
                        <span className="text-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                          ➔
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${index}-${message.role}`}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "model" && (
                    <div className="w-8 h-8 rounded-full bg-white/90 p-0.5 shadow-sm border border-purple-100 mr-2.5 flex-shrink-0 self-end mb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/lumi-3d-model.png"
                        alt="Lumi"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] whitespace-pre-wrap break-words rounded-3xl px-5 py-3.5 text-sm sm:text-base leading-relaxed sm:max-w-[78%] shadow-sm ${
                      message.role === "user"
                        ? "rounded-br-sm bg-[#6D28D9] text-white font-medium"
                        : "rounded-bl-sm text-[#24112E]"
                    }`}
                    style={{
                      background:
                        message.role === "user"
                          ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)"
                          : "rgba(255, 255, 255, 0.92)",
                      border:
                        message.role === "user"
                          ? "none"
                          : "1px solid rgba(255, 255, 255, 0.98)",
                    }}
                  >
                    {message.text}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/90 p-0.5 shadow-sm border border-purple-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/lumi-3d-model.png"
                    alt="Lumi"
                    className="w-full h-full object-contain animate-pulse"
                  />
                </div>
                <div
                  className="rounded-3xl bg-white/85 border border-white px-5 py-3 text-xs sm:text-sm text-[#664A73] flex items-center gap-2 shadow-sm"
                  role="status"
                >
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping" />
                  <span>น้อง Lumi กำลังเรียบเรียงคำตอบที่อ่อนโยนให้คุณ...</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="mx-5 mb-2 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700"
            >
              ⚠️ {error}
            </p>
          )}

          {/* Input Box Bar */}
          <form
            onSubmit={sendMessage}
            className="border-t border-white/60 p-4 sm:p-5"
            style={{
              background: "rgba(255, 255, 255, 0.55)",
            }}
          >
            <div
              className="flex items-end gap-2.5 rounded-2xl p-2.5 shadow-inner transition-all focus-within:shadow-[0_0_0_2px_#8B5CF6]"
              style={{
                background: "rgba(255, 255, 255, 0.88)",
                border: "1.5px solid rgba(255, 255, 255, 0.98)",
              }}
            >
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="พิมพ์เรื่องที่คุณสงสัยหรืออยากปรึกษาตรงนี้ได้เลยนะ..."
                aria-label="ข้อความที่ต้องการปรึกษา"
                maxLength={4000}
                rows={2}
                disabled={loading}
                className="max-h-36 min-h-12 flex-1 resize-y bg-transparent px-3 py-2 text-sm text-[#24112E] outline-none placeholder:text-[#9987A8]"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 shadow-md cursor-pointer flex items-center gap-1.5"
                style={{
                  background:
                    "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                }}
              >
                <span>ส่งคำถาม</span>
                <span>➔</span>
              </button>
            </div>

            <p className="mt-2.5 text-center text-xs text-[#664A73]">
              กด Enter เพื่อส่ง · Shift + Enter เพื่อขึ้นบรรทัดใหม่ · ข้อมูลของคุณไม่ถูกบันทึก 100%
            </p>
          </form>
        </section>

        {/* Medical & Privacy Trust Disclaimer */}
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-[#664A73]">
          ✦ BloomCare AI เป็นผู้ช่วยให้ความรู้สุขภาวะเบื้องต้นตามหลักการแพทย์ ไม่ใช่การวินิจฉัยโรคโดยแพทย์
          หากมีอาการผิดปกติรุนแรงควรพบแพทย์เฉพาะทาง · ปลอดภัย 100% ไร้การระบุตัวตน
        </p>
      </main>

      <Footer />
    </div>
  );
}
