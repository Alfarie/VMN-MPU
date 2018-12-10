
import express from 'express'
import {Router} from './router'
import { JWTHandler } from '../jwt';
export default class AuthRouter extends Router {
    private authData: any;
    private jwtHandler: JWTHandler;

    constructor(){
        super();
        this.name = '/auth/'
        this.authData = {
            "username": "grobot-vmn@agrointelligence.com",
            "password": "raspberry"
        }
        this.jwtHandler = new JWTHandler()
        this.router = express.Router()
        this.mountRoute()
    }

    
    private mountRoute(){
        this.router.post('/signin', (req,res) => {
            /*
                {
                    username: ....,
                    password: ....
                }
            */
           var ad = req.body;
           console.log(ad);
           if(this.authData.username == ad.username && this.authData.password == ad.password){
                var tokenId = this.jwtHandler.sign(this.authData)
                console.log(this.authData);
                res.json({
                    username: this.authData.username,
                    tokenId: tokenId,
                    message: 'Authentication Successful',
                    success: true,
                    expiresIn: this.jwtHandler.expiresIn
                })
           }else{
               res.status(401).json({
                   success: false,
                   message: 'Authentication Fail'
               })
           }
        });
    }
}