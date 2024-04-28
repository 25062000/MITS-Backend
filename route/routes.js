var express = require('express');
var clientController = require('../src/client/clientController.js');
var adminController = require('../src/admin/adminController.js');
const router = express.Router();
const { setCurrentUser, isAdmin, isUser} = require('../middleware/authMiddleware.js');

router.route('/client/login').post(clientController.loginClient)
router.route('/client/register').post(clientController.createClient)

router.route('/admin/login').post(adminController.adminLogin)
router.get('/admin/allUser', setCurrentUser, isAdmin, clientController.getAllUserDetails);

module.exports = router;