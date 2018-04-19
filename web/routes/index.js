"use strict";

var login 	  = require('./login');
var user 	  = require('./user');
var coupon 	  = require('./coupon');
var settings  = require('./settings');
var services  = require('./services');
var userquery  = require('./userquery');
	
module.exports = {
	login 	  : login,
	user 	  : user,
	coupon	  : coupon,
	settings  : settings,
	services  : services,
	userquery : userquery
};
