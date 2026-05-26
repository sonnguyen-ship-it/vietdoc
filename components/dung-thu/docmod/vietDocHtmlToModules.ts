import type { DocModule, ModuleType, TextAlign } from "./types"

function uid(): string {
  return crypto.randomUUID()
}

function inferAlign(el: Element): TextAlign {
  const st = (el as HTMLElement).style?.textAlign
  if (st === "center" || st === "right" || st === "left" || st === "justify") return st
  const cls = el.className?.toString?.() ?? ""
  if (cls.includes("doc-title") || cls.includes("doc-num")) return "center"
  return "left"
}

function mod(t: ModuleType, content: string, align?: TextAlign, extra?: Partial<DocModule>): DocModule {
  return {
    id: uid(),
    type: t,
    content,
    align: align ?? "left",
    ...extra,
  }
}

/**
 * Split VietDoc `contentHTML` into reorderable modules, matching patterns used
 * across hdld, tncn, hdkt, hdmb, bienban, donnghi.
 */
export function vietDocHtmlToModules(html: string): DocModule[] {
  if (typeof window === "undefined") return []

  const parser = new DOMParser()
  const wrapped = `<div data-vietdoc-parse-root>${html.trim()}</div>`
  const doc = parser.parseFromString(wrapped, "text/html")
  const root = doc.querySelector("[data-vietdoc-parse-root]")
  if (!root) return []

  const out: DocModule[] = []

  for (const node of Array.from(root.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent?.trim()
      if (t) {
        const esc = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        out.push(mod("paragraph", esc, "left"))
      }
      continue
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue
    const el = node as Element
    const tag = el.tagName.toLowerCase()

    if (tag === "hr") {
      out.push(mod("divider", "", "left"))
      continue
    }

    if (tag === "h1" && el.classList.contains("doc-title")) {
      out.push(mod("title", el.innerHTML, inferAlign(el), { bold: true }))
      continue
    }

    if (tag === "p" && el.classList.contains("doc-section")) {
      out.push(mod("section", el.innerHTML, inferAlign(el)))
      continue
    }

    if (tag === "p" && el.classList.contains("doc-legal")) {
      out.push(mod("legal", el.innerHTML, inferAlign(el)))
      continue
    }

    if (tag === "p" && el.classList.contains("doc-note")) {
      out.push(mod("html", el.outerHTML, inferAlign(el)))
      continue
    }

    if (tag === "div" && el.classList.contains("doc-block")) {
      out.push(mod("block", el.innerHTML, inferAlign(el)))
      continue
    }

    if (tag === "div" && el.classList.contains("doc-gov")) {
      out.push(mod("html", el.outerHTML, "center", { presetId: "gov-header" }))
      continue
    }

    if (tag === "table" && el.classList.contains("doc-table")) {
      out.push(mod("html", el.outerHTML, "left"))
      continue
    }

    if (tag === "div" && el.classList.contains("doc-sigs")) {
      out.push(mod("html", el.outerHTML, "left"))
      continue
    }

    if (tag === "p" || tag === "div" || tag === "select" || tag === "textarea") {
      out.push(mod("html", el.outerHTML, inferAlign(el)))
      continue
    }

    out.push(mod("html", el.outerHTML, inferAlign(el)))
  }

  return out.length > 0 ? out : [mod("html", html.trim(), "left")]
}
