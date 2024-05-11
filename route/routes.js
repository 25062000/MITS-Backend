var express = require('express');
var clientController = require('../src/client/clientController.js');
var adminController = require('../src/admin/adminController.js');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { setCurrentUser, isAdmin, isUser} = require('../middleware/authMiddleware.js');
const { client } = require('../src/client/clientModel.js');

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
router.post('/client/getEncFiles', setCurrentUser, isUser, clientController.getEncFiles);
router.post('/client/requestFiles',setCurrentUser, isUser, clientController.requestFiles),
router.post('/client/getMapSource',setCurrentUser, isUser, clientController.getMapSource);
router.post('/client/getPermittedFiles', clientController.getPermittedFiles);
router.post('/client/singleUserDetails', clientController.singleUserDetails);


router.route('/admin/login').post(adminController.adminLogin)
router.get('/admin/allUser', setCurrentUser, isAdmin, clientController.getAllUserDetails);
router.post('/admin/uploadFiles', setCurrentUser, isAdmin, upload.single('logo'), adminController.uploadFiles);
router.get('/admin/getAllRequestedFiles', clientController.getAllRequestedFiles);
router.post('/admin/acceptRequestFiles', clientController.acceptRequestedFiles);
router.post('/admin/rejectRequestFiles', clientController.rejectRequestFiles);


module.exports = router;