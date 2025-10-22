import prisma from "./lib/prisma"

async function main() {
  const users = await prisma.user.findMany()
  console.log("✅ Users:", users)

  const ads = await prisma.ad.findMany()
  console.log("📢 Ads:", ads)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
