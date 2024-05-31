const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.set('strictQuery', false);
var routes = require('./route/routes.js');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const {exec} = require('child_process');
const axios = require("axios");
// var admin = require('./src/admin/adminModel.js');
// const middleware = require('./middleware/authMiddleware.js');

const app = express()
// app.use(multer({dest:__dirname+'/uploads/'}).any());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(
  {
    origin: ["http://localhost:4200", "http://localhost:8080"]
  }
));

// var allowedOrigins = ['http://localhost:4200',
//                       'http://localhost:8080'];
// app.use(cors({
//   origin: function(origin, callback){
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));


// const corsOptions = {   origin: "*",   methods:
// "GET,HEAD,PUT,PATCH,POST,DELETE",   allowedHeaders:
//     "Access-Control-Allow-Headers,Access-Control-Allow-Origin,Access-Control-Request-Method,Access-Control-Request-Headers,Origin,Cache-Control,Content-Type,X-Token,X-Refresh-Token",   credentials: true,   preflightContinue: false,  
// optionsSuccessStatus: 204 };

// app.use(cors(corsOptions))


exec('echo "12345" | sudo -S docker run -d -t -v .:/u02 -v /home:/home -u:1000:1000 -p 8080:80 mapserver/mapserver:v7.0.4',(error,stdout,stderr)=>{
  if(error){
    console.log(error.message);
    return;
  }

  if(stderr){
    console.log(stderr);
    return;
  }

  console.log(stdout);
});

app.listen(3000,function check(err)
{
    if(err)
      console.log("error");
    else
      console.log("started");
});


const uri = process.env.MONGODB_URI;
console.log("uri", uri);
mongoose.connect(uri) 
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a new user document
// const adminData = new admin({
//   name: 'Admin',
//   email: 'admin123@gmail.com',
//   password: 'Admin@123'
// });

// admin.create(adminData)
//       .then(admin => {
//         console.log('Admin data inserted successfully:', admin);
//         // mongoose.connection.close();
//       })
//       .catch(error => {
//         console.error('Error inserting admin data:', error);
//         // mongoose.connection.close();
//       });

// app.use(middleware.setCurrentUser)
app.use(routes);
