KILL="sudo pkill -9 node"
$KILL
CMD="sudo node /home/pi/SG-MPU/build/main/index.js -sp=/dev/serial0 -lg=60000 -wifi -iface=wlan0 &"
$CMD