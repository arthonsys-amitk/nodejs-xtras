"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');


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

module.exports = exportFuns;
