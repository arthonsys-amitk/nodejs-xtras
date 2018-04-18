"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');


const Promise = require("bluebird");

//get_services_count
exportFuns.get_services_count = ()=>{
  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.find('services', {});
  })
  .then(function(resservices){
    db.close();
    return resservices.length;
  });
};


module.exports = exportFuns;
