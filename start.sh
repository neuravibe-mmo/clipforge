#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Clean up any cross-volume symlink which breaks Turbopack and causes infinite HMR watch loops in Webpack
if [ -L ".next_dev" ]; then
  rm -f .next_dev
fi
mkdir -p .next_dev

echo "🚀 Khởi chạy ClipForge tại http://localhost:3003 ..."
NEXT_DIST_DIR=.next_dev npx next dev --webpack -p 3003
