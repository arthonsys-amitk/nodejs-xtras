"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');
	
var nodemailer = require('nodemailer');

var admin_contact_email = "amit.kothari@arthonsys.com";

// returns inserted contact data
exportFuns.insert_contact_us = (data)=>{
  var insertPattern = { email: data.email, contact_number: data.phone_no, comment: data.comment };
  let db = new Mongo;

  return db.connect(config.mongoURI)
  .then(function(){
    return db.insert('contact_us', insertPattern);
  })
  .then(function(user){
	  return exportFuns.sendContactEmail(data.email, data.phone_no, data.comment)
	  .then(function(res){
		  db.close();
		  return user.ops[0];
	  });
  })
  .then(function(final_res){
	  return final_res;
  });
};


exportFuns.sendContactEmail = (email, phone_no, comment) => {
	var transporter = nodemailer.createTransport({
	  service: "" + config.email_auth_service,
	  auth: {
		user: "" + config.email_auth_user,
		pass: "" + config.email_auth_password
	  }
	});

	var mailOptions = {
	  from: 'Xtras Admin',
	  to: "" + config.admin_contact_email,
	  subject: 'Xtras: Comments from ' + email,
	  html: "From: " + email + "<br/>Phone No.:" + phone_no + "<br/>Comments: <br/>" + comment
	};
	return transporter.sendMail(mailOptions)
	.then(function(info){
		console.log('Contact Email sent: ' + info.response);			
		return 1;
	}).catch(function(err){
		console.log(err);
		return 0;
	});
};

exportFuns.find_privacy_policy = ()=>{
  let searchPattern = {
    key : 'Privacy and Policy'
  };

  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.findOne('settings', searchPattern);
  })
  .then(function(user){
    db.close();
    return user;
  });
};

module.exports = exportFuns;
