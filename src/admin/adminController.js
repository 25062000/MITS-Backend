var adminService = require('./adminService')
const path = require('path');
const fs = require('fs');

var adminLogin = async (req, res) =>{
    var result = null;
    try{
        // console.log(req.body);
        result = await adminService.logInadminDB(req.body);
        if(result.status){
            res.send({ "status": true, "message": result.msg , "data": result.data});
        }else{
            res.send({ "status": false, "message": result.msg});
        }
    }catch(error){
        console.log(error);
        res.send({ "status": false, "message": error.msg});
    }
}

var uploadFiles = async(req, res, next)=> {
    try {
        const originalFilename = req.file.originalname;
        const filePath = path.join(__dirname, '../..', 'uploads', originalFilename); 

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.send({ "status": false, "message":'File does not exist'});
            } else {
                res.send({ 'status': true, "message":"Files uploaded successfully"});
            }
        });
    } catch (err) {
        next(err)
    } 
}

var getAllUploadedFiles = async(req, res) =>{
    try{
        var getDir = path.join(__dirname,'../..', 'uploads');
        var files = fs.readdirSync(getDir, {withFileTypes: true})
            .filter(item => !item.isDirectory())
            .map(item => item.name)
        res.send({ "status": true, "message": "Successfully", "data": files});

    }catch(error){
        res.send({ "status": false, "message": error});
    }
}

module.exports = { adminLogin, uploadFiles, getAllUploadedFiles };