var express = require('express');
var clientController = require('../src/client/clientController.js');
var adminController = require('../src/admin/adminController.js');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { setCurrentUser, isAdmin, isUser} = require('../middleware/authMiddleware.js');

const uploadDir = path.join(__dirname,'..', 'uploads');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdir(uploadDir,(err)=>{
            cb(null, uploadDir);
         });
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});

const upload =multer({storage: storage});

router.route('/client/login').post(clientController.loginClient)
router.route('/client/register').post(clientController.createClient)

router.route('/admin/login').post(adminController.adminLogin)
router.get('/admin/allUser', setCurrentUser, isAdmin, clientController.getAllUserDetails);
router.post('/admin/uploadFiles', setCurrentUser, isAdmin, upload.single('logo'), adminController.uploadFiles);
module.exports = router;