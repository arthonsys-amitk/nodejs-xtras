"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');

var _ = require('lodash');

const Promise = require("bluebird");

//get configuration settings
exportFuns.get_configuration_settings = ()=>{
  
  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.find('settings', {});
  })
  .then(function(settings){
    db.close();
    return settings;
  });
};

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
exportFuns.update_notification_setting = (settings) => {
  let searchPattern1 = {key : "ios_keyId"};
  let searchPattern2 = {key : "ios_teamId"};
  let searchPattern3 = {key : "ios_appBundleId"};
  let searchPattern4 = {key : "android_fcmServerKey"};
  let searchPattern5 = {key : "push_notifications"};
  
  var enable_notifications = "0";
  if(settings.chk_notifications != null && settings.chk_notifications != undefined)
		enable_notifications = "1";
  let updatePattern1 = {value : _.trim("" + settings.ios_keyid)};
  let updatePattern2 = {value : _.trim("" + settings.ios_teamid)};
  let updatePattern3 = {value : _.trim("" + settings.ios_app_bundleid)};
  let updatePattern4 = {value : _.trim("" + settings.android_fcm_key)};
  let updatePattern5 = {value : _.trim("" + enable_notifications)};
  
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
					return db.update('settings', searchPattern5, updatePattern5)
					.then(function(res5){
						return (res1 || res2 || res3 || res4 || res5 );
					});
				});
			});
		});
	})
  })
  .then(function(res_settings){
	db.close();
	return res_settings;
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
exportFuns.update_email_settings = (req)=>{
	let searchPattern1 = {key: "admin_contact_email"};
	let searchPattern2 = {key: "developer_mail"};
	let searchPattern3 = {key: "email_authentication_service"};
	let searchPattern4 = {key: "email_authentication_user"};
	let searchPattern5 = {key: "email_authentication_password"};
	
	let updatePattern1 = {value: _.trim("" + req.admin_email)};
	let updatePattern2 = {value: _.trim("" + req.developer_email)};
	let updatePattern3 = {value: _.trim("" + req.email_authentication_service)};
	let updatePattern4 = {value: _.trim("" + req.email_authentication_user)};
	let updatePattern5 = {value: _.trim("" + req.email_authentication_password)};
	
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
						return db.update('settings', searchPattern5, updatePattern5)
						.then(function(res5){
							return (res1 || res2 || res3 || res4 || res5);
						});
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
//update privacy policy
exportFuns.privacy_policy = (req)=>{
  let searchPattern1 = { key : "Privacy and Policy"};

  
  let updatePattern1 = { value : _.trim(req.content)};
  
  
 
 let db = new Mongo;
 return db.connect(config.mongoURI)
 .then(function(){
   return db.update('settings', searchPattern1, updatePattern1)
 
  })
 .then(function(privacy_policy){
   db.close();
   return privacy_policy;
 });
};
//update Get privacy policy
exportFuns.get_privacy_policy = ()=>{
  let searchPattern1 = { key : "Privacy and Policy"};
  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.find('settings', searchPattern1)
  
    })
  .then(function(privacy_policy){
    db.close();
    return privacy_policy;
  });
};
module.exports = exportFuns;
