import type { Template } from "@/lib/types"
import { govHeaderHTML } from "@/lib/templates/govHeader"

const attendeeRows = [1, 2, 3, 4, 5]
  .map(
    (n) => `
  <tr>
    <td contenteditable="true">${n}</td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
  </tr>`
  )
  .join("")

export const bienban: Template = {
  id: "bienban",
  name: {
    vi: "Biên bản họp Hội đồng quản trị",
    en: "Board of directors meeting minutes",
  },
  description: {
    vi: "Biên bản họp HĐQT theo Luật Doanh nghiệp 2020 và NĐ 01/2021.",
    en: "BoD minutes aligned with the 2020 Enterprise Law and Decree 01/2021.",
  },
  category: "hanh-chinh",
  tagLabel: { vi: "Hành chính", en: "Corporate" },
  tagClass: "bg-gold/20 text-ink2",
  decree: "Luật DN 2020 · NĐ 01/2021/NĐ-CP",
  effectiveFrom: "01/01/2021",
  updated: "",
  icon: "🏛️",
  previewBg: "#FFF7ED",
  contentHTML: `
${govHeaderHTML}
<h1 class="doc-title">BIÊN BẢN CUỘC HỌP<br/>HỘI ĐỒNG QUẢN TRỊ</h1>
<div class="doc-num">Số: <span class="doc-field" contenteditable="true" data-placeholder="Số biên bản"></span></div>
<p class="doc-legal">Căn cứ Luật Doanh nghiệp số 59/2020/QH14; Nghị định số 01/2021/NĐ-CP ngày 04/01/2021 của Chính phủ về đăng ký doanh nghiệp và Điều lệ Công ty.</p>

<p class="doc-section">I. THÔNG TIN CUỘC HỌP</p>
<p>Thời gian: <span class="doc-field" contenteditable="true" data-placeholder="Giờ, ngày"></span></p>
<p>Địa điểm: <span class="doc-field" contenteditable="true" data-placeholder="Địa chỉ / hình thức trực tuyến"></span></p>
<p>Chủ trì: <span class="doc-field" contenteditable="true" data-placeholder="Họ và tên, chức vụ"></span></p>
<p>Thư ký: <span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>

<p class="doc-section">II. THÀNH PHẦN THAM DỰ</p>
<table class="doc-table">
  <thead>
    <tr>
      <th style="width:40px">STT</th>
      <th>Họ tên</th>
      <th>Chức vụ</th>
      <th style="width:88px">Có mặt (✓/✗)</th>
    </tr>
  </thead>
  <tbody>
    ${attendeeRows}
    <tr>
      <td colspan="4" contenteditable="true">Tổng hợp: X/Y thành viên HĐQT có mặt — đủ / không đủ điều kiện biểu quyết theo Điều lệ.</td>
    </tr>
  </tbody>
</table>

<p class="doc-section">III. NỘI DUNG VÀ BIỂU QUYẾT</p>
<p><strong>Vấn đề 1</strong></p>
<p>Nội dung:</p>
<textarea class="doc-textarea" rows="2" placeholder="Trình bày nội dung..."></textarea>
<p>Kết quả biểu quyết: <span class="doc-field" contenteditable="true" data-placeholder="Nhất trí / không nhất trí / số phiếu"></span></p>
<p>Quyết nghị: <span class="doc-field" contenteditable="true" data-placeholder="Nội dung quyết nghị"></span></p>

<p><strong>Vấn đề 2</strong></p>
<p>Nội dung:</p>
<textarea class="doc-textarea" rows="2" placeholder="Trình bày nội dung..."></textarea>
<p>Kết quả biểu quyết: <span class="doc-field" contenteditable="true" data-placeholder="Nhất trí / không / vắng mặt — số lượng"></span></p>
<p>Quyết nghị: <span class="doc-field" contenteditable="true" data-placeholder="Nội dung quyết nghị"></span></p>

<p><strong>Vấn đề 3</strong></p>
<p>Nội dung:</p>
<textarea class="doc-textarea" rows="2" placeholder="Trình bày nội dung..."></textarea>
<p>Kết quả biểu quyết: <span class="doc-field" contenteditable="true" data-placeholder="Nhất trí / không / vắng mặt — số lượng"></span></p>
<p>Quyết nghị: <span class="doc-field" contenteditable="true" data-placeholder="Nội dung quyết nghị"></span></p>

<p class="doc-section">IV. KẾT LUẬN</p>
<p>Cuộc họp kết thúc lúc: <span class="doc-field" contenteditable="true" data-placeholder="Giờ"></span> cùng ngày. Các thành viên cam kết thực hiện đúng quyết nghị của HĐQT.</p>

<div class="doc-sigs">
  <div>
    <p class="doc-sig-label">CHỦ TỊCH HĐQT</p>
    <p class="doc-sig-sub">(Ký, ghi rõ họ tên)</p>
    <div class="doc-sig-space"></div>
    <p><span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
  </div>
  <div>
    <p class="doc-sig-label">THƯ KÝ CUỘC HỌP</p>
    <p class="doc-sig-sub">(Ký, ghi rõ họ tên)</p>
    <div class="doc-sig-space"></div>
    <p><span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
  </div>
</div>

<p class="doc-note">Luật Doanh nghiệp 2020 và NĐ 01/2021/NĐ-CP. Biên bản tham khảo — đối chiếu Điều lệ công ty và sổ biên bản nội bộ.</p>
`.trim(),
}
