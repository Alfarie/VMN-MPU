
import express from 'express'
import {Router} from './router'

import store from '../../store'
import {setOperation} from '../../store/operation'

const {getState, dispatch} = store;

export default class AuthRouter extends Router {

    constructor(){
        super();
        this.router = express.Router()
        this.mountRoute()
    }
    
    private mountRoute(){
        this.router.post('/', (req,res) => {
            const {body} = req;
            dispatch(setOperation(body))
            res.json({msg: 'success'})
        });
        this.router.get('/', ({},res)=>{
            res.json(getState().operation)
        })
    }
}