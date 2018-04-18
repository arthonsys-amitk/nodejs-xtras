"use strict";

var exportFuns = {};

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = '$2a$10$u63CMPV6QbEiAs7Qmif7u';

exportFuns.encrypt = (text) => {

  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
exportFuns.decrypt = (text) => {

  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = exportFuns;
