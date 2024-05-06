const { client, requestsManagement } = require('./clientModel.js');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const mongoose = require('mongoose');

module.exports.createClientDB = (clientDetails) =>{

    console.log("ClientDetails", clientDetails);

    return new Promise(function myFn(resolve, reject){

        var clientModelData = new client();
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
        client.findOne({email: clientDetails.email})
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
        client.find().then(result =>{
            resolve(result);
        }).catch(error=>{
            console.log(error);
            reject({ status: false, msg:"Error occured"});
        });
    })
}

module.exports.createRequestDB = (requestedFiles) =>{
    return new Promise(function myFn(resolve, reject){

        requestsManagement.findOne({ clientID: requestedFiles.clientID })
        .then(existingDocument => {
            if (existingDocument) {
                return requestsManagement.updateOne(
                    { _id: existingDocument._id },
                    { $addToSet: { requestedFiles: { $each: requestedFiles.requestedFiles } } }
                );
            } else {
                var requestModelData = new requestsManagement({
                    clientID: requestedFiles.clientID,
                    requestedFiles: requestedFiles.requestedFiles
                });
                return requestModelData.save();
            }
        }).then(result => {
                resolve(true);
            })
            .catch(error => {
                console.log("Servicefile", error)
                reject(false);
        });
    });
}

module.exports.getAllRequestFiles = () =>{
    return new Promise( function myFun(resolve, reject){
        requestsManagement.find().populate('clientID', 'name email').then( result =>{
            resolve(result);
        }).catch(error => {
            console.log("Servicefile", error)
            reject(false);
        });
    })
}

module.exports.acceptRequestedFiles = (filesWantToAccept) => {
    return new Promise((resolve, reject) => {
        client.updateOne({ _id: filesWantToAccept.clientID}, { $set: { requests: filesWantToAccept.requestedFiles  } })
            .then(result => {
                return requestsManagement.updateOne(
                    { clientID: filesWantToAccept.clientID,
                    "requestedFiles.name": { $in: filesWantToAccept.requestedFiles }
                     },
                    { $pull: { requestedFiles: { name: { $in: filesWantToAccept.requestedFiles } }}}
                );
            })
            .then(result => {
                resolve(true);
            })
            .catch(error => {
                console.log(error);
                reject(false);
            });
    });
};


module.exports.rejectRequestFiles = (filesWantToReject) =>{
    return new Promise((resolve, reject) =>{
        requestsManagement.updateOne({
            clientID: filesWantToReject.clientID,
            "requestedFiles.name": { $in: filesWantToReject.requestedFiles}
        }, { $pull: { requestedFiles: { name: { $in: filesWantToReject.requestedFiles } }}}
        ).then(result => {
            console.log("RequestsManagement document updated successfully:", result);
            resolve(true);
        })
        .catch(error => {
            console.log(error);
            reject(false);
        });
    })
};


module.exports.getPermittedFiles=(clientID)=>{
    const objectIdString = clientID.clientID;       
    const objectId = new mongoose.Types.ObjectId(objectIdString);
    return new Promise((resolve, reject)=>{
        client.findOne({_id: objectId}).then(result =>{
            resolve(result.requests);
        }).catch(error =>{
            console.log(error);
            reject(false);
        })
    })
};
