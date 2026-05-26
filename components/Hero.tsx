"use client"

import { HeroCTAButtons } from "@/components/signup/SignupButtons"
import { useLang } from "@/context/LangContext"
import { useSignup } from "@/context/SignupContext"

const STATS_STATIC = [
  { k: "47+", vi: "biểu mẫu", en: "templates" },
  { k: "2025", vi: "khung pháp lý", en: "legal frame" },
  { k: "99k+", vi: "lượt soạn thảo", en: "edits tracked" },
  { k: "TT 99", vi: "tham chiếu nhanh", en: "quick refs" },
] as const

export function Hero() {
  const { lang } = useLang()
  const { wlCount } = useSignup()

  /* First tile = shared waitlist counter; keep original four marketing stats. */
  const stats = [
    {
      k: wlCount.toLocaleString(lang === "vi" ? "vi-VN" : "en-US"),
      vi: "trong danh sách chờ",
      en: "on the waitlist",
    },
    ...STATS_STATIC,
  ] as const

  return (
    <section
      id="top"
      className="border-b border-black/10 bg-red text-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/90">
          {lang === "vi"
            ? "THAY THẾ MICROSOFT WORD TẠI VIỆT NAM"
            : "SOFTWARE MADE IN VIETNAM"}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
          {lang === "vi" ? (
            <>
              VietDoc — Microsoft Word{" "}
              <em className="not-italic text-gold">phiên bản Việt Nam</em>
            </>
          ) : (
            <>
              VietDoc — Microsoft Word, the{" "}
              <em className="not-italic text-gold">Vietnamese edition</em>
            </>
          )}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
          {lang === "vi"
            ? "Một lựa chọn thay thế Microsoft Word cho người dùng ở Việt Nam: soạn hợp đồng lao động, tờ khai thuế TNCN, biên bản họp và xuất .docx ngay trên trình duyệt. Không cần Word crack."
            : "Labour contracts, VAT invoices, PIT returns, meeting minutes — all updated to the latest circulars. No Word. No cracks."}
        </p>
        <HeroCTAButtons />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.k}
              className="rounded-lg border border-white/20 bg-white/5 px-3 py-4 text-center backdrop-blur-[2px]"
            >
              <p className="font-display text-2xl font-semibold text-gold sm:text-3xl">
                {s.k}
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-white/80">
                {lang === "vi" ? s.vi : s.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
