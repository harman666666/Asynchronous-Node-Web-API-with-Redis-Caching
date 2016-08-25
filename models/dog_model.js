"use strict";
var mongoose = require('mongoose'); //We have to npm install this
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
//We are going to make a schema to map a dog model to mongdo tables
var dogSchema = new mongoose.Schema({
    //Used mongoose to define a schema, and pass it an object 
    //You can use booleans, dates, you can even reference other schemas, these are mongo types btw
    //Read the mongoose docs
    name: String,
    age: Number,
    type: String
});
var dog = mongoose.model('dog', dogSchema);
module.exports = dog;
//Then export it, name of model is going to be dog 
