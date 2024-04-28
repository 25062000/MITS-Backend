const jwt = require('jsonwebtoken');
const secretKey ="8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp";

function setCurrentUser(req, res, next){
    // console.log("middelware executed");
    var token = req.header("Authorization");
    if (token && token.startsWith("Bearer ")){
        token = token.substring(7);
        try{
            var decodedToken = jwt.verify(token,secretKey)
            var decodedRole = decodedToken.role;
            if(decodedRole === "admin"){
                console.log(decodedRole);
                req.currentUser = decodedRole;
                next();
                return
            }else{
                req.currentUser = decodedRole;
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
        console.log("isAdminexecuted");
        next();
    }else{
        return res.status(401).json({message: "Unauthorized Admin request"});
    }
}

function isUser(req, res, next){
    if(req.currentUser && req.currentUser === "user"){
        next();
    }else{
        return res.status(401).json({message: "Unauthorized Admin request"});
    }
}

module.exports = { setCurrentUser, isAdmin, isUser };