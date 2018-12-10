import AWSIOT from './aws-iot'
import DeviceManager from '../device/device';
export default class AWSReciever {
    awsIot: AWSIOT
    constructor(iot: AWSIOT) {
        this.awsIot = iot
        this.init()
    }

    private init() {
        console.log('[Info] AWS-IOT Ready.')
        this.awsIot.onShadowDelta.asObservable().subscribe(stateObject => {
            var state = stateObject.state;
            if (state.control) {
                var chStr = Object.keys(state.control)[0];
                // var ch = parseInt(chStr.replace('ch', ''));
                // var ctrlCh = JSON.parse(JSON.stringify( mcu.GetControl()[ch - 1] ))
                var ctrlCh = JSON.parse(JSON.stringify(DeviceManager.getDeviceData().control[0] ))
                var objChange = Object.keys(state.control[chStr]);
                objChange.forEach(key => {
                    if (Object.keys(state.control[chStr][key]).length > 0) {
                        Object.keys(state.control[chStr][key]).forEach(key2 => {
                            ctrlCh[key][key2] = state.control[chStr][key][key2]
                        })
                    }
                    else {
                        ctrlCh[key] = state.control[chStr][key];
                    }
                });
                // console.log(ctrlCh)
                DeviceManager.getTransmiter().updateControl(ctrlCh)

                setTimeout( ()=> {
                    this.awsIot.awsTransmitter.updateShadowControl()
                },2000)
            }
            if (state.datetime) {
                console.log(state.datetime)
                // mcu.SendDateTime(state.datetime);
                // awsclient.clearDesired();
            }
        })
    }
}