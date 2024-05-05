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
})

const client = mongoose.model('clients', clientSchema);

var requestsManagementSchema = new Schema({
    clientID:{
        type: MyObjectId, // Referencing the 'clients' collection
        ref: 'client',
        required: true
    },
    requestedFiles:{
        type: Array,
        required: true,
    }

})

const requestsManagement = mongoose.model('requestsManagement', requestsManagementSchema, 'requestsManagement');

// module.exports = mongoose.model('clients', clientSchema)

module.exports = { client, requestsManagement};