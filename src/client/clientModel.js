var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientSchema = new Schema({
    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true
    }
})

var requestsManagementSchema = new Schema({
    clientID:{
        type: String, // Referencing the 'clients' collection
        required: true
    },
    requestedFiles:{
        type: Array,
        required: true,
    }

})

const client = mongoose.model('clients', clientSchema);
const requestsManagement = mongoose.model('requestsManagement', requestsManagementSchema, 'requestsManagement');

// module.exports = mongoose.model('clients', clientSchema)

module.exports = { client, requestsManagement};