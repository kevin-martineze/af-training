#!/usr/bin/env bash
# DORMANT. The hero no longer uses a wide clip — it tiles three vertical ones,
# see data/media.ts. The client did not like the horizontal footage and is
# reshooting it; this script is kept ready for that replacement. Point SRC at
# the new master, run it, and switch Hero.astro back to a single <video>.
#
# Cuts the hero loop from the camera master in media-source/.
#
# The source is a single continuous 1920x1080 take of a pitchside briefing —
# no montage this time, so there are no beats to assemble and no seam to hide.
# It loops on a hard cut back to the start, which reads as a camera restart
# rather than a glitch because the framing barely moves.
#
# Needs the ffmpeg-static binary, which pnpm does not install by default:
#   node node_modules/ffmpeg-static/install.js
#
# Usage: bash scripts/encode-hero.sh
set -euo pipefail

cd "$(dirname "$0")/.."
FF=./node_modules/ffmpeg-static/ffmpeg.exe
[ -x "$FF" ] || FF=./node_modules/ffmpeg-static/ffmpeg
SRC=media-source/hero-source.mp4

# ffmpeg-static is set to allowBuilds:false in pnpm-workspace.yaml, so its
# binary is fetched on demand rather than on every install.
if [ ! -x "$FF" ]; then
  echo "ffmpeg binary missing. Fetch it with:" >&2
  echo "  node node_modules/ffmpeg-static/install.js" >&2
  exit 1
fi

if [ ! -f "$SRC" ]; then
  echo "missing $SRC — the camera master is gitignored, ask for it before recutting" >&2
  exit 1
fi

mkdir -p public/videos public/posters

# The master runs 27.8s and changes setup near the end; this window stays on the
# one framing. Twelve seconds is plenty of loop for a backdrop nobody watches
# through twice, and the hero video is the heaviest thing on the page — every
# second of it is bytes on first paint.
TRIM="trim=start=0.6:end=12.6,setpts=PTS-STARTPTS"

# Mild grade only. The mood (veil, vignette, grain) lives in CSS so it stays
# tunable without a re-encode. The master is 59.94fps; halving to 30 costs
# nothing on a backdrop and roughly halves the bitrate needed.
GRADE="eq=contrast=1.06:saturation=0.93:brightness=-0.015,fps=30,format=yuv420p"

# 1920x1080 is the source's native size, so the wide cut never upscales.
WIDE="${TRIM},${GRADE}"
# Phones get a 9:16 window out of the middle of the frame rather than a sliver
# of a letterboxed 16:9. 608 is all the width a 1080-tall crop allows.
PORTRAIT="${TRIM},crop=608:1080:656:0,scale=720:1280,${GRADE}"

echo "--- hero-wide.mp4"
"$FF" -hide_banner -loglevel error -y -i "$SRC" \
  -vf "$WIDE" -an \
  -c:v libx264 -profile:v high -crf 27 -preset slow -pix_fmt yuv420p \
  -movflags +faststart public/videos/hero-wide.mp4

echo "--- hero-wide.webm"
"$FF" -hide_banner -loglevel error -y -i "$SRC" \
  -vf "$WIDE" -an \
  -c:v libvpx-vp9 -crf 40 -b:v 0 -row-mt 1 -pix_fmt yuv420p \
  public/videos/hero-wide.webm

echo "--- hero-portrait.mp4"
"$FF" -hide_banner -loglevel error -y -i "$SRC" \
  -vf "$PORTRAIT" -an \
  -c:v libx264 -profile:v high -crf 28 -preset slow -pix_fmt yuv420p \
  -movflags +faststart public/videos/hero-portrait.mp4

# Posters are the loop's own first frame, so there is no jump when playback
# starts (and nothing else to look at if autoplay is blocked).
echo "--- posters"
"$FF" -hide_banner -loglevel error -y -i public/videos/hero-wide.mp4 \
  -frames:v 1 -q:v 4 public/posters/hero-wide.jpg
"$FF" -hide_banner -loglevel error -y -i public/videos/hero-portrait.mp4 \
  -frames:v 1 -q:v 4 public/posters/hero-portrait.jpg

echo "--- result"
ls -lh public/videos/hero-* public/posters/hero-*
