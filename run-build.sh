#!/bin/bash
echo "Script executed from: ${PWD}"
BASEDIR=$(dirname $0)
PASS="raspberry"
echo "Script location: ${BASEDIR}"

MOVE_BUILD="sshpass -p $PASS scp -r build pi@smartgrobot.local:/home/pi/SG-MPU/"
$MOVE_BUILD