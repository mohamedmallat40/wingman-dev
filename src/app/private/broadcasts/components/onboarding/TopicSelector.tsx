"use client"

import { useMemo, useState, useTransition } from "react"
import { useTranslations } from 'next-intl';
import type { Topic } from "../../types"
import { CategoryChips } from "./CategoryChips"
import HorizontalRails from "./HorizontalRails"
import FullBleed from "./FullBleed"
import { SelectionCTA } from "./SelectionCTA"

type TopicSelectorProps = {
  topics?: Topic[]
  minSelect?: number
  rowCount?: number
  durationSeconds?: number
  gap?: number
  cardHeight?: number
  rowTitles?: string[]
  pauseOnHover?: boolean
  initialSelectedIds?: string[]
  onConfirm?: (selectedIds: string[]) => void
}

export default function TopicSelector({
  topics = [],
  minSelect = 5,
  rowCount = 4,
  durationSeconds = 66,
  gap = 24,
  cardHeight = 135,
  rowTitles,
  pauseOnHover = true,
  initialSelectedIds = [],
  onConfirm = () => {},
}: TopicSelectorProps) {
  const t = useTranslations('broadcasts.onboarding');
  const tCategories = useTranslations('broadcasts.categories');
  const [category, setCategory] = useState("All")
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelectedIds))
  const [isPending, startTransition] = useTransition()

  const categories = useMemo(() => {
    const s = new Set<string>(["All"])
    for (const t of topics) s.add(t.category)
    return Array.from(s)
  }, [topics])

  const filtered = useMemo(() => {
    return topics.filter((t) => category === "All" || t.category === category)
  }, [topics, category])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function clearAll() {
    setSelected(new Set())
  }

  function selectRandom() {
    const pool = filtered.length ? filtered : topics
    if (pool.length === 0) return
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.max(minSelect, 5))
    setSelected(new Set(shuffled.map((t) => t.id)))
  }

  function confirm() {
    startTransition(async () => {
      onConfirm(Array.from(selected))
    })
  }

  const selectedTopics = useMemo(() => topics.filter((t) => selected.has(t.id)), [topics, selected])

  return (
    <div className="space-y-6">
      {/* Enhanced Category Chips with glass effect */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
        <CategoryChips categories={categories} active={category} onChange={setCategory} />
      </div>

      {/* Topic Rails with enhanced visual effects */}
      <div className="relative">
        <FullBleed>
          <HorizontalRails
            topics={filtered.length ? filtered : topics}
            selectedIds={selected}
            onToggle={toggle}
            rowCount={rowCount}
            durationSeconds={durationSeconds}
            gap={gap}
            cardHeight={cardHeight}
            pauseOnHover={pauseOnHover}
            rowTitles={rowTitles}
          />
        </FullBleed>

        {/* Ambient glow effects */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Enhanced Selection CTA with glass morphism */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50" />
        <div className="relative z-10">
          <SelectionCTA
            selectedNames={selectedTopics.map((t) => t.name)}
            minSelect={minSelect}
            isPending={isPending}
            onShuffle={selectRandom}
            onClear={clearAll}
            onConfirm={confirm}
          />
        </div>
      </div>
    </div>
  )
}
