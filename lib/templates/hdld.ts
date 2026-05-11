import type { Template } from "@/lib/types"
import { govHeaderHTML } from "@/lib/templates/govHeader"

export const hdld: Template = {
  id: "hdld",
  name: {
    vi: "Hợp đồng lao động",
    en: "Labour contract",
  },
  description: {
    vi: "Hợp đồng lao động theo BLLĐ 2019, đầy đủ điều khoản thử việc, lương, địa điểm.",
    en: "Labour contract aligned with the 2019 Labour Code, including probation, pay, and workplace clauses.",
  },
  category: "lao-dong",
  tagLabel: { vi: "Lao động", en: "Labour" },
  tagClass: "bg-blue/10 text-blue",
  decree: "BLLĐ 45/2019/QH14 · NĐ 145/2020/NĐ-CP",
  effectiveFrom: "01/01/2021",
  updated: "Hot",
  icon: "📋",
  previewBg: "#EFF6FF",
  featured: true,
  contentHTML: `
${govHeaderHTML}
<h1 class="doc-title">HỢP ĐỒNG LAO ĐỘNG</h1>
<div class="doc-num">Số: <span class="doc-field" contenteditable="true" data-placeholder="Số hợp đồng"></span></div>
<p class="doc-legal">Căn cứ Bộ luật Lao động số 45/2019/QH14; Nghị định số 145/2020/NĐ-CP ngày 14/12/2020 của Chính phủ hướng dẫn điều kiện lao động và quan hệ lao động; các văn bản pháp luật có liên quan.</p>

<p class="doc-section">BÊN A: NGƯỜI SỬ DỤNG LAO ĐỘNG</p>
<p>Tên doanh nghiệp: <span class="doc-field" contenteditable="true" data-placeholder="Tên doanh nghiệp"></span></p>
<p>Mã số thuế: <span class="doc-field" contenteditable="true" data-placeholder="Mã số thuế"></span></p>
<p>Địa chỉ: <span class="doc-field" contenteditable="true" data-placeholder="Địa chỉ trụ sở"></span></p>
<p>Đại diện pháp luật: <span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span> — Chức vụ: <span class="doc-field" contenteditable="true" data-placeholder="Chức vụ"></span></p>
<p>Điện thoại: <span class="doc-field" contenteditable="true" data-placeholder="Số điện thoại"></span></p>

<p class="doc-section">BÊN B: NGƯỜI LAO ĐỘNG</p>
<p>Họ và tên: <span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
<p>Ngày sinh: <span class="doc-field" contenteditable="true" data-placeholder="dd/mm/yyyy"></span> — Giới tính: <span class="doc-field" contenteditable="true" data-placeholder="Nam / Nữ / Khác"></span></p>
<p>Số CCCD/CMND: <span class="doc-field" contenteditable="true" data-placeholder="Số CCCD/CMND"></span> — Cấp ngày / tại: <span class="doc-field" contenteditable="true" data-placeholder="Ngày cấp, nơi cấp"></span></p>
<p>Địa chỉ thường trú: <span class="doc-field" contenteditable="true" data-placeholder="Địa chỉ thường trú"></span></p>
<p>Điện thoại: <span class="doc-field" contenteditable="true" data-placeholder="Số điện thoại"></span> — Email: <span class="doc-field" contenteditable="true" data-placeholder="Email"></span></p>

<p>Hai bên thoả thuận ký kết Hợp đồng lao động (HĐLĐ) với các điều khoản sau:</p>

<p class="doc-section">ĐIỀU 1. LOẠI HỢP ĐỒNG VÀ THỜI HẠN</p>
<p>Loại HĐLĐ:</p>
<select class="doc-select" aria-label="Loại hợp đồng">
  <option>Không xác định thời hạn</option>
  <option>Xác định thời hạn</option>
  <option>Thử việc</option>
</select>
<p>Từ ngày: <span class="doc-field" contenteditable="true" data-placeholder="dd/mm/yyyy"></span> — Đến ngày: <span class="doc-field" contenteditable="true" data-placeholder="dd/mm/yyyy hoặc để trống"></span></p>
<p>Thử việc (số ngày): <span class="doc-field" contenteditable="true" data-placeholder="Số ngày thử việc"></span></p>

<p class="doc-section">ĐIỀU 2. CÔNG VIỆC VÀ ĐỊA ĐIỂM</p>
<p>Chức danh: <span class="doc-field" contenteditable="true" data-placeholder="Chức danh công việc"></span></p>
<p>Mô tả công việc:</p>
<textarea class="doc-textarea" rows="3" placeholder="Mô tả chi tiết công việc, KPI, báo cáo..."></textarea>
<p>Địa điểm làm việc: <span class="doc-field" contenteditable="true" data-placeholder="Địa điểm"></span></p>
<p>Thời gian làm việc: <span class="doc-field" contenteditable="true" data-placeholder="Giờ làm việc, ca, lịch tuần"></span></p>

<p class="doc-section">ĐIỀU 3. LƯƠNG VÀ PHÚC LỢI</p>
<p>Mức lương cơ bản (VNĐ/tháng): <span class="doc-field" contenteditable="true" data-placeholder="Số tiền"></span></p>
<p>Phụ cấp: <span class="doc-field" contenteditable="true" data-placeholder="Các khoản phụ cấp"></span></p>
<p>Hình thức trả lương: <span class="doc-field" contenteditable="true" data-placeholder="Chuyển khoản / tiền mặt"></span> — Ngày trả lương: <span class="doc-field" contenteditable="true" data-placeholder="Ngày hàng tháng"></span></p>
<p>BHXH, BHYT, BHTN: đóng theo quy định hiện hành của pháp luật Việt Nam.</p>

<p class="doc-section">ĐIỀU 4. QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN</p>
<div class="doc-block" contenteditable="true">Bên A có quyền yêu cầu Bên B thực hiện đúng công việc, nội quy lao động và bố trí hợp lý theo nhu cầu sản xuất kinh doanh trong phạm vi pháp luật. Bên B có nghĩa vụ chấp hành nội quy, bảo mật thông tin và bàn giao khi chấm dứt HĐLĐ theo quy định.<br/><br/>Bên B có quyền được trả lương đầy đủ, đúng hạn, nghỉ phép, nghỉ lễ và tham gia BHXH theo luật. Bên A có nghĩa vụ tôn trọng danh dự, tạo điều kiện an toàn lao động và thanh toán đầy đủ các quyền lợi hợp pháp của Bên B.</div>

<p class="doc-section">ĐIỀU 5. ĐIỀU KHOẢN CHUNG</p>
<div class="doc-block" contenteditable="true">Hợp đồng có hiệu lực kể từ ngày ký. Mọi sửa đổi, bổ sung phải được lập thành văn bản và có chữ ký của hai bên. Tranh chấp phát sinh được giải quyết theo trình tự hoà giải, trọng tài hoặc Tòa án có thẩm quyền theo quy định pháp luật.</div>

<div class="doc-sigs">
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
</div>

<p class="doc-note">Ghi chú pháp lý: Bộ luật Lao động 2019 (Luật số 45/2019/QH14); Nghị định 145/2020/NĐ-CP hướng dẫn điều kiện lao động và quan hệ lao động. Biểu mẫu mang tính tham khảo — cần rà soát theo nội bộ doanh nghiệp và tư vấn pháp lý trước khi ký kết.</p>
`.trim(),
}
