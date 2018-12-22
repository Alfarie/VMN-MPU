import os from 'os'
import fs from 'fs'
export default class DeviceIO {
    lcd: any;
    hostapd_file: string = '/etc/hostapd/hostapd.conf'
    constructor() {
        if (os.arch() == 'arm') {
            this.initLcd();
        }
        else {
            console.log('[Error] LCD is not support for ' + os.arch())
            this.lcd = null;
        }
    }

    private async initLcd() {
        const LCD = require('lcdi2c');
        this.lcd = new LCD(1, 0x27, 20, 4);
        this.lcd.clear();
        this.lcd.on();
        this.lcd.println("VMN Network", 1);
        this.lcd.println("Initializing..", 2);

        process.on('exit', function() {  
            this.lcd.clear();
            this.lcd.off();
        });
        setTimeout(() => {
            this.lcd.clear();
            this.lcd.println("Initialized!", 2);
            this.updateLcd();
        }, 3000);
    }

    private checkWifi():String{
        const lastOctave = parseInt(os.networkInterfaces()['wlan0'][0]['address'].split('.')[3])
        if( lastOctave > 1){ return 'STA:' + os.networkInterfaces()['wlan0'][0]['address'] }
        const apName = fs.readFileSync(this.hostapd_file).toString().split('\n')[2].replace('ssid=','')
        return 'AP:' + apName
    }
    private updateLcd() {
        setInterval(() => {
            // update redux
            // WiFi: AP 
            this.lcd.println(this.checkWifi(), 1);
            this.lcd.println(". . . . . . . .", 2);
        }, 1000);
    }
}
