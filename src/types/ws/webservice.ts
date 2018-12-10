import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import socketIO from 'socket.io'
import * as http from 'http'
import path from 'path'
import jsoncsv from 'express-json-csv'
import AuthRouter from './router/authRouter'
import ControlRouter from './router/controlRouter'
import LoggerRouter from './router/loggerRouter'
import WifiRouter from './router/wifiRouter'
import SettingRouter from './router/settingRouter'
import VmnOperationRouter from './router/vmn-operation'
import VmnLoggerRouter from './router/vmnLoggerRouter'

var app = express()
var secret = 'ThisIsSecretMessageIntelAgro'
app.set('superSecret', secret)

var cors = require('cors');
app.use(cors());
jsoncsv(app)
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true
}));

var root = path.join(path.resolve(__dirname, '../../../../dist/'));
app.use(express.static(root));


export class WebService {
    port:Number = 3000
    http: any
    private io: any
    constructor() {
        this.mountRoute();
        
        this.http = new http.Server(app)
        this.io = socketIO(this.http)
        
       
        this.http.listen(this.port, (err)=>{
           if(err) console.log(err)
           console.log('[Info] Listening on port:', this.port)
        })
    }

    public getIO (): any {
        return this.io
    }
    
    private mountRoute():void {
        const authRouter = new AuthRouter()
        const controlRouter = new ControlRouter()
        const loggerRouter = new LoggerRouter()
        const wifiRouter = new WifiRouter()
        const settingRouter =  new SettingRouter()
        const vmnOperationRouter =  new VmnOperationRouter()
        const vmnLoggerRouter =  new VmnLoggerRouter()
        app.use('/auth', authRouter.getRouter());
        app.use('/control', controlRouter.getRouter());
        app.use('/logger', loggerRouter.getRouter());
        app.use('/vmn-logger', vmnLoggerRouter.getRouter());
        app.use('/wifi', wifiRouter.getRouter());
        app.use('/setting', settingRouter.getRouter());
        app.use('/operation', vmnOperationRouter.getRouter());
    }
}