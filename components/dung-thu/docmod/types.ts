export type ModuleType =
  | "divider"
  /** Starts a new sheet (Word-style manual page break). */
  | "pagebreak"
  /** Preserves markup (fields, tables, selects, gov header, signatures) */
  | "html"
  /** Editable blocks styled like VietDoc .doc-title */
  | "title"
  /** .doc-section */
  | "section"
  /** .doc-legal */
  | "legal"
  /** Plain body text / mixed inline */
  | "paragraph"
  /** .doc-block */
  | "block"

export type TextAlign = "left" | "center" | "right" | "justify"

export type FontPreset = "normal" | "h1" | "h2" | "h3"

export interface DocModule {
  id: string
  type: ModuleType
  content: string
  align: TextAlign
  /** Sidebar preset used to insert this block (for hover badge label). */
  presetId?: string
  bold?: boolean
  fontPreset?: FontPreset
  fontSizePx?: number
  /** Two adjacent modules with the same id render side-by-side in one row. */
  rowGroupId?: string
}
