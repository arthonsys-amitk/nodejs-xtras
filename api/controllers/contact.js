"use strict";
var _      = require('lodash'),
    {contact} = require('../models'),
    config = require('../../config'),
    mail   = require('./mail.js'),
    bcrypt = require('bcrypt-nodejs');

var exportFuns = {},
    web = {};

///////////////////
//postContact
exportFuns.postContact = (email, number, comments)=>{
	if((!email) || (!number) || (!comments)) {
		var str = '{"responsecode": "-1", "responsemsg" : "Invalid Input"}';
		return str;
	}
	return contact.postContact(email, number, comments);
};

web.webpostContact = (req, res)=>{
  /*
  if(! req.body.email || _.trim(req.body.email) == '' ){
    res.json({
      "message": "Email is required"
    });
  }
  */
  console.log("test msg");
  res.json({message:`Test msg`})
};

exportFuns.web = web;
module.exports = exportFuns;
