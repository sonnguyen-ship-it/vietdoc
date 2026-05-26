import { SITE_URL } from "@/lib/siteUrl"

/** Root @graph JSON-LD for VietDoc (layout `<head>`). */
export function buildRootJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#software`,
        name: "VietDoc",
        alternateName: [
          "VietDoc Office",
          "Microsoft Word phiên bản Việt Nam",
          "Thay thế Microsoft Word",
          "Phần mềm văn phòng VietDoc",
          "VietDoc biểu mẫu pháp lý",
        ],
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Document Editor",
        operatingSystem: "Web Browser, Windows, MacOS, iOS, Android",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "VND",
          description: "Miễn phí trong thời gian beta",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "127",
          bestRating: "5",
          worstRating: "1",
        },
        description:
          "VietDoc là phần mềm soạn thảo văn bản và biểu mẫu pháp lý dành riêng cho người dùng tại Việt Nam. Cung cấp 47+ biểu mẫu luôn cập nhật, soạn online và xuất .docx tương thích Microsoft Word, Google Docs, WPS và LibreOffice.",
        url: SITE_URL,
        screenshot: `${SITE_URL}/opengraph-image`,
        featureList: [
          "Thay thế Microsoft Word cho biểu mẫu pháp lý Việt Nam",
          "47+ biểu mẫu pháp lý chuẩn Việt Nam",
          "Hợp đồng lao động theo BLLĐ 2019",
          "Tờ khai thuế TNCN mẫu 02/QTT-TNCN",
          "Hợp đồng dịch vụ kinh tế",
          "Biên bản họp HĐQT",
          "Xuất file .docx",
          "Không cần cài đặt",
          "Cập nhật tự động khi thông tư thay đổi",
        ],
        inLanguage: "vi-VN",
        countriesSupported: "VN",
        isAccessibleForFree: true,
        softwareVersion: "1.0-beta",
        releaseNotes: `${SITE_URL}/cap-nhat-mau`,
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: "VietDoc",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/opengraph-image`,
          width: 200,
          height: 60,
        },
        description:
          "Công ty phát triển phần mềm văn phòng và biểu mẫu pháp lý cho doanh nghiệp Việt Nam.",
        foundingDate: "2025",
        areaServed: "VN",
        knowsAbout: [
          "Phần mềm văn phòng",
          "Biểu mẫu pháp lý Việt Nam",
          "Luật lao động Việt Nam",
          "Thuế thu nhập cá nhân",
          "Hợp đồng kinh tế",
        ],
        sameAs: [
          "https://www.facebook.com/vietdoc",
          "https://www.linkedin.com/company/vietdoc",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "VietDoc",
        description: "Thay thế Microsoft Word cho biểu mẫu pháp lý Việt Nam",
        inLanguage: "vi-VN",
        publisher: { "@id": `${SITE_URL}/#org` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "VietDoc có thể thay thế Microsoft Word tại Việt Nam không?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Có. VietDoc là lựa chọn thay thế Microsoft Word cho các công việc văn bản pháp lý phổ biến tại Việt Nam: hợp đồng lao động, tờ khai thuế, hợp đồng kinh tế và biên bản họp. Người dùng soạn trực tiếp trên trình duyệt và xuất file .docx tương thích với Word khi cần lưu trữ hoặc gửi đối tác.",
            },
          },
          {
            "@type": "Question",
            name: "VietDoc có phải Microsoft Word Vietnam không?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "VietDoc không phải sản phẩm của Microsoft. Đây là phần mềm soạn thảo và biểu mẫu pháp lý được xây dựng cho người dùng Việt Nam, giúp thay thế Word trong các quy trình hợp đồng, nhân sự, thuế và hành chính cần biểu mẫu chuẩn Việt Nam.",
            },
          },
          {
            "@type": "Question",
            name: "Các biểu mẫu của VietDoc có được cập nhật theo thông tư mới không?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Có. Đây là điểm khác biệt cốt lõi của VietDoc. Khi Bộ Tài chính, Bộ Lao động, hoặc Tổng cục Thuế ban hành thông tư mới hoặc cập nhật biểu mẫu, VietDoc sẽ cập nhật ngay trong hệ thống. Người dùng luôn có biểu mẫu đúng nhất mà không cần tự tìm kiếm.",
            },
          },
          {
            "@type": "Question",
            name: "VietDoc có xuất được file Word (.docx) không?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Có. Sau khi điền thông tin vào biểu mẫu, bạn có thể xuất ra file .docx tương thích với Microsoft Word, Google Docs, WPS Office và LibreOffice. File xuất ra giữ nguyên định dạng chuẩn pháp lý Việt Nam bao gồm font chữ Times New Roman, lề trang theo Thông tư 01/2011/TT-BNV.",
            },
          },
          {
            "@type": "Question",
            name: "Dùng Microsoft Word crack có rủi ro gì?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Phần mềm crack có thể tạo rủi ro bản quyền, bảo mật và vận hành cho doanh nghiệp. VietDoc là lựa chọn hợp pháp: không cần cài đặt, không cần crack, có biểu mẫu luôn cập nhật và xuất .docx tương thích Microsoft Word, Google Docs, WPS Office và LibreOffice.",
            },
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Biểu mẫu pháp lý doanh nghiệp Việt Nam",
        description: "Danh sách các biểu mẫu pháp lý chuẩn dành cho doanh nghiệp Việt Nam",
        numberOfItems: 47,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Hợp đồng lao động",
            description:
              "Mẫu hợp đồng lao động xác định thời hạn theo Bộ luật Lao động 2019 và Nghị định 145/2020/NĐ-CP",
            url: `${SITE_URL}/mau/hop-dong-lao-dong`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tờ khai quyết toán thuế TNCN",
            description:
              "Mẫu 02/QTT-TNCN theo Thông tư 80/2021/TT-BTC, cập nhật từ 01/07/2025",
            url: `${SITE_URL}/mau/to-khai-thue-tncn`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Hợp đồng dịch vụ kinh tế",
            description: "Hợp đồng cung cấp dịch vụ theo BLDS 2015 và Luật Thương mại 2005",
            url: `${SITE_URL}/mau/hop-dong-dich-vu`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Biên bản họp Hội đồng quản trị",
            description: "Biên bản họp HĐQT theo Luật Doanh nghiệp 2020",
            url: `${SITE_URL}/mau/bien-ban-hop-hdqt`,
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "Hợp đồng mua bán hàng hoá",
            description: "Hợp đồng mua bán theo Luật Thương mại 2005 và BLDS 2015",
            url: `${SITE_URL}/mau/hop-dong-mua-ban`,
          },
          {
            "@type": "ListItem",
            position: 6,
            name: "Đơn xin nghỉ việc",
            description: "Đơn thôi việc theo Điều 35 Bộ luật Lao động 2019",
            url: `${SITE_URL}/mau/don-xin-nghi-viec`,
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Trang chủ",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Biểu mẫu pháp lý",
            item: `${SITE_URL}/mau`,
          },
        ],
      },
    ],
  }
}
