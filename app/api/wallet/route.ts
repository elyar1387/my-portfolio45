import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "نیاز به ورود" }, { status: 401 });
    }

    const decoded: any = verifyJwt(token);
    if (!decoded) {
      return NextResponse.json({ error: "توکن نامعتبر" }, { status: 401 });
    }

    let wallet = await prisma.wallet.findUnique({
      where: { userId: decoded.userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: decoded.userId,
          balance: 0,
        },
      });
    }

    return NextResponse.json(wallet);
  } catch (err: any) {
    console.error("Wallet Error:", err);

    // 👇 برای دیباگ: متن خطا رو مستقیم برگردون
    return NextResponse.json(
      { error: "Wallet Error", details: err.message, stack: err.stack },
      { status: 500 }
    );
  }
}
