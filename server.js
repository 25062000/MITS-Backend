const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.set('strictQuery', false);
var routes = require('./route/routes.js');
const cors = require('cors');

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(
  {
    origin: "http://localhost:4200"
  }
));

app.listen(3000,function check(err)
{
    if(err)
    console.log("error")
    else
    console.log("started")
});



const uri = 'mongodb://localhost:27017/mits';

mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(routes);
