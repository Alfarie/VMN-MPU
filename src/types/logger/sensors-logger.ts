
import moment from 'moment'
import Logger from './logger'
import Configuration from '../configuration';
import DeviceManager from '../device/device';

class SensorLogger extends Logger {
    public static instance: SensorLogger;
    private currentTime: String;
    public static getInstance(): SensorLogger {
        if (!this.instance) this.instance = new SensorLogger()
        return this.instance
    }
    constructor() {
        super();
        this.createTable()
        this.sensorsLoggingRoutine()
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS sensors_logger(
            timestamp INTEGER PRIMARY KEY NOT NULL,
            datetime TEXT NOT NULL,
            soil NUMBER NOT NULL,
            temperature NUMBER NOT NULL,
            humidity NUMBER NOT NULL,
            vpd NUMBER NOT NULL,
            par NUMBER NOT NULL,
            co2 NUMBER NOT NULL,
            paracc NUMBER NOT NULL)
        `
        this.db.exec(sql)
    }

    log(json: any) {
        const sql = `INSERT INTO sensors_logger(timestamp,datetime,soil,temperature,humidity,vpd,par,co2,paracc)
        VALUES(?,?,?,?,?,?,?,?,?);`
        const params = [
            moment(json.datetime).unix(),
            json.datetime,
            json.soil,
            json.temperature,
            json.humidity,
            json.vpd,
            json.par,
            json.co2,
            json.paracc
        ]
        this.db.execParams(sql, params).catch(err => {
            const message = params.toString() + ' ' + err
            console.log(message)
        })
    }

    public getLog(start: moment.Moment, end: moment.Moment, interval: Number): Promise<any> {
        return new Promise((resolve, reject) => {
            var startUnix = start.unix()
            var endUnix = end.unix()

            if (startUnix == endUnix) {
                endUnix = end.add(1440, 'minute').unix()
            }
            let sql = 'SELECT * FROM sensors_logger WHERE (timestamp between ? AND ?) AND round((timestamp / 60)) % ? == 0;'
            let params = [startUnix, endUnix, interval];
            this.db.getDB().all(sql, params, (err, rows) => {
                if (err) reject(err.message);

                console.log(rows.length)
                resolve(rows);
            })

        })
    }

    public getLastLog(interval: Number, limit: Number) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM sensors_logger WHERE round((timestamp / 60)) % ? == 0 ORDER BY timestamp DESC LIMIT ?'
            let params = [interval, limit]
            this.db.getDB().all(sql, params, (err, rows) => {
                if (err) reject(err.message);

                // console.log(rows);
                resolve(rows);
            })
        })
    }

    public getStatisticalData(start: moment.Moment, end: moment.Moment): Promise<any> {
        return new Promise((resolve, reject) => {
            var startUnix = start.unix()
            var endUnix = end.unix()

            if (startUnix == endUnix) {
                endUnix = end.add(1440, 'minute').unix()
            }
            let sql = 'SELECT * FROM sensors_logger WHERE (timestamp between ? AND ?)'
            let params = [startUnix, endUnix];

            try{
                this.db.getDB().all(sql, params, (err: any, rows: any[]) => {
                    if (err) reject(err.message);
    
                    var soil = []
                    var temperature = []
                    var humidity = []
                    var vpd = []
                    var co2 = []
                    var par = []
                    rows.forEach(row => {
                         soil.push(row.soil)
                         temperature.push(row.temperature)
                         humidity.push(row.humidity)
                         vpd.push(row.vpd)
                         co2.push(row.co2)
                         par.push(row.par)
                    })
                    var data = {
                        soil: [parseInt(Math.max(...soil).toFixed(2)), soil.reduce((p,c)=> p+c)/soil.length , parseInt(Math.min(...soil).toFixed(2))],
                        temperature: [parseInt(Math.max(...temperature).toFixed(2)), temperature.reduce((p,c)=> p+c)/temperature.length, parseInt(Math.min(...temperature).toFixed(2))],
                        humidity: [parseInt(Math.max(...humidity).toFixed(2)), humidity.reduce((p,c)=> p+c)/humidity.length, parseInt(Math.min(...humidity).toFixed(2))],
                        vpd: [parseInt(Math.max(...vpd).toFixed(2)), vpd.reduce((p,c)=> p+c)/vpd.length, parseInt(Math.min(...vpd).toFixed(2))],
                        co2: [parseInt(Math.max(...co2).toFixed(2)), co2.reduce((p,c)=> p+c)/co2.length, parseInt(Math.min(...co2).toFixed(2))],
                        par: [parseInt(Math.max(...par).toFixed(2)), par.reduce((p,c)=> p+c)/par.length, parseInt(Math.min(...par).toFixed(2))]
                    }
                    resolve(data);
                })
            }
            catch(ex){
                reject(ex)
            }
            
        })
    }

    private sensorsLoggingRoutine(): void {
        setInterval(() => {
            var loggingData = DeviceManager.getDeviceData().status.sensors
            const datetime = DeviceManager.getDeviceData().status.datetime
            loggingData.datetime = datetime.date + ' ' + datetime.time;

            if(this.currentTime == loggingData.datetime){
                console.log('[Info] Current datetime is not updating from previous datetime')
                return;
            }
            
            this.currentTime = loggingData.datetime;
            
            this.log(DeviceManager.getDeviceData().status.sensors)
        }, Configuration.getConfig().loggerTime)
    }
}

export default SensorLogger.getInstance();