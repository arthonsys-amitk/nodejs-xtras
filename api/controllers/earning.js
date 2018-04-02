"use strict";

var jwt    = require('jwt-simple'),
    _      = require('lodash'),
    config = require('../../config');

var posts = {

  add_post:(req, res)=>{

    res.status(400);
      res.json({
        "status": 400,
        "message": "Either username or password is blank.",
        "data": {}
      });
      return;
  }
};


module.exports = posts;
