var clientService = require('./clientService.js');
var path = require('path');
var fs = require('fs');
const { client } = require('./clientModel.js');
const { Worker, workerData } = require('node:worker_threads');
const { config } = require('./configfile.js') 

var createClient = async (req, res) =>{
    try{
        console.log(req.body);
        var status = await clientService.createClientDB(req.body);

        if(status){
            res.send({ "status": true, "message": "Client created successfully"})
        }else{
            res.send({ "status": false, "message": "Error creating client"})
        }
    }catch(err){
        console.log("err",err);
    }
}

var loginClient = async (req, res) =>{
    var result = null;
    try{
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
        var permittedFiles = await clientService.getPermittedFiles(req.body);
        var getDir = path.join(__dirname,'../..', 'uploads');
        var files = fs.readdirSync(getDir, {withFileTypes: true})
            .filter(item => !item.isDirectory())
            .map(item => item.name)
            .filter(fileName => !permittedFiles.includes(fileName));
     
        res.send({ "status": true, "message": "Successfully", "data": files});

    }catch(error){
        res.send({"status":false, "message": error});
    }
}


var requestFiles = async(req, res) =>{
    try{
        var status = await clientService.createRequestDB(req.body);
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
    var clientId = req.body.clientID._id;
    var requestedFiles = req.body.requestedFiles;
    requestedFiles.forEach(element => {
        var src = path.join(__dirname,'../..', 'uploads/',element);
        var destDir = path.join(__dirname,'../..', 'userData/',clientId, '/encData');
        var dest = path.join(destDir,'/',element)
        fs.mkdir(destDir, { recursive: true }, (err) => {
            if (err) throw err;
                fs.symlink(src, dest,(err)=>{
                    if(err) throw err;
                })
        })
    });
    ENC_DATA = path.join(__dirname,'../..', 'userData/',clientId,'/encData');
    ENC_SHAPE_FILE  = path.join(__dirname,'../..', 'userData/',clientId,'/shp/'); 
    fs.mkdir( ENC_SHAPE_FILE , { recursive: true }, (err) => {
        if (err) throw err;
    });
    ENC_MAP_FILE = path.join(__dirname,'../..', 'userData/',clientId,'/map/'); 
    fs.mkdir( ENC_MAP_FILE  , { recursive: true }, (err) => {
        if (err) throw err;
    });
    configuration = config.replace('ENC_CHART_DIRECTORY',ENC_DATA).replace('ENC_SHAPE_FILE',ENC_SHAPE_FILE ).replace('ENC_MAP_FILE',ENC_MAP_FILE);
    configPath='./submodules/SMAC-M/noaa/config.enc.noaa.toml';
    fs.writeFileSync(configPath, configuration);
    const worker = new Worker('./src/client/workerProcess.js', {workerData: req.body})
    worker.on('message', (message)=>{
        result = clientService.acceptRequestedFiles(req.body);
        if(res.status){
            res.send({"status": true, "message":"Files are accepted"})
        }else{
            res.send({"status": false, "message":"Error occured"});
        }
    })
    worker.on('error', (error) => {
        res.status(500).send('Internal Server Error');
    });
    
 }catch(error){
    res.send({"status": false, "message": "Error occured while accepting files"});
 }
}

var rejectRequestFiles = async(req, res) =>{
    try{
        console.log("RejectFiles",req.body);
        result = await clientService.rejectRequestFiles(req.body);
        if(res.status){
            res.send({"status": true, "message":"Files are rejected"})
        }else{
            res.send({"status": false, "message":"Error occured"});
        }
    }catch(error){
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

var getMapSource = async(req, res)=>{
    try{
        var srcFile = req.body.map(item => item.id+'.map');
        clientId = req.clientID;
        var getDir = path.join(__dirname,'../..', 'userData/',clientId,'/map/'); 
        var sourcefiles = srcFile;
        var srcPath = Promise.all(
            sourcefiles.map(item => new Promise(resolve => {
                var srcDir = path.join(getDir, item);
                if (fs.existsSync(srcDir)) {
                    resolve(srcDir);
                } else {
                    resolve(null);
                }
            }))
        );
        
        srcPath.then(results => {
            var sourcekey = ['chart-source',{
                'type': 'raster',
                'tiles': [results],
                'titeSize': 256
            }];
            var layerkey =[{
                'id':'chart-layer',
                'type':'raster',
                'source':'chart-source',
                'paint':{}
            },'building'];
            console.log(sourcekey);
            console.log(layerkey);
            console.log(results);
            // data={ sourcekey, layerkey, results;
            res.send({status:true, message:'Source accessed', sourcekey:sourcekey, layerkey:layerkey, data:results})
        });
    }catch(error){
        console.log(error);
        res.send({"status": false, "message": "Error occured while getting map source"});
    }
}

var removePermittedFiles = async(req, res)=>{
    var clientId = req.clientID;
    requestedFiles = req.body.requestedFiles;
    requestedFiles.forEach(element => {
        var destDir = path.join(__dirname,'../..', 'userData/',clientId, '/encData');
        var dest = path.join(destDir,'/',element)
        fs.mkdir(destDir, { recursive: true }, (err) => {
            if (err) throw err;
                fs.unlink(dest,(err)=>{
                    if(err) throw err;
                })
        })
       
    });
    ENC_DATA = path.join(__dirname,'../..', 'userData/',clientId,'/encData');
    ENC_SHAPE_FILE  = path.join(__dirname,'../..', 'userData/',clientId,'/shp/'); 

    ENC_MAP_FILE = path.join(__dirname,'../..', 'userData/',clientId,'/map/'); 
 
    configuration = config.replace('ENC_CHART_DIRECTORY',ENC_DATA).replace('ENC_SHAPE_FILE',ENC_SHAPE_FILE ).replace('ENC_MAP_FILE',ENC_MAP_FILE);
    configPath='./submodules/SMAC-M/noaa/config.enc.noaa.toml';
    fs.writeFileSync(configPath, configuration);
    const worker = new Worker('./src/client/workerProcess.js', {workerData: req.body})
    worker.on('message', (message)=>{
        result = clientService.removePermittedFiles(req.body, req.clientID);
        if(res.status){
            res.send({"status": true, "message":"Files are removed"})
        }else{
            res.send({"status": false, "message":"Error occured"});
        }
    })
    worker.on('error', (error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    });
}

module.exports = { createClient, loginClient, getAllUserDetails, getEncFiles,
     requestFiles, getAllRequestedFiles, acceptRequestedFiles, rejectRequestFiles,getPermittedFiles,
      singleUserDetails, getMapSource, removePermittedFiles};