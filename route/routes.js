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
router.post('/client/getMapSources',setCurrentUser, isUser, clientController.getMapSource);
router.post('/client/getPermittedFiles',setCurrentUser, isUser, clientController.getPermittedFiles);
router.post('/client/singleUserDetails',setCurrentUser,isUser, clientController.singleUserDetails);
router.post('/client/removePermittedFiles', setCurrentUser, isUser, clientController.removePermittedFiles);


router.route('/admin/login').post(adminController.adminLogin)
router.get('/admin/allUser', setCurrentUser, isAdmin, clientController.getAllUserDetails);
router.post('/admin/uploadFiles', setCurrentUser, isAdmin, upload.single('logo'), adminController.uploadFiles);
router.get('/admin/getAllRequestedFiles',setCurrentUser, isAdmin, clientController.getAllRequestedFiles);
router.post('/admin/acceptRequestFiles', setCurrentUser, isAdmin,clientController.acceptRequestedFiles);
router.post('/admin/rejectRequestFiles',setCurrentUser, isAdmin, clientController.rejectRequestFiles);
router.get('/admin/getAllUploadedFiles', setCurrentUser, isAdmin, adminController.getAllUploadedFiles)
router.get('/getMap', clientController.getMap)

module.exports = router;