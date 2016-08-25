"use strict";
var _ = require('lodash');
var Cat = require('../models/cat_model.js');
module.exports = function (app) {
    /* Create */
    app.post('/cat', function (req, res) {
        var newCat = new Cat(req.body); //declare model
        newCat.save(function (err) {
            //happened
            //If i do this save and callback function has an error, 
            if (err) {
                res.json({ info: 'error during cat create', error: err });
            }
            res.json({ info: 'cat create succesfully' });
        });
    });
    /*After posting a cat we get,
    
    {
  "info": "cats found succesfully",
  "data": [
    {
      "_id": "57bc424270a5e1e0244b14b8",
      "name": "lilly",
      "age": 7,
      "type": "foobbb",
      "__v": 0
    },
    {
      "_id": "57bc427670a5e1e0244b14b9", //unique id like a primary key
      "name": "lilly",
      "age": 7,
      "__v": 0 //This is the version, multiple versions of the same object
    }
  ]
}
     */
    /* Read */
    //Use Cat model to query the database
    app.get('/cat', function (req, res) {
        Cat.find(function (err, cats) {
            //runs function whether or not it is found
            if (err) {
                res.json({ info: 'error during find cats', error: err });
            }
            res.json({ info: 'cats found succesfully', data: cats });
        });
    });
    app.get('/cat/:id', function (req, res) {
        Cat.findById(req.params.id, function (err, cat) {
            //pass parameters of id, will look for id in cats database
            if (err) {
                res.json({ info: 'error during find cat', error: err });
            }
            ;
            if (cat) {
                res.json({ info: 'cat found successfully', data: cat });
            }
            else {
                res.json({ info: "cat not found" });
            }
        });
    });
    /* Update */
    app.put('/cat/:id', function (req, res) {
        //When you create a new object in Mongo, you will get a new id
        Cat.findById(req.params.id, function (err, cat) {
            if (err) {
                res.json({ info: 'error during find cat', error: err });
            }
            ;
            if (cat) {
                _.merge(cat, req.body);
                cat.save(function (err) {
                    if (err) {
                        res.json({ info: 'error during cat update', error: err });
                    }
                    else {
                        res.json({ info: 'cat updated succesfully' });
                    }
                });
            }
            else {
                res.json({ info: 'cat not found' });
            }
        });
    });
    /* Delete */
    app.delete('/cat/:id', function (req, res) {
        Cat.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.json({ info: 'error during remove cat', error: err });
            }
            ;
            res.json({ info: 'cat removed successfully' });
        });
    });
};
//For typings, use ts-node
/*

npm install -g ts-node
 
# Install a TypeScript compiler (requires `typescript` by default).
npm install -g typescript

# Execute a script as you world normally with `node`.
ts-node script.ts
 
# Starts the TypeScript REPL.
ts-node
 
# Execute code with TypeScript.
ts-node -e 'console.log("Hello, world!")'
 
# Execute, and print, code with TypeScript.
ts-node -p '"Hello, world!"'
 
# Pipe scripts to execute with TypeScript.
echo "console.log('Hello, world!')" | ts-node

Or make a tsconfig file and put this:

{
    "compilerOptions": {
        "emitDecoratorMetadata": true,
        "module": "commonjs",
        "target": "ES5",
        "outDir": "./",
        "rootDir": "./"
    }
}


and then type tsc -w to autocompile to javascript

MONGO TERMINAL KONGFU

start Mongo
type 'show dbs' to show all the databases
then 'use cats;'
then 'show collections'
then type 'db.cats.find()' <= Mongo Command gets all of the cats
type 'db.cats.find({name : 'john'})' <= finds all the cats with the name John
type 'db.getCollection('cats').find({name: "carol", age: 35})' <= finds all cats with the name carol AND age 35
You can shard mongo, take one database and push it off into different servers

*/ 
