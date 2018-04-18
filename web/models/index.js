var login     = require('./login');
var user      = require('./user');
var coupon    = require('./coupon');
var services  = require('./services');
var userquery = require('./userquery');
var settings  = require('./settings');
module.exports = {
  login      : login,
  user       : user,
  coupon	 : coupon,
  services	 : services,
  userquery	 : userquery,
  settings	 : settings
};