import {
  AlignmentType,
  BorderStyle,
  Document,
  PageBreak,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  UnderlineType,
  VerticalAlignTable,
  WidthType,
  type FileChild,
  type ParagraphChild,
} from "docx"

const FONT = "Times New Roman"
const SIZE_HALF_PT = 26 // 13pt
const BORDER: { style: (typeof BorderStyle)[keyof typeof BorderStyle]; size: number; color: string } = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: "888888",
}

function tr(
  text: string,
  overrides: Partial<{ bold: boolean; italics: boolean }> = {}
): TextRun {
  return new TextRun({
    font: FONT,
    size: SIZE_HALF_PT,
    text: text ?? "",
    ...overrides,
  })
}

function fieldRun(text: string): TextRun {
  const t = text.trim() || "___________"
  return new TextRun({
    font: FONT,
    size: SIZE_HALF_PT,
    text: t,
    underline: { type: UnderlineType.SINGLE },
  })
}

/** Walk inline nodes: text + `.doc-field` → TextRuns */
function inlineRuns(root: HTMLElement): ParagraphChild[] {
  const runs: ParagraphChild[] = []
  const walk = (n: Node) => {
    if (n.nodeType === Node.TEXT_NODE) {
      const t = n.textContent ?? ""
      if (t) runs.push(tr(t))
      return
    }
    if (n.nodeType !== Node.ELEMENT_NODE) return
    const el = n as HTMLElement
    if (el.classList.contains("doc-field")) {
      runs.push(fieldRun(el.textContent ?? ""))
      return
    }
    if (el.tagName === "BR") {
      runs.push(new TextRun({ break: 1 }))
      return
    }
    el.childNodes.forEach(walk)
  }
  root.childNodes.forEach(walk)
  if (runs.length === 0) runs.push(tr(" "))
  return runs
}

function pCenterBoldItalic(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [
      new TextRun({
        font: FONT,
        size: SIZE_HALF_PT,
        text,
        bold: true,
        italics: true,
      }),
    ],
  })
}

function hrLine(): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000", space: 1 },
    },
    indent: { left: 2880, right: 2880 },
    children: [tr(" ")],
  })
}

function pTitle(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 200 },
    children: [
      new TextRun({
        font: FONT,
        size: SIZE_HALF_PT,
        text: text.toUpperCase(),
        bold: true,
      }),
    ],
  })
}

function pLegal(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { after: 200 },
    children: [tr(text)],
  })
}

function pSection(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        font: FONT,
        size: SIZE_HALF_PT,
        text: text.toUpperCase(),
        bold: true,
      }),
    ],
  })
}

function pBody(el: HTMLParagraphElement): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { after: 120 },
    children: inlineRuns(el),
  })
}

function pNote(el: HTMLElement): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "B5A98C", space: 4 },
    },
    children: [
      new TextRun({
        font: FONT,
        size: 22,
        color: "7A6E5A",
        italics: true,
        text: el.textContent?.trim() || " ",
      }),
    ],
  })
}

function convertTable(table: HTMLTableElement): Table {
  const rows: TableRow[] = []
  for (const trEl of Array.from(table.querySelectorAll("tr"))) {
    const cells: TableCell[] = []
    for (const td of Array.from(trEl.querySelectorAll("th, td"))) {
      const isHeader = td.tagName === "TH"
      const text = (td as HTMLTableCellElement).innerText.replace(/\s+/g, " ").trim() || " "
      cells.push(
        new TableCell({
          shading: isHeader
            ? { fill: "F5F0E4", type: ShadingType.CLEAR, color: "auto" }
            : undefined,
          children: [
            new Paragraph({
              alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
              children: [tr(text, { bold: isHeader })],
            }),
          ],
          borders: {
            top: BORDER,
            bottom: BORDER,
            left: BORDER,
            right: BORDER,
          },
        })
      )
    }
    if (cells.length) rows.push(new TableRow({ children: cells }))
  }
  if (!rows.length) {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [tr(" ")] })],
            }),
          ],
        }),
      ],
    })
  }
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: BORDER,
      bottom: BORDER,
      left: BORDER,
      right: BORDER,
      insideHorizontal: BORDER,
      insideVertical: BORDER,
    },
    rows,
  })
}

function convertDocSigs(root: HTMLElement): Table {
  const cols = Array.from(root.children).filter((c) => c.nodeType === Node.ELEMENT_NODE) as HTMLElement[]
  const cells = cols.map((col) => {
    const paras: Paragraph[] = []
    col.childNodes.forEach((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return
      const el = node as HTMLElement
      if (el.classList.contains("doc-sig-space")) {
        paras.push(
          new Paragraph({
            spacing: { before: 720 },
            alignment: AlignmentType.CENTER,
            children: [tr(" ")],
          })
        )
        return
      }
      if (el.tagName === "P") {
        paras.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: inlineRuns(el as HTMLParagraphElement),
          })
        )
      }
    })
    if (!paras.length) {
      paras.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [tr(" ")] }))
    }
    return new TableCell({
      children: paras,
      verticalAlign: VerticalAlignTable.TOP,
    })
  })
  while (cells.length < 2) {
    cells.push(
      new TableCell({
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [tr(" ")] })],
      })
    )
  }
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [4505, 4505],
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [new TableRow({ children: cells.slice(0, 2) })],
  })
}

function prevLabelText(el: HTMLElement): string {
  let p: Element | null = el.previousElementSibling
  while (p) {
    if (p.tagName === "P" || p.tagName === "LABEL") {
      const t = p.textContent?.replace(/\s*:\s*$/, "").trim()
      if (t) return t
    }
    p = p.previousElementSibling
  }
  return el.getAttribute("aria-label") || ""
}

function convertSelect(sel: HTMLSelectElement): Paragraph {
  const label = prevLabelText(sel)
  const val = sel.options[sel.selectedIndex]?.text ?? ""
  const line = label ? `${label}: ${val}` : val
  return new Paragraph({
    spacing: { after: 120 },
    children: [tr(line)],
  })
}

function convertTextarea(ta: HTMLTextAreaElement): Paragraph {
  const label = prevLabelText(ta)
  const val = ta.value.trim() || ta.placeholder || ""
  const text = label ? `${label}\n${val}` : val
  return new Paragraph({
    spacing: { after: 120 },
    children: [tr(text)],
  })
}

function convertBlock(div: HTMLElement): Paragraph[] {
  const raw = div.innerText.replace(/\r\n/g, "\n").trim() || " "
  const parts = raw.split(/\n+/).map((s) => s.trim()).filter(Boolean)
  if (!parts.length) return [new Paragraph({ children: [tr(" ")] })]
  return parts.map(
    (line) =>
      new Paragraph({
        spacing: { after: 120 },
        children: [tr(line)],
      })
  )
}

function convertGov(div: HTMLElement): Paragraph[] {
  const out: Paragraph[] = []
  div.querySelectorAll("p").forEach((p) => {
    const t = p.textContent?.trim()
    if (t) out.push(pCenterBoldItalic(t))
  })
  return out.length ? out : [pCenterBoldItalic(" ")]
}

export function parseEditorToDocx(editorEl: HTMLElement): FileChild[] {
  const out: FileChild[] = []
  const children = Array.from(editorEl.children) as HTMLElement[]

  for (const el of children) {
    if (el.classList.contains("doc-gov")) {
      out.push(...convertGov(el))
      continue
    }
    if (el.tagName === "HR") {
      if (el.classList.contains("docmod-export-pagebreak")) {
        out.push(new Paragraph({ children: [new PageBreak()] }))
      } else {
        out.push(hrLine())
      }
      continue
    }
    if (el.classList.contains("doc-gov-rule")) {
      out.push(hrLine())
      continue
    }
    if (el.matches("h1.doc-title, .doc-title")) {
      out.push(pTitle(el.textContent?.trim() || ""))
      continue
    }
    if (el.classList.contains("doc-num")) {
      out.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: inlineRuns(el),
        })
      )
      continue
    }
    if (el.classList.contains("doc-legal")) {
      out.push(pLegal(el.textContent?.trim() || ""))
      continue
    }
    if (el.classList.contains("doc-section")) {
      out.push(pSection(el.textContent?.trim() || ""))
      continue
    }
    if (el.tagName === "P") {
      out.push(pBody(el as HTMLParagraphElement))
      continue
    }
    if (el.tagName === "TABLE" && el.classList.contains("doc-table")) {
      out.push(convertTable(el as HTMLTableElement))
      continue
    }
    if (el.classList.contains("doc-sigs")) {
      out.push(convertDocSigs(el))
      continue
    }
    if (el.classList.contains("doc-note")) {
      out.push(pNote(el))
      continue
    }
    if (el.classList.contains("doc-block")) {
      out.push(...convertBlock(el))
      continue
    }
    if (el.tagName === "SELECT" && el.classList.contains("doc-select")) {
      out.push(convertSelect(el as HTMLSelectElement))
      continue
    }
    if (el.tagName === "TEXTAREA" && el.classList.contains("doc-textarea")) {
      out.push(convertTextarea(el as HTMLTextAreaElement))
      continue
    }
    if (el.tagName === "DIV") {
      const t = el.textContent?.trim()
      if (t) out.push(new Paragraph({ spacing: { after: 120 }, children: [tr(t)] }))
      continue
    }
    const t = el.textContent?.trim()
    if (t) out.push(new Paragraph({ spacing: { after: 120 }, children: [tr(t)] }))
  }

  return out
}

export async function exportAsDocx(
  editorEl: HTMLElement,
  filename: string
): Promise<void> {
  const parsed = parseEditorToDocx(editorEl)
  const children =
    parsed.length > 0 ? parsed : [new Paragraph({ children: [tr(" ")] })]
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT,
            size: SIZE_HALF_PT,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134,
              bottom: 1134,
              left: 1701,
              right: 1134,
            },
          },
        },
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  const safe = filename.replace(/[/\\?%*:|"<>]/g, "-").trim() || "vietdoc"
  a.download = `${safe}.docx`
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
