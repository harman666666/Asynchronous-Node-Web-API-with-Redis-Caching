 var mongoose: Mongoose = require('mongoose'); //We have to npm install this

import {Mongoose} from 'mongoose'

/*
npm install --save mongoose
typings install dt~mongoose --global --save

By default, NPM simply installs a package under node_modules. 
When you're trying to install dependencies for your app/module, 
you would need to first install them, and then add them (along with the appropriate version number) 
to the dependencies section of your package.json.
The --save option instructs NPM to include the package inside of the dependencies section of your 
package.json automatically, thus saving you an additional step.
*/

//We are going to make a schema to map a cat model to mongdo tables

var catSchema = new mongoose.Schema({ 
    //Used mongoose to define a schema, and pass it an object 
    //You can use booleans, dates, you can even reference other schemas, these are mongo types btw
    //Read the mongoose docs
    name: String,
    age: Number,
    type: String 
});

var Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;
//Then export it, name of model is going to be cat 


/*
Why USE Mongoose 

You can use mongodb client =>

var MongoClient = require('mongodb').MongoClient;

//Connnect to the db
MongoClient.connect("mongodb://localhost:27017/exampleDb",
function (err, db) {
    if(!err){
        console.log(We are connected");
    }
});

Because MongoDB is so eay to use, the basci Node.js driver can be the best solutin for many applications. However, 
if you need validations, associations, and other high-lvel data modeling functions, then an object document mapper may
be helpful. Use mongoose for validation, defaults, query builder, pseudo-joins, life-cycle managment. 
*/
