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
        console.log(req.file);
        const originalFilename = req.file.originalname;
        console.log('Uploaded filename:', originalFilename);
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
module.exports = { adminLogin, uploadFiles };