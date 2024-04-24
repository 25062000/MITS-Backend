var clientService = require('./clientService.js');

var createClient = async (req, res) =>{
    try{
        console.log(req.body);
        var status = await clientService.createClientDB(req.body);
        console.log("status",status);

        if(status){
            res.send({ "status": true, "message": "Client created successfully"})
        }else{
            res.sedn({ "status": false, "message": "Error creating client"})
        }
    }catch(err){
        console.log("err",err);
    }
}

var loginClient = async (req, res) =>{
    var result = null;
    try{
        console.log(req.body);
        result = await clientService.logInClientDB(req.body);
        if(result.status){
            res.send({ "status": true, "message": result.msg, "data": result.data });
        }else{
            res.send({ "status": false, "message": result.msg});
        }
    }catch(error){
        console.log(error);
        res.send({ "status": false, "message": error.msg});
    }
}

var getAllUserDetails = async(req, res) =>{
    try{
        result = await clientService.getAllUsersDB();
        if(res.status){
            res.send({"status": true, "data": result});
        }else{
            res.send({"status": false, "message": result.message});
        }
    }catch(error){
        res.send({"status": false, "message":error.msg});
    }
}

module.exports = { createClient, loginClient, getAllUserDetails };