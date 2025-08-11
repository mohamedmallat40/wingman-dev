"use client"

import { motion } from "framer-motion"

export default function GradientBG() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute -top-32 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(closest-side, rgba(217, 70, 239, 0.25), rgba(217, 70, 239, 0) 70%)",
          filter: "blur(40px)",
        }}
        animate={{ y: [0, 20, 0], x: [0, -20, 0], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 h-[30rem] w-[30rem] -translate-x-1/3 translate-y-1/3 rounded-full"
        style={{
          background: "radial-gradient(closest-side, rgba(249, 115, 22, 0.25), rgba(249, 115, 22, 0) 70%)",
          filter: "blur(40px)",
        }}
        animate={{ y: [0, -20, 0], x: [0, 20, 0], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </div>
  )
}