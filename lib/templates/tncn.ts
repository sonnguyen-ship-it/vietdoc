import type { Template } from "@/lib/types"
import { govHeaderHTML } from "@/lib/templates/govHeader"

export const tncn: Template = {
  id: "tncn",
  name: {
    vi: "Tờ khai quyết toán thuế TNCN (02/QTT-TNCN)",
    en: "PIT finalisation return (Form 02/QTT-TNCN)",
  },
  description: {
    vi: "Mẫu 02/QTT-TNCN theo TT 80/2021 (sửa đổi TT 94/2025), hiệu lực từ 01/07/2025.",
    en: "Form 02/QTT-TNCN under Circular 80/2021 (as amended by 94/2025), effective 01/07/2025.",
  },
  category: "thue",
  tagLabel: { vi: "Thuế TNCN", en: "PIT" },
  tagClass: "bg-gold/15 text-ink2",
  decree: "TT 80/2021 · Mẫu 02/QTT-TNCN",
  effectiveFrom: "01/07/2025",
  updated: "Mới",
  icon: "📊",
  previewBg: "#FFFBEB",
  contentHTML: `
${govHeaderHTML}
<h1 class="doc-title">TỜ KHAI QUYẾT TOÁN THUẾ THU NHẬP CÁ NHÂN<br/>(Mẫu số 02/QTT-TNCN)</h1>
<div class="doc-num">Ký hiệu: <span class="doc-field" contenteditable="true" data-placeholder="Ký hiệu / số thứ tự"></span></div>
<p class="doc-legal">Căn cứ Thông tư số 80/2021/TT-BTC ngày 29/09/2021 của Bộ Tài chính hướng dẫn thi hành Luật Quản lý thuế và Luật Thuế thu nhập cá nhân; Thông tư số 94/2025/TT-BTC sửa đổi, bổ sung một số điều.</p>

<p class="doc-section">PHẦN I. THÔNG TIN NGƯỜI NỘP THUẾ</p>
<p>[01] Kỳ tính thuế (năm): <span class="doc-field" contenteditable="true" data-placeholder="YYYY"></span></p>
<p>[02] Lần đầu / Bổ sung lần thứ: <span class="doc-field" contenteditable="true" data-placeholder="Lần đầu / số lần bổ sung"></span></p>
<p>[03] Tên người nộp thuế: <span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
<p>[04] Mã số thuế: <span class="doc-field" contenteditable="true" data-placeholder="MST cá nhân"></span></p>
<p>[05] Số CCCD / Hộ chiếu: <span class="doc-field" contenteditable="true" data-placeholder="Số giấy tờ"></span></p>
<p>[06] Địa chỉ cư trú: <span class="doc-field" contenteditable="true" data-placeholder="Địa chỉ đầy đủ"></span></p>
<p>[07] Điện thoại: <span class="doc-field" contenteditable="true" data-placeholder="Số điện thoại"></span> &nbsp; [08] Email: <span class="doc-field" contenteditable="true" data-placeholder="Email"></span></p>

<p class="doc-section">PHẦN II. THU NHẬP VÀ THUẾ</p>
<table class="doc-table">
  <thead>
    <tr><th style="width:40px">STT</th><th>Chỉ tiêu</th><th style="width:140px">Số tiền (VNĐ)</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>[09] Tổng thu nhập chịu thuế</td><td contenteditable="true"></td></tr>
    <tr><td>2</td><td>[10] Các khoản được miễn thuế</td><td contenteditable="true"></td></tr>
    <tr><td>3</td><td>[11] Thu nhập chịu thuế sau miễn</td><td contenteditable="true"></td></tr>
    <tr><td>4</td><td>[12] Bảo hiểm bắt buộc được trừ</td><td contenteditable="true"></td></tr>
    <tr><td>5</td><td>[13] Giảm trừ bản thân (11 triệu/tháng × số tháng)</td><td contenteditable="true"></td></tr>
    <tr><td>6</td><td>[14] Giảm trừ người phụ thuộc (4,4 triệu/người/tháng)</td><td contenteditable="true"></td></tr>
    <tr><td>7</td><td>[15] Thu nhập tính thuế [= 11 − 12 − 13 − 14]</td><td contenteditable="true"></td></tr>
    <tr><td>8</td><td>[16] Thuế TNCN phải nộp theo biểu lũy tiến</td><td contenteditable="true"></td></tr>
    <tr><td>9</td><td>[17] Số thuế đã khấu trừ trong năm</td><td contenteditable="true"></td></tr>
    <tr><td>10</td><td>[18] Số thuế còn phải nộp (+) / được hoàn (−)</td><td contenteditable="true"></td></tr>
  </tbody>
</table>

<p class="doc-section">BIỂU THUẾ LŨY TIẾN THAM KHẢO (ĐỌC)</p>
<table class="doc-table">
  <thead>
    <tr><th>Bậc</th><th>Phần thu nhập tính thuế / tháng</th><th>Thuế suất</th></tr>
  </thead>
  <tbody>
    <tr><td contenteditable="false">1</td><td contenteditable="false">Đến 5 triệu</td><td contenteditable="false">5%</td></tr>
    <tr><td contenteditable="false">2</td><td contenteditable="false">Trên 5 đến 10 triệu</td><td contenteditable="false">10%</td></tr>
    <tr><td contenteditable="false">3</td><td contenteditable="false">Trên 10 đến 18 triệu</td><td contenteditable="false">15%</td></tr>
    <tr><td contenteditable="false">4</td><td contenteditable="false">Trên 18 đến 32 triệu</td><td contenteditable="false">20%</td></tr>
    <tr><td contenteditable="false">5</td><td contenteditable="false">Trên 32 đến 52 triệu</td><td contenteditable="false">25%</td></tr>
    <tr><td contenteditable="false">6</td><td contenteditable="false">Trên 52 đến 80 triệu</td><td contenteditable="false">30%</td></tr>
    <tr><td contenteditable="false">7</td><td contenteditable="false">Trên 80 triệu</td><td contenteditable="false">35%</td></tr>
  </tbody>
</table>

<p>Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về các số liệu đã khai./.</p>

<div class="doc-sigs">
  <div>
    <p class="doc-sig-label">NGƯỜI NỘP THUẾ</p>
    <p class="doc-sig-sub">(Ký, ghi rõ họ tên)</p>
    <div class="doc-sig-space"></div>
    <p><span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
    <p>Ngày <span class="doc-field" contenteditable="true" data-placeholder="dd/mm/yyyy"></span></p>
  </div>
  <div>
    <p class="doc-sig-label">CÁN BỘ TIẾP NHẬN</p>
    <p class="doc-sig-sub">(Ghi nhận nơi nộp)</p>
    <div class="doc-sig-space"></div>
    <p><span class="doc-field" contenteditable="true" data-placeholder="Họ tên cán bộ"></span></p>
  </div>
</div>

<p class="doc-note">TT 80/2021/TT-BTC ngày 29/09/2021 hướng dẫn Luật Quản lý thuế và Luật Thuế TNCN. TT 94/2025/TT-BTC sửa đổi, bổ sung một số điều. Biểu mẫu tham khảo — kiểm tra phiên bản hiện hành trên Cổng thông tin Bộ Tài chính / Tổng cục Thuế trước khi nộp.</p>
`.trim(),
}
