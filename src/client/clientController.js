var clientService = require('./clientService.js');
var path = require('path');
var fs = require('fs');

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

var getEncFiles = async(req, res) =>{
    try{
        var getDir = path.join(__dirname,'../..', 'uploads');
        var files = fs.readdirSync(getDir, {withFileTypes: true})
            .filter(item => !item.isDirectory())
            .map(item => item.name)
        res.send({ "status": true, "message": "Successfully", "data": files});

    }catch(error){
        res.send({"status":false, "message": error});
    }
}


var requestFiles = async(req, res) =>{
    try{
     
        var status = await clientService.createRequestDB(req.body);
        console.log("status",status);
        if(status){
            res.send({ "status": true, "message": "Requests Sent"})
        }else{
            res.sedn({ "status": false, "message": "Error sending requests"})
        }

    }catch(error){
        res.send({"status": false, "message": error});
    }
}

var getAllRequestedFiles = async(req, res) =>{
    try{
        result = await clientService.getAllRequestFiles();
        if(res.status){
            res.send({"status": true, "data": result});
        }else{
            res.send({"status": false, "message": result.message});
        }
    }catch(error){
        res.send({"status": false, "message":error.msg});
    }
}

var acceptRequestedFiles = async(req, res) =>{
    try{
        console.log(req.body);
        result = await clientService.acceptRequestedFiles(req.body);
        if(res.status){
            res.send({"status": true, "message":"Files are accepted"})
        }else{
            res.send({"status": false, "message":"Error occured"});
        }
    }catch(error){
        res.send({"status": false, "message": "Error occured while accepting files"});
    }
}

module.exports = { createClient, loginClient, getAllUserDetails, getEncFiles,
     requestFiles, getAllRequestedFiles, acceptRequestedFiles};