import SerialPort from 'serialport'
import * as Rx from 'rxjs'

export class SerialPortManager {
    private port: any;
    private parser: any;
    private reciever: any;
    private portName: String;
    private isPortAvailable: Boolean;
   
    constructor(port: String) {
        this.isPortAvailable = false;
        this.reciever = new Rx.Subject()
        this.portName = port
        this.port = new SerialPort(this.portName, {
            baudRate: 115200,
            autoOpen: false,
            disconnectedCallback: function () {
                console.log('You pulled the plug!');
            }
        })
        this.port.open(this.onOpen)
        this.port.on('closed', () => this.onClosed())
        this.port.on('open', () => this.onOpened())
        this.parser = this.port.pipe(new SerialPort.parsers.Readline({
            delimiter: '\r\n'
        }));
        this.parser.on('data', (data) => {
            this.onData(data)
        })
    }
    public getTransmiter(): any {
        return this.port;
    }

    public getReciever(): any {
        return this.reciever;
    }

    public isAvailable(): Boolean {
        return this.isPortAvailable;
    }

    private onData(data: string): void {
        this.getReciever().next(data)
    }

    private onOpen(err: any): void {
        if (err) {
            console.log('[Error] OnOpen:', err);
            return;
        }
    }

    private onOpened(): void {
        this.isPortAvailable = true;
        console.log("[Info]", this.portName, "is Opened. ")
    }
    private onClosed(): void {
        this.isPortAvailable = false;
        console.log("[Info]", this.portName, "is Closed. ")
    }
}
