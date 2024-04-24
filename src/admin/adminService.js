var adminModel = require('./adminModel.js');
var jwt = require('jsonwebtoken');

module.exports.logInadminDB = (clientDetails) =>{
  
    return new Promise(function myFn(resolve, reject){
        adminModel.findOne({email: clientDetails.email})
            .then(result =>{
               
                if(result != undefined && result!=null){

                    if (clientDetails.password == result.password) {
                        try{
                            token = jwt.sign({
                                userID: result.id,
                                email:result.email
                            },"8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp",  { expiresIn: "1h" });
                            resolve({ status: true, msg: "Validated Successfully", data: { userId: result.id, email: result.email, accesToken: token} });
                        }catch(error){
                            reject({ status: false, msg: "Error while creating JWT"});
                        };
                        
                    } else {
                        reject({ status: false, msg: "Invalid Credentials" });
                    }
                   
                }else{
                    reject({ status: true, msg:"No admin found"});
                }
            })
            .catch(error =>{
                console.log(error);
                reject({ status: false, msg: "Invalid Data"});
            })
 
    })
}