import { Router } from './router';
import express from 'express'
import moment from 'moment';
import VmnLogger from '../../logger/vmn-logger'
export default class VmnLoggerRouter extends Router {
    constructor() {
        super();
        this.name = '/logger'
        this.router = express.Router()
        this.mountRoute()
    }
    private mountRoute(): void {
        this.router.get('/interval', (req,res)=>{
            const interval = req.query;
            if(interval.start && interval.end && interval.interval){
                const startTime = moment(interval.start);
                const endTime = moment(interval.end);
                const intv = parseInt(interval.interval);
                const sta = interval.station?parseInt(interval.station):1
                VmnLogger.getLog(startTime, endTime,intv).then( rows => {
                    res.json(rows.map( row=> (
                        {
                            station: sta,
                            datetime: row.datetime,
                            ec: row.nodes[sta].ec,
                            volume: row.nodes[sta].volume
                        }
                    )))
                })
            }
            else {
                res.json({ messgae: 'Error: Invalid format.'})
            }
        });
        
        this.router.get('/interval/csv', (req,res)=>{
            const interval = req.query;
            // (interval)
            if(interval.start && interval.end && interval.interval){
                const startTime = moment(interval.start);
                const endTime = moment(interval.end);
                const intv = parseInt(interval.interval)
                const sta = interval.station? parseInt(interval.station):0
                VmnLogger.getLog(startTime, endTime,intv).then( rows => {
                    const data = rows.map(row =>{
                        return {
                            station: sta,
                            datetime: row.datetime,
                            ec: row.nodes[sta].ec,
                            volume: row.nodes[sta].ec
                        }
                    })
                    const keys = Object.keys(data[0]);
                    res.csv(
                        data, {
                            fields: keys
                        });
                })
            }
            else {
                res.json({ messgae: 'Error: Invalid format.'})
            }
        })
    }
}
