import type { Metadata } from "next"
import Link from "next/link"
import { SITE_URL } from "@/lib/siteUrl"

export const metadata: Metadata = {
  title: "So Sánh VietDoc vs Microsoft Office vs Google Docs vs WPS | 2025",
  description:
    "So sánh chi phí, tính pháp lý, biểu mẫu tiếng Việt và khả năng offline giữa VietDoc, Microsoft Office, Google Docs và WPS Office cho doanh nghiệp Việt Nam.",
  keywords: [
    "so sánh microsoft office google docs",
    "phần mềm văn phòng nào tốt nhất 2025",
    "microsoft office có đáng mua không",
    "google docs vs microsoft word tiếng việt",
  ],
  alternates: { canonical: `${SITE_URL}/bang-so-sanh` },
}

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "So Sánh Phần Mềm Văn Phòng 2025: VietDoc, Microsoft Office, Google Docs, và WPS",
  datePublished: "2025-01-15",
  dateModified: "2025-05-01",
  author: { "@type": "Organization", name: "VietDoc", url: SITE_URL },
  publisher: { "@type": "Organization", name: "VietDoc", url: SITE_URL },
  inLanguage: "vi-VN",
}

export default function BangSoSanhPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <nav className="text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            Trang chủ
          </Link>
          <span className="mx-1">/</span>
          <span className="text-ink2">So sánh</span>
        </nav>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          So Sánh Phần Mềm Văn Phòng 2025: VietDoc, Microsoft Office, Google Docs, và WPS
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          Khi cơ quan nhà nước tăng cường kiểm tra bản quyền phần mềm và doanh nghiệp chuẩn hoá hồ sơ pháp lý, việc chọn bộ công cụ văn phòng không chỉ là chuyện giao diện quen tay. Bài viết này so sánh bốn lựa chọn phổ biến nhất theo các tiêu chí thực tế với SME Việt Nam: chi phí định kỳ, rủi ro pháp lý khi dùng bản crack, mức độ sẵn có của biểu mẫu tiếng Việt đúng thông tư, và khả năng làm việc khi mạng không ổn định. Mục tiêu là giúp bạn ra quyết định dựa trên nhu cầu cụ thể — soạn văn bản thông thường, cộng tác online, hay lập hợp đồng và tờ khai thuế đúng khung pháp luật hiện hành.
        </p>

        <div className="mt-8 overflow-x-auto rounded-lg border border-black/10 bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-paper2">
                <th className="p-3 font-semibold text-ink">Tiêu chí</th>
                <th className="p-3 font-semibold text-red">VietDoc</th>
                <th className="p-3 font-semibold text-ink">Microsoft Office</th>
                <th className="p-3 font-semibold text-ink">Google Docs</th>
                <th className="p-3 font-semibold text-ink">WPS Office</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr className="border-b border-black/10">
                <td className="p-3 font-medium text-ink">Chi phí hàng tháng</td>
                <td className="p-3">99.000đ</td>
                <td className="p-3">~500.000đ</td>
                <td className="p-3">Miễn phí–300.000đ</td>
                <td className="p-3">Miễn phí</td>
              </tr>
              <tr className="border-b border-black/10">
                <td className="p-3 font-medium text-ink">Tính pháp lý tại VN</td>
                <td className="p-3">Hợp lệ 100%</td>
                <td className="p-3">Cần bản quyền</td>
                <td className="p-3">Hợp lệ 100%</td>
                <td className="p-3">Hợp lệ</td>
              </tr>
              <tr className="border-b border-black/10">
                <td className="p-3 font-medium text-ink">Biểu mẫu VN chuẩn</td>
                <td className="p-3">47+ luôn cập nhật</td>
                <td className="p-3">Tự tạo</td>
                <td className="p-3">Tự tạo</td>
                <td className="p-3">Không có</td>
              </tr>
              <tr className="border-b border-black/10">
                <td className="p-3 font-medium text-ink">Cập nhật theo thông tư</td>
                <td className="p-3">Tự động</td>
                <td className="p-3">Không</td>
                <td className="p-3">Không</td>
                <td className="p-3">Không</td>
              </tr>
              <tr className="border-b border-black/10">
                <td className="p-3 font-medium text-ink">Hoạt động offline</td>
                <td className="p-3">Có</td>
                <td className="p-3">Có</td>
                <td className="p-3">Hạn chế</td>
                <td className="p-3">Có</td>
              </tr>
              <tr className="border-b border-black/10">
                <td className="p-3 font-medium text-ink">Xuất .docx</td>
                <td className="p-3">Có</td>
                <td className="p-3">Có</td>
                <td className="p-3">Có</td>
                <td className="p-3">Có</td>
              </tr>
              <tr className="border-b border-black/10">
                <td className="p-3 font-medium text-ink">Giao diện tiếng Việt</td>
                <td className="p-3">Hoàn toàn</td>
                <td className="p-3">Có</td>
                <td className="p-3">Có</td>
                <td className="p-3">Có</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-ink">Phù hợp SME VN</td>
                <td className="p-3">★★★★★</td>
                <td className="p-3">★★★</td>
                <td className="p-3">★★★★</td>
                <td className="p-3">★★★★</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 font-display text-xl font-semibold text-ink">
          Khi nào nên dùng Microsoft Office?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Microsoft Office vẫn là chuẩn de facto khi đối tác yêu cầu file .docx/.xlsx nặng macro, pivot phức tạp, hoặc khi tổ chức đã đầu tư hạ tầng SharePoint và cần đồng bộ chính sách CNTT nội bộ. Nếu doanh nghiệp đã mua bản quyền hợp lệ và chủ yếu soạn tài liệu nội bộ không bám sát biểu mẫu Bộ/Ngành, chi phí license có thể được phân bổ hợp lý trên số đầu người dùng. Điểm cần cân nhắc là biểu mẫu pháp lý Việt Nam không đi kèm sẵn: kế toán và nhân sự thường phải tự cập nhật khi thông tư đổi, dễ lệ thuộc vào file mẫu cũ truyền tay trong công ty.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-ink">
          Khi nào nên dùng Google Docs?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Google Docs phù hợp nhóm cần cộng tác real-time, phê duyệt nhanh và chi phí ban đầu thấp. Với đội remote hoặc agency nhiều stakeholder bên ngoài, liên kết chia sẻ và lịch sử phiên bản giúp giảm email đính kèm. Hạn chế là phụ thuộc đường truyền, và các biểu mẫu pháp lý Việt Nam vẫn phải tự xây — rủi ro sai chỉ tiêu trên tờ khai thuế hay thiếu điều khoản bắt buộc trên hợp đồng lao động vẫn nằm ở quy trình nội bộ. Nếu nhu cầu của bạn là “văn phòng chung” chứ không phải “đúng mẫu theo TT/Bộ”, Google Docs là lựa chọn hợp lý.
        </p>

        <h2 className="mt-8 font-display text-xl font-semibold text-ink">Khi nào nên dùng VietDoc?</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          VietDoc tập trung vào biểu mẫu pháp lý và hành chính doanh nghiệp Việt Nam: hợp đồng lao động, tờ khai TNCN, hợp đồng kinh tế, biên bản họp HĐQT, v.v. Bạn mở trình duyệt, điền trực tiếp trên khung đã căn chỉnh theo thông lệ (font, lề theo Thông tư 01/2011/TT-BNV), rồi xuất .docx để lưu hồ sơ hoặc gửi đối tác. Đây không phải bản thay thế Excel hay pivot nâng cao, mà là lớp chuyên biệt giúp SME giảm rủi ro “dùng mẫu cũ” và giảm nhu cầu cài đặt Office crack cho các tác vụ văn bản pháp lý tiêu chuẩn.
        </p>

        <p className="mt-10 text-sm">
          <Link href="/" className="font-semibold text-red hover:underline">
            ← Về trang chủ VietDoc
          </Link>
        </p>
      </article>
    </>
  )
}
