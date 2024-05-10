var clientService = require('./clientService.js');
var path = require('path');
var fs = require('fs');
const { client } = require('./clientModel.js');
const { Worker, workerData } = require('node:worker_threads');

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
        console.log(req.body);
        var permittedFiles = await clientService.getPermittedFiles(req.body);
        console.log("Permitted Files", permittedFiles);
        var getDir = path.join(__dirname,'../..', 'uploads');
        var files = fs.readdirSync(getDir, {withFileTypes: true})
            .filter(item => !item.isDirectory())
            .map(item => item.name)
            .filter(fileName => !permittedFiles.includes(fileName));
        console.log("Get Enc files", files);
     
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

// var acceptRequestedFiles = async(req, res) =>{
//     try{
//         console.log("Accept",req.body);
//         result = await clientService.acceptRequestedFiles(req.body);
//         if(res.status){
//             var clientId =req.body.clientID._id;
//             var requestedFiles = req.body.requestedFiles;
//             console.log("RF", requestedFiles);
//             requestedFiles.forEach(element => {
//                 var src = path.join(__dirname,'../..', 'uploads/',element);
//                 var destDir = path.join(__dirname,'../..', 'userData/',clientId);
//                 var dest = path.join(destDir,'/',element)
//                 fs.mkdir(destDir, { recursive: true }, (err) => {
//                     if (err) throw err;
//                     fs.symlink(src, dest,(err)=>{
//                         if(err) throw err;
//                     })
//                 })
//             });
//             res.send({"status": true, "message":"Files are accepted"})
//         }else{
//             res.send({"status": false, "message":"Error occured"});
//         }
//     }catch(error){
//         res.send({"status": false, "message": "Error occured while accepting files"});
//     }
// }

var acceptRequestedFiles = async(req, res) =>{
 try{
    const worker = new Worker('./src/client/workerProcess.js', {workerData: req.body})
    worker.on('message', (message)=>{
        console.log(message);
    })
    worker.on('error', (error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    });
    result = await clientService.acceptRequestedFiles(req.body);
            if(res.status){
                var clientId =req.body.clientID._id;
                var requestedFiles = req.body.requestedFiles;
                console.log("RF", requestedFiles);
                requestedFiles.forEach(element => {
                    var src = path.join(__dirname,'../..', 'uploads/',element);
                    var destDir = path.join(__dirname,'../..', 'userData/',clientId);
                    var dest = path.join(destDir,'/',element)
                    fs.mkdir(destDir, { recursive: true }, (err) => {
                        if (err) throw err;
                        fs.symlink(src, dest,(err)=>{
                            if(err) throw err;
                        })
                    })
                });
                res.send({"status": true, "message":"Files are accepted"})
            }else{
                res.send({"status": false, "message":"Error occured"});
            }
 }catch(error){
    console.log(error);
    res.send({"status": false, "message": "Error occured while accepting files"});
 }
}

var rejectRequestFiles = async(req, res) =>{
    try{
        console.log("RejectFiles",req.body);
        result = await clientService.rejectRequestFiles(req.body);
        console.log(result);
        if(res.status){
            res.send({"status": true, "message":"Files are rejected"})
        }else{
            res.send({"status": false, "message":"Error occured"});
        }
    }catch(error){
        console.log(error);
        res.send({"status": false, "message": "Error occured while rejecting files"});
    }
};

var getPermittedFiles = async(req, res) =>{
    try{
        result = await clientService.getPermittedFiles(req.body);
        if(res.status){
            res.send({"status": true, "message":"Permitted files", "data": result})
        }else{
            res.send({"status": false, "message":"Error occured"});
        }
    }catch(error){
        console.log(error);
        res.send({"status": false, "message": "Error occured while getting permitted files"});
    }
}

var singleUserDetails = async(req, res) =>{
    try{
        result = await clientService.singleUserDetails(req.body);
        if(res.status){
            res.send({"status": true, "message":"User Found", "data": result})
        }else{
            res.send({"status": false, "message":"Error occured"});
        }
    }catch(error){
        console.log(error);
        res.send({"status": false, "message": "Error occured while getting user details"});
    }
}

module.exports = { createClient, loginClient, getAllUserDetails, getEncFiles,
     requestFiles, getAllRequestedFiles, acceptRequestedFiles, rejectRequestFiles,getPermittedFiles, singleUserDetails};