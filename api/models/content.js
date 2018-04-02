"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');
// returns inserted contact data
exportFuns.insert_contact_us = (data)=>{
  var insertPattern = { email: data.email, contact_number: data.phone_no, comment: data.comment };
  let db = new Mongo;

  return db.connect(config.mongoURI)
  .then(function(){
    return db.insert('contact_us', insertPattern);
  })
  .then(function(user){
    db.close();
    return user.ops[0];
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
