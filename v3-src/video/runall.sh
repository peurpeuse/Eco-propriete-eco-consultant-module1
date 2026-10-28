#!/bin/bash
cd /home/claude/eco-propriete-eco-consultant-module1/v3-src/video
A=$(awk 'NR%2==1' ids.txt | tr '\n' ' '); B=$(awk 'NR%2==0' ids.txt | tr '\n' ' ')
node render.js /mnt/user-data/outputs/videos_v4 $A > /tmp/claude-0/-home-claude/f70bc3dd-9d17-56d9-b65f-f080ba0643f6/scratchpad/renderA.log 2>&1 &
node render.js /mnt/user-data/outputs/videos_v4 $B > /tmp/claude-0/-home-claude/f70bc3dd-9d17-56d9-b65f-f080ba0643f6/scratchpad/renderB.log 2>&1 &
wait
echo done
