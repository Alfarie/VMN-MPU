import fs from 'fs'

class ConfigModel {
    // public portName:String = "/dev/cu.usbmodem143301";
    public portName:String = "/dev/cu.usbserial-DN02S59Z";
    public loggerTime:number = 60000;
    public interface:String = "en0";
    public wifi:Boolean = false;
}

class ArgumentManager {
    constructor(){
        process.argv.forEach( (val, {}, {}) => {
            // console.log(index + ': ' + val);
            this.extractArgv(val);
        });
    }
    private extractArgv(data:String):void {
        if(data.startsWith('-sp') || data.startsWith('--serialport')) {
           
            const portName = data.split('=')[1]
            Configuration.getInstance().getConfig().portName = portName
            console.log('[Info] Port name:', portName)
        }
        else if( data.startsWith('--loggertime') || data.startsWith('-lg') ){
            const loggerTime: number = parseInt(data.split('=')[1])
            Configuration.getInstance().getConfig().loggerTime = loggerTime
            console.log('[Info] Logger time:', loggerTime)
            
        }
        else if (data.startsWith('--interface') || data.startsWith('-iface')){
            const iface:String = data.split('=')[1]
            Configuration.getInstance().getConfig().interface = iface
            console.log('[Info] Network interface:', iface)
        }
        else if(data.startsWith('--wifi') || data.startsWith('-wifi')){
            Configuration.getInstance().getConfig().wifi = true
            console.log('[Info] Wifi Permission : True')
        }
    }
}

class Configuration {
    public static configuration:Configuration
    private configModel:ConfigModel;
    private filePath:string = __dirname + "/config.txt"

    public static getInstance(){
        if(!this.configuration){
            this.configuration = new Configuration()
            return this.configuration
        }
        else {
            return this.configuration
        }
    }
    constructor(){
        this.configModel = new ConfigModel()
        if(!this.readConfigFile()){
            this.writeConfigFile()
        }
    }

    private readConfigFile():Boolean {
        if( !fs.existsSync(this.filePath)){
            console.log('[Error] Config file not found.')
            return false
        }
        var data:any = JSON.parse(fs.readFileSync(this.filePath).toString())
        this.configModel.portName = data.portName;
        this.configModel.loggerTime = data.loggerTime;
        this.configModel.interface = data.interface;
        this.configModel.wifi = data.wifi;
        return true
    }

    private writeConfigFile(){
        var configJSON = {
            portName: this.configModel.portName,
            loggerTime: this.configModel.loggerTime,
            interface: this.configModel.interface,
            wifi: this.configModel.wifi
        }
        fs.writeFileSync(this.filePath, JSON.stringify(configJSON))
    }

    public getConfig(): ConfigModel {
        return this.configModel
    }

    public initArgv():void {
        new ArgumentManager()
    }
}
Configuration.getInstance().initArgv()


export default Configuration.getInstance()