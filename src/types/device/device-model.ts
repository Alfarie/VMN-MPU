export const control =  {
    "ch": 1,
    "mode": 0,
    "sensor": 0,
    "manual": {
        "status": 0
    },
    "timer": {
        "size": 3,
        "mode":0,
        "list": [ [0,60], [120,180], [300,360]]
    },
    "irrigation": {
        "soil_upper": 60,
        "soil_lower": 40,
        "soil_detecting": 30,
        "soil_working": 15,

        "par_soil_setpoint": 50,
        "par_detecting": 30,
        "par_working": 15,
        "par_acc": 1.5,
        "mode": 1,
        "limit_time": 3,
        "descent_rate": 0.2
    },
    "dfirrigation": {
        "upper": 60,
        "lower": 40,
        "paracc": 1.0,
        "working": 15,
        "descent": 50
    },
    "advcond": {
        "timer_list": [],
        "timer_size": 0,
        "timer_flag": false,
        "sensor_condition": 3,
        "sensor_setpoint": 30,
        "sensor_flag": false,
        "sensor_direction": 0,
        
        "sensor": 5,
        "setpoint": 600,
        "working": 15,
        "detecting": 30,
        "direction": 0
    },
    "advsb": {
        "timer_list": [],
        "timer_size": 0,
        "timer_flag": false,
        "sensor_condition": 3,
        "sensor_setpoint": 30,
        "sensor_flag": false,
        "sensor_direction": 0,
        
        "sensor": 5,
        "upper": 2000,
        "lower": 1500,
        "direction": 0
    },
    "advsbt": {
        "timer_list": [],
        "timer_size": 0,
        "timer_flag": false,
        "sensor_condition": 3,
        "sensor_setpoint": 30,
        "sensor_flag": false,
        "sensor_direction": 0,
        
        "sensor": 5,
        "upper": 2000,
        "lower": 1500,
        "working": 10,
        "detecting": 10,
        "direction": 0
    }
}

export const sensors = {
    soil:0,
    temperature:0,
    humidity: 0,
    vpd: 0,
    par: 0,
    co2: 0,
    paracc: 0
}

export const datetime = { 
    date: '2018-01-01',
    time: '00:00:00'
}

export const gpio = [0,0,0,0]

export const paracc = [0,0,0,0]