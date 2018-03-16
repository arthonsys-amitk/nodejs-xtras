"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');

// set password reset key in database
exportFuns.setResetKey = (email, resetKey)=>{
  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.update('users', {"email" : email}, {"resetKey": resetKey});
  })
  .then(function(numUpdated){
    db.close();
    return numUpdated;
  });

};

// get user object from database using email
exportFuns.getUserByEmail = (email)=>{
  let searchPattern = {
    email : email
  };

  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.findOne('users', searchPattern);
  })
  .then(function(user){
    db.close();
    return user;
  });
};

// returns user
exportFuns.getUser = (userID)=>{
  let db = new Mongo;
  let oid = db.makeID(userID);
  let searchPattern = {_id : oid};

  return db.connect(config.mongoURI)
  .then(function(){
    return db.findOne('users', searchPattern);
  })
  .then(function(user){
    db.close();
    return user;
  });
};

// returns array of results
exportFuns.search = (pattern, sort)=>{
  let db = new Mongo;

  if(pattern._id){
    pattern._id = db.makeID(pattern._id);
  }

  if(pattern.accountID){
    pattern.accountID = db.makeID(pattern.accountID);
  }

  return db.connect(config.mongoURI)
  .then(function(){
    return db.search('users', pattern, sort);
  })
  .then(function(users){
    db.close();
    return users;
  });
};

// create user
exportFuns.createUser = (user)=>{
  let db = new Mongo;

  return db.connect(config.mongoURI)
  .then(function(){
    return db.insert('users', user);
  })
  .then(function(user){
    db.close();
    return user.ops[0];
  });
};
// update user
exportFuns.updateUser = (userID, user)=>{
  let db = new Mongo;
  let oid = db.makeID(userID);
  let updatePattern = {_id : oid};
  user._id = oid;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.update('users', updatePattern, user);
  })
  .then(function(numUpdated){
    db.close();
    return numUpdated;
  });
};

// set new password for user
exportFuns.updatePassword = (userID, password)=>{
  let db = new Mongo;
  let oid = db.makeID(userID);
  let updatePattern = {_id : oid};

  return db.connect(config.mongoURI)
  .then(function(){
    return db.update('users', updatePattern, {"password": password});
  })
  .then(function(numUpdated){
    db.close();
    return numUpdated;
  });
};

exportFuns.updateForgotPassword = (resetKey, password)=>{
  let db = new Mongo;
  let updatePattern = {"resetKey" : resetKey};

  return db.connect(config.mongoURI)
  .then(function(){
    return db.update('users', updatePattern, {"password": password, "resetKey" : null});
  })
  .then(function(numUpdated){
    db.close();
    return numUpdated;
  });
};

// returns number of users deleted
exportFuns.deleteUser = (userID)=>{
  let db = new Mongo;
  let deletePattern = {_id : db.makeID(userID)};
  return db.connect(config.mongoURI)
  .then(function(){
    return db.delete('users', deletePattern);
  })
  .then(function(results){
    db.close();
    return results.ok;
  });
};

module.exports = exportFuns;
