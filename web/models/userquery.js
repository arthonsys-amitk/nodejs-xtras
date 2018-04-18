"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');


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


module.exports = exportFuns;
