
"use client";

import { useState, type FormEvent } from "react";
import { Footer } from "@/components/layout/Footer";

type Message = {
  role: "user" | "model";
  text: string;
};

const SUGGESTIONS = [
  "การคุมกำเนิดมีวิธีไหนบ้าง?",
  "จะรู้ได้อย่างไรว่าตัวเองพร้อมมีความสัมพันธ์?",
  "ถุงยางอนามัยเลือกอย่างไร?",
  "อยากปรึกษาเรื่องความสัมพันธ์",
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
          : "เกิดข้อผิดพลาด กรุณาลองใหม่"
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
    <div className="flex min-h-[100svh] flex-col bg-background pt-24">
      <main className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col px-4 py-8 sm:px-8">

        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <span className="text-sm font-medium text-primary-strong">
              BLOOMCARE COMPANION
            </span>

            <h1 className="mt-2 text-3xl font-semibold text-text">
              พื้นที่ที่คุณพูดคุยได้อย่างสบายใจ
            </h1>

            <p className="mt-2 text-sm leading-7 text-[#686474]">
              เรื่องเพศ สุขภาพ และความสัมพันธ์
              เราพร้อมรับฟังโดยไม่ตัดสิน
            </p>
          </div>

          <button
            type="button"
            onClick={clearChat}
            disabled={loading || messages.length === 0}
            className="rounded-full border border-border px-4 py-2 text-sm text-text transition hover:bg-secondary disabled:opacity-40"
          >
            เริ่มแชตใหม่
          </button>
        </header>

        <section
          className="flex min-h-[480px] flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm"
          aria-label="BloomCare AI chat"
        >
          <div className="flex items-center gap-3 border-b border-border p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-xl">
              ✿
            </div>

            <div>
              <p className="font-semibold text-text">
                BloomCare AI Companion
              </p>
              <p className="text-xs text-[#777382]">
                ผู้ช่วยด้านเพศศึกษาและความสัมพันธ์
              </p>
            </div>

            <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              พร้อมพูดคุย
            </span>
          </div>

          <div
            className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6"
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <div className="m-auto w-full max-w-xl py-8 text-center">
                <div className="mb-5 text-5xl">🌷</div>

                <h2 className="text-xl font-semibold text-text">
                  สวัสดี ยินดีต้อนรับสู่ BloomCare
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#777382]">
                  คุณสามารถถามเรื่องเพศศึกษา สุขภาพทางเพศ
                  หรือความสัมพันธ์ได้อย่างสบายใจ
                  ไม่มีคำถามไหนที่ควรทำให้คุณรู้สึกอับอาย
                </p>

                <div className="mt-7 grid gap-2 text-left sm:grid-cols-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendMessage(undefined, suggestion)}
                      disabled={loading}
                      className="rounded-2xl border border-border bg-background p-4 text-sm leading-6 text-text transition hover:border-primary hover:bg-secondary disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${index}-${message.role}`}
                  className={`flex ${message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-7 sm:max-w-[78%] ${message.role === "user"
                        ? "rounded-br-md bg-primary-strong text-white"
                        : "rounded-bl-md border border-border bg-background text-text"
                      }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-[#777382]"
                  role="status"
                >
                  BloomCare กำลังคิดคำตอบ...
                </div>
              </div>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="mx-4 mb-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <form
            onSubmit={sendMessage}
            className="border-t border-border bg-surface p-4"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-background p-2 focus-within:border-primary">
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
                placeholder="พิมพ์สิ่งที่คุณอยากปรึกษา..."
                aria-label="ข้อความที่ต้องการปรึกษา"
                maxLength={4000}
                rows={2}
                disabled={loading}
                className="max-h-36 min-h-12 flex-1 resize-y bg-transparent px-3 py-2 text-sm text-text outline-none placeholder:text-[#9995A3]"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-primary-strong px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ส่ง
              </button>
            </div>

            <p className="mt-2 text-center text-xs text-[#888493]">
              Enter เพื่อส่ง · Shift + Enter เพื่อขึ้นบรรทัดใหม่
            </p>
          </form>
        </section>

        <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-6 text-[#777382]">
          BloomCare AI เป็นผู้ช่วยให้ข้อมูลเบื้องต้น ไม่ใช่แพทย์
          และไม่สามารถวินิจฉัยโรคได้
          โปรดหลีกเลี่ยงการส่งชื่อจริง ข้อมูลติดต่อ
          หรือข้อมูลส่วนตัวที่ละเอียดอ่อน
          ข้อความจะถูกส่งไปประมวลผลผ่านผู้ให้บริการ AI
        </p>
      </main>

      <Footer />
    </div>
  );
}
