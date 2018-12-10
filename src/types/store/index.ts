import {combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import operation from './operation'
import nodes from './nodes'
const middlewares = [thunk]

const reducers = combineReducers({
    operation,nodes
})

export default createStore(reducers,applyMiddleware(...middlewares))