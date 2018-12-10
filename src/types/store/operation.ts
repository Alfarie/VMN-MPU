import {createAction, createReducer} from 'redux-act';
import {join, resolve} from 'path'
import {writeFileSync,existsSync} from 'fs'
const FILE_PATH =  join(resolve(__dirname, '../../../../DB/operation.json'));

// import storejs from 'store'
const NS = `OP`
export const setOperation:any = createAction(`${NS}SET_OP`)
const initState = existsSync(FILE_PATH)?
    require(FILE_PATH)
    :{
        "operation": {
            "operator-name": "John Doe",
            "crop-name": "Tomato",
            "measurement-time": ["06:00", "17:00"]
        },
        "supply-water": [900, 900, 900, 900],
        "number-plant": [49, 49, 49, 49, 49, 49, 49, 49],
        "number-drippers": [49, 49, 49, 49, 49, 49, 49, 49],
        "water-flow": [49, 49, 49, 49, 49, 49, 49, 49]
    }
export default createReducer({
    [setOperation]: (state,payload)=> {
        const combinedState = ({...state,...payload})
        writeFileSync(FILE_PATH, JSON.stringify(combinedState))
        return combinedState;
    }
},initState);