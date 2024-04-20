var adminModel = require('./adminModel.js')

module.exports.logInadminDB = (clientDetails) =>{
  
    return new Promise(function myFn(resolve, reject){
        adminModel.findOne({email: clientDetails.email})
            .then(result =>{
               
                if(result != undefined && result!=null){

                    if (clientDetails.password == result.password) {
                        resolve({ status: true, msg: "Validated Successfully" });
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