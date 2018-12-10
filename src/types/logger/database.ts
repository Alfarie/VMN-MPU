import * as sqlite from 'sqlite3'
import path from 'path'
import fs from 'fs'
const sqlite3 = sqlite.verbose()

export default class Database { 
    dbDir: string = path.join(path.resolve(__dirname, '../../../../DB'));
    dbPath: string = this.dbDir + '/db.db';
    db: any;
    constructor(){
        if( !fs.existsSync(this.dbDir)){
            fs.mkdirSync(this.dbDir);
        }
        this.db = this.connect();
    }

    public async exec(data:string) {
        return new Promise((resolve, reject) => {
            this.db.run(data, err => {
                if (err) reject(err.message);
                resolve('Exec success')
            })
        })
    }

    public async execParams(sql:string, params: any[]){
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, (err) => {
                if (err){ 
                    reject(err)
                };
                resolve()
            })
        })
    }

    public getDB(){
        return this.db;
    }

    private connect():any {
        var db = new sqlite3.Database(this.dbPath);
        return db;
    }
}