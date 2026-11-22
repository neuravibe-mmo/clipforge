#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Ensure local cache directory and symlink exist
mkdir -p /tmp/clipforge-next
if [ ! -L ".next_dev" ]; then
  ln -s /tmp/clipforge-next .next_dev 2>/dev/null || true
fi
if [ ! -L "/tmp/node_modules" ]; then
  ln -sf "$(pwd)/node_modules" /tmp/node_modules 2>/dev/null || true
fi

echo "🚀 Khởi chạy ClipForge tại http://localhost:3000 ..."
NEXT_DIST_DIR=.next_dev npx next dev --webpack -p 3000
