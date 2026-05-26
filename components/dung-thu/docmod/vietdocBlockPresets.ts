import type { DocModule, ModuleType, TextAlign } from "./types"
import { govHeaderHTML } from "@/lib/templates/govHeader"

/** Same structure as home-page HĐLĐ template — two signing columns. */
export const SIGNS_LABOR_HTML = `<div class="doc-sigs">
  <div>
    <p class="doc-sig-label">ĐẠI DIỆN BÊN A</p>
    <p class="doc-sig-sub">(Người sử dụng lao động)</p>
    <div class="doc-sig-space"></div>
    <p><span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
  </div>
  <div>
    <p class="doc-sig-label">NGƯỜI LAO ĐỘNG</p>
    <p class="doc-sig-sub">(Bên B)</p>
    <div class="doc-sig-space"></div>
    <p><span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
  </div>
</div>`

/** Generic two-party block with date lines — common on invoices / letters. */
export const SIGNS_TWO_PARTY_HTML = `<div class="doc-sigs">
  <div>
    <p class="doc-sig-label">CHỮ KÝ BÊN A</p>
    <p class="doc-sig-sub">(Ký, ghi rõ họ tên)</p>
    <div class="doc-sig-space"></div>
    <p><span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
    <p>Ngày <span class="doc-field" contenteditable="true" data-placeholder="dd/mm/yyyy"></span></p>
  </div>
  <div>
    <p class="doc-sig-label">CHỮ KÝ BÊN B</p>
    <p class="doc-sig-sub">(Ký, ghi rõ họ tên)</p>
    <div class="doc-sig-space"></div>
    <p><span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
    <p>Ngày <span class="doc-field" contenteditable="true" data-placeholder="dd/mm/yyyy"></span></p>
  </div>
</div>`

export const TABLE_BASIC_HTML = `<table class="doc-table">
<thead><tr><th style="width:48px">STT</th><th>Nội dung</th><th style="width:140px">Ghi chú</th></tr></thead>
<tbody><tr><td contenteditable="true">1</td><td contenteditable="true"></td><td contenteditable="true"></td></tr></tbody>
</table>`

export const DOC_NUM_HTML = `<div class="doc-num">Số: <span class="doc-field" contenteditable="true" data-placeholder="Số văn bản / hợp đồng"></span></div>`

export const KINH_GUI_HTML = `<p class="text-sm leading-relaxed text-ink2">Kính gửi: <span class="doc-field" contenteditable="true" data-placeholder="Ban Giám đốc / Trưởng phòng Nhân sự…"></span></p>`

export const DOC_NOTE_HTML = `<p class="doc-note">Ghi chú pháp lý: Biểu mẫu mang tính tham khảo — cần rà soát theo nội bộ doanh nghiệp và tư vấn pháp lý trước khi ký kết.</p>`

export type VietdocBlockPreset = {
  id: string
  vi: string
  en: string
  moduleType: ModuleType
  content: string
  align: TextAlign
}

/**
 * Insertable blocks aligned with Vietnamese legal templates on the home page
 * (quốc hiệu, số/ký hiệu, chữ ký, v.v.).
 */
export const VIETDOC_BLOCK_PRESETS: readonly VietdocBlockPreset[] = [
  {
    id: "paragraph",
    vi: "Đoạn văn thường",
    en: "Body paragraph",
    moduleType: "paragraph",
    content: "",
    align: "left",
  },
  {
    id: "blank-spacer",
    vi: "Khoảng trống (cách khối)",
    en: "Blank space (between blocks)",
    moduleType: "paragraph",
    content: "<br>",
    align: "left",
  },
  {
    id: "gov-header",
    vi: "Quốc hiệu & khẩu hiệu",
    en: "National header & motto",
    moduleType: "html",
    content: govHeaderHTML,
    align: "center",
  },
  {
    id: "doc-num",
    vi: "Số / ký hiệu văn bản",
    en: "Document number line",
    moduleType: "html",
    content: DOC_NUM_HTML,
    align: "center",
  },
  {
    id: "kinh-gui",
    vi: "Dòng “Kính gửi…”",
    en: "“To / Dear …” line",
    moduleType: "html",
    content: KINH_GUI_HTML,
    align: "left",
  },
  {
    id: "title",
    vi: "Tiêu đề (giữa trang)",
    en: "Title (centred)",
    moduleType: "title",
    content: "",
    align: "center",
  },
  {
    id: "section",
    vi: "Mục / điều (ĐIỀU …)",
    en: "Article heading",
    moduleType: "section",
    content: "",
    align: "left",
  },
  {
    id: "legal",
    vi: "Căn cứ pháp lý",
    en: "Legal basis paragraph",
    moduleType: "legal",
    content: "",
    align: "left",
  },
  {
    id: "block",
    vi: "Khối thoả thuận / điều khoản",
    en: "Agreement / clause block",
    moduleType: "block",
    content: "",
    align: "left",
  },
  {
    id: "sigs-labor",
    vi: "Chữ ký — HĐLĐ (2 bên)",
    en: "Signatures — labour (2 parties)",
    moduleType: "html",
    content: SIGNS_LABOR_HTML,
    align: "left",
  },
  {
    id: "sigs-two-party",
    vi: "Chữ ký — hai bên + ngày",
    en: "Signatures — two parties + date",
    moduleType: "html",
    content: SIGNS_TWO_PARTY_HTML,
    align: "left",
  },
  {
    id: "table",
    vi: "Bảng biểu",
    en: "Table",
    moduleType: "html",
    content: TABLE_BASIC_HTML,
    align: "left",
  },
  {
    id: "doc-note",
    vi: "Ghi chú pháp lý",
    en: "Legal footnote",
    moduleType: "html",
    content: DOC_NOTE_HTML,
    align: "left",
  },
  {
    id: "divider",
    vi: "Đường kẻ ngang",
    en: "Horizontal rule",
    moduleType: "divider",
    content: "",
    align: "left",
  },
  {
    id: "page-break",
    vi: "Ngắt trang (trang mới)",
    en: "Page break (new page)",
    moduleType: "pagebreak",
    content: "",
    align: "left",
  },
] as const

export function moduleFromPreset(p: VietdocBlockPreset): DocModule {
  return {
    id: crypto.randomUUID(),
    type: p.moduleType,
    content: p.content,
    align: p.align,
    ...(p.moduleType === "title" ? { bold: true } : {}),
    presetId: p.id,
  }
}
