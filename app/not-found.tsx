import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center text-ink">
      <p className="font-display text-4xl font-semibold text-red">404</p>
      <p className="max-w-md text-sm text-muted">
        Không tìm thấy trang này. Mở đúng URL gốc (ví dụ{" "}
        <code className="rounded bg-paper2 px-1 text-ink2">http://localhost:3010/</code>
        ) — không thêm <code className="rounded bg-paper2 px-1 text-ink2">/viet-doc</code> sau
        cổng. / Page not found. Use the server root URL (no{" "}
        <code className="rounded bg-paper2 px-1 text-ink2">/viet-doc</code> path).
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
