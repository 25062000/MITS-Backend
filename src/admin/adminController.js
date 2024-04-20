var adminService = require('./adminService')

var adminLogin = async (req, res) =>{
    var result = null;
    try{
        console.log(req.body);
        result = await adminService.logInadminDB(req.body);
        if(result.status){
            res.send({ "status": true, "message": result.msg });
        }else{
            res.send({ "status": false, "message": result.msg});
        }
    }catch(error){
        console.log(error);
        res.send({ "status": false, "message": error.msg});
    }
}

module.exports = { adminLogin };