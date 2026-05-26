import Link from "next/link"
import { headers } from "next/headers"
import { NotFoundMistakenPathRedirect } from "@/components/NotFoundMistakenPathRedirect"

export const dynamic = "force-dynamic"

export default function NotFound() {
  const host = headers().get("host") ?? "localhost:3000"
  const forwardedProto = headers().get("x-forwarded-proto")
  const proto = forwardedProto === "https" || forwardedProto === "http" ? forwardedProto : "http"
  const rootUrl = `${proto}://${host}/`

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center text-ink">
      <NotFoundMistakenPathRedirect />
      <p className="font-display text-4xl font-semibold text-red">404</p>
      <p className="max-w-md text-sm text-muted">
        Không tìm thấy trang này. Trang VietDoc nằm ở gốc máy chủ — ví dụ{" "}
        <code className="rounded bg-paper2 px-1 text-ink2">{rootUrl}</code>
        . / Page not found. Open the app at the host root, e.g.{" "}
        <code className="rounded bg-paper2 px-1 text-ink2">{rootUrl}</code>
      </p>
      <p className="max-w-md text-xs text-muted">
        Không dùng <code className="text-ink2">/viet-doc</code> sau cổng — đó là tên thư mục, không phải đường dẫn web. / Do not add{" "}
        <code className="text-ink2">/viet-doc</code> after the port (that is the folder name, not the site path).
      </p>
      <p className="max-w-xs text-[11px] text-hint">
        Nếu bạn vừa cập nhật code: dừng dev, chạy <code className="text-ink2">rm -rf .next</code>, rồi{" "}
        <code className="text-ink2">npm run dev</code> và tải lại trang (Cmd+Shift+R). / If you pulled new code: stop
        dev, run <code className="text-ink2">rm -rf .next</code>, then <code className="text-ink2">npm run dev</code>{" "}
        and hard-refresh (Cmd+Shift+R).
      </p>
      <Link
        href="/"
        className="rounded border border-black/10 bg-gold px-4 py-2 text-sm font-semibold text-ink hover:opacity-95"
      >
        Về trang chủ / Home
      </Link>
    </div>
  )
}
