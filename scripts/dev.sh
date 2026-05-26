#!/usr/bin/env bash
# Best-effort raise soft FD limit before Next.js dev (reduces Watchpack EMFILE on macOS / Cursor).
# On Darwin, default to Watchpack polling unless VIET_DOC_NATIVE_WATCH=1 (avoids one FD per path).
set -eu
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
for n in 65536 32768 16384 12288 10240 8192 4096; do
  ulimit -n "$n" 2>/dev/null && break
done
if [ "$(uname -s)" = "Darwin" ] && [ "${VIET_DOC_NATIVE_WATCH:-}" != "1" ]; then
  : "${WATCHPACK_POLLING:=true}"
  : "${WATCHPACK_POLLING_INTERVAL:=1000}"
  export WATCHPACK_POLLING WATCHPACK_POLLING_INTERVAL
fi
exec next dev "$@"
