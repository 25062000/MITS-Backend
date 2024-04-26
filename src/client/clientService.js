var clientModel = require('./clientModel.js');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const saltRounds = 10;

module.exports.createClientDB = (clientDetails) =>{

    console.log("ClientDetails", clientDetails);

    return new Promise(function myFn(resolve, reject){

        var clientModelData = new clientModel();
        var hashPassword;
        clientModelData.name = clientDetails.name;
        clientModelData.email = clientDetails.email;
        bcrypt.hash(clientDetails.password, saltRounds)
        .then(hash => {
            clientModelData.password = hash; 


            clientModelData.save()
                .then(result => {
                    resolve(true);
                })
                .catch(error => {
                    console.log("Servicefile", error)
                    reject(false);
            });
        })
        .catch(error => {
            console.log("Bcrypt",error);
            reject(false)
        });

    });
}


module.exports.logInClientDB = (clientDetails) =>{
    return new Promise(function myFn(resolve, reject){
        clientModel.findOne({email: clientDetails.email})
            .then(result =>{
                if(result != undefined && result!=null){
                    bcrypt.compare(clientDetails.password, result.password)
                        .then(compare => {
                            if (compare) {
                                let token;
                                try{
                                    token = jwt.sign({
                                        clientID: result.id,
                                        email:result.email,
                                        role:'user'
                                    },"8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp",  { expiresIn: "1h" });
                                    resolve({ status: true, msg: "Employee Validated Successfully", data: { clientID: result.id, email: result.email, token: token, role: 'user'} });
                                }catch(error){
                                    reject({ status: false, msg: "Error while creating JWT"});
                                };
                                
                            } else {
                                reject({ status: false, msg: "Employee Validation failed" });
                            }
                        })
                        .catch(error => {
                            reject({ status: false, msg: "Internal Server Error" });
                        });
                   
                }else{
                    reject({ status: true, msg:"Invalid Employee Credentials"});
                }
            })
            .catch(error =>{
                console.log(error);
                reject({ status: false, msg: "Invalid Data"});
            })
 
    })
}


module.exports.getAllUsersDB = ()=>{
    return new Promise( function myFun(resolve, reject){
        clientModel.find().then(result =>{
            resolve(result);
        }).catch(error=>{
            console.log(error);
            reject({ status: false, msg:"Error occured"});
        });
    })
}


