import moment from 'moment'
import DeviceManager from '../../device/device'
export class SocketHandler {
    io:any
    constructor(IO:any){
        this.io = IO;
        this.declarePublisher()
        this.publishStatus();
    }

    private declarePublisher():void {
        this.io.on('connection', function (socket) {
            console.log("[socket] Client Connected");
            socket.join('0x01');
            socket.on('disconnect', function() {
                console.log('[socket] DISCONNECT');
            });
        });
    }

    protected publishStatus():void {
        setInterval( () => {
            if( !DeviceManager.isDeviceAvailable()){
                return ;
            }
            try {
                var deviceStatus = DeviceManager.getDeviceData().status
                const data =  { 
                    sensors: deviceStatus.sensors,
                    datetime: moment(deviceStatus.datetime.date + ' ' + deviceStatus.datetime.time ).format('YYYY-MM-DD HH:mm:ss'),
                    paracc: deviceStatus.paracc,
                    gpio: deviceStatus.gpio
                }
                // console.log(data);
                this.io.to('0x01').emit('DEVICE_DATA', data);
            } catch (err) {
               console.log(err)
            }
        },1000)
        
    }
}

