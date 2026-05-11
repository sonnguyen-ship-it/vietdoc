export type Lang = "vi" | "en"

export type Category =
  | "lao-dong"
  | "thue"
  | "hop-dong"
  | "ke-toan"
  | "hanh-chinh"

export type UpdatedStatus = "Mới" | "Hot" | ""

export type Template = {
  id: string
  name: { vi: string; en: string }
  description: { vi: string; en: string }
  category: Category
  tagLabel: { vi: string; en: string }
  tagClass: string
  decree: string
  effectiveFrom: string
  updated: UpdatedStatus
  icon: string
  previewBg: string
  featured?: boolean
  contentHTML: string
}

export type DocField = {
  placeholder: string
  value?: string
}

/** Signup / waitlist UI (see SignupContext). */
export type SignupModalContextValue = {
  indOpen: boolean
  coOpen: boolean
  openInd: () => void
  closeInd: () => void
  openCo: () => void
  closeCo: () => void
  wlCount: number
}

/** Alias matching product spec naming. */
export type SignupState = SignupModalContextValue
