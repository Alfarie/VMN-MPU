import { Router } from './router';
import express from 'express';
import DeviceManager from '../../device/device';
export default class SettingRouter extends Router {
    constructor() {
        super();
        this.name = '/setting'
        this.router = express.Router()
        this.mountRoute()
    }
    private mountRoute(): void {
        this.router.post('/datetime', function (req, res) {
            // {date: "2017-01-01", time: "10:46"}
            DeviceManager.getTransmiter().updateDateTime(req.body)
            console.log(req.body);
            res.json({
                msg: 'success'
            })
        });
        
    }
}