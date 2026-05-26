import type { Metadata } from "next"
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google"
import { Providers } from "@/app/providers"
import { buildRootJsonLd } from "@/lib/rootJsonLd"
import { SITE_URL } from "@/lib/siteUrl"
import "./globals.css"

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700"],
})

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VietDoc — Microsoft Word phiên bản Việt Nam | Thay thế Word hợp pháp",
    template: "%s | VietDoc",
  },
  description:
    "Không cần Word crack. VietDoc cung cấp biểu mẫu pháp lý Việt Nam luôn cập nhật, soạn online và xuất .docx tương thích Microsoft Word, Google Docs, WPS.",
  keywords: [
    "microsoft word vietnam",
    "microsoft word việt nam",
    "microsoft word cho việt nam",
    "thay thế microsoft word",
    "thay thế word",
    "word phiên bản việt nam",
    "phần mềm soạn thảo văn bản việt nam",
    "thay thế microsoft office",
    "phần mềm văn phòng việt nam",
    "microsoft office crack thay thế",
    "microsoft word crack thay thế",
    "không cần word crack",
    "biểu mẫu pháp lý việt nam",
    "hợp đồng lao động mẫu 2025",
    "tờ khai thuế tncn 2025",
    "phần mềm văn phòng miễn phí",
    "soạn thảo văn bản pháp lý online",
    "biểu mẫu doanh nghiệp việt nam",
    "office suite việt nam",
    "phần mềm không bản quyền thay thế",
    "google docs alternative tiếng việt",
    "wps office alternative",
    "vietdoc",
    "biểu mẫu hợp đồng kinh tế",
    "mẫu biên bản họp hđqt",
    "phần mềm kế toán văn phòng",
  ],
  authors: [{ name: "VietDoc", url: SITE_URL }],
  creator: "VietDoc",
  publisher: "VietDoc",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "vi-VN": SITE_URL,
      "en-US": `${SITE_URL}/en`,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: "VietDoc",
    title: "VietDoc — Microsoft Word phiên bản Việt Nam | Thay thế Word hợp pháp",
    description:
      "Không cần Word crack. Soạn biểu mẫu pháp lý Việt Nam online, xuất .docx tương thích Microsoft Word, Google Docs và WPS.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VietDoc — Thay thế Microsoft Word hợp pháp tại Việt Nam",
    description:
      "Biểu mẫu pháp lý Việt Nam luôn cập nhật, soạn online và xuất .docx. Không cần Word crack.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
  category: "productivity",
  classification: "Business Software",
  manifest: "/site.webmanifest",
}

const jsonLd = buildRootJsonLd()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${playfair.variable}`}>
      <head>
        <link rel="alternate" hrefLang="vi" href={SITE_URL} />
        <link rel="alternate" hrefLang="en" href={`${SITE_URL}/en`} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.26.0/dist/tabler-icons.min.css"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${beVietnam.className} min-h-screen bg-paper text-ink`}>
        <Providers defaultLang="vi">{children}</Providers>
      </body>
    </html>
  )
}
