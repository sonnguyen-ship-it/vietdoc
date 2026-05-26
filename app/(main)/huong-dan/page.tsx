import type { Metadata } from "next"
import Link from "next/link"
import { SITE_URL } from "@/lib/siteUrl"

export const metadata: Metadata = {
  title: "Hướng Dẫn Soạn Thảo Biểu Mẫu Pháp Lý | VietDoc",
  description:
    "Cách điền hợp đồng lao động, tờ khai thuế TNCN, hợp đồng dịch vụ, biên bản họp HĐQT và đơn xin nghỉ việc trên VietDoc — lưu ý pháp lý trước khi ký.",
  keywords: [
    "cách viết hợp đồng lao động",
    "hướng dẫn điền tờ khai thuế tncn",
    "biểu mẫu pháp lý điền như thế nào",
  ],
  alternates: { canonical: `${SITE_URL}/huong-dan` },
}

const howToLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "HowTo",
      name: "Điền hợp đồng lao động trên VietDoc",
      step: [
        { "@type": "HowToStep", text: "Xác định loại hợp đồng và thời hạn." },
        { "@type": "HowToStep", text: "Điền thông tin doanh nghiệp và người lao động theo CMND/CCCD." },
        { "@type": "HowToStep", text: "Kiểm tra mức lương và phụ cấp đúng vùng hiện hành." },
      ],
    },
  ],
}

const sections = [
  {
    h2: "Hợp đồng lao động (BLLĐ 2019)",
    body: "Bắt đầu từ phần nhận diện doanh nghiệp và người lao động: họ tên, địa chỉ, số CCCD, chức danh công việc, địa điểm làm việc. Tiếp theo điền thù lao, hình thức trả lương, thời gian làm việc và thử việc. Kiểm tra điều khoản bảo hiểm xã hội, bảo hiểm y tế và điều kiện chấm dứt hợp đồng. Trước khi ký, nên nhờ nhân sự hoặc luật sư đối chiếu với nội quy lao động nội bộ.",
    href: "/mau/hop-dong-lao-dong",
  },
  {
    h2: "Tờ khai quyết toán thuế TNCN (02/QTT-TNCN)",
    body: "Xác định năm quyết toán và chỉ tiêu thuộc diện khai. Điền chỉ tiêu thu nhập chịu thuế, khấu trừ và số thuế đã tạm nộp. Đối chiếu với chứng từ khấu trừ thuế của đơn vị chi trả. Nếu có phụ thuộc và giảm trừ gia cảnh, chuẩn bị bản sao chứng minh theo hướng dẫn của cơ quan thuế.",
    href: "/mau/to-khai-thue-tncn",
  },
  {
    h2: "Hợp đồng dịch vụ kinh tế",
    body: "Ghi rõ phạm vi dịch vụ, thời gian thực hiện, cách tính phí và lịch thanh toán. Điều khoản VAT cần khớp với hóa đơn đầu ra. Bổ sung điều khoản bảo mật thông tin và sở hữu trí tuệ nếu có xử lý dữ liệu khách hàng. Hai bên nên thống nhất cơ chế nghiệm thu và phạt chậm tiến độ.",
    href: "/mau/hop-dong-dich-vu",
  },
  {
    h2: "Hợp đồng mua bán hàng hoá",
    body: "Liệt kê hàng hoá theo dòng: tên, đơn vị, số lượng, đơn giá, thành tiền. Ghi rõ điều kiện giao hàng, chuyển rủi ro, bảo hành và xử lý hàng không đạt. Thống nhất phương thức thanh toán (CK, LC, tiền mặt) và lãi chậm thanh toán nếu có.",
    href: "/mau/hop-dong-mua-ban",
  },
  {
    h2: "Biên bản họp Hội đồng quản trị",
    body: "Ghi nhận thành phần tham dự, chủ tọa, thư ký, nội dung các báo cáo và phần thảo luận. Phần biểu quyết cần rõ số phiếu tán thành/không tán thành/không biểu quyết. Đính kèm phụ lục nghị quyết nếu có quyết định riêng.",
    href: "/mau/bien-ban-hop-hdqt",
  },
  {
    h2: "Đơn xin nghỉ việc / thôi việc",
    body: "Điền ngày gửi đơn và ngày dự kiến nghỉ việc sao cho phù hợp thời gian báo trước theo loại hợp đồng (Điều 35 BLLĐ 2019). Ghi rõ lý do nếu cần thiết cho hồ sơ nội bộ. Giữ bản scan hoặc biên nhận nộp đơn.",
    href: "/mau/don-xin-nghi-viec",
  },
]

export default function HuongDanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <nav className="text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            Trang chủ
          </Link>
          <span className="mx-1">/</span>
          <span className="text-ink2">Hướng dẫn</span>
        </nav>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
          Hướng Dẫn Sử Dụng Biểu Mẫu Pháp Lý VietDoc
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          VietDoc mở biểu mẫu trực tiếp trên trình duyệt: bạn chỉnh sửa văn bản như trong word processor, có tự động lưu nháp cục bộ trên máy. Dưới đây là quy trình gợi ý cho từng loại hồ sơ thường gặp; đây không phải tư vấn pháp lý — hãy xác minh với luật sư hoặc kế toán trước khi ký.
        </p>

        <div className="mt-8 space-y-10">
          {sections.map((s) => (
            <section key={s.h2}>
              <h2 className="font-display text-xl font-semibold text-ink">{s.h2}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
              <p className="mt-3 text-sm font-semibold">
                <Link href={s.href} className="text-red hover:underline">
                  Mở biểu mẫu →
                </Link>
              </p>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm">
          <Link href="/" className="font-semibold text-red hover:underline">
            ← Về trang chủ
          </Link>
        </p>
      </article>
    </>
  )
}
