import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

/** Folder name ≠ URL. Send mistaken `/viet-doc` hits to `/` before they become a 404. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === "/viet-doc" || pathname.startsWith("/viet-doc/")) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.search = ""
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/viet-doc", "/viet-doc/:path*"],
}
