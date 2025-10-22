import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { writeFile } from "fs/promises"
import path from "path"

/* 🟢 ایجاد آگهی */
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const title = formData.get("title") as string
    const desc = formData.get("desc") as string
    const category = formData.get("category") as string
    const price = Number(formData.get("price"))
    const file = formData.get("image") as File | null

    if (!title || !desc || !category || !price) {
      return NextResponse.json(
        { error: "تمام فیلدها الزامی هستند." },
        { status: 400 }
      )
    }

    let imagePath: string | null = null
    if (file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = Date.now() + "_" + file.name.replace(/\s+/g, "_")
      const filePath = path.join(process.cwd(), "public/uploads", fileName)
      await writeFile(filePath, buffer)
      imagePath = "/uploads/" + fileName
    }

    const ad = await prisma.ad.create({
      data: { title, desc, category, price, image: imagePath },
    })

    return NextResponse.json({ success: true, ad })
  } catch (err) {
    console.error("❌ خطا در ایجاد آگهی:", err)
    return NextResponse.json(
      { error: "خطا در ایجاد آگهی." },
      { status: 500 }
    )
  }
}

/* 🟡 دریافت همه آگهی‌ها */
export async function GET() {
  try {
    const ads = await prisma.ad.findMany({ orderBy: { id: "desc" } })
    return NextResponse.json(ads)
  } catch (err) {
    console.error("❌ خطا در دریافت آگهی‌ها:", err)
    return NextResponse.json(
      { error: "خطا در دریافت آگهی‌ها." },
      { status: 500 }
    )
  }
}
