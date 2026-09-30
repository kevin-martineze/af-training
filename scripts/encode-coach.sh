#!/usr/bin/env bash
# Encodes the coach band from the camera master in media-source/.
#
# Unlike the hero, this is a finished edit the client supplied, not raw footage:
# one 23s take with its own opening title card and burned-in kinetic captions.
# So there is no trim, no grade and no loop cut here — the piece is encoded as
# delivered, audio included, because the whole point of the band is that the
# coach can be heard. Everything else (the veil, the grain, when it plays) lives
# in CoachFilm.astro.
#
# Runs against the ffmpeg-static binary, which pnpm does not install by default:
#   node node_modules/ffmpeg-static/install.js
#
# Usage: bash scripts/encode-coach.sh
set -euo pipefail

cd "$(dirname "$0")/.."
FF=./node_modules/ffmpeg-static/ffmpeg.exe
[ -x "$FF" ] || FF=./node_modules/ffmpeg-static/ffmpeg
SRC=media-source/coach-talking-4k.MP4
OUT=public/videos/coach-detalles.mp4

if [ ! -x "$FF" ]; then
  echo "ffmpeg binary missing. Fetch it with:" >&2
  echo "  node node_modules/ffmpeg-static/install.js" >&2
  exit 1
fi

if [ ! -f "$SRC" ]; then
  echo "missing $SRC — the camera master is gitignored, ask for it before re-encoding" >&2
  exit 1
fi

mkdir -p public/videos public/posters

# Down to 1080p from the 3840x2160 source. CRF 25 holds up on a locked-off shot
# with little motion; the audio is the coach's voice and is the only reason
# anyone presses the sound button, so it stays.
#
# No crop. Shaving the bottom band would take the captions out of the frame, but
# it would also take the ball and both his hands with them — those captions are
# meant to be seen.
echo "--- coach-detalles.mp4"
"$FF" -hide_banner -loglevel error -y -i "$SRC" \
  -vf "scale=1920:1080:flags=lanczos,format=yuv420p" \
  -c:v libx264 -profile:v high -crf 25 -preset slow \
  -c:a aac -b:a 128k -ac 2 \
  -movflags +faststart "$OUT"

# The poster is the clip's own first frame — the title card. Playback starts
# there, so nothing jumps, and the section has something to show before the
# video itself is fetched (preload="none" until the band is on screen).
echo "--- posters"
"$FF" -hide_banner -loglevel error -y -i "$OUT" \
  -frames:v 1 -q:v 4 public/posters/coach-detalles.jpg

echo "--- result"
ls -lh "$OUT" public/posters/coach-detalles.jpg
