import {createReducer, createAction} from 'redux-act'
import moment from 'moment'

export const setNodes:any = createAction('SET_NODES');

const initState = {
    supply: 2.0,
    nodes: [
        { ec: 1.2, volume: 300},
        { ec: 1.2, volume: 300},
        { ec: 1.2, volume: 300},
        { ec: 1.2, volume: 300},
        { ec: 1.2, volume: 300},
        { ec: 1.2, volume: 300},
        { ec: 1.2, volume: 300},
        { ec: 1.2, volume: 300},
        { ec: 1.2, volume: 300}
    ],
    datetime: moment().format('YYYY-MM-DD HH:mm:ss')
}

export default createReducer({
    [setNodes]: (state, nodes) => ( {...state, ...nodes})
}, initState)