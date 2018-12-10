import { SerialPortManager } from './serialport'
import { ReceptionManager, TransmitionManager, DeviceDataSG } from './device-communication'
import Configuration from '../configuration';
class DeviceManager {

    static instance: DeviceManager
    private serialPort: SerialPortManager
    private transmiter: TransmitionManager
    private reciever: ReceptionManager

    constructor(portName: String = "/dev/serial0") {
        this.serialPort = new SerialPortManager(portName)
        this.transmiter = new TransmitionManager(this.serialPort)
        this.reciever = new ReceptionManager(this.serialPort)
    }

    public static getInstance(): DeviceManager {
        if (this.instance) return this.instance;
        else {
            this.instance = new DeviceManager(Configuration.getConfig().portName)
            return this.instance
        }
    }

    public getTransmiter(): TransmitionManager {
        return this.transmiter
    }
    public getDeviceData(): DeviceDataSG {
        return this.reciever.getDeviceData()
    }

    public isDeviceAvailable(): Boolean {
        return this.serialPort.isAvailable()
    }

}

export default DeviceManager.getInstance()


