"use client"

import { useMemo } from "react"
import { useTranslations } from 'next-intl';
import type { Topic } from "../../types"
import { cn } from "@/lib/utils"
import { RailRow } from "./RailRow"

type HorizontalRailsProps = {
  topics?: Topic[]
  selectedIds?: Set<string>
  onToggle?: (id: string) => void
  rowCount?: number
  durationSeconds?: number
  gap?: number
  cardHeight?: number
  aspect?: number
  className?: string
  pauseOnHover?: boolean
  rowTitles?: string[]
}

export default function HorizontalRails({
  topics = [],
  selectedIds = new Set(),
  onToggle = () => {},
  rowCount = 4,
  durationSeconds = 66,
  gap = 24,
  cardHeight = 135,
  aspect = 16 / 9,
  className,
  pauseOnHover = true,
  rowTitles = [],
}: HorizontalRailsProps) {
  const tCategories = useTranslations('broadcasts.categories');
  
  const rows = useMemo(() => {
    const r: Topic[][] = Array.from({ length: rowCount }, () => [])
    for (let i = 0; i < topics.length; i++) {
      r[i % rowCount].push(topics[i])
    }
    return r
  }, [topics, rowCount])

  const defaultTitles = [
    tCategories('ai'), 
    tCategories('development'), 
    tCategories('marketing'), 
    tCategories('sales'), 
    tCategories('freelance')
  ]
  const titles = rowTitles.length > 0 ? rowTitles : defaultTitles

  return (
    <div className={cn("group relative w-full overflow-hidden", className)}>
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => {
          const reverse = i % 2 === 1
          const localDuration = durationSeconds + (i % 3) * 6
          return (
            <div key={i} className="space-y-1">
              <div className="max-w-7xl mx-auto px-4">
                <h3 className="flex items-center gap-2 text-xs font-medium text-foreground-600 px-2">
                  <span className="inline-block h-1 w-1 rounded-full bg-fuchsia-500" />
                  {titles[i % titles.length]}
                </h3>
              </div>
              <RailRow
                topics={row}
                selectedIds={selectedIds}
                onToggle={onToggle}
                reverse={reverse}
                gap={gap}
                cardHeight={cardHeight}
                aspect={aspect}
                durationSeconds={localDuration}
                pauseOnHover={pauseOnHover}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}