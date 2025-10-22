import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const tx = await prisma.transaction.findMany({ include: { user: true } });
  return NextResponse.json(tx);
}

export async function POST(req: Request) {
  const data = await req.json();
  const tx = await prisma.transaction.create({ data });
  return NextResponse.json(tx);
}

export async function PUT(req: Request) {
  const { id, ...rest } = await req.json();
  const tx = await prisma.transaction.update({
    where: { id },
    data: rest,
  });
  return NextResponse.json(tx);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.transaction.delete({ where: { id } });
  return NextResponse.json({ message: "تراکنش حذف شد" });
}
