import { Router } from './router';
import express from 'express';
import WIFI from '../../wifi/wifi';
export default class ControlRouter extends Router {
    constructor() {
        super();
        this.name = '/wifi'
        this.router = express.Router()
        this.mountRoute()
    }
    private mountRoute(): void {
        this.router.get('/scan', function ({}, res) {
            WIFI.scanWifi()
            .then(data => {
                res.json({msg: 'success', data: data});
            })
            .catch(err=>{
                res.json({msg: 'failure', data: err });
            })
        });    

        // /wifi/apmode
        this.router.post('/apmode', function (req, res) {
            const {ssid, password} = req.body;
            console.log(req.body)
            res.json({ msg: 'success' })
            // { ssid: 'SmartGrobot-A', password: 'raspberry' }
            WIFI.startAp(ssid, password);
        });

        // /wifi/stamode
        this.router.post('/stamode', function (req, res) {
            const {ssid, password} = req.body;
            res.json({ msg: 'success' })
            // { ssid: 'SmartGrobot-A', password: 'raspberry' }
            WIFI.startStation(ssid, password);
        });
    }
}