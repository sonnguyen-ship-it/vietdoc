export type TemplateFaqItem = { q: string; a: string }

export type TemplateMeta = {
  slug: string
  templateId: string
  title: string
  description: string
  h1: string
  intro: string
  legalBasis: string
  lastUpdated: string
  keywords: string[]
  faq: TemplateFaqItem[]
}

export const TEMPLATE_META: Record<string, TemplateMeta> = {
  "hop-dong-lao-dong": {
    slug: "hop-dong-lao-dong",
    templateId: "hdld",
    title: "Mẫu Hợp Đồng Lao Động Chuẩn 2025 | Miễn Phí | VietDoc",
    description:
      "Tải về mẫu hợp đồng lao động xác định thời hạn chuẩn theo Bộ luật Lao động 2019 và Nghị định 145/2020/NĐ-CP. Điền thông tin online, xuất file .docx miễn phí.",
    h1: "Mẫu Hợp Đồng Lao Động Chuẩn 2025",
    intro:
      "Biểu mẫu hợp đồng lao động xác định thời hạn theo Bộ luật Lao động số 45/2019/QH14 và Nghị định 145/2020/NĐ-CP. Điền thông tin trực tiếp trên trình duyệt, tải về file .docx hoặc in ngay.",
    legalBasis: "Bộ luật Lao động 2019 (Luật số 45/2019/QH14) · Nghị định 145/2020/NĐ-CP",
    lastUpdated: "2025-01-01",
    keywords: [
      "hợp đồng lao động mẫu",
      "hợp đồng lao động 2025",
      "mẫu hdlđ chuẩn",
      "tải hợp đồng lao động miễn phí",
    ],
    faq: [
      {
        q: "Hợp đồng lao động mới nhất 2025 theo quy định nào?",
        a: "Hợp đồng lao động hiện hành phải tuân thủ Bộ luật Lao động 2019 (Luật số 45/2019/QH14) và Nghị định 145/2020/NĐ-CP. Mẫu trên VietDoc đã được cập nhật đầy đủ các điều khoản bắt buộc theo quy định này.",
      },
      {
        q: "Hợp đồng lao động có cần công chứng không?",
        a: "Theo Bộ luật Lao động 2019, hợp đồng lao động không bắt buộc phải công chứng. Chỉ cần có chữ ký của cả hai bên là có giá trị pháp lý.",
      },
    ],
  },
  "to-khai-thue-tncn": {
    slug: "to-khai-thue-tncn",
    templateId: "tncn",
    title: "Mẫu Tờ Khai Quyết Toán Thuế TNCN 02/QTT-TNCN 2025 | VietDoc",
    description:
      "Tờ khai quyết toán thuế thu nhập cá nhân mẫu 02/QTT-TNCN theo Thông tư 80/2021/TT-BTC, cập nhật từ 01/07/2025. Điền online, xuất PDF hoặc .docx miễn phí.",
    h1: "Tờ Khai Quyết Toán Thuế TNCN Mẫu 02/QTT-TNCN 2025",
    intro:
      "Mẫu tờ khai quyết toán thuế thu nhập cá nhân (mẫu 02/QTT-TNCN) theo Thông tư 80/2021/TT-BTC, cập nhật theo TT 94/2025/TT-BTC có hiệu lực từ 01/07/2025. Bao gồm biểu thuế lũy tiến 2024 và hướng dẫn điền từng chỉ tiêu.",
    legalBasis: "Thông tư 80/2021/TT-BTC · TT 94/2025/TT-BTC (sửa đổi)",
    lastUpdated: "2025-07-01",
    keywords: [
      "tờ khai thuế tncn 2025",
      "mẫu 02 qtt tncn",
      "quyết toán thuế thu nhập cá nhân",
      "tờ khai thuế tncn mới nhất",
    ],
    faq: [
      {
        q: "Mẫu tờ khai quyết toán thuế TNCN mới nhất là mẫu nào?",
        a: "Mẫu tờ khai quyết toán thuế TNCN hiện hành là mẫu 02/QTT-TNCN ban hành kèm theo Thông tư 80/2021/TT-BTC, được sửa đổi bổ sung bởi TT 94/2025/TT-BTC có hiệu lực từ 01/07/2025.",
      },
      {
        q: "Hạn nộp quyết toán thuế TNCN năm 2024 là ngày nào?",
        a: "Hạn nộp quyết toán thuế TNCN cho năm 2024 là ngày 31/03/2025. Trường hợp nộp chậm sẽ bị tính tiền chậm nộp theo Luật Quản lý thuế.",
      },
    ],
  },
  "hop-dong-dich-vu": {
    slug: "hop-dong-dich-vu",
    templateId: "hdkt",
    title: "Mẫu Hợp Đồng Dịch Vụ Kinh Tế Chuẩn 2025 | VietDoc",
    description:
      "Hợp đồng cung cấp dịch vụ giữa hai doanh nghiệp theo BLDS 2015 và Luật Thương mại 2005. Kèm điều khoản VAT, phạt vi phạm. Tải .docx miễn phí.",
    h1: "Mẫu Hợp Đồng Dịch Vụ Kinh Tế Chuẩn 2025",
    intro:
      "Hợp đồng cung cấp dịch vụ giữa hai tổ chức/cá nhân theo Bộ luật Dân sự 2015 và Luật Thương mại 2005. Bao gồm điều khoản về giá trị hợp đồng, VAT, thanh toán, quyền và nghĩa vụ, và phạt vi phạm.",
    legalBasis: "BLDS 2015 · Luật Thương mại 2005",
    lastUpdated: "2025-01-01",
    keywords: [
      "hợp đồng dịch vụ mẫu",
      "hợp đồng kinh tế 2025",
      "mẫu hợp đồng cung cấp dịch vụ",
      "tải hợp đồng dịch vụ miễn phí",
    ],
    faq: [
      {
        q: "Hợp đồng dịch vụ có cần đóng dấu không?",
        a: "Theo quy định hiện hành, doanh nghiệp không bắt buộc phải đóng dấu trên hợp đồng nếu điều lệ công ty không yêu cầu. Chữ ký của người đại diện pháp luật có đủ giá trị pháp lý.",
      },
    ],
  },
  "hop-dong-mua-ban": {
    slug: "hop-dong-mua-ban",
    templateId: "hdmb",
    title: "Mẫu Hợp Đồng Mua Bán Hàng Hoá Chuẩn 2025 | VietDoc",
    description:
      "Hợp đồng mua bán hàng hoá theo Luật Thương mại 2005. Kèm bảng hàng hoá, điều khoản giao hàng, bảo hành, phạt vi phạm. Tải .docx miễn phí.",
    h1: "Mẫu Hợp Đồng Mua Bán Hàng Hoá 2025",
    intro:
      "Hợp đồng mua bán hàng hoá chuẩn theo Luật Thương mại 2005 và BLDS 2015, có bảng liệt kê hàng hoá, điều khoản thanh toán, giao hàng, bảo hành và xử lý vi phạm.",
    legalBasis: "Luật Thương mại 2005 · BLDS 2015",
    lastUpdated: "2025-01-01",
    keywords: [
      "hợp đồng mua bán hàng hoá",
      "mẫu hợp đồng mua bán 2025",
      "tải hợp đồng mua bán miễn phí",
    ],
    faq: [
      {
        q: "Hợp đồng mua bán cần những điều khoản bắt buộc nào?",
        a: "Theo Luật Thương mại 2005, hợp đồng mua bán hàng hoá cần có: tên hàng, số lượng, chất lượng, giá cả, phương thức thanh toán, địa điểm và thời hạn giao hàng, và quyền/nghĩa vụ của các bên.",
      },
    ],
  },
  "bien-ban-hop-hdqt": {
    slug: "bien-ban-hop-hdqt",
    templateId: "bienban",
    title: "Mẫu Biên Bản Họp Hội Đồng Quản Trị 2025 | VietDoc",
    description:
      "Biên bản họp HĐQT/Ban Giám đốc theo Luật Doanh nghiệp 2020. Kèm bảng thành phần tham dự, nội dung biểu quyết, nghị quyết. Tải .docx miễn phí.",
    h1: "Mẫu Biên Bản Họp Hội Đồng Quản Trị 2025",
    intro:
      "Biên bản họp Hội đồng quản trị theo Luật Doanh nghiệp 2020 và Nghị định 01/2021/NĐ-CP. Có đầy đủ phần thành phần tham dự, nội dung thảo luận, kết quả biểu quyết và nghị quyết.",
    legalBasis: "Luật Doanh nghiệp 2020 · NĐ 01/2021/NĐ-CP",
    lastUpdated: "2025-01-01",
    keywords: [
      "biên bản họp hđqt",
      "mẫu biên bản họp hội đồng quản trị",
      "biên bản họp công ty 2025",
    ],
    faq: [
      {
        q: "Biên bản họp HĐQT cần bao nhiêu người ký?",
        a: "Theo Luật Doanh nghiệp 2020, biên bản họp HĐQT phải được Chủ tọa và Thư ký ký xác nhận. Các thành viên tham dự cũng nên ký để đảm bảo giá trị pháp lý.",
      },
    ],
  },
  "don-xin-nghi-viec": {
    slug: "don-xin-nghi-viec",
    templateId: "donnghi",
    title: "Mẫu Đơn Xin Nghỉ Việc Chuẩn 2025 | Đúng Luật | VietDoc",
    description:
      "Đơn xin nghỉ việc theo Điều 35 Bộ luật Lao động 2019. Thời gian báo trước đúng quy định. Tải .docx miễn phí, điền online trong 2 phút.",
    h1: "Mẫu Đơn Xin Nghỉ Việc Chuẩn 2025",
    intro:
      "Đơn xin thôi việc theo Điều 35 Bộ luật Lao động 2019: HĐLĐ không xác định thời hạn báo trước 45 ngày; HĐLĐ xác định thời hạn từ 12 tháng trở lên báo trước 30 ngày; dưới 12 tháng báo trước 03 ngày.",
    legalBasis: "Bộ luật Lao động 2019 · Điều 35",
    lastUpdated: "2025-01-01",
    keywords: [
      "đơn xin nghỉ việc mẫu",
      "đơn thôi việc 2025",
      "mẫu đơn xin nghỉ việc chuẩn",
      "thời gian báo trước nghỉ việc",
    ],
    faq: [
      {
        q: "Nghỉ việc cần báo trước bao nhiêu ngày?",
        a: "Theo Điều 35 BLLĐ 2019: HĐLĐ không xác định thời hạn phải báo trước ít nhất 45 ngày; HĐLĐ xác định thời hạn từ 12 tháng trở lên báo trước ít nhất 30 ngày; HĐLĐ dưới 12 tháng báo trước ít nhất 03 ngày làm việc.",
      },
      {
        q: "Đơn xin nghỉ việc có cần công ty ký xác nhận không?",
        a: "Pháp luật không bắt buộc công ty phải ký xác nhận vào đơn xin nghỉ việc. Tuy nhiên, bạn nên giữ bằng chứng đã nộp đơn (email xác nhận, biên nhận) để bảo vệ quyền lợi của mình.",
      },
    ],
  },
}

/** template.id → SEO slug for `/mau/[slug]`. */
export const TEMPLATE_SLUG_BY_ID: Record<string, string> = Object.fromEntries(
  Object.values(TEMPLATE_META).map((m) => [m.templateId, m.slug])
)
