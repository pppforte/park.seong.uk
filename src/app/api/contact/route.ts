import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "이름, 이메일, 메시지는 필수 항목입니다." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 형식이 아닙니다." },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.collection("contacts").insertOne({
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 254),
      subject: (subject || "").trim().slice(0, 200),
      message: message.trim().slice(0, 5000),
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "메시지가 성공적으로 전송되었습니다." });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
