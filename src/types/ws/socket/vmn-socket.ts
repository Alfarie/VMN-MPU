import {SocketHandler} from './socket'
import store from '../../store'

// import {setNodes} from '../../store/nodes'
// import moment from 'moment'

// function getRndInteger(min, max) {
//     return Math.floor(Math.random() * (max - min) ) + min;
//   }
// function getRndFloat(min, max) {
//     return (Math.random() * (max - min) ) + min;
//   }
// const genNodes = () => {
//     return {
//         supply: getRndFloat(1.8, 2),
//         nodes: [
//             { ec: getRndFloat(1.8, 2), volume: getRndInteger(400,420)},
//             { ec: getRndFloat(1.8, 2), volume: getRndInteger(400,420)},
//             { ec: getRndFloat(1.8, 2), volume: getRndInteger(400,420)},
//             { ec: getRndFloat(1.8, 2), volume: getRndInteger(400,420)},
//             { ec: getRndFloat(1.8, 2), volume: getRndInteger(400,420)},
//             { ec: getRndFloat(1.8, 2), volume: getRndInteger(400,420)},
//             { ec: getRndFloat(1.8, 2), volume: getRndInteger(400,420)},
//             { ec: getRndFloat(1.8, 2), volume: getRndInteger(400,420)}
//         ],
//         datetime: moment().format('YYYY-MM-DD HH:mm:ss')
//     }
// }

export class VmnSocket extends SocketHandler {
    constructor(IO:any){
        super(IO);
    }

    protected publishStatus():void {
        setInterval(()=>{
            // store.dispatch(setNodes(genNodes()))
            this.io.to('0x01').emit('action', store.getState().nodes);
        },1000);
    }
}