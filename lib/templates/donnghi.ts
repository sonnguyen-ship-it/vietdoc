import type { Template } from "@/lib/types"
import { govHeaderHTML } from "@/lib/templates/govHeader"

export const donnghi: Template = {
  id: "donnghi",
  name: {
    vi: "Đơn xin nghỉ việc",
    en: "Resignation letter",
  },
  description: {
    vi: "Đơn xin nghỉ việc theo BLLĐ 2019 Điều 35, có lựa chọn lý do và thời báo trước.",
    en: "Resignation letter referencing Labour Code 2019 Article 35, with reason and notice guidance.",
  },
  category: "lao-dong",
  tagLabel: { vi: "Nghỉ việc", en: "Resignation" },
  tagClass: "bg-red/10 text-red",
  decree: "BLLĐ 2019 · Điều 35",
  effectiveFrom: "01/01/2021",
  updated: "",
  icon: "📝",
  previewBg: "#FEF2F2",
  contentHTML: `
${govHeaderHTML}
<h1 class="doc-title">ĐƠN XIN NGHỈ VIỆC</h1>
<div class="doc-num">Ngày lập đơn: <span class="doc-field" contenteditable="true" data-placeholder="dd/mm/yyyy"></span></div>
<p class="doc-legal">Căn cứ Bộ luật Lao động số 45/2019/QH14, đặc biệt Điều 35 về quyền đơn phương chấm dứt hợp đồng lao động của người lao động.</p>

<p>Kính gửi: <span class="doc-field" contenteditable="true" data-placeholder="Ban Giám đốc / Trưởng phòng Nhân sự..."></span></p>

<p class="doc-section">THÔNG TIN NGƯỜI LÀM ĐƠN</p>
<p>Họ và tên: <span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
<p>Chức vụ: <span class="doc-field" contenteditable="true" data-placeholder="Chức danh"></span> — Phòng ban: <span class="doc-field" contenteditable="true" data-placeholder="Phòng / bộ phận"></span></p>
<p>Số HĐLĐ: <span class="doc-field" contenteditable="true" data-placeholder="Số hợp đồng"></span> — Ngày ký HĐ: <span class="doc-field" contenteditable="true" data-placeholder="dd/mm/yyyy"></span></p>

<p class="doc-section">NỘI DUNG ĐƠN</p>
<p>Tôi làm đơn này đề nghị được chấm dứt HĐLĐ với Công ty kể từ ngày làm việc cuối cùng:</p>
<p>Ngày làm việc cuối cùng dự kiến: <span class="doc-field" contenteditable="true" data-placeholder="dd/mm/yyyy"></span></p>
<p>Lý do nghỉ việc:</p>
<select class="doc-select" aria-label="Lý do nghỉ">
  <option>Lý do cá nhân</option>
  <option>Sức khỏe</option>
  <option>Cơ hội mới</option>
  <option>Khác</option>
</select>
<p>Chi tiết (nếu cần):</p>
<textarea class="doc-textarea" rows="3" placeholder="Mô tả ngắn gọn..."></textarea>
<p class="doc-note" style="margin-top:8px">Gợi ý thời báo trước theo BLLĐ 2019: HĐLĐ không xác định thời hạn — 45 ngày; HĐLĐ xác định thời hạn từ đủ 12 tháng trở lên — 30 ngày; dưới 12 tháng — 03 ngày (trừ trường hợp pháp luật quy định khác).</p>

<p class="doc-section">CAM KẾT</p>
<div class="doc-block" contenteditable="true">Tôi cam kết bàn giao công việc, tài liệu, tài sản của Công ty theo đúng quy định nội bộ và hướng dẫn của quản lý trực tiếp trong thời gian báo trước.</div>

<div style="margin-top:32px;text-align:center">
  <p class="doc-sig-label">NGƯỜI LÀM ĐƠN</p>
  <p class="doc-sig-sub">(Ký, ghi rõ họ tên)</p>
  <div class="doc-sig-space" style="margin:0 auto;max-width:280px"></div>
  <p><span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
  <p>Ngày <span class="doc-field" contenteditable="true" data-placeholder="dd/mm/yyyy"></span></p>
</div>

<p class="doc-note">BLLĐ 2019, Điều 35. Mẫu tham khảo — kiểm tra quy trình nội bộ và thời hạn báo trước cụ thể trong HĐLĐ của bạn.</p>
`.trim(),
}
