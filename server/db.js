var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('databse connected');
});


var puppySchema = mongoose.Schema({
  name: String,
  owner: String,
  image: String,
  description: String
});

var Puppy = mongoose.model('Cat', puppySchema);
module.exports = Puppy;