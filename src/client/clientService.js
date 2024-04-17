var clientModel = require('./clientModel.js');
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.createClientDB = (clientDetails) =>{

    return new Promise(function myFn(resolve, reject){

        var clientModelData = new clientModel();

        clientModelData.name = clientDetails.name;
        clientModelData.email = clientDetails.email;
        var hashPassword = bcrypt.hash(clientDetails.password, saltRounds).then(hash => {hashPassword = hash; console.log("HashedPassword", hash)})
        clientModelData.password = hashPassword;

        clientModelData.save(function resultHandle(error, result){
            if(error){
               reject(false);
            }else{
                resolve(true);
            }
        });
    });
}





// function validateUser(hash) {
//     bcrypt
//       .compare(password, hash)
//       .then(res => {
//         console.log(res) // return true
//       })
//       .catch(err => console.error(err.message))        
// }