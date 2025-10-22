// app/api/orders/new/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "نیاز به ورود" }, { status: 401 });

    const decoded: any = verifyJwt(token);
    if (!decoded) return NextResponse.json({ error: "توکن نامعتبر" }, { status: 401 });

    const { productId, amount } = await req.json();

    const product = await prisma.ad.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "محصول پیدا نشد" }, { status: 404 });

    const newOrder = await prisma.order.create({
      data: {
        userId: decoded.userId,
        productId,
        amount,
        price: product.price * amount,
      },
    });

    return NextResponse.json(newOrder);
  } catch (err) {
    console.error("Order Error:", err);
    return NextResponse.json({ error: "خطا در ثبت سفارش" }, { status: 500 });
  }
}
