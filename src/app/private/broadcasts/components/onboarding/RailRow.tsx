"use client"

import type React from "react"
import type { Topic } from "../../types"
import { cn } from "@/lib/utils"
import { RailCard } from "../cards/RailCard"

type RailRowProps = {
  topics: Topic[]
  selectedIds: Set<string>
  onToggle: (id: string) => void
  reverse?: boolean
  gap?: number
  cardHeight?: number
  aspect?: number
  durationSeconds?: number
  pauseOnHover?: boolean
}

export function RailRow({
  topics,
  selectedIds,
  onToggle,
  reverse = false,
  gap = 24,
  cardHeight = 135,
  aspect = 16 / 9,
  durationSeconds = 60,
  pauseOnHover = true,
}: RailRowProps) {
  // Create enough duplicates to fill screen completely + ensure seamless loop
  const width = Math.round(cardHeight * aspect)
  const estimatedScreenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
  const cardsPerScreen = Math.ceil(estimatedScreenWidth / (width + gap))
  const duplicateCount = Math.max(6, Math.ceil(cardsPerScreen / topics.length) * 3)
  const content = Array(duplicateCount).fill(topics).flat()

  return (
    <div className="relative h-[min(20svh,160px)] w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center">
        <div
          className={cn(
            "flex w-max items-stretch",
            reverse ? "animate-marquee-x-reverse" : "animate-marquee-x",
            pauseOnHover && "hover:pause"
          )}
          style={{
            "--duration": `${durationSeconds}s`,
            "--gap": `${gap}px`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          } as React.CSSProperties}
        >
          {content.map((topic, i) => (
            <RailCard
              key={`${topic.id}-${i}`}
              topic={topic}
              isSelected={selectedIds.has(topic.id)}
              onToggle={onToggle}
              width={width}
              height={cardHeight}
              gap={gap}
            />
          ))}
        </div>
      </div>
    </div>
  )
}