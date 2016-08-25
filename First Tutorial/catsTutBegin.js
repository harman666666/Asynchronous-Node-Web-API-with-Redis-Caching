var _ = require('lodash');
/*
 So, lodash is great. It's a utility class, it's a utility module that does a lot of things
 on arrays and collections, so like map reduce and find and all those types of things so you
 don't have to kind of write those algorithms yourself.

 npm install lodash cause we need to use the module: npm install --save lodash
 lodash only library used more than express

*/
//module.exports
//so this exports is giving me a function, so when i require cats, its going to make the cats variable equal to this
//function 
module.exports = function (app) {
    //parameter app used for endpoints
    var _cats = [];
    /* Create */
    app.post('/cat', function (req, res) {
        _cats.push(req.body); //We are not validation if it is a cat, they could end up pushing a dog into this
        //Post this { "name": "sam", "age": "5", "type": "alley}
        //Also make sure Content-Type is application/json => itll know its json body 
        res.json({ info: 'cat created successfully' });
    });
    /*Read */
    app.get('/cat', function (req, res) {
        res.send(_cats);
    });
    app.get('/cat/:id', function (req, res) {
        res.send(_.find(//Thie finds in the cats array, the object that contains name: req.params.id
        _cats, {
            name: req.params.id
        }));
    });
    /* Update */
    app.put('/cat/:id', function (req, res) {
        //This method is like _.find except that it returns the index of the first element predicate 
        //returns truthy for instead of the element itself.
        //We made a cat with this {"name": "jessy","age": "3","type": "tabby" } and lets say its 4 years old now
        //Do this: localhost:3001/cat/jessy, with same body except age is 4
        var index = _.findIndex(_cats, {
            name: req.params.id
        });
        if (index !== -1) {
            _.merge(_cats[index], req.body);
            res.json({ info: 'cat updated successfully' });
        }
        else {
            _cats.push(req.body);
            res.json({ info: 'cat created successfully' });
        }
    });
    /* Delete */
    app.delete('/cat/:id', function (req, res) {
        _.remove(_cats, function (cat) {
            return cat.name === req.params.id;
        });
        //Uses remove on every instance of cats array, and then removes when predicate true. 
        res.json({ info: 'The cat ' + req.params.id + 'was removed successfully' });
    });
    //For production phases, you use pm2 or forever
    //Well personally he uses docker, so a single process running in docker container, and docker thing watches the 
    //container 
    //install mongodb using chocolatey which is a windows package manager
    //then installed the mongodb service, to use its features start cygwin in adminstrator
    //To start mongodb service do: net start mongodb
    //To stop: net stop mongodb   
    //To start go to C/program files/mongodb/server/3.2/bin
    //Then start mongo shell by typing ./mongo
    //mongo is a document store 
    //Mongo is database and mongoose is odm (object document mapper different from orm which is object relational mapper)
    //Unlike before where cats could be any shape or size, now the actual structure of the cat is going to be fixed
    //structure specified in cat_model
};
