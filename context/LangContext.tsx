"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Lang } from "@/lib/types"

type LangContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
  toggleLang: () => void
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("vi")

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "vi" ? "en" : "vi"))
  }, [])

  const value = useMemo(
    () => ({ lang, setLang, toggleLang }),
    [lang, toggleLang]
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error("useLang must be used within LangProvider")
  return ctx
}
