"use strict";

var auth = require('./auth'),
    purchase = require('./purchase'),
    product = require('./product'),
    contact = require('./contact'),
    user = require('./user');

module.exports = {
  auth  : auth,
  purchase : purchase,
  product : product,
  user : user,
  contact: contact
};
