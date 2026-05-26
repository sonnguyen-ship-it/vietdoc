"use client"

import type { ReactNode } from "react"
import { CompanySignupModal } from "@/components/signup/CompanySignupModal"
import { IndividualSignupModal } from "@/components/signup/IndividualSignupModal"
import { FilterProvider } from "@/context/FilterContext"
import { LangProvider } from "@/context/LangContext"
import { SignupProvider } from "@/context/SignupContext"
import type { Lang } from "@/lib/types"

export function Providers({
  children,
  defaultLang = "vi",
}: {
  children: ReactNode
  defaultLang?: Lang
}) {
  return (
    <LangProvider defaultLang={defaultLang}>
      <FilterProvider>
        <SignupProvider>
          {children}
          <IndividualSignupModal />
          <CompanySignupModal />
        </SignupProvider>
      </FilterProvider>
    </LangProvider>
  )
}
