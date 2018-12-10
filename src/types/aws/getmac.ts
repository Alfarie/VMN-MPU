import getmac from 'getmac'

class GetMac{
    static getMac: GetMac;
    public static getInstance(){
        if(this.getMac == undefined) {
            this.getMac = new GetMac()
        }
        return this.getMac
    }
    mac: string;
    constructor(){
        
    }
    public getMac(iface: String):any{
        return new Promise((resolve, reject) => {
            getmac.getMac({ iface: iface },  (err, macAddress) => {
                if (err) reject(err)
                this.mac = macAddress.split(":").join('')
                resolve(macAddress.split(":").join(''));
            });
        })
    }
}
export default GetMac.getInstance()
