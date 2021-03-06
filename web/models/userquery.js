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
	let db = new Mongo;

	return db.connect(config.mongoURI)
	.then(function(){
		  return db.find("settings", {});
	})
	.then(function(res_settings){
		
		var email_auth_service = config.email_auth_service;
		var email_auth_user = config.email_auth_user;
		var email_auth_password = config.email_auth_password;
		
		if(res_settings != null && res_settings != undefined) {
			for(var i = 0; i < res_settings.length; i++){
				if(res_settings[i].key == "email_authentication_service") {
					email_auth_service = res_settings[i].value;
				} else if(res_settings[i].key == "email_authentication_user") {
					email_auth_user = res_settings[i].value;
				} else if(res_settings[i].key == "email_authentication_password") {
					email_auth_password = res_settings[i].value;
				}				
			}
		}
		
		var transporter = nodemailer.createTransport({
		  service: "" + email_auth_service,
		  auth: {
			user: "" + email_auth_user,
			pass: "" + email_auth_password
		  }
		});

		var mailOptions = {
		  from: 'Xtras Admin',
		  to: "" + sender_email,
		  subject: 'RE: Xtras Query ID: ' + faq_id,
		  html: "" + reply
		};
		return transporter.sendMail(mailOptions)
		.then(function(info){
			console.log('Email sent: ' + info.response);			
			return 1;
		}).catch(function(err){
			console.log(err);
			return 0;
		});
	});
};

module.exports = exportFuns;
