import Logger from './logger'
import moment from 'moment';

class SGLogger extends Logger { 
    public static instance: SGLogger;
    public static getInstance(): SGLogger{
        if(!this.instance) this.instance = new SGLogger()
        return this.instance
    }
    constructor(){
        super();
        this.createTable()
    }

    log(data: any) {
        const params = [
            moment(data.datetime).unix(),
            data.datetime,
            data.message
        ]
        const sql = `INSERT INTO sg_logger(timestamp, datetime, message) VALUES(?,?,?);`
        this.db.execParams(sql, params);
    }

    createTable(){
        const sql = `CREATE TABLE IF NOT EXISTS sg_logger (
            timestamp INTEGER PRIMARY KEY NOT NULL,
            datetime TEXT NOT NULL,
            message TEXT NOT NULL)
        `
        this.db.exec(sql)
    }
}

export default SGLogger.getInstance();