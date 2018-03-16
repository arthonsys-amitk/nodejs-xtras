"use strict";
var jwt = require('jwt-simple');
var {user} = require('../api/controllers');

module.exports = function(req, res, next) {

  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe.

  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();

  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

  var checkRole = (url, role)=>{
    if (role === 'admin'){
      return true;
    }

    if (url.indexOf('/search') !== -1){
      return true;
    }

    return false;
  };

  if (token) {
    try {

      var decoded = jwt.decode(token, require('../config').secret);

      if (decoded.expires <= Date.now()) {
        res.status(400);
        res.json({
          "status": 400,
          "message": "Token Expired"
        });
        return;
      }

      // Authorize the user to see if s/he can access our resources

      user.getUser(decoded.userID)
      .then(function(user){
        if (user) {
          if (checkRole(req.url, user.role)){
            req.validatedUser = user;
            next(); // To move to next middleware
          } else {
            res.status(403);
            res.json({
              "status": 403,
              "message": "Not Authorized"
            });
          }
        } else {
          // No user with this name exists, respond back with a 401
          res.status(401);
          res.json({
            "status": 401,
            "message": "Invalid User"
          });
          return;
        }
      })
    } catch (err) {
      res.status(500);

      res.json({
        "status": 500,
        "message": "Oops something went wrong",
        "error": err
      });
    }
  } else {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid Token"
    });
    return;
  }

};
