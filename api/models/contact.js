"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');

// create user
exportFuns.postContact = (email, number, comments)=>{
  let db = new Mongo;

  return db.connect(config.mongoURI)
  .then(function(){
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	var formatted_time = dt.format('Y-m-d H:M:S');
	
	let newQuery = {
		sender_email : _.trim(email),
		sender_comments : _.trim(number),
		sender_comments : _.trim(comments),
		created_at : formatted_time,
		is_deleted: 0
	  };
	console.log("inserting query.....");
    return db.insert('contact_queries', newQuery);
  })
  .then(function(qry){
    db.close();
	console.log(qry);
    return qry.ops[0];
  });
};

module.exports = exportFuns;
