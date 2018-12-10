import {AccessPoint, Station} from './ap-station'
import Configuration from '../configuration';
import iwlist from 'wireless-tools/iwlist'

// WIFI handler
class WIFI {
    private accessPoint: AccessPoint;
    private station: Station;
    private static instance: WIFI;
    public static getInstance() {
        if (this.instance == undefined) {
            this.instance = new WIFI()
        }
        return this.instance
    }
    private constructor() {
        this.accessPoint = new AccessPoint()
        this.station = new Station()
    }

    public scanWifi() {
       
        return new Promise((resolve, reject) => {
            iwlist.scan(Configuration.getConfig().interface,  (err, networks) => {
                console.log(err,networks);
                if (err) {
                    reject(err);
                    return;
                }
                resolve(networks);
            });
    
        });
    }

    public startAp(ssid:string, pass:string){
        this.accessPoint.startAP(ssid, pass)
    }
    public startStation(ssid:string, pass:string){
        this.station.startWifi(ssid,pass)
    }
}

export default WIFI.getInstance();