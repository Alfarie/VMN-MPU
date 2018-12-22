
import { WebService } from './types/ws/webservice';
import { VmnSocket } from './types/ws/socket/vmn-socket';
const ws = new WebService()
new VmnSocket(ws.getIO())
import AWSManager from './types/aws/aws';
new AWSManager()

import DeviceIO from './types/device-io/device'
new DeviceIO();


// import { InitVmnLogger } from './types/simulation/generate-sensors-logger'

// InitVmnLogger()