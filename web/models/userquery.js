"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');

var nodemailer = require('nodemailer');

const Promise = require("bluebird");

//get_userquery_count
exportFuns.get_userquery_count = ()=>{
  let searchPattern = {
    is_deleted : 0
  };
  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.find('user_query', searchPattern);
  })
  .then(function(resqueries){
    db.close();
    return resqueries.length;
  });
};

//get all queries
exportFuns.get_all_queries = ()=>{
  let searchPattern = {
    is_deleted : 0
  };
  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.find('user_query', searchPattern, {_id: -1});
  })
  .then(function(resqueries){
    db.close();
    return resqueries;
  });
};

//get faq record by id
exportFuns.get_faq_by_id = (faq_id)=>{
  let db = new Mongo;
  let searchPattern = {
    _id : db.makeID("" + faq_id)
  };
  return db.connect(config.mongoURI)
  .then(function(){
    return db.findOne('user_query', searchPattern);
  })
  .then(function(resquery){
    db.close();
    return resquery;
  });
};

//delete given faq by id
exportFuns.delete = (faq_id)=>{
  let db = new Mongo;
  let searchPattern = {
    _id : db.makeID("" + faq_id)
  };
  let updatePattern = {
	  is_deleted : 1
  };
  return db.connect(config.mongoURI)
  .then(function(){
	return db.update('user_query', searchPattern, updatePattern);
  })
  .then(function(resquery){
    db.close();
    return resquery;
  });
};

//send reply to query
exportFuns.send_reply = (sender_email, reply, faq_id)=>{
	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
		user: 'amitkothari.as@gmail.com',
		pass: 'Arthonsys@12345'
	  }
	});

	var mailOptions = {
	  from: 'Xtras Admin',
	  to: "" + sender_email,
	  subject: 'RE: Xtras Query ID: ' + faq_id,
	  html: "" + reply
	};
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
			return 0;
		} else {
			console.log('Email sent: ' + info.response);			
			return 1;			
		}
	});
};

module.exports = exportFuns;
