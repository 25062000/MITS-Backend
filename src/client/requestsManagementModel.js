var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var requestsManagementSchema = new Schema({
    clientID:{
        type: String,
        required: true
    },
    requestedFiles:{
        type: Array,
        required: true,
    }

})

module.exports = mongoose.model('requestsManagement', requestsManagementSchema, 'requestsManagement');