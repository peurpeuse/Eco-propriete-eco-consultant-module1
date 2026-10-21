#!/bin/sh
# Assemblage final : vidéo motion design + voix de Seb (HeyGen/ElevenLabs) décalée de l'intro, normalisée -16 LUFS
set -e
R=/home/claude/eco_v3/video11/render
SRC=/home/claude/eco_v3/video11/src_media/seb_heygen.mp4
INTRO_MS=$(python3 -c "import json;print(int(json.load(open('/home/claude/eco_v3/video11/mg/src/timing.json'))['intro']*1000))")
printf "file '%s'\nfile '%s'\n" $R/part1.mp4 $R/part2.mp4 > $R/list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i $R/list.txt -c copy $R/video_only.mp4
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $R/video_only.mp4)
ffmpeg -y -loglevel error -i $R/video_only.mp4 -i $SRC -map 0:v -map 1:a \
  -af "adelay=${INTRO_MS}|${INTRO_MS},loudnorm=I=-16:TP=-1.5:LRA=11,apad" -t $DUR \
  -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart $R/Capsule_1-1_Seb_motion-design.mp4
ls -la $R/Capsule_1-1_Seb_motion-design.mp4
