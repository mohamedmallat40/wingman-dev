"use client"

import type { ReactNode, CSSProperties } from "react"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export default function FullBleed({ className, style, children }: Props) {
  return (
    <div
      className={cn(
        "relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen max-w-[100vw]",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  )
}