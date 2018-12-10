import { Router } from './router';
import express from 'express'
import moment from 'moment';
import SGLogger from '../../logger/sensors-logger'
export default class LoggerRouter extends Router {
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
                const intv = parseInt(interval.interval)
                SGLogger.getLog(startTime, endTime,intv).then( rows => res.json(rows) )
            }
            else {
                res.json({ messgae: 'Error: Invalid format.'})
            }
        })

        this.router.get('/statistic', (req,res)=>{
            const interval = req.query;
            if(interval.start && interval.end){
                const startTime = moment(interval.start);
                const endTime = moment(interval.end);
                SGLogger.getStatisticalData(startTime, endTime).then( rows => res.json(rows) )
            }
            else {
                res.json({ messgae: 'Error: Invalid format.'})
            }
        })

        this.router.get('/least', (req,res)=>{
            const interval = req.query;
            if(interval.interval && interval.limit){
                const intv = parseInt(interval.interval);
                const limit = parseInt(interval.limit);
                SGLogger.getLastLog(intv, limit).then( rows => res.json(rows) )
            }
            else {
                res.json({ messgae: 'Error: Invalid format.'})
            }
        })


       


        this.router.get('/interval/csv', (req,res)=>{
            const interval = req.query;
            console.log(interval)
            if(interval.start && interval.end && interval.interval){
                const startTime = moment(interval.start);
                const endTime = moment(interval.end);
                const intv = parseInt(interval.interval)
                SGLogger.getLog(startTime, endTime,intv).then( rows => {
                    const keys = Object.keys(rows[0]);
                    res.csv(
                        rows, {
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