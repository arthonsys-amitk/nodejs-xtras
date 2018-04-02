"use strict";

var config = require('./config'),
    Mongo  = require('./mongo');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var db = new Mongo;
db.connect(config.mongoURI)
  .then(function(){

    db.db.collection("users", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex({email:1, password:1}, {unique:true, background:true, dropDups:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing email/password in the users collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });

  })

sleep(3000).then(function(){db.close();console.log("Done");})
