const jwt = require('jsonwebtoken');
const secretKey ="8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp";
const multer = require('multer');

function setCurrentUser(req, res, next){
    var token = req.header("Authorization");
    if (token && token.startsWith("Bearer ")){
        token = token.substring(7);
        try{
            var decodedToken = jwt.verify(token,secretKey)
            var decodedRole = decodedToken.role;
            var clientID = decodedToken.clientID;
            if(decodedRole === "admin"){
                req.currentUser = decodedRole;
                next();
                return
            }else{
                req.currentUser = decodedRole;
                req.clientID = clientID;
                next();
                return
            }

        }catch(error){
            return res.status(401).json({ message: "Unauthorized" });
        }
    }else{
        return res.status(401).json({ message: "Unauthorized" });
    }
}

function isAdmin(req, res, next){
    if(req.currentUser && req.currentUser === "admin"){
        next();
    }else{
        return res.status(401).json({message: "Unauthorized Admin request"});
    }
}

function isUser(req, res, next){
    if(req.currentUser && req.currentUser === "user" || req.currentUser === "admin"){
        next();
    }else{
        return res.status(401).json({message: "Unauthorized Admin request"});
    }
}

module.exports = { setCurrentUser, isAdmin, isUser};