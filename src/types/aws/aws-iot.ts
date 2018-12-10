import awsIot from 'aws-iot-device-sdk'
import GetMac from './getmac';
import Configuration from '../configuration';
import path from 'path'
import AWSTransmitter from './aws-transmiter'
import AWSReciever from './aws-reciever'
import * as Rx from 'rxjs'
export default class AWSIOT {
    mid: String;
    device:any;
    shadow:any;
    thingName:String;
    awsTransmitter: AWSTransmitter
    awsReciever:AWSReciever
    onDeviceStatus: Rx.Subject<any>
    onShadowDelta: Rx.Subject<any>
    certPath: String = path.join(path.resolve(__dirname, '../../../../'));
    constructor(){
        console.log("cert path: " + this.certPath);
        this.init()
        this.awsTransmitter = new AWSTransmitter(this)
        this.awsReciever = new AWSReciever(this)
    }

    private async init(){
        this.onDeviceStatus = new Rx.Subject();
        this.onShadowDelta = new Rx.Subject();
        this.mid = await GetMac.getMac(Configuration.getConfig().interface)
        console.log(this.mid)
        this.thingName = this.mid;
        const clientId = this.mid;
        var lwt_payload = {
            connection: false,
            mid: this.thingName
        }
        var cert_shadow = {
            keyPath: this.certPath + '/cert/private.pem.key',
            certPath: this.certPath + '/cert/certificate.pem.crt',
            caPath: this.certPath + '/cert/root-CA.crt',
            host: 'a36i6p8e4cz1dq.iot.ap-southeast-1.amazonaws.com',
            clientId: '12345678910'
        }
        var cert_device = {
            keyPath: this.certPath + '/cert/private.pem.key',
            certPath: this.certPath + '/cert/certificate.pem.crt',
            caPath: this.certPath + '/cert/root-CA.crt',
            host: 'a36i6p8e4cz1dq.iot.ap-southeast-1.amazonaws.com',
            clientId: '12345678911',
            will: {
                topic: 'LWT_UPDATE',
                payload: JSON.stringify(lwt_payload)
            }
        }

        cert_device['clientId'] = clientId + '-device';
        cert_shadow['clientId'] = clientId + '-shadow';
        this.device = awsIot.device(cert_device);
        this.shadow = awsIot.thingShadow(cert_shadow);
        this.shadow.on('connect', () => {
            console.log('[Info] AWS-IoT Shadow CONNECTED')
            this.shadow.register(this.thingName, {}, () => {
                console.log('[Info] Thing Registered');
                this.onDeviceStatus.next({topic: 'shadow', message: 'connected'})
            });
        });
    
        // this.shadow.on('status', (thingName, stat, clientToken, stateObject) => {
        //     // console.log('received ' + stat + ' on ' + thingName + ': ' +
        //     //     JSON.stringify(stateObject.state.reported));
        // });
    
        this.shadow.on('error', (error) => {
            console.log(error);
        });
    
        this.shadow.on('delta', (thingName, stateObject) => {
            // console.log('received delta on ' + thingName + ': ' +
            //     JSON.stringify(stateObject.state));
            // var state = stateObject.state // desired 
            // onDelta.next(stateObject)
            console.log('[Info] Recieved deltal on ' + thingName)
            this.onShadowDelta.next(stateObject)
    
        });
    
        this.device.on('connect', () => {
            console.log('[Info] AWS-IoT CONNECTED');
            this.publish('UPDATE_DEVICE', {mid: this.mid, updateDevice: new Date() })
            this.onDeviceStatus.next({topic: 'device', message: 'connected'})
        });
    
        this.device.on('close', () => console.log('[Info] AWS-IoT CLOSED'));
        this.device.on('reconnect', () => console.log('[Info] AWS-IoT RECONNECT'));
        this.device.on('offline', () => console.log('[Info] AWS-IoT OFFLINE'));
        this.device.on('error', (error) => console.log('[Info] AWS-IoT ERROR', error));
    
        this.device.on('message', (topic, payload) => {
            console.log('message', topic, payload.toString());
        });
    }

    public publish(topic, jsonMsg) { 
        this.device.publish(topic, JSON.stringify(jsonMsg));
    }

    public subscribe(topic, {}) {
        console.log('[INFO] AWS Subscribe ' + topic);
        this.device.subscribe(topic);
    }

    public updateThingShadow(data) {
        var state = { state: { reported: data, desired: null } };
        const clientTokenUpdate = this.shadow.update(this.thingName, state);
        if (clientTokenUpdate === null) {
            console.log('[Error] update shadow failed, operation still in progress');
        }
        else {
            console.log('[Info] update shadow successful');
        }
    }

    public clearDesired(){
        var state = { state: { desired: null } };
        const clientTokenUpdate = this.shadow.update(this.thingName, state);
        if (clientTokenUpdate === null) {
            console.log('[Error] update shadow failed, operation still in progress');
        }
        else {
            console.log('[Info] update shadow successful');
        }
    }
}