"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');

var _ = require('lodash');

const Promise = require("bluebird");

//get push notification settings
exportFuns.get_notification_settings = ()=>{
  let searchPattern = {
    "key": {$regex : ".*push.*", $options: "i"},
  };

  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.findOne('settings', searchPattern);
  })
  .then(function(settings){
    db.close();
    return settings;
  });
};

//update push notification settings
exportFuns.update_notification_setting = (settings_id, enable_notifications) => {
  let searchPattern = {};
  if(settings_id) {
	  _id: settings_id
  } else {
	  searchPattern = {
		"key": {$regex : ".*push.*", $options: "i"},
	  };
  }
  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.update('settings', searchPattern, {"value": "" + enable_notifications});
  })
  .then(function(settings){    
		return db.findOne('settings', searchPattern)
		.then(function(ressettings){
			db.close();
			return ressettings;  
		});	
  });
};

//get payment configuration settings
exportFuns.get_payment_settings = ()=>{
  let searchPattern = {
    "key": {$regex : ".*stripe.*", $options: "i"},
  };

  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.find('settings', searchPattern);
  })
  .then(function(res_settings){
    db.close();
    return res_settings;
  });
};

//update payment settings
exportFuns.update_payment_settings = (req)=>{
   let searchPattern1 = { key : "stripe_email"};
   let searchPattern2 = { key : "stripe_secret_key"};
   let searchPattern3 = { key : "stripe_publishable_key"};
   let searchPattern4 = { key : "stripe_mode"};
   
   let updatePattern1 = { value : _.trim(req.stripe_email)};
   let updatePattern2 = { value : _.trim(req.stripe_secret_key)};
   let updatePattern3 = { value : _.trim(req.stripe_publishable_key)};
   let updatePattern4 = { value : _.trim(req.stripe_mode)};
   
  
  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.update('settings', searchPattern1, updatePattern1)
	.then(function(res1){
		return db.update('settings', searchPattern2, updatePattern2)
		.then(function(res2){
			return db.update('settings', searchPattern3, updatePattern3)
			.then(function(res3){
				return db.update('settings', searchPattern4, updatePattern4)
				.then(function(res4){
					return (res1 || res2 || res3 || res4);
				});
			});
		});
	});
  })
  .then(function(res_settings){
    db.close();
    return res_settings;
  });
};

module.exports = exportFuns;
