
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
คุณคือ BloomCare AI Companion
ผู้ช่วยด้านเพศศึกษา สุขภาพทางเพศ และความสัมพันธ์

บุคลิก:
- อบอุ่น สุภาพ เป็นมิตร และรับฟัง
- ใช้ภาษาไทยธรรมชาติ เข้าใจง่าย
- ไม่ตัดสิน ไม่ตำหนิ ไม่ทำให้ผู้ถามอับอาย
- เคารพทุกเพศ ทุกอัตลักษณ์ และทุกรูปแบบความสัมพันธ์
- ใช้คำเรียกที่ให้เกียรติผู้ใช้

ขอบเขตความรู้:
- เพศศึกษาและกายวิภาค
- การคุมกำเนิดและถุงยางอนามัย
- โรคติดต่อทางเพศสัมพันธ์
- สุขภาพประจำเดือน
- ความยินยอม (Consent)
- ความสัมพันธ์และการสื่อสาร
- ความหลากหลายทางเพศ
- การดูแลสุขภาพทางเพศ

แนวทางความปลอดภัย:
- ให้ข้อมูลตามหลักวิทยาศาสตร์และหลักฐานที่เชื่อถือได้
- ห้ามวินิจฉัยโรคหรือสั่งยาแทนแพทย์
- หากมีอาการรุนแรงหรือฉุกเฉิน ให้แนะนำพบแพทย์ทันที
- หากผู้ใช้ถูกบังคับ ล่วงละเมิด หรือไม่ปลอดภัย
  ให้รับฟังโดยไม่กล่าวโทษและแนะนำความช่วยเหลือที่เหมาะสม
- ไม่สร้างเนื้อหาทางเพศที่โจ่งแจ้งเพื่อความบันเทิง
- ไม่สนับสนุนการล่วงละเมิดหรือการกระทำที่ไม่มีความยินยอม
- ให้ความระมัดระวังเป็นพิเศษเมื่อเกี่ยวข้องกับผู้เยาว์
- ไม่แต่งข้อมูลทางการแพทย์ขึ้นเอง

รูปแบบการตอบ:
- ตอบตรงคำถาม
- ใช้ภาษาที่เข้าใจง่าย
- หากเป็นคำถามละเอียดอ่อน ให้ตอบอย่างอ่อนโยน
- หากข้อมูลไม่เพียงพอ ให้ถามเพิ่มเติมทีละข้อ
- ไม่อ้างว่าตนเองเป็นแพทย์หรือนักจิตวิทยา
- ไม่รับประกันว่าการสนทนาเป็นความลับสมบูรณ์

เป้าหมายคือทำให้ทุกคนรู้สึกปลอดภัย
และกล้าถามเรื่องเพศโดยไม่กลัวการถูกตัดสิน
`;

type ChatMessage = {
    role: "user" | "model";
    text: string;
};

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.AI_API_KEY;
        const provider = process.env.AI_PROVIDER;
        const model =
            process.env.AI_MODEL || "gemini-3.5-flash-lite";

        if (!apiKey || provider !== "gemini") {
            return NextResponse.json(
                { error: "ระบบ AI ยังไม่ได้ตั้งค่า API Key" },
                { status: 503 }
            );
        }

        const body = await request.json();
        const messages = body.messages;

        if (
            !Array.isArray(messages) ||
            messages.length === 0 ||
            messages.length > 20
        ) {
            return NextResponse.json(
                { error: "รูปแบบข้อความไม่ถูกต้อง" },
                { status: 400 }
            );
        }

        const validMessages: ChatMessage[] = [];

        for (const message of messages) {
            if (
                !message ||
                !["user", "model"].includes(message.role) ||
                typeof message.text !== "string" ||
                message.text.trim().length === 0 ||
                message.text.length > 4000
            ) {
                return NextResponse.json(
                    { error: "ข้อความไม่ถูกต้องหรือยาวเกินไป" },
                    { status: 400 }
                );
            }

            validMessages.push({
                role: message.role,
                text: message.text.trim(),
            });
        }

        if (validMessages[validMessages.length - 1].role !== "user") {
            return NextResponse.json(
                { error: "ข้อความสุดท้ายต้องเป็นคำถามจากผู้ใช้" },
                { status: 400 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model,
            contents: validMessages.map((message) => ({
                role: message.role,
                parts: [{ text: message.text }],
            })),
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.65,
                maxOutputTokens: 1000,
            },
        });

        const answer = response.text?.trim();

        if (!answer) {
            return NextResponse.json(
                { error: "AI ยังไม่สามารถตอบคำถามนี้ได้ กรุณาลองใหม่" },
                { status: 502 }
            );
        }

        return NextResponse.json({ answer });
    } catch (error) {
        console.error("BloomCare AI error:", error);

        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการเชื่อมต่อ AI กรุณาลองใหม่อีกครั้ง" },
            { status: 500 }
        );
    }
}
