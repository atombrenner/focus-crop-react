#!/usr/bin/env bash
set -euo pipefail

TARGET="s3://www.atombrenner.de/focus-crop-react"

export AWS_PROFILE="atombrenner"
aws s3 cp build/static "${TARGET}/static" --recursive --cache-control "public,max-age=31536000" --no-progress
aws s3 cp build s3://www.atombrenner.de/focus-crop-react --exclude "static/*" --recursive --cache-control "public,max-age=7200" --no-progress

echo "<head><meta http-equiv=\"refresh\" content=\"0;URL='${TARGET/s3/https}'\"/></head>" >/tmp/redirect
aws s3 cp /tmp/redirect "${TARGET}" --cache-control "public,max-age=31536000" --no-progress