import { NextResponse } from "next/server"
import { getWorkflowFeed } from "@/lib/workflow/feed"

export async function GET() {
  const feed = await getWorkflowFeed()
  return NextResponse.json(feed)
}
