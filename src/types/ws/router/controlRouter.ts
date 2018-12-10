import { Router } from './router';
import express from 'express';
import DeviceManager from '../../device/device';

export default class ControlRouter extends Router {
    constructor() {
        super();
        this.name = '/control'
        this.router = express.Router()
        this.mountRoute()
    }
    private mountRoute(): void {
        this.router.get('/', ({ }, res) => {
            console.log('[Info] Control API: Request');
            res.json(DeviceManager.getDeviceData().control);
        });

        this.router.post('/', (req, res) => {
            const control = req.body.control;
            DeviceManager.getTransmiter().updateControl(control)
            res.json({ msg: 'success' })
        });
    }
}