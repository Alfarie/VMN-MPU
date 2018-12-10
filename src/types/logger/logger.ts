import DataBase from './database'
export default abstract class Logger { 
    db:DataBase
    constructor(){
        this.db = new DataBase();
    }
    abstract log(json:any):void;
    abstract createTable():void;
}
