"use strict";
var _      = require('lodash'),
    {user} = require('../models'),
    config = require('../../config'),
    mail   = require('./mail.js'),
    bcrypt = require('bcrypt-nodejs');

var exportFuns = {},
    web = {};

var generatePasswordReset = (email)=>{
  let resetKey = genPasswordResetKey();
  let url = config.passwordResetURL + resetKey;

  // update database record with reset key
  return user.setResetKey(email, url)
  .then(function(){
    return exportFuns.search({email: email})
  })
  .then(function(users){
    if (users && users.length > 0){
      mail.sendPasswordReset(email, resetKey, users[0]['firstName'] + ' ' + users[0]['lastName']);
    }

  });
};

var genPasswordResetKey = ()=>{
  let chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',0,1,2,3,4,5,6,7,8,9,'@','!','*']
  return _.sampleSize(chars, 15);
};

var encryptPassword = (pwd)=>{
  return bcrypt.hashSync(pwd);
};

exportFuns.createUser = (objUser)=>{
  if (! _.has(objUser, 'email') || _.trim(objUser.email).length == 0 || ! _.has(objUser, 'password') || _.trim(objUser.password).length == 0){
    return undefined;
  }

  let newUser = {
    email : _.trim(objUser.email),
    password : encryptPassword(_.trim(objUser.password)),
    user_role : objUser.user_role,
    is_active : 1,
	is_deleted: 0
  };
  return user.createUser(newUser);
};

// authenticate a user
exportFuns.authenticateUser = (email, password)=>{
  return user.getUserByEmail(email)
  .then(function(authUser){
    if(bcrypt.compareSync(password, authUser.password)){
      return authUser;
    } else {
      return null;
    }
  });
};

// get a user
exportFuns.getUser = (userID)=>{
  return user.getUser(userID);
};

// get multiple users
exportFuns.search = (pattern, sort)=>{
  return user.search(pattern, sort);
};

// update user
exportFuns.updateUser = (userID, objUser)=>{
  if (! _.has(objUser, 'email') || _.trim(objUser.email).length == 0 || ! _.has(objUser, 'password') || _.trim(objUser.password).length == 0){
    return undefined;
  }

  return user.updateUser(userID, objUser);
};

// update password
exportFuns.updatePassword = (userId, password)=>{
  password = encryptPassword(_.trim(password));
  return user.updatePassword(userId, password);
};

// update password
exportFuns.updateForgotPassword = (resetKey, password)=>{
  password = encryptPassword(_.trim(password));
  return user.updateForgotPassword(resetKey, password);
};

// delete user
exportFuns.deleteUser = (userID)=>{
  return user.deleteUser(userID);
};

// web methods
web.createUser = (req, res)=>{
  var errors = [];

  if(! req.body.email || _.trim(req.body.email) == ''){
    errors.push("Email is required");
  }
  if(! req.body.password || _.trim(req.body.password) == ''){
    errors.push("Password is required");
  }
  if(errors.length > 0)
  {
    res.json({"message" : errors});
    return false;
  }

  let newUser = {
    email : _.trim(req.body.email),
    password : _.trim(req.body.password),
    role : req.body.role || 'user',
    activeYN : true,
    resetKey : null
  };

  exportFuns.createUser(newUser)
  .then(function(user){
    res.json(user);
  });
};

web.generatePasswordReset = (req, res)=>{
  if(! req.body.email || _.trim(req.body.email) == ''){
    res.json({
      "message": "Email is required"
    });
  }

  generatePasswordReset(_.trim(req.body.email))
  .then(res.json({message:`Password reset emailed to ${req.body.email}`}))
};

web.getUser = (req, res)=>{
  if (! req.params.userID || _.trim(req.params.userID) == ''){
    res.json({
      "message": "User ID Required"
    });
  }

  exportFuns.getUser(req.params.userID)
  .then(function(user){
    res.json(user);
  });
};

web.search = (req, res)=>{
  exportFuns.search(req.body)
  .then(function(users){
    res.json(users);
  })
};

web.updateUser = (req, res)=>{
  var errors = [];
  if(! req.body._id || _.trim(req.body._id) == ''){
    errors.push("ID is required");
  }

  if(! req.body.email || _.trim(req.body.email) == ''){
    errors.push("Email is required");
  }
  if(! req.body.password || _.trim(req.body.password) == ''){
    errors.push("Password is required");
  }
  if(errors.length > 0)
  {
    res.json({"message" : errors});
    return false;
  }
  let newUser = {
    email : _.trim(req.body.email),
    password : _.trim(req.body.password),
    role : req.body.role || 'user',
    activeYN : req.body.activeYN == 'true',
    resetKey : null
  };
  exportFuns.updateUser(req.body._id, newUser)
  .then(function(user){
    res.json(user);
  });
};

web.updatePassword = (req, res)=>{
  if (! req.body.password || _.trim(req.body.password) == ''){
    res.json({
      "message": "Password is required"
    });
  }
  if (! req.body._id || _.trim(req.body._id) == ''){
    res.json({
      "message": "User ID is required"
    });
  }
  let userID = req.body._id;

  exportFuns.updatePassword(userID, _.trim(req.body.password))
  .then(function(user){
    res.json(user);
  });
};

web.updateForgotPassword = (req, res)=>{
  if (! req.body.password || _.trim(req.body.password) == ''){
    res.json({
      "message": "Password is required"
    });
  }
  if (! req.body.resetKey || _.trim(req.body.resetKey) == ''){
    res.json({
      "message": "User ID is required"
    });
  }
  let resetKey = req.body.resetKey;

  exportFuns.updateForgotPassword(resetKey, _.trim(req.body.password))
  .then(function(user){
    res.json(user);
  });
};

web.deleteUser = (req, res)=>{
  if(! req.body._id || _.trim(req.body._id) == ''){
    res.json({
      "message": "ID is required"
    });
  }

  exportFuns.deleteUser(req.body._id)
  .then(function(user){
    res.json(user);
  })
};

exportFuns.web = web;
module.exports = exportFuns;
