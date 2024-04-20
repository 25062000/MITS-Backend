var express = require('express');

var clientController = require('../src/client/clientController.js');
var adminController = require('../src/admin/adminController.js');
const router = express.Router();

router.route('/client/login').post(clientController.loginClient)
router.route('/client/register').post(clientController.createClient)
router.route('/admin/login').post(adminController.adminLogin)

module.exports = router;