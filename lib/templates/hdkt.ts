import type { Template } from "@/lib/types"
import { govHeaderHTML } from "@/lib/templates/govHeader"

export const hdkt: Template = {
  id: "hdkt",
  name: {
    vi: "Hợp đồng dịch vụ",
    en: "Service agreement",
  },
  description: {
    vi: "Hợp đồng cung ứng dịch vụ giữa bên thuê và bên cung cấp theo BLDS và Luật Thương mại.",
    en: "Service contract between client and provider under the Civil Code and Commercial Law.",
  },
  category: "hop-dong",
  tagLabel: { vi: "Dịch vụ", en: "Services" },
  tagClass: "bg-ink/5 text-ink2",
  decree: "BLDS 2015 · Luật Thương mại 2005",
  effectiveFrom: "01/01/2017",
  updated: "",
  icon: "🤝",
  previewBg: "#F5F3FF",
  contentHTML: `
${govHeaderHTML}
<h1 class="doc-title">HỢP ĐỒNG DỊCH VỤ</h1>
<div class="doc-num">Số: <span class="doc-field" contenteditable="true" data-placeholder="Số hợp đồng"></span></div>
<p class="doc-legal">Căn cứ Bộ luật Dân sự số 91/2015/QH13; Luật Thương mại số 36/2005/QH11 và pháp luật có liên quan, hai bên thoả thuận ký kết Hợp đồng dịch vụ với các điều khoản sau:</p>

<p class="doc-section">BÊN A: BÊN THUÊ DỊCH VỤ</p>
<p>Tên: <span class="doc-field" contenteditable="true" data-placeholder="Tên tổ chức / cá nhân"></span></p>
<p>Mã số thuế: <span class="doc-field" contenteditable="true" data-placeholder="MST (nếu có)"></span></p>
<p>Địa chỉ: <span class="doc-field" contenteditable="true" data-placeholder="Địa chỉ"></span></p>
<p>Đại diện: <span class="doc-field" contenteditable="true" data-placeholder="Họ và tên, chức vụ"></span></p>

<p class="doc-section">BÊN B: BÊN CUNG CẤP DỊCH VỤ</p>
<p>Tên: <span class="doc-field" contenteditable="true" data-placeholder="Tên tổ chức / cá nhân"></span></p>
<p>Mã số thuế: <span class="doc-field" contenteditable="true" data-placeholder="MST (nếu có)"></span></p>
<p>Địa chỉ: <span class="doc-field" contenteditable="true" data-placeholder="Địa chỉ"></span></p>
<p>Đại diện: <span class="doc-field" contenteditable="true" data-placeholder="Họ và tên, chức vụ"></span></p>

<p class="doc-section">ĐIỀU 1. NỘI DUNG DỊCH VỤ</p>
<textarea class="doc-textarea" rows="4" placeholder="Mô tả phạm vi dịch vụ, sản phẩm bàn giao, tiêu chuẩn chất lượng..."></textarea>
<p>Thời gian thực hiện: <span class="doc-field" contenteditable="true" data-placeholder="Từ ngày — đến ngày / milestone"></span></p>

<p class="doc-section">ĐIỀU 2. GIÁ TRỊ VÀ THANH TOÁN</p>
<p>Giá trị chưa VAT: <span class="doc-field" contenteditable="true" data-placeholder="VNĐ"></span></p>
<p>VAT (%): <span class="doc-field" contenteditable="true" data-placeholder="10 / 8 / 0..."></span> — Tổng thanh toán: <span class="doc-field" contenteditable="true" data-placeholder="VNĐ"></span></p>
<p>Phương thức thanh toán: <span class="doc-field" contenteditable="true" data-placeholder="Chuyển khoản / tiền mặt / kỳ hạn"></span></p>

<p class="doc-section">ĐIỀU 3. QUYỀN VÀ NGHĨA VỤ</p>
<div class="doc-block" contenteditable="true">Bên A có quyền giám sát tiến độ, yêu cầu sửa lỗi trong phạm vi hợp đồng và từ chối thanh toán nếu sản phẩm không đạt tiêu chuẩn đã thoả thuận. Bên B có nghĩa vụ thực hiện đúng phạm vi, bảo mật thông tin và bàn giao đầy đủ tài liệu.<br/><br/>Bên B có quyền yêu cầu cung cấp thông tin cần thiết và nhận thanh toán đúng hạn. Bên A có nghĩa vụ thanh toán theo tiến độ và phối hợp kịp thời.</div>

<p class="doc-section">ĐIỀU 4. XỬ LÝ VI PHẠM</p>
<p>Phạt vi phạm: <span class="doc-field" contenteditable="true" data-placeholder="% giá trị HĐ hoặc mức cụ thể"></span> trên giá trị hợp đồng (hoặc theo thiệt hại thực tế nếu cao hơn, trong giới hạn pháp luật).</p>

<p class="doc-section">ĐIỀU 5. HIỆU LỰC VÀ ĐIỀU KHOẢN CHUNG</p>
<div class="doc-block" contenteditable="true">Hợp đồng có hiệu lực kể từ ngày ký. Mọi sửa đổi phải bằng văn bản có chữ ký hai bên. Tranh chấp được giải quyết tại Tòa án có thẩm quyền tại <span class="doc-field" contenteditable="true" data-placeholder="Địa phương"></span> trừ khi hai bên thoả thuận trọng tài.</div>

<div class="doc-sigs">
  <div>
    <p class="doc-sig-label">ĐẠI DIỆN BÊN A</p>
    <p class="doc-sig-sub">(Bên thuê dịch vụ)</p>
    <div class="doc-sig-space"></div>
    <p><span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
  </div>
  <div>
    <p class="doc-sig-label">ĐẠI DIỆN BÊN B</p>
    <p class="doc-sig-sub">(Bên cung cấp dịch vụ)</p>
    <div class="doc-sig-space"></div>
    <p><span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
  </div>
</div>

<p class="doc-note">Căn cứ BLDS 2015 và Luật Thương mại 2005. Văn bản tham khảo — cần điều chỉnh theo từng ngành và tư vấn pháp lý trước khi ký kết.</p>
`.trim(),
}
