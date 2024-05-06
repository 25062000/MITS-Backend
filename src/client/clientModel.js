const { request } = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const MyObjectId = mongoose.Types.ObjectId;

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
    }, 
    
    requests:{
        type: Array
    }
})

const client = mongoose.model('clients', clientSchema);

var requestsManagementSchema = new Schema({
    clientID:{
        type: MyObjectId, // Referencing the 'clients' collection
        ref: 'clients',
        required: true
    },
    requestedFiles:{
        type: Array,
    }

})

const requestsManagement = mongoose.model('requestsManagement', requestsManagementSchema, 'requestsManagement');

module.exports = { client, requestsManagement};