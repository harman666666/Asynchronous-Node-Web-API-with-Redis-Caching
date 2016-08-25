import {Express} from 'express';
import {Request} from 'request';
import * as Async from 'async';
import * as Redis from 'redis'; //The pet server is going to cache the data
                               //npm install --save redis

import * as AllOfRequestModule from 'request';

//This is the javascript way
var r = require('request').defaults({ //Please install this => npm install --save request
    json: true //When you are sending data, send it out as json
    //Look at docs for headers, authentication: https://github.com/request/request
    //You can also use request for web scrapes to scrape a site, get information about it, web request
    //Node version of postman set headers, other stuff, process data
});

//This is the typescript way, also you cant do it this way by using the Request from the second import. Need AllOfRequest
//Has Intellisense
//Both r and R do the same thing though
var R = AllOfRequestModule.defaults(
    {
        json: true
    });

//Create Client for Redis, attach port 6379 to our local host
var client = Redis.createClient(6379, '127.0.0.1');//Default port number for redis is 6379                     

//Request allows me to go and make http calls or request out calls to secondary servers, so I am going to make requests
//from my pet server to go out to my other servers, send those requests come back and aggregrate
//The browser will only talk to the pet server, pet server exposed outside the firewall, cat dog server behind the firewall
//One central web api and aggregate the data from secondary servers
//Reason being for a client application, you only want to hit one point, one central place that hits the backened services
//better for security, its easier to code to, and maintain, bring things online and offline
//No performance hit on the servers, cause they are all running in the same place
//They all take a seperate process, you will need architecture and infrastructure to deploy these
//Fire up a docker container, and have these all running in different containers 

var async = Async;  // => npm install --save async


module.exports = function (app: Express) {

    /*Read*/
    app.get('/pets', function (req, res) {

        async.parallel({
            //Take this object and add as many key value pairs as you want,
            //The key is basically something I can reference back later to see which service im hitting
            //and the value is a function which has a callback
            //executing this anonymous function, creating a request
            //all of these key values will be executed in parallel
            cat: function (callback) //You can call this keyword anything, but we called it callback
             {  //The callback is basically the way the async response talks to the calling code
                R({ uri: 'http://localhost:4000/cat' }, function (error, response, body) {
                    if (error) { //the request returned an error
                        callback({ service: 'cat', error: error });
                        //then i handle the callback, if i have an error, im calling back with my service as 'cat'
                        //and passing the error, a json object
                        return;
                    };
                    if (!error && response.statusCode === 200) {
                        callback(null, body.data); 
                        //Not error, good code
                        //When you callback with null, they get aggregated until everyone has been called back
                        //until the final function at the very bottom is going to be called
                    } else {
                        callback(response.statusCode); 
                        //If the status code is anything besides 200, hit this
                        //Like if status is 404, thats not an error
                        //if there is an error, callback with a status code
                        //that immedietly stops all the other processes and returns an error parameter in the 
                        //function below
                    }
                });
            },

            dog: function (callback) {
                client.get('http://localhost:5000/dog', function(error, dog) {
                //Reddis for caching =>
                //Go into reddis and find me this key, which is http://localhost:5000/dog, if it exists, gimmie its value
                //If i was storing individual pets, i would have used their id
                    //It will either give you an error or the dog endpoint
                    if (error) { throw error; }
                    if (dog) {
                        callback(null, JSON.parse(dog));
                        //The key existed and there was a value so give it
                        //Because it is a key value store, cant store the value as a JSON object only as a string but
                        //we can use JSON.parse() to convert the string to a JSON object
                        //Use JSON.stringfy() converts JavaScript Object to JSON string
                    } else {
                        //Here is the Dog Request calling the dog server endpoint
                        R({ uri: 'http://localhost:5000/dog' }, function (error, response, body) {
                            if (error) {
                                callback({ service: 'dog', error: error });
                                return;
                            };
                            if (!error && response.statusCode === 200) { //Good Data
                                //   callback(null, body); 
                                //We dont want the whole body, because the body contains an info property. We just want the data 
                                //property so:
                                callback(null, body.data);

                                //Lets cache the good data
                                //Usually we want to callback/send the data first, because node will keep going through
                                //because of the single event loop, because we want it to respond faster
         
             // client.set('http://localhost:5000/dog', JSON.stringify(body.data), function (error) { <= This one doesnt have expiration
                                  client.setex('http://localhost:5000/dog',10, JSON.stringify(body.data), function (error) {
                                      //Second parameter is integer which is the number of seconds it will last before expiring
                                    if (error) { throw error; }
                                });
                            } else {
                                callback(res.statusCode);
                            }
                        });
                    }
                });
            }
        },
        //When all the parallels are done this function gets executed
            function (error, results) {
                res.json({
                    error: error,
                    results: results //An object that has a .dog or .cat, so thats where the key comes in
                                    //We didnt aggregate the results we end up getting two lists
                });
            });
    });     
    //In R pass in the uri that is has to go get. Go to my local host and hit dog server. When that gets hit
    //it runs the callback function.

    //What is you want to call cats service too, use both here, asynchronous so use async module
    //To run stuff parallel or sequentially
    //We have multiple asynchronous requests we have to make and when they are all done we can grab and merge the
    //data and return



    //A ping endpoint to indicate when you have hit the endpoint, so that we can later measure how long it takes
    //after the endpoint was hit to return back the response (to observer the asynchronous nature)
    
    app.get('/ping', function(req, res){
        res.json({pong: Date.now()});
    });


};

/*
We want to use redis for caching, Redis is a in memory key value store. Push data into it and retrieve it on the fly.
Set expirations. Cache you have to worry about synching and expirations. Gives you helpers to do that. 

Install redis using chocaltey
Then in cygwin type
'redis-server' to start the redis server
'redis-cli' after to start redis terminal
'set fun poo' => Returns ok
'get fun'=> returns poo
'keys *' => Shows all the keys
'get key' => Shows value for a key
'flushdb' => Deletes all the key value pairs



You want to cache data that is static not data that is too dynamic. If data changes every 10-15 minutes, cache for 9
minutes, not the end of the world to return old data

You can also tye in your backend system to update redis and send pushes to redis when data changes => Data synchronization

And Redis is an in-memory database, so if you turn off the server and turn it back on the data will flush. Redis does write out to the
file system, so it has a backup system, you can tell it when to flush and how often it actually does backups, its not meant for 
persistent data but is robust enuff for persistent data. 
You can also add cache to cat, dog, and pet servers, add in all caching optimizations.
But rmbr you want to design system to not need cache because it is liek an enhancement, not a design. Its duck tape over a real problem. 

*/


/*
More about async

Run the tasks collection of functions in parallel, without waiting until the previous function has completed. 
If any of the functions pass an error to its callback, the main callback is immediately called with the value of 
the error. Once the tasks have completed, the results are passed to the final callback as an array.
Note: parallel is about kicking-off I/O tasks in parallel, not about parallel execution of code. If your tasks do 
not use any timers or perform any I/O, they will actually be executed in series. Any synchronous setup sections 
for each task will happen one after the other. JavaScript remains single-threaded.
It is also possible to use an object instead of an array. Each property will be run as a function and the results 
will be passed to the final callback as an object instead of an array. This can be a more readable way of 
handling results from async.parallel.

tasks	Array | Iterable | Object	
A collection containing functions to run. Each function is passed a callback(err, result) which 
it must call on completion with an error err (which can be null) and an optional result value.

callback	function <optional>	
An optional callback to run once all the functions have completed successfully. 
This function gets a results array (or object) containing all the result arguments passed to 
the task callbacks. Invoked with (err, results).


async.parallel([
    function(callback) {
        setTimeout(function() {
            callback(null, 'one');
        }, 200);
    },
    function(callback) {
        setTimeout(function() {
            callback(null, 'two');
        }, 100);
    }
],
// optional callback
function(err, results) {
    // the results array will equal ['one','two'] even though
    // the second function had a shorter timeout.
});

// an example using an object instead of an array
async.parallel({
    one: function(callback) {
        setTimeout(function() {
            callback(null, 1);
        }, 200);
    },
    two: function(callback) {
        setTimeout(function() {
            callback(null, 2);
        }, 100);
    }
}, function(err, results) {
    // results is now equals to: {one: 1, two: 2}
});


*/

/* ///////////////////////////////////////////////////////////////////////////////////////////////////
Redis Tutorial

Storing Strings
////////////////////////////////////////////////////////////////////////////
client.set('framework', 'AngularJS'); or client.set(['framework', 'AngularJS']);

The only difference is that the first one passes a variable number of arguments while the 
later passes an args array to client.set() function. You can also pass an optional callback to 
get a notification when the operation is complete:

client.set('framework', 'AngularJS', function(err, reply) {
  console.log(reply);
});

If the operation failed for some reason, the err argument to the callback represents the error. 
To retrieve Key:
The value of the key can be accessed via the callback argument reply. 
If the key doesn’t exist, the value of reply will be empty.

client.get('framework', function(err, reply) {
    console.log(reply);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
STORING OBJECTS:

Many times storing simple values won’t solve your problem. You will need to store hashes (objects) in Redis. 
For that you can use hmset() function as following:The above snippet stores a hash in Redis that maps each 
technology to its framework. The first argument to hmset() is the name of the key. Subsequent arguments 
represent key-value pairs. Similarly, hgetall() is used to retrieve the value of the key. If the key is 
found, the second argument to the callback will contain the value which is an object. Note that Redis doesn’t 
support nested objects. All the property values in the object will be coerced into strings before getting stored.
An optional callback can also be passed to know when the operation is completed.

client.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');

OR

client.hmset('frameworks', {
    'javascript': 'AngularJS',
    'css': 'Bootstrap',
    'node': 'Express'
});


client.hgetall('frameworks', function(err, object) {
    console.log(object);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////
STORING LISTS:

If you want to store a list of items, you can use Redis lists. To store a list use the following syntax:
The above snippet creates a list called frameworks and pushes two elements to it. So, the length of the list 
is now two. As you can see I have passed an args array to rpush. The first item of the array represents 
the name of the key while the rest represent the elements of the list. You can also use lpush() instead 
of rpush() to push the elements to the left.To retrieve the elements of the list you can use the lrange() 
function as following:Just note that you get all the elements of the list by passing -1 as the third 
argument to lrange(). If you want a subset of the list, you should pass the end index here.

client.rpush(['frameworks', 'angularjs', 'backbone'], function(err, reply) {
    console.log(reply); //prints 2
});

client.lrange('frameworks', 0, -1, function(err, reply) {
    console.log(reply); // ['angularjs', 'backbone']
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
Storing Sets
Sets are similar to lists, but the difference is that they don’t allow duplicates. 
So, if you don’t want any duplicate elements in your list you can use a set. Here is how 
we can modify our previous snippet to use a set instead of list.As you can see, the sadd() function creates 
a new set with the specified elements. Here, the length of the set is three. To retrieve the members of the set, 
use the smembers() function as following.

client.sadd(['tags', 'angularjs', 'backbonejs', 'emberjs'], function(err, reply) {
    console.log(reply); // 3
});

client.smembers('tags', function(err, reply) {
    console.log(reply);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Checking the Existing Keys, Deleting and Expiring Keys, Incrementing and Decrementing

Existence: 
client.exists('key', function(err, reply) {
    if (reply === 1) {
        console.log('exists');
    } else {
        console.log('doesn\'t exist');
    }
});


Deleting: 
client.del('frameworks', function(err, reply) {
    console.log(reply);
});

Expiring Keys: You can also give an expiration time to an existing key as following:
client.set('key1', 'val1');
client.expire('key1', 30);

Redis also supports incrementing and decrementing keys:
The incr() function increments a key value by 1. If you need to increment by a different amount, 
you can use incrby() function. Similarly, to decrement a key you can use the functions like decr() and decrby().

client.set('key1', 10, function() {
    client.incr('key1', function(err, reply) {
        console.log(reply); // 11
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////
Reference : https://www.sitepoint.com/using-redis-node-js/




*/
