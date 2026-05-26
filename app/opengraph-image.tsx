import { ImageResponse } from "next/og"

export const alt = "VietDoc — Microsoft Word phiên bản Việt Nam"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#C8102E",
          padding: 48,
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            color: "white",
          }}
        >
          <div style={{ fontSize: 56, fontStyle: "italic", fontWeight: 700 }}>
            VietDoc
          </div>
          <div style={{ fontSize: 38, fontWeight: 600, maxWidth: 900 }}>
            Microsoft Word phiên bản Việt Nam
          </div>
          <div style={{ fontSize: 22, opacity: 0.9, maxWidth: 900 }}>
            Thay thế Word hợp pháp · Xuất .docx · Không cần crack
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            color: "#F5A623",
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          4.9/5
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#F5A623",
          }}
        />
      </div>
    ),
    { ...size }
  )
}
