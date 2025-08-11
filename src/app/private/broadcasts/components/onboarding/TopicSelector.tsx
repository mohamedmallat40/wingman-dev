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
    <div className="space-y-2">
      <CategoryChips categories={categories} active={category} onChange={setCategory} />

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

      <SelectionCTA
        selectedNames={selectedTopics.map((t) => t.name)}
        minSelect={minSelect}
        isPending={isPending}
        onShuffle={selectRandom}
        onClear={clearAll}
        onConfirm={confirm}
      />
    </div>
  )
}