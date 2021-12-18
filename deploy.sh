#!/usr/bin/env bash
set -euo pipefail


TARGET="s3://www.atombrenner.de/focus-crop-react"

export AWS_PROFILE="atombrenner"
aws s3 cp build/static "${TARGET}/static" --recursive --cache-control "public,max-age=31536000" --no-progress
aws s3 cp build s3://www.atombrenner.de/focus-crop-react --exclude "static/*" --recursive --cache-control "public,max-age=7200" --no-progress