import AWSIOT from './aws-iot'

export default class AWSManager {
    machineId:string;
    awsIot:AWSIOT
    constructor(){
        this.init()
    }

    private async init(){
        this.awsIot = new AWSIOT()
    }
}