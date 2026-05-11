"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Category } from "@/lib/types"

export type ActiveFilter = "all" | "featured" | "moi" | "hot"

type FilterContextValue = {
  activeCat: Category | "all"
  setActiveCat: (c: Category | "all") => void
  activeFilter: ActiveFilter
  setActiveFilter: (f: ActiveFilter) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  resetFilters: () => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [activeCat, setActiveCat] = useState<Category | "all">("all")
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const resetFilters = useCallback(() => {
    setActiveCat("all")
    setActiveFilter("all")
    setSearchQuery("")
  }, [])

  const value = useMemo(
    () => ({
      activeCat,
      setActiveCat,
      activeFilter,
      setActiveFilter,
      searchQuery,
      setSearchQuery,
      resetFilters,
    }),
    [activeCat, activeFilter, resetFilters, searchQuery]
  )

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  )
}

export function useFilter(): FilterContextValue {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error("useFilter must be used within FilterProvider")
  return ctx
}
