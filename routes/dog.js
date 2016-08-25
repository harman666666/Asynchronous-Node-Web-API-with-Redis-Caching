"use strict";
var _ = require('lodash');
var dog = require('../models/dog_model.js');
module.exports = function (app) {
    /* Create */
    app.post('/dog', function (req, res) {
        var newdog = new dog(req.body); //declare model
        newdog.save(function (err) {
            //happened
            //If i do this save and callback function has an error, 
            if (err) {
                res.json({ info: 'error during dog create', error: err });
            }
            res.json({ info: 'dog create succesfully' });
        });
    });
    /*After posting a dog we get,
    
    {
  "info": "dogs found succesfully",
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
    //Use dog model to query the database
    app.get('/dog', function (req, res) {
        dog.find(function (err, dogs) {
            //runs function whether or not it is found
            if (err) {
                res.json({ info: 'error during find dogs', error: err });
            }
            setTimeout(function () {
                res.json({ info: 'dogs found succesfully', data: dogs }); //Wait 10 seconds then run callback
            }, 10000);
            //Now dog is slow because it takes 10 seconds for browser to actually get back the response
            //This slowdown in the server also causes the pet server to be slow because the pet server will also
            //take 10 seconds
            //You can see though that even though it takes the pet server 10 seconds because of slow dog server,
            //however if you keep hitting the ping endpoint while you are waiting, for that 10 second request to complete
            //the ping endpoint will actually return a response, so even though one client might be waiting 10 seconds to
            //get response back, b/c of the asynchronous nature of node, we can keep serving requests on the side
            //to other clients
            //AND THIS IS NON BLOCKING, THE SLOW GET REQUEST WONT STOP PING REQUEST FROM BEING HIT
            //BUT HOWEVER, SAY YOU DO COMPLICATED CALCULATIONS IN THAT SLOW GET REQUEST IN THE PET SERVER ITSELF, For
            //instnace in the callback function, THAT 
            //WILL BE BLOCKING BECAUSE THE NODE SINGLE EVENT LOOP WILL HAVE TO GO THROUGH THAT COMPLICATED CALCULATION
            //STOPPING IT FROM SERVING OTHER REQUESTS IN THAT EVENT LOOP THAT ARE BEING CALLED
            //SO DONT DO COMPLICATED STUFF IN THE MAIN SERVER, DELEGATE THIS TO THE backened services, because then the
            //event loop will not be blocked by it
            /*
            For deployment, do this to increase efficiency:

            Cat Server and Dog Server will live in the background, and have several pet servers. Scaling issues.
            Just remember to use 12 factor design
            4 processers, 4 pet servers, all the same code running on different processes, and then each of them is hitting
            the same dog and cat server another process, but then you got an HA Proxy (High availability) which lets you
            load balance and prox between those

            The browser is still talking to one guy, the HA Proxy, whose then talking to the 4 different pet servers
            to get to dog and cat, but if one particular response, pet server is getting hit really hard, it still
            has somewhere to go

            Also to hit these slow legacy back end services fewer times, we use redis caching to improve performance
            */
            /*
            Observer asynchronous nature of node
            
            */
        });
    });
    app.get('/dog/:id', function (req, res) {
        dog.findById(req.params.id, function (err, dog) {
            //pass parameters of id, will look for id in dogs database
            if (err) {
                res.json({ info: 'error during find dog', error: err });
            }
            ;
            if (dog) {
                res.json({ info: 'dog found successfully', data: dog });
            }
            else {
                res.json({ info: "dog not found" });
            }
        });
    });
    /* Update */
    app.put('/dog/:id', function (req, res) {
        //When you create a new object in Mongo, you will get a new id
        dog.findById(req.params.id, function (err, dog) {
            if (err) {
                res.json({ info: 'error during find dog', error: err });
            }
            ;
            if (dog) {
                _.merge(dog, req.body);
                dog.save(function (err) {
                    if (err) {
                        res.json({ info: 'error during dog update', error: err });
                    }
                    else {
                        res.json({ info: 'dog updated succesfully' });
                    }
                });
            }
            else {
                res.json({ info: 'dog not found' });
            }
        });
    });
    /* Delete */
    app.delete('/dog/:id', function (req, res) {
        dog.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.json({ info: 'error during remove dog', error: err });
            }
            ;
            res.json({ info: 'dog removed successfully' });
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
then 'use dogs;'
then 'show collections'
then type 'db.dogs.find()' <= Mongo Command gets all of the dogs
type 'db.dogs.find({name : 'john'})' <= finds all the dogs with the name John
type 'db.getCollection('dogs').find({name: "carol", age: 35})' <= finds all dogs with the name carol AND age 35
You can shard mongo, take one database and push it off into different servers

*/ 
