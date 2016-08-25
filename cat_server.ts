/*
Adding intellisense
Typings, the type definition manager for TypeScript, makes it easy to search for and install TypeScript 
definition files into your workspace. This tool can download the requested definitions from a variety 
of sources, including the DefinitelyTyped repository. As we did with the Express Generator, we will install 
the Typings command line tool globally using NPM so that you can use the tool in any application you create.

npm install -g typings => When you put g, it means it will be installed as a global package and will be available anywhere
                          on your system
Tip: Typings has a number of options for configuring where and how definition files are downloaded. 
From the terminal, run typings --help for more information.
Go back to the file app.js and notice that if you hover over the Node.js global object __dirname, 
VS Code does not know the type and displays any.

Now, using the Typings command line, pull down the Node.js and Express type definition files:

$ node_modules/.bin/typings install dt~body-parser --global --save
$ node_modules/.bin/typings install dt~express --global --save
$ node_modules/.bin/typings install dt~node --global --save
$ node_modules/.bin/typings install dt~serve-static --global --save
$ node_modules/.bin/typings install dt~express-serve-static-core --global --save
$ node_modules/.bin/typings install dt~mime --global --save

typings install dt~lodash --global --save
typings install dt~mongoose --global --save
typings install dt~request --global --save
typings install dt~async --global --save
typings install dt~redis --global --save

best way to install typings is to open packages.json, look at dependencies and install

Click on the Configure gear icon at the top of the Debug view to create a default launch.json configuration 
file and select Node.js as the Debug Environment. This configuration file lets you specify how to start the 
application, what arguments to pass in, the working directory, and more. The new launch.json file is created 
in a VS Code specific .vscode folder in root of your workspace.

Look at this for info on setting up node to make coding efficient
http://brianflove.com/2016/03/29/typescript-express-node-js/

INSTALLING ESLINT DO THIS:
npm install -g eslint eslint-plugin-react babel-eslint eslint-config-defaults

Tools and Packages Used
The Express-Generator Package can be used to generate a scaffolded express application. Basic application with
some routes and views and basic folder structure. Express Generator uses view engine called Jade, 2 other view engines,
Hokan and EJS, are also supported. 
A view engine is used to render html back to the client, brings up Bootstrap. And Robomongo tool important for efficient
use of mongodb. 

*/

//To start a node application, do node init -y in console to create package.json file
//Then create index.js file in the same folder

var http = require('http'); //Requires http which is a node built in module, in es6 you can use import, this is es5
//We created the variable http which comes with a bunch of node functions from the built in module such as
//createServer, which takes a callback function, the callback function has a request and a response object
//This callback function gets executed whenever someone enters the web page
//


http.createServer( function( req, res){
    //Look at request, investigate it, then create the response
    //and end it.
    res.writeHead(200, {'Content-Type': 'text/plain'});
    //When youre in this function, first write out a header
    
    res.end('Hello Word\n');
    /*
     So, when I'm in this function, I'm going to first write out a header, so I'm going to send a status of 200, 
     and I'm going to send Content-Type text/plain, and then I'm going to res.end. So this is going to send the text Hello World down 
     the pipe to the server that made the request, or to the client that made the request, and it's going to end the response. 
     And then this callback function gets instantiated and run every time someone hits the server, and then I tell it to listen on 
     port 3000 on my localhost(127.0.0.1).
    */
}).listen(3000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:3000/');
//To run this, type in console, node index.js, to start the server
//I dont want to be writing headers, and making these low level calls, so need a framework, thats why we need express
//Express handles both front end and backened, templating
/*
 It handles front-end and back-end, so it can do templating and send Jade files, 
 which translates into HTML or pure HTML so you can use it for your front and your back-end.
 So lets use express module
*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var express = require('express'); //Requires the function express, gets the module
var app = express(); //Create an app that executes the express function name(params) {
var bodyParser = require('body-parser'); //nom install this: npm install --save body-parser

var mongoose = require('mongoose'); //require and connect to mongoose here and cat_model.js
mongoose.connect('mongodb://localhost/cats'); //can be any url, can be a cloud server, so its its own protocol


//Cant find module express, so we need to install it
//To do this write: npm install --save express
//If you go into node modules, youll have an express folder
//If you go in package json, you see express in the dependencies section
//Write this:
//vi .gitignore => vi is just a terminal editor use in git bash
//then type node_modules
//so now whenever you commit, itll commit files, but not modules
//The logic behind it is when someone gets project off github, all they need
//is project json to get the dependencies\
//How can I ignore directories or folders in Git using msysgit on Windows?
/*
Create a file named .gitignore in your projects directory. Ignore directories by entering the directory name 
into the file (with a slash appended):
dir_to_ignore/
*/

//Use the body parser, so i can use the syntax
app.use(bodyParser.json()); //Hey body parser, if my application type is json coming across, or if ive got a 
//form submit, just basically parse the body and add it onto the request for you
/*
So without that I'm assuming then that if somebody passes me JSON I wouldn't be able to read it properly. 
Exactly. This will attach it onto the request for you so that you can then do what you need to do with it.
*/
app.use(bodyParser.urlencoded({
    extended: true
}));

//Get rid of this definition here and move it to the cat file

app.get('/', function (req,res){ //Everytime there is a get request on slash '/' and just slash, 
                                //execute the req res function
                                //The default content type is text/html
                                //You can set that based on options inside the res
                                // you could also send json 
//res.send('Hello World!');
res.json({hello: 'world'}); //This will display on screen {"hello": "world"}

});    


//Move route defininitions to cat file
//This is how you seperate routes into diffirent files as well
var cats = require('./routes/cat.js')(app); //requiring a path ./cat.js is in the same folder, and passing app 
                                      //which executes function
//when you require express you get one singleton, app is unique to this file so the only way of getting over to cats
//is by passing it. 

var server = app.listen(4000, function(){console.log('Server running at http://127.0.0.1:4000/')})
//Server at the bottom set up with app.listen
//To make it so that the server automatically changes and picks up changes to the node code, use nodemon
//It runs node and runs a watchtask inside the folder to look for changes in the files
//To get this type
//npm install -g nodemon //The dash g means globally, means any program you got can use this
/*
-g => Yeah, and it puts it in your path so that whenever you're in your terminal you can actually use, 
there's usually going to be a terminal facet to a ---. Difference of that is going to be we had Express, 
which we didn't do -g, and this one we do -g. So -g is for I'm going to use it everywhere, it's not going 
to be my package,

Now to start your programs type:
nodemon index.js
*/

//We have one endpoint which is just a slash, but we want other endpoints that do something.
//To add files using terminal, type: touch cat.js

/*

 I am going to be sending data back and forth from the express app
 express is barebones, its just a simple server that allows you to set and built out a server with endpoints

 Things like parsing the body and parsing cookies, those are all left to plugins
 node small compartementalized functionality, you can add what you want

//////////////////////////////////////////////////////////////////////////////////////

Node is geared toward being a middle man, like an air traffic controller
You really just want backend services that do the number crunching and data processing
So node itself is a single event loop, and so google V8 which node runs on top of, is threaded
So you can have threaded processes, you can do exec, you can spawn processes, but Node itself has a single event loop.  
If you're coming through in that event loop and you start doing some really heavy processing here, 
like let's say I had 10,000 cats, and I wanted to then take those cats and I want to arrange them alphabetically by 
like maybe 20 parameters deep, like sorting them ---. So what you're saying is that, if I hear you right, with the 
single event loop, that's why we have callbacks everywhere, right? Correct. So, go figure this out. When you're ready, 
I'll catch you on the next iteration of the loop. But if I stop and I pause and I make you process all that data, then 
we're slowing down everybody else. Yes. Okay, so how do we fix that? So, the way that this should be architected, and 
especially in a lot of businesses now, is you already have some back-end services that do a lot of different things. 
Right, you've got .NET, Java, whatever. Yeah, and I've got a new client application that needs some data, but it could 
be a mobile app or whatever, and I don't need to be sending all of this data, and I don't want to hit all these 
different endpoints. So where Node really shines is putting it in between, right? As a web API right at the edge 
of your network. So, all these databases that already exist and all of these services that already exist, I can go 
and aggregate and orchestrate and then send back just what I need for my client. So that's pretty cool because a 
lot of places, you know I've done a lot of consulting in my career, and I know you have too, they already have a 
lot of applications in the back-end. Let's say it's all .NET. They've got stuff that they've written for years. 
And usually when an app or a project comes up, have said, hey, go add a new UI to this, or go add this new feature, 
but you can't change the back-end systems. Not easily. So this would allow you to say, look, financially we can't 
change everything. Leave the back-end systems there, and if I hear you right, you're going to put Node in front of 
those. So it's not doing the heavy number crunching. It's deferring that to the other places, and then Node acts as 
like an aggregator? Aggregator, orchestrator. Those are the architectural terms. Again, I like to think of it as 
an air traffic controller. So it's between your .NET and your glass, your screens. Yeah, I don't need to send back 
this 10,000 JSON document that I got from my service to my web application, right, and I don't want to change the 
service to trim and get the specific data I need, but I can use this in between to get from service A, B, and C, 
and just send down what I need. Why not just go right to .NET in this case? Why Node? Just Node, first of all, is 
written in JavaScript, so it's very easy for people who are working in the front-end to become accustomed to it 
and to write with it. And it's simple. I mean, look at how quick we wrote this. I defer to you because you have a 
lot of .NET experience. I don't have a whole lot of .NET experience, but ---. Well, yeah, I could easily go back 
and say, well, I know .NET very well, I could write a web API very quickly, but it sounds like, and in my experience 
this has been true, and tell me because you have more of it than I have, when I create a Node server that it's really, 
because of the event loop and all that, it's really built for that fast I/O. I mean faster than if I crank something 
up with Java or .NET, I'm going to have to deal with even more server stuff going on, and it just, it seems to be a 
little more bulky. Larger memory footprint. It does more. A larger memory footprint, yeah. But Node seems to be 
like I need to get fast I/O, boom, boom, boom, I can run through it. Okay, basically Node is that great middle 
layer air traffic controller, you call it? Air traffic controller. And then we use our back-end. Okay, so we'll 
agree there, .NET in the back-end, Node in the middle. Well, I would say Go in the back-end, but you know me. 
That'll be the next one.

*/

