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
    return db.find('settings', searchPattern);
  })
  .then(function(settings){
    db.close();
    return settings;
  });
};

module.exports = exportFuns;
