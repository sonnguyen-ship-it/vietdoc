"use client"

import { useEffect } from "react"

/** If middleware/build is stale, still leave mistaken `/viet-doc` URLs. */
export function NotFoundMistakenPathRedirect() {
  useEffect(() => {
    const p = window.location.pathname
    if (p === "/viet-doc" || p.startsWith("/viet-doc/")) {
      window.location.replace(`${window.location.origin}/`)
    }
  }, [])
  return null
}
