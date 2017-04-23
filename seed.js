/**
 *  This file should be a standalone script that seeds your database,
 *  making testing interactions with your database much easier.
 *
 *  You should be able to run this file from Terminal with:
 *
 *    node ./seed.js
 *  
 *  And populate your database with all the data from `data.json`
 */

var Puppy = require('./server/db');
var data = require('./data.json');

//console.log(Cat);
// Step 1: Drop old data
// TODO
Puppy.collection.drop();

// Step 2: Add data from `data.json`
// TODO
data.forEach(function(pup) {
  console.log('I am here');
  var fluffy = new Puppy(pup);
  fluffy.save(function(err, fluffy) {
    if (err) {
      console.log(err);
    }
  });
});
