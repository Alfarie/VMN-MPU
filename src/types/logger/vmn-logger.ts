import Logger from './logger'
import moment from 'moment';
import store from '../store'
import Configuration from '../configuration';

class VmnLogger extends Logger {
    public static instance: VmnLogger;
    private currentTime: String;
    public static getInstance(): VmnLogger {
        if (!this.instance) this.instance = new VmnLogger()
        return this.instance
    }
    constructor() {
        super();
        this.createTable()
        this.vmnLoggingRoutine();
    }

    log(data) {
        const params = [
            moment(data.datetime).unix(),
            data.datetime,
            JSON.stringify(data.data)
        ]
        const sql = `INSERT INTO vmn_logger(timestamp, datetime, data) VALUES(?,?,?);`
        this.db.execParams(sql, params);
    }

    public getLog(start: moment.Moment, end: moment.Moment, interval: Number): Promise<any> {
        return new Promise((resolve, reject) => {
            var startUnix = start.unix()
            var endUnix = end.unix()

            if (startUnix == endUnix) {
                endUnix = end.add(1440, 'minute').unix()
            }
            let sql = 'SELECT * FROM vmn_logger WHERE  (timestamp between ? AND ?) AND round((timestamp / 60)) % ? == 0';
            let params = [startUnix, endUnix, interval];
            this.db.getDB().all(sql, params, (err, rows) => {
                if (err) reject(err.message);
                resolve( rows.map( row=> JSON.parse(row.data)));
            })
        })
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS vmn_logger (
            timestamp INTEGER PRIMARY KEY NOT NULL,
            datetime TEXT NOT NULL,
            data TEXT NOT NULL)
        `
        this.db.exec(sql)
    }

    private vmnLoggingRoutine(): void {
        setInterval(() => {
            const { datetime } = store.getState().nodes;

            if (this.currentTime == datetime) {
                console.log('[Info] Current datetime is not updating from previous datetime')
                return;
            }

            this.currentTime = datetime;

            this.log({
                datetime,
                data: store.getState().nodes
            })

        }, Configuration.getConfig().loggerTime );

    }
}

export default VmnLogger.getInstance();