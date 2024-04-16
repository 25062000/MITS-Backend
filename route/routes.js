var express = require('express');

var clientController = require('../src/client/clientController.js');
const router = express.Router();

// router.route('/login').post(clientController.loginClient)
router.route('/register').post(clientController.createClient)

module.exports = router;