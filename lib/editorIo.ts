export function draftStorageKey(templateId: string): string {
  return `vietdoc_draft_${templateId}`
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

export async function copyDocText(editorEl: HTMLElement): Promise<void> {
  const text = editorEl.innerText ?? ""
  await navigator.clipboard.writeText(text)
}

export function printDoc(title: string, innerHtml: string): void {
  const w = window.open("", "_blank", "noopener,noreferrer")
  if (!w) return
  const safeTitle = escapeHtml(title)
  const styles = `
    @page { margin: 20mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 40px;
      font-family: "Times New Roman", Times, serif;
      font-size: 13px;
      line-height: 1.9;
      color: #1A1208;
    }
    table { width: 100%; border-collapse: collapse; }
    td, th { border: 0.5px solid #888; padding: 6px 9px; vertical-align: top; }
    .doc-field { border-bottom: 1px solid #2D2416; min-width: 80px; display: inline-block; }
  `
  w.document.open()
  w.document.write(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <title>${safeTitle}</title>
  <style>${styles}</style>
</head>
<body>
  <div class="doc-paper">${innerHtml}</div>
</body>
</html>`)
  w.document.close()
  window.setTimeout(() => {
    w.focus()
    w.print()
  }, 500)
}
