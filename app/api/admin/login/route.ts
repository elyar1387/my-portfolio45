import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = body?.password;

    if (!password) {
      return NextResponse.json({ error: "رمز وارد نشده" }, { status: 400 });
    }

    // مقدار رمز را در .env با کلید ADMIN_PASSWORD قرار بده
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

    if (!ADMIN_PASSWORD) {
      console.error("ADMIN_PASSWORD not set in environment");
      return NextResponse.json({ error: "سرور تنظیم نشده" }, { status: 500 });
    }

    if (password === ADMIN_PASSWORD) {
      // موفق
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: "رمز اشتباه است" }, { status: 401 });
    }
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "خطا در پردازش" }, { status: 500 });
  }
}
