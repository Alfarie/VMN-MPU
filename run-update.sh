# !/bin/bash

echo "Script executed from: ${PWD}"
BASEDIR=$(dirname $0)
PASS="raspberry"
echo "Script location: ${BASEDIR}"

MOVE_BUILD="sshpass -p $PASS scp -r build pi@smartgrobot.local:/home/pi/SG-MPU/"
$MOVE_BUILD

RUN_DEVICE="sshpass -p $PASS scp run-device.sh pi@smartgrobot.local:/home/pi/SG-MPU/"
$RUN_DEVICE

MOVE_CERT="sshpass -p $PASS scp -r cert pi@smartgrobot.local:/home/pi/SG-MPU/"
$MOVE_CERT

MOVE_DIST="sshpass -p $PASS scp -r dist pi@smartgrobot.local:/home/pi/SG-MPU/"
$MOVE_DIST

MOVE_PACKAGE_JSON="sshpass -p $PASS scp package.json pi@smartgrobot.local:/home/pi/SG-MPU/"
$MOVE_PACKAGE_JSON
echo "UPLOAD DONE!"