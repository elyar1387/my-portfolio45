import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const settings = await prisma.setting.findFirst();
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const data = await req.json();
  const setting = await prisma.setting.create({ data });
  return NextResponse.json(setting);
}

export async function PUT(req: Request) {
  const { id, ...rest } = await req.json();
  const setting = await prisma.setting.update({
    where: { id },
    data: rest,
  });
  return NextResponse.json(setting);
}
