var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path'); //use path.resolve
var Puppy = require('./db');

var app = express();
app.use(express.static('./client'));
//app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist/'));
//app.use(express.static(path.join(__dirname + 'node_modules')));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')))

app.use(bodyParser.json());

// routes
app.get('/api/puppies', function(req, res) {
  Puppy.find({}, function(err, cats) {
    if (err) {
      res.send(err);
    } else {
      res.json(cats);
    }
  });
});


// app.post('/api/cats', function(req, res) {
//   var name = req.body.name;
//   var owner = req.body.owner;
//   var image = req.body.image;
//   var description = req.body.description;

//   Puppy.create({
//     name: name,
//     owner: owner,
//     image: image,
//     description: description
//   });
// });

app.post('/api/puppies', function(req, res, next) {
  var newPuppy = req.body;

  Puppy.create(newPuppy) 
    .then(function(dog) {
      res.json(dog)
    }, function(err) {
      next(err);
    });
})


app.listen(3000, function() {
  console.log('Listening on port 3000');
});