"use strict";

var jwt    = require('jwt-simple'),
    _      = require('lodash'),
    config = require('../../config'),
    user = require('./user');

var auth = {

  login:(req, res)=>{

    let username = _.trim(req.body.email) || '';
    let password = _.trim(req.body.password) || '';
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Incomplete credentials"
      });
      return;
    }

    // fire a query to the DB and check if the credentials are valid
    auth.validate(username, password)
    .then(function(userObj){

      // block inactive users
      if (userObj && ! userObj.activeYN){
        return null;
      }

      if (userObj){
        return userObj;
      }
    })
    .then(function(userObj){

      if (! userObj) { // If authentication fails, we send a 401 back
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid credentials"
        });
        return;
      } else {
        // authentication is success - generate a token and dispatch to the client
        res.json(genToken(userObj));
      }
    })

  },

  validate: function(username, password) {
    return user.authenticateUser(username, password);
  }
};

var  genToken = (user)=>{
  let expires = expiresIn(config.tokenExpiration);
  let token = jwt.encode({
    expires: expires,
    userID: user._id
  }, config.secret);

  return {
    token: token,
    expires: expires,
    user: user
  };
}

var expiresIn = (numDays)=>{
  let dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
