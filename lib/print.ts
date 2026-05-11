const PRINT_STYLES = `
  @page { margin: 12mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    background: #fff;
    color: #2D2416;
    font-family: "Be Vietnam Pro", system-ui, sans-serif;
    font-size: 12pt;
    line-height: 1.55;
  }
  .doc-paper {
    max-width: none;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 0;
  }
  .doc-gov { font-size: 10.5pt; }
  .doc-title { font-size: 12pt; }
  .doc-table th, .doc-table td { font-size: 10pt; padding: 4pt 6pt; }
  .doc-field { min-width: 100px; font-size: 11pt; }
  .doc-note { font-size: 9pt; }
`

export function printDocumentHtml(innerHtml: string, title = "VietDoc"): void {
  const w = window.open("", "_blank", "noopener,noreferrer")
  if (!w) return

  w.document.open()
  w.document.write(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>${PRINT_STYLES}</style>
</head>
<body>
  <div class="doc-paper">${innerHtml}</div>
  <script>window.onload=function(){window.print();};</script>
</body>
</html>`)
  w.document.close()
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
