import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

let ads: any[] = []

export async function GET() {
  return NextResponse.json(ads)
}

export async function POST(req: Request) {
  const form = await req.formData()

  const title = form.get("title") as string
  const desc = form.get("desc") as string
  const category = form.get("category") as string
  const price = Number(form.get("price"))

  // 📷 ذخیره عکس
  const file = form.get("image") as File | null
  let imageUrl = ""
  if (file) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = Date.now() + "-" + file.name
    const filepath = path.join(process.cwd(), "public", "uploads", filename)
    await writeFile(filepath, buffer)
    imageUrl = "/uploads/" + filename
  }

  const newAd = {
    id: Date.now(),
    title,
    desc,
    category,
    price,
    visible: true,
    createdAt: new Date().toLocaleDateString("fa-IR"),
    image: imageUrl,
  }

  ads.push(newAd)
  return NextResponse.json(newAd, { status: 201 })
}
