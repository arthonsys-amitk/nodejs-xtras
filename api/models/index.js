"use strict";

var user = require('./user'),
    purchase = require('./purchase'),
    product = require('./product'),
    mail = require('./mail');


module.exports = {
  user : user,
  purchase : purchase,
  product : product,
  mailHelper : mail
};
