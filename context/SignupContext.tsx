"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { SignupModalContextValue } from "@/lib/types"

const SignupContext = createContext<SignupModalContextValue | null>(null)

export function SignupProvider({ children }: { children: ReactNode }) {
  const [indOpen, setIndOpen] = useState(false)
  const [coOpen, setCoOpen] = useState(false)
  const [wlCount, setWlCount] = useState(2347)

  useEffect(() => {
    const id = window.setInterval(() => {
      setWlCount((n) => n + 1)
    }, 8000)
    return () => window.clearInterval(id)
  }, [])

  const openInd = useCallback(() => setIndOpen(true), [])
  const closeInd = useCallback(() => setIndOpen(false), [])
  const openCo = useCallback(() => setCoOpen(true), [])
  const closeCo = useCallback(() => setCoOpen(false), [])

  const value = useMemo<SignupModalContextValue>(
    () => ({
      indOpen,
      coOpen,
      openInd,
      closeInd,
      openCo,
      closeCo,
      wlCount,
    }),
    [indOpen, coOpen, openInd, closeInd, openCo, closeCo, wlCount]
  )

  return (
    <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
  )
}

export function useSignup(): SignupModalContextValue {
  const ctx = useContext(SignupContext)
  if (!ctx) throw new Error("useSignup must be used within SignupProvider")
  return ctx
}
