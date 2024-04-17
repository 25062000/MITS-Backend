var clientService = require('./clientService.js');

var createClient = async (req, res) =>{
    try{
        console.log(req.body);
        var status = await clientService.createClientDB(req.body);
        console.log(status);

        if(status){
            res.send({ "status": true, "message": "Client created successfully"})
        }else{
            res.sedn({ "status": false, "message": "Error creating client"})
        }
    }catch(err){
        console.log(error);
    }
}

module.exports = { createClient };