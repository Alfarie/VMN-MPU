import { SerialPortManager } from './serialport'
import * as Model from './device-model'
import moment from 'moment'
import store from '../store'
import { setNodes } from '../store/nodes'
class StringManager {
    public static replaceAll(str, search, replacement) {
        var target = str;
        return target.replace(new RegExp(search, 'g'), replacement);
    }
}

export abstract class DeviceData {
    protected status: any;
    protected control: any;
    protected setting: any
}

export class DeviceDataSG extends DeviceData {
    public status: {
        sensors: any;
        datetime: any;
        paracc: any;
        gpio: any;
    }
    public control: any;
    constructor() {
        super()
        this.status = {
            sensors: JSON.parse(JSON.stringify(Model.sensors)),
            datetime: {date: moment().format('YYYY-MM-DD'), time: moment().format('HH:mm:ss')},
            paracc: [0, 0, 0, 0],
            gpio: [0, 0, 0, 0]
        }
        this.control = [JSON.parse(JSON.stringify(Model.control)),
        JSON.parse(JSON.stringify(Model.control)),
        JSON.parse(JSON.stringify(Model.control)),
        JSON.parse(JSON.stringify(Model.control))]
    }


}

abstract class ExtractJSON {
    abstract extract(array: [string]);
}

class ExtractControl extends ExtractJSON {
    extract(array: string[]): any {
        var craftedJson: any = {}
        const header = array[0];
        const ch = parseInt(array[1])
        array.splice(0, 1);
        if (header == 'ct-chst') {
            craftedJson = { ch: 0, mode: 0, sensor: 0, status: 0 }
            Object.keys(craftedJson).forEach((key, ind) => {
                craftedJson[key] = parseInt(array[ind])
            })
            console.log('[Info] Recieved: channel-mode-sensor from channel ' + craftedJson.ch);
        }
        else if (header == 'ct-timer') {

            craftedJson = { mode: parseInt(array[1]), list: {} }
            // [[300-480]-[540-720]-[780-960]-[1020-1200]-[1260-1439]]
            var timerstr = StringManager.replaceAll(array[2], '-', ',');
            var timerlist = JSON.parse("{\"list\": " + timerstr + " }")
            craftedJson.list = timerlist.list
            console.log('[Info] Recieved: timer from channel ' + ch);
        }
        else if (header == 'ct-setpoint') {
            craftedJson = {
                working: parseFloat(array[1]),
                setpoint: parseFloat(array[2]),
                detecting: parseFloat(array[3])
            }
            console.log('[Info] Recieved: setpoint from channel ' + ch);
        }
        else if (header == 'ct-setbound') {
            craftedJson = {
                upper: parseFloat(array[1]),
                lower: parseFloat(array[2])
            }
            console.log('[Info] Recieved: setbound from channel ' + ch);
        }
        else if (header == 'ct-sbtiming') {
            craftedJson = {
                upper: parseFloat(array[1]),
                lower: parseFloat(array[2]),
                detecting: parseFloat(array[2]),
                working: parseFloat(array[2])
            }
            console.log('[Info] Recieved: sbtiming from channel ' + ch);
        }
        else if (header == 'ct-irrigation') {
            craftedJson = {
                soil_upper: parseFloat(array[1]),
                soil_lower: parseFloat(array[2]),
                soil_detecting: parseFloat(array[3]),
                soil_working: parseFloat(array[4]),
                par_soil_setpoint: parseFloat(array[5]),
                par_detecting: parseFloat(array[6]),
                par_working: parseFloat(array[7]),
                par_acc: parseFloat(array[8]),
                limit_time: parseFloat(array[9]),
                descent_rate: parseFloat(array[10]),
                mode: parseFloat(array[11])
            }

            
            console.log('[Info] Recieved: Irrigation from channel ' + ch);
        }
        else if (header == 'ct-dfirrigation') {
            craftedJson = {
                upper: parseFloat(array[1]),
                lower: parseFloat(array[2]),
                paracc: parseFloat(array[3]),
                working: parseFloat(array[4]),
                descent: parseFloat(array[5])
            }
            console.log('[Info] Recieved: DF Irrigation from channel ' + ch);
        }
        else if (header == 'ct-advcond') {
            craftedJson = {
                setpoint: parseFloat(array[1]),
                working: parseFloat(array[2]),
                detecting: parseFloat(array[3]),
                sensor: parseInt(array[4]),
                direction: parseInt(array[5]),
                sensor_condition: parseInt(array[6]),
                sensor_direction: parseInt(array[7]),
                sensor_setpoint: parseFloat(array[8]),
                sensor_flag: parseInt(array[9]) == 1 ? true : false,
                timer_flag: parseInt(array[10]) == 1 ? true : false,
                timer_list: JSON.parse(StringManager.replaceAll(array[11], '-', ','))
            }
            console.log('[Info] Recieved: Advance Setpoint Control from channel ' + ch)
        }

        else if (header == 'ct-advsb') {

            craftedJson = {
                upper: parseFloat(array[1]),
                lower: parseFloat(array[2]),
                sensor: parseInt(array[3]),
                direction: parseInt(array[4]),
                sensor_condition: parseInt(array[5]),
                sensor_direction: parseInt(array[6]),
                sensor_setpoint: parseFloat(array[7]),
                sensor_flag: parseInt(array[8]) == 1 ? true : false,
                timer_flag: parseInt(array[9]) == 1 ? true : false,
                timer_list: JSON.parse(StringManager.replaceAll(array[10], '-', ','))
            }
            console.log('[Info] Recieved: Advance Setbound from channel ' + ch);
        }

        else if (header == 'ct-advsbt') {

            craftedJson = {
                upper: parseFloat(array[1]),
                lower: parseFloat(array[2]),
                working: parseFloat(array[3]),
                detecting: parseFloat(array[4]),
                sensor: parseInt(array[5]),
                direction: parseInt(array[6]),
                sensor_condition: parseInt(array[7]),
                sensor_direction: parseInt(array[8]),
                sensor_setpoint: parseFloat(array[9]),
                sensor_flag: parseInt(array[10]) == 1 ? true : false,
                timer_flag: parseInt(array[11]) == 1 ? true : false,
                timer_list: JSON.parse(StringManager.replaceAll(array[12], '-', ','))
            }
            console.log('[Info] Recieved: Advance Timing Setbound from channel ' + ch);
        }

        return {
            header: header.replace('ct-', ''),
            ch: parseInt(array[0]),
            data: craftedJson
        }
    }
}

class ExtractStatus extends ExtractJSON {
    extract(array: [string]): any {
        var craftedJson: any = {}
        const header = array[0];
        array.splice(0, 1);
        if (header == 'st-sensors') {
            const arrayNumber = array.map(Number);
            let keys = Object.keys(Model.sensors);
            keys.forEach((key, ind) => {
                craftedJson[key] = arrayNumber[ind]
            });
        }
        else if (header == 'st-datetime') {
            let keys = Object.keys(Model.datetime);
            keys.forEach((key, ind) => {
                craftedJson[key] = array[ind]
            });
            const datetime = craftedJson.date + ' ' + craftedJson.time
            store.dispatch(setNodes({datetime: datetime}))
        }
        else if (header == 'st-paracc') {
            craftedJson = array.map(Number);
            
        }
        else if (header == 'st-gpio') {
            craftedJson = array.map(Number)
        }
        else if(header == 'st-nodes'){
            const nodes = array.map( el => {
                const els = el.split('-').map(Number);
                return {
                    ec: els[1],
                    volume: els[2]
                }
            })
            store.dispatch(setNodes({nodes: nodes}))
            store.dispatch(setNodes({supply: nodes[0].ec}))
            // console.log(store.getState().nodes)
        }

        return {
            header: header.replace('st-', ''),
            data: craftedJson
        }
    }
}

/*
    RDY , UPD-TYPE -> TM
    INFO-TYPE -> RM
    DONE -> RM
    {CMD} -> RM
*/

export class ReceptionManager {

    private serialPort: SerialPortManager
    private extractStatus: ExtractStatus
    private extractControl: ExtractControl
    private deviceDataSG: DeviceDataSG

    
    constructor(serial: SerialPortManager) {
        this.serialPort = serial
        this.serialPort.getReciever().subscribe(data => this.onRecieved(data))
        this.extractStatus = new ExtractStatus()
        this.extractControl = new ExtractControl()
        this.deviceDataSG = new DeviceDataSG()
    }

    public getDeviceData(): DeviceDataSG {
        return this.deviceDataSG
    }

    private onRecieved(data: String) {
        if (data.startsWith("INFO")) {
            let str = data.replace('INFO', '');
            console.log('[Info] Mcu board info: ', str);
        }
        else if (data.startsWith("DONE")) {
            console.log('[Info] MCU requesting is done');
        }
        else if (this.verifyData(data)) {
            const splitedData: [any] = this.splitData(data)
            splitedData.forEach(item => {
                const cmdArray = item.split(',')
                // console.log(cmdArray)
                if (cmdArray[0].startsWith('st')) {
                    const extractedData = this.extractStatus.extract(cmdArray)
                    this.deviceDataSG.status[extractedData.header] = extractedData.data
                    
                }
                else if (cmdArray[0].startsWith('ct')) {
                    const extractedData = this.extractControl.extract(cmdArray)
                    const header = extractedData.header;
                    const data = extractedData.data;
                    const ch = parseInt(extractedData.ch)
                    if (header == 'chst') {
                        const ch = parseInt(extractedData.ch) - 1
                        this.deviceDataSG.control[ch].manual.status = data.status;
                        this.deviceDataSG.control[ch].sensor = data.sensor;
                        this.deviceDataSG.control[ch].mode = data.mode;
                        this.deviceDataSG.control[ch].ch = data.ch;
                    }
                    else {
                        this.deviceDataSG.control[ch - 1][header] = data
                    }
                }
                else if (cmdArray[0].startsWith('se')) { ; }

            })
        }
    }

    private verifyData(data: String) { // UPD-type
        var match = data.match(/\{[\w\,\-\.\:\[\]]+\}/);
        if (match != null) return true;
        else return false;
    }

    private splitData(data: any) {
        data = this.replaceAll(data, '{', '');
        data = data.split('}');
        data.splice(data.length - 1, 1);
        return data;
    }

    private replaceAll(str, search, replacement) {
        var target = str;
        return target.replace(new RegExp(search, 'g'), replacement);
    }
}

class CraftCommand {
    craft(chData: any) {
        var ch = chData.ch;
        var mode = chData.mode;
        var strcmd = "";
        if (mode == 0) {
            strcmd = "{manual," + ch + "," + chData.manual.status + "}";
        } else if (mode == 1) {
            // {timer,1,1,20-60,90-150,200-260}
            let list = chData.timer.list;
            let strlist = []
            strcmd = "{timer," + ch + "," + chData.timer.mode + ",";
            list.forEach(l => {
                strlist.push(l.join('-'))
            });
            strcmd += strlist.join(',');
            strcmd += "}";
        } else if (mode == 2) {
            //{setpoint,channel,setpoint_value, working, detecting, sensor}
            let setpoint = chData.setpoint;
            strcmd = "{setpoint," + ch + "," + setpoint.setpoint + "," + setpoint.working + "," + setpoint.detecting + "," + chData.sensor + "}"
        }
        else if (mode == 3) {
            let setbound = chData.setbound;
            // {setbound, channel, upper,lower,sensor}
            strcmd = "{setbound," + ch + "," + setbound.upper + "," + setbound.lower + "," + chData.sensor + "}";
        }
        else if (mode == 4) {
            let sbtiming = chData.sbtiming;
            // {setbound, channel, upper,lower,sensor}
            strcmd = "{sbtiming," + ch + "," + sbtiming.upper + "," + sbtiming.lower + "," + sbtiming.detecting + "," + sbtiming.working + "," + chData.sensor + "}";
        }
        else if (mode == 5) {
            //{irrigation,ch, irr_mode,soil_up, soil_low, par_acc}
            let irr = chData.irrigation;
            
            strcmd = "{irrigation," + ch + "," + irr.mode + "," + irr.soil_upper + "," + irr.soil_lower + "," 
                    + irr.soil_detecting + "," + irr.soil_working + "," + irr.par_soil_setpoint + "," + irr.par_working + "," 
                    + irr.par_detecting + "," + irr.par_acc + "," + irr.descent_rate + "," + irr.limit_time + "}";
        }
        else if (mode == 6) {
            //{advancecond, ch, setpoint, working, detecting, sensor, direction , sensor_cond, sensor_direction, sensor_set,
            //              sensor_flag, timer_flag, 480-1080,1100-1120}
            var advcond = chData.advcond;
            var sensor_flag = advcond.sensor_flag ? 1 : 0;
            var timer_flag = advcond.timer_flag ? 1 : 0;
            strcmd = "{advancecond," + ch + "," + advcond.setpoint + "," + advcond.working + "," + advcond.detecting + "," + advcond.sensor + "," + advcond.direction + "," + advcond.sensor_condition + "," + advcond.sensor_direction + "," + advcond.sensor_setpoint + "," + sensor_flag + "," + timer_flag + ",";
            // console.log(advcond.timer_list)
            var strlist = advcond.timer_list.map(l => l.join('-'));
            strcmd = strcmd + strlist.join(",") + "}";

        }
        else if (mode == 7) {
            //{advancecond, ch, setpoint, working, detecting, sensor, direction , sensor_cond, sensor_direction, sensor_set,
            //              sensor_flag, timer_flag, 480-1080,1100-1120}
            var advsb = chData.advsb;
            var sensor_flag = advsb.sensor_flag ? 1 : 0;
            var timer_flag = advsb.timer_flag ? 1 : 0;
            strcmd = "{advancesb," + ch + "," + advsb.upper + "," + advsb.lower + "," + advsb.sensor + "," + advsb.direction + "," + advsb.sensor_condition + "," + advsb.sensor_direction + "," + advsb.sensor_setpoint + "," + sensor_flag + "," + timer_flag + ",";
            // console.log(advsb.timer_list)
            var strlist = advsb.timer_list.map(l => l.join('-'));
            strcmd = strcmd + strlist.join(",") + "}";
        }
        else if (mode == 8) {
            //{advancecond, ch, setpoint, working, detecting, sensor, direction , sensor_cond, sensor_direction, sensor_set,
            //              sensor_flag, timer_flag, 480-1080,1100-1120}
            var advsbt = chData.advsbt;
            var sensor_flag = advsbt.sensor_flag ? 1 : 0;
            var timer_flag = advsbt.timer_flag ? 1 : 0;
            strcmd = "{advancesbt," + ch + "," + advsbt.upper + "," + advsbt.lower + "," + advsbt.working + "," + advsbt.detecting + "," + advsbt.sensor + "," + advsbt.direction + "," + advsbt.sensor_condition + "," + advsbt.sensor_direction + "," + advsbt.sensor_setpoint + "," + sensor_flag + "," + timer_flag + ",";
            // console.log(advsbt.timer_list)
            var strlist = advsbt.timer_list.map(l => l.join('-'));
            strcmd = strcmd + strlist.join(",") + "}";
        }
        else if (mode == 9) {
            //{advancecond, ch, setpoint, working, detecting, sensor, direction , sensor_cond, sensor_direction, sensor_set,
            //              sensor_flag, timer_flag, 480-1080,1100-1120}
            var advsbt = chData.dfirrigation;
            strcmd = "{dfirrigation," + ch + "," + advsbt.upper + "," + advsbt.lower + "," + advsbt.paracc + "," + advsbt.working + "," + advsbt.descent + "}";

        }
        console.log(strcmd);
        return strcmd;
    }
}

class DateTime {
    static craftDateTime(datetime) {
        /*
            dt: {date: "2017-01-01", time: "10:46"}
        */
        var date = datetime.date.split('-');
        var time = datetime.time.split(':');
        var payload = {
            day: parseInt(date[2]),
            month: parseInt(date[1]),
            year: parseInt(date[0]) % 2000,
            hour: parseInt(time[0]),
            min: parseInt(time[1])
        }
    
        return '{datetime,' + payload.day + ',' +
            payload.month + ',' +
            payload.year + ',' +
            payload.hour + ',' +
            payload.min + '}'; 
    }
}

export class TransmitionManager {
    private serialPort: SerialPortManager
    private cmdList: [String]
    private isTunnelAvailable: boolean = true
    private craftCommand: CraftCommand
    constructor(serial: SerialPortManager) {
        this.serialPort = serial
        this.serialPort.getReciever().subscribe(data => this.onRecieved(data))
        this.writeRoutine()
        this.requestRoutine()
        this.craftCommand = new CraftCommand()
        this.cmdList = ['{checkstatus}']
    }

    public updateDateTime(datetime:any){
       const dtStr =  DateTime.craftDateTime(datetime)
       console.log(dtStr);
       this.write(dtStr);
    }

    public updateControl(control: any): void {
        const cmd:string = this.craftCommand.craft(control)
        // console.log(cmd);
        this.write(cmd)
    }

    private write(data:string){
        this.serialPort.getTransmiter().write(data)
    }

    private onRecieved(data: String) {
        this.isTunnelAvailable = true
        if (data == 'RDY') {
            console.log('[Info] MCU is ready!')
            this.requestControl()
        }
        else if (data.startsWith('UPD')) {
            var resarr = data.split('-');
            var type = resarr[1];
            var ch = (resarr.length > 2) ? resarr[2] : null;
            if (type == 'WATER') this.write('{Gwater-control}');
            else if (type == 'SETPOINT') this.write('{Gcontrol,setpoint,' + ch + ',1}');
            else if (type == 'SETBOUND') this.write('{Gcontrol,setbound,' + ch + ',1}');
            else if (type == 'IRR') this.write('{Gcontrol,irrigation,' + ch + ',1}');
            else if (type == 'TIMER') this.write('{Gcontrol,timer,' + ch + ',1}');
            else if (type == 'MANUAL') this.write('{Gcontrol,manual,' + ch + ',1}');
            else if (type == 'ADVCOND') this.write('{Gcontrol,advcond,' + ch + ',1}');
            else if (type == 'ADVSB') this.write('{Gcontrol,advsb,' + ch + ',1}');
            else if (type == 'ADVSBT') this.write('{Gcontrol,asbsbt,' + ch + ',1}');
            else if (type == 'DFIRR') this.write('{Gcontrol,dfirrigation,' + ch + ',1}');
            if (ch) this.write('{Gcontrol,channelstatus,' + ch + ',1}');
        }
    }

    private writeRoutine() {
        setInterval(() => {
            // console.log(this.isTunnelAvailable, this.cmdList.length, this.serialPort.isAvailable() )
            if (this.isTunnelAvailable && this.cmdList.length > 0 && this.serialPort.isAvailable()) {
                let cmd = this.cmdList.shift();
                this.serialPort.getTransmiter().write(cmd);
                this.isTunnelAvailable = false
            }
        }, 10)
    }

    private requestRoutine() {
        setInterval(() => {
            if (this.serialPort.isAvailable()) {
                
                this.serialPort.getTransmiter().write('{Gdatetime}')
                this.serialPort.getTransmiter().write('{Gnodes}')
                /*
                    this.serialPort.getTransmiter().write('{Gparacc}')
                    this.serialPort.getTransmiter().write('{Ggpio}')
                    this.serialPort.getTransmiter().write('{Gsensors}')
                */
            }
        }, 1000);
    }

    private requestControl() {
        console.log('[Info] Requesting: control');
        this.serialPort.getTransmiter().write('{Gcontrol,channelstatus,1,4}');
        this.serialPort.getTransmiter().write('{Gcontrol,timer,1,4}');
        this.serialPort.getTransmiter().write('{Gcontrol,setbound,1,4}');
        this.serialPort.getTransmiter().write('{Gcontrol,setpoint,1,4}');
        this.serialPort.getTransmiter().write('{Gcontrol,sbtiming,1,4}');
        this.serialPort.getTransmiter().write('{Gcontrol,irrigation,1,4}');
        this.serialPort.getTransmiter().write('{Gcontrol,dfirrigation,1,4}');
        this.serialPort.getTransmiter().write('{Gcontrol,advcond,1,4}');
        this.serialPort.getTransmiter().write('{Gcontrol,advsb,1,4}');
        this.serialPort.getTransmiter().write('{Gcontrol,advsbt,1,4}');
        this.serialPort.getTransmiter().write('{done}')
    }
}


