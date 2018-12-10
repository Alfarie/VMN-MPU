import AWSIOT from './aws-iot';
import DeviceManager from '../device/device';
import store from '../store'
export default class AWSTransmitter {
    awsIot: AWSIOT
    constructor(iot:AWSIOT){
        this.awsIot = iot

        // this.onDeviceStatus.next({topic: 'shadow', message: 'connected'})
        this.awsIot.onDeviceStatus.subscribe( data => {
            if(data.topic == 'shadow' && data.message == 'connected'){
                this.updateShadowControl()
            }
            else if (data.topic == 'device' && data.message == 'connected'){
                this.publicDeviceLogging()
                this.publicDeviceStatus()
            }
        })
    }
    
    private publicDeviceStatus(){
        // console.log(store.getState().nodes);
        setInterval(() => this.awsIot.publish('STREAM_STATUS_VMN/' + this.awsIot.mid, store.getState().nodes ) , 2000);
    }
    private publicDeviceLogging(){
        setInterval(() => this.awsIot.publish('LOG_SENSORS_VMN/' + this.awsIot.mid, store.getState().nodes ), 60000);
    }

    public updateShadowControl() {
        console.log('[Info] Update shadow control');
        const data = {
            control: {
                ch1: DeviceManager.getDeviceData().control[0],
                ch2: DeviceManager.getDeviceData().control[1],
                ch3: DeviceManager.getDeviceData().control[2],
                ch4: DeviceManager.getDeviceData().control[3],
            }
        }
        this.awsIot.updateThingShadow(data)
    }
}