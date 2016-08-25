import {Mongoose} from 'mongoose'
import {Express} from 'express'
import * as BodyParser from 'body-parser';

var express: Express = require('express');
var app = express();

//var bodyParser = require('body-parser'); 

//This server doesnt even need to connect to mongoose cause we are not using from the database,
//we are aggregating from cat and dog server

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));

var petRoutes = require('./routes/pet.js')(app);

var server = app.listen(6500, function(){
    console.log('Server running at http://127.0.0.1:6500/');
})

/*
Going to start using Forever
npm install -g Forever
forever basically runs the process as a daemon 
A daemon is a long-running background process that answers requests for services. 
The term originated with Unix, but most operating systems use daemons in some form or another.

You can look to see to log the files out, and itll constantly restart it if the server crashes
nodemon => constantly restart the server when the file changes

To use forever, first do, 
'forever list' => To check if any processes are running
'forever help'
'forever dog_server.js'
'forever start dog_server.js'
'forever start cat_server.js' => can be done on same terminal 
'forever list'
'forever stop {pid}'
'forever restartall'
'forever restart 1885' <= 1885 is the pid

Lets use nodemon for pet server

 */