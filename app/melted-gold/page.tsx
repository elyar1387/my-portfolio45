"use client"
import { motion } from "framer-motion"

export default function MeltedGoldPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex flex-col items-center p-8">
      <motion.h1 
        className="text-3xl font-extrabold text-yellow-800 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        خرید و فروش طلای آب‌شده
      </motion.h1>
      <p className="text-lg text-gray-700">اینجا بخش خرید و فروش طلای آب‌شده است (فعلاً تستی)</p>
    </main>
  )
}
