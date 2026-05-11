import type { Metadata } from "next"
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google"
import { Providers } from "@/app/providers"
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

export const metadata: Metadata = {
  title: "VietDoc — Thư viện biểu mẫu pháp lý & kinh doanh",
  description:
    "Thư viện biểu mẫu văn bản pháp lý và kinh doanh Việt Nam, chỉnh sửa trực tiếp trên trình duyệt.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${playfair.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.26.0/dist/tabler-icons.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${beVietnam.className} min-h-screen bg-paper text-ink`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
