import type { Template } from "@/lib/types"
import { govHeaderHTML } from "@/lib/templates/govHeader"

const goodsRows = Array.from({ length: 5 }, (_, i) => i + 1)
  .map(
    (n) => `
  <tr>
    <td contenteditable="true">${n}</td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
  </tr>`
  )
  .join("")

export const hdmb: Template = {
  id: "hdmb",
  name: {
    vi: "Hợp đồng mua bán hàng hoá",
    en: "Goods sale and purchase contract",
  },
  description: {
    vi: "Hợp đồng mua bán kèm bảng hàng hoá, thanh toán, giao nhận và bảo hành.",
    en: "Sale contract with line items, payment, delivery, and warranty clauses.",
  },
  category: "hop-dong",
  tagLabel: { vi: "Mua bán", en: "Sales" },
  tagClass: "bg-green/10 text-green",
  decree: "Luật TM 2005 · BLDS 2015",
  effectiveFrom: "01/01/2006",
  updated: "",
  icon: "📦",
  previewBg: "#F0FDF4",
  contentHTML: `
${govHeaderHTML}
<h1 class="doc-title">HỢP ĐỒNG MUA BÁN HÀNG HOÁ</h1>
<div class="doc-num">Số: <span class="doc-field" contenteditable="true" data-placeholder="Số hợp đồng"></span></div>
<p class="doc-legal">Căn cứ Luật Thương mại số 36/2005/QH11; Bộ luật Dân sự số 91/2015/QH13 và quy định pháp luật có liên quan.</p>

<p class="doc-section">BÊN BÁN (BÊN A)</p>
<p>Tên: <span class="doc-field" contenteditable="true" data-placeholder="Tên bên bán"></span> — MST: <span class="doc-field" contenteditable="true" data-placeholder="MST"></span></p>
<p>Địa chỉ: <span class="doc-field" contenteditable="true" data-placeholder="Địa chỉ"></span> — Đại diện: <span class="doc-field" contenteditable="true" data-placeholder="Họ tên, chức vụ"></span></p>

<p class="doc-section">BÊN MUA (BÊN B)</p>
<p>Tên: <span class="doc-field" contenteditable="true" data-placeholder="Tên bên mua"></span> — MST: <span class="doc-field" contenteditable="true" data-placeholder="MST"></span></p>
<p>Địa chỉ: <span class="doc-field" contenteditable="true" data-placeholder="Địa chỉ"></span> — Đại diện: <span class="doc-field" contenteditable="true" data-placeholder="Họ tên, chức vụ"></span></p>

<p class="doc-section">ĐIỀU 1. HÀNG HOÁ</p>
<table class="doc-table">
  <thead>
    <tr>
      <th style="width:36px">STT</th>
      <th>Tên hàng</th>
      <th style="width:56px">ĐVT</th>
      <th style="width:72px">SL</th>
      <th style="width:96px">Đơn giá</th>
      <th style="width:104px">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    ${goodsRows}
    <tr>
      <td colspan="5" style="text-align:right;font-weight:600">Tổng cộng</td>
      <td contenteditable="true"></td>
    </tr>
  </tbody>
</table>

<p class="doc-section">ĐIỀU 2. THANH TOÁN</p>
<p>Phương thức: <span class="doc-field" contenteditable="true" data-placeholder="CK / tiền mặt / LC..."></span></p>
<p>Thời hạn: <span class="doc-field" contenteditable="true" data-placeholder="Theo tiến độ / ngày cụ thể"></span></p>
<p>Tài khoản ngân hàng: <span class="doc-field" contenteditable="true" data-placeholder="Ngân hàng, số TK, chủ TK"></span></p>

<p class="doc-section">ĐIỀU 3. GIAO HÀNG</p>
<p>Địa điểm giao/nhận: <span class="doc-field" contenteditable="true" data-placeholder="Địa chỉ"></span></p>
<p>Thời hạn giao: <span class="doc-field" contenteditable="true" data-placeholder="Ngày / tuần / milestone"></span></p>
<p>Phương tiện vận chuyển: <span class="doc-field" contenteditable="true" data-placeholder="Bên A / Bên B / thuê ngoài"></span></p>

<p class="doc-section">ĐIỀU 4. BẢO HÀNH VÀ XỬ LÝ HÀNG LỖI</p>
<div class="doc-block" contenteditable="true">Thời hạn bảo hành: … Điều kiện đổi/trả: … Trách nhiệm khi hàng không đúng quy cách/chất lượng: …</div>

<p class="doc-section">ĐIỀU 5. PHẠT VI PHẠM VÀ BỒI THƯỜNG</p>
<div class="doc-block" contenteditable="true">Mức phạt chậm giao/chậm thanh toán: … Bồi thường thiệt hại thực tế trong giới hạn pháp luật.</div>

<div class="doc-sigs">
  <div>
    <p class="doc-sig-label">ĐẠI DIỆN BÊN A (BÁN)</p>
    <div class="doc-sig-space"></div>
    <p><span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
  </div>
  <div>
    <p class="doc-sig-label">ĐẠI DIỆN BÊN B (MUA)</p>
    <div class="doc-sig-space"></div>
    <p><span class="doc-field" contenteditable="true" data-placeholder="Họ và tên"></span></p>
  </div>
</div>

<p class="doc-note">Căn cứ Luật Thương mại 2005 và BLDS 2015. Biểu mẫu tham khảo — cần rà soát Incoterms, bảo hiểm hàng hoá và điều khoản đặc thù ngành.</p>
`.trim(),
}
