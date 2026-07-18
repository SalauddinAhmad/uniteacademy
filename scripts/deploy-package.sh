#!/usr/bin/env bash
# Package the app for cPanel deploy.
# Produces two zips under dist-deploy/:
#   - uniteacademy-frontend.zip  -> unzip into public_html/
#   - uniteacademy-api.zip       -> unzip into ~/apps/uniteacademy-api/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/dist-deploy"
rm -rf "$OUT" && mkdir -p "$OUT"

echo "==> Building frontend"
cd "$ROOT"
npm run build

echo "==> Zipping frontend"
cp public/.htaccess dist/.htaccess 2>/dev/null || true
( cd "$ROOT/dist" && zip -qr "$OUT/uniteacademy-frontend.zip" . )

echo "==> Building API"
cd "$ROOT/apps/api"
npm install --omit=dev=false
npm run prisma:generate
npm run build

echo "==> Zipping API"
STAGE="$OUT/_api-stage"
rm -rf "$STAGE" && mkdir -p "$STAGE"
cp -r dist prisma package.json package-lock.json 2>/dev/null passenger.js ecosystem.config.cjs .env.example "$STAGE/" || true
cp -r prisma "$STAGE/" 2>/dev/null || true
( cd "$STAGE" && zip -qr "$OUT/uniteacademy-api.zip" . )
rm -rf "$STAGE"

echo ""
echo "✅ Done. Artifacts in $OUT"
ls -lh "$OUT"
