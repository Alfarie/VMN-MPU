import SGLogger from '../logger/sensors-logger';
import VmnLogger from '../logger/vmn-logger';
import moment from 'moment'



export var InitSGLogger = () => {

    const loggingTime = 50000;
    var json: any = {
        datetime: moment('2018-01-01 00:00:00').format('YYYY-MM-DD HH:mm:ss'),
        soil: 0,
        temperature: 0,
        humidity: 0,
        vpd: 0,
        par: 0,
        co2: 0,
        paracc: 0
    }
    setTimeout(() => {
        for (var i = 0; i < loggingTime; i++) {
            json.datetime = moment(json.datetime).add(1, 'minute').format('YYYY-MM-DD HH:mm:ss');
            json.soil = Math.random();
            json.temperature = Math.random();
            json.humidity = Math.random();
            json.vpd = Math.random();
            json.par = Math.random();
            json.co2 = Math.random();
            json.paracc = Math.random();
            SGLogger.log(json)
        }
        
    }, 2000)
}


var getNodes = () => {
    return {
        supply: Math.random()*2.0,
        nodes: [
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300}
        ],
        datetime: moment().format('YYYY-MM-DD HH:mm:ss')
    }
}
export var InitVmnLogger = () => {
    const loggingTime = 100000;
    var json: any = {
        supply: 2.0,
        nodes: [
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300},
            { ec: Math.random()*1, volume: 300}
        ],
        datetime: moment('2018-01-01 00:00:00').format('YYYY-MM-DD HH:mm:ss')
    }

    setTimeout(() => {
        for (var i = 0; i < loggingTime; i++) {
            const datetime = moment(json.datetime).add(1, 'minute').format('YYYY-MM-DD HH:mm:ss');
            json = {...getNodes(), datetime}

            // console.log(json)
            VmnLogger.log({
                datetime: datetime,
                data: json
            });
            // console.log('log')
        }
        console.log('finish')
    
        
    }, 2000)
}
