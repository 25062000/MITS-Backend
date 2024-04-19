var clientModel = require('./clientModel.js');
const bcrypt = require("bcrypt");
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
                                resolve({ status: true, msg: "Employee Validated Successfully" });
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


