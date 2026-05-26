import { ImageResponse } from "next/og"
import { TEMPLATE_META } from "@/lib/templateMeta"

export const alt = "VietDoc biểu mẫu"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

type Props = { params: { slug: string } }

export default function Image({ params }: Props) {
  const meta = TEMPLATE_META[params.slug]
  const title = meta?.h1 ?? "VietDoc"
  const line = meta?.legalBasis ?? ""

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
          background: "#C8102E",
          padding: 56,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div style={{ color: "white", fontSize: 52, fontWeight: 700, lineHeight: 1.15 }}>
          {title}
        </div>
        <div
          style={{
            height: 4,
            width: 120,
            background: "#F5A623",
          }}
        />
        <div style={{ color: "#F5A623", fontSize: 22, maxWidth: 1000, lineHeight: 1.4 }}>
          {line}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 48,
            color: "white",
            fontSize: 26,
            fontStyle: "italic",
            opacity: 0.95,
          }}
        >
          VietDoc
        </div>
      </div>
    ),
    { ...size }
  )
}
