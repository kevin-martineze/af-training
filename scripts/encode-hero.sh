#!/usr/bin/env bash
# Cuts the hero loop from the camera master in media-source/.
#
# The source is a 1080x1920 phone edit made of fast cuts, so the loop is a
# curated montage of its strongest beats rather than one continuous take.
# Hard cuts throughout (matching the source's own grammar) mean the loop seam
# is just another cut — no crossfade needed, nothing to line up.
#
# Needs the ffmpeg-static binary, which pnpm does not install by default:
#   node node_modules/ffmpeg-static/install.js
#
# Usage: bash scripts/encode-hero.sh
set -euo pipefail

cd "$(dirname "$0")/.."
FF=./node_modules/ffmpeg-static/ffmpeg.exe
[ -x "$FF" ] || FF=./node_modules/ffmpeg-static/ffmpeg
SRC=media-source/hero-source.MOV

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

# start:end in source seconds, ordered for rhythm:
# open wide -> brand detail -> two wide action beats -> stride -> dive -> resolve
BEATS=(
  "2.00:2.95"    # wide group on the pitch, city lights bokeh behind
  "3.20:3.65"    # crest close-up: ELITE FOOTBALL CLUB
  "4.30:5.25"    # wide, players running toward goal
  "5.28:6.10"    # wide, ball in play
  "16.00:16.80"  # stride and strike, turf lines
  "14.20:15.20"  # keeper dive
  "20.80:21.90"  # keeper set in goal — calm close, loops back into the open
)

build_graph() {
  # $1 = trailing filters applied after the concat
  local tail="$1" graph="" labels="" i=0
  for b in "${BEATS[@]}"; do
    graph+="[0:v]trim=start=${b%%:*}:end=${b##*:},setpts=PTS-STARTPTS[v$i];"
    labels+="[v$i]"
    i=$((i + 1))
  done
  graph+="${labels}concat=n=${#BEATS[@]}:v=1:a=0[cat];[cat]${tail}[out]"
  printf '%s' "$graph"
}

# Mild grade only. The mood (veil, vignette, grain) lives in CSS so it stays
# tunable without a re-encode. setpts slows it ~10% — the source cuts are quick
# and a touch of drag reads more cinematic under a headline.
GRADE="eq=contrast=1.06:saturation=0.93:brightness=-0.015,setpts=1.10*PTS,fps=30,format=yuv420p"

# 16:9 window out of the vertical frame. 1080 wide is the source ceiling.
WIDE_GRAPH=$(build_graph "crop=1080:608:0:656,${GRADE}")
# Portrait keeps the native framing for phones, just downscaled.
PORT_GRAPH=$(build_graph "scale=720:1280,${GRADE}")

echo "--- hero-wide.mp4"
"$FF" -hide_banner -loglevel error -y -i "$SRC" \
  -filter_complex "$WIDE_GRAPH" -map "[out]" -an \
  -c:v libx264 -profile:v high -crf 23 -preset slow -pix_fmt yuv420p \
  -movflags +faststart public/videos/hero-wide.mp4

echo "--- hero-wide.webm"
"$FF" -hide_banner -loglevel error -y -i "$SRC" \
  -filter_complex "$WIDE_GRAPH" -map "[out]" -an \
  -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -pix_fmt yuv420p \
  public/videos/hero-wide.webm

echo "--- hero-portrait.mp4"
"$FF" -hide_banner -loglevel error -y -i "$SRC" \
  -filter_complex "$PORT_GRAPH" -map "[out]" -an \
  -c:v libx264 -profile:v high -crf 24 -preset slow -pix_fmt yuv420p \
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
