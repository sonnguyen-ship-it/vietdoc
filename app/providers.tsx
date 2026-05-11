"use client"

import type { ReactNode } from "react"
import { CompanySignupModal } from "@/components/signup/CompanySignupModal"
import { IndividualSignupModal } from "@/components/signup/IndividualSignupModal"
import { FilterProvider } from "@/context/FilterContext"
import { LangProvider } from "@/context/LangContext"
import { SignupProvider } from "@/context/SignupContext"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
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
