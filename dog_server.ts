import {Mongoose} from 'mongoose'
import {Express} from 'express'
import * as BodyParser from 'body-parser';

var express: Express = require('express');
var app = express();

//var bodyParser = require('body-parser'); 

var mongoose:Mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dogs');

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));

var dogRoutes = require('./routes/dog.js')(app);

var server = app.listen(5000, function(){
    console.log('Server running at http://127.0.0.1:5000/');
})