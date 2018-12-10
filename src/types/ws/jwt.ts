import jwt from 'jsonwebtoken'

export class JWTHandler {
    public secret:String = 'ThisIsSecretMessageIntelAgro'
    public expiresIn: Number  = 3600;

    public sign(payload){
        var tokenId = jwt.sign(payload, this.secret , {
            expiresIn: this.expiresIn
        });
        return tokenId;
    }

    public async verify(tokenId){
        return new Promise( (resolve, reject)=>{
            jwt.verify(tokenId, this.secret, function(err, decoded) {
                if(err){
                    reject(err);
                }
                else{
                    resolve(decoded);
                }
            })
        })
        
    }
    public setSecret(secret:String){
        this.secret = secret
    }
    public setExpiresIn(expiresIn:Number){
        this.expiresIn = expiresIn
    }
}