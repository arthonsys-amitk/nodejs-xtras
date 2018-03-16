"use strict";
// NOTE - once code is in production, never change the value of secret, otherwise decryption will break for existing data

module.exports = {
  mongoURI : 'mongodb://localhost:27017/xtras',
  //mongoURI : 'mongodb://simon:Simon123@cluster0-shard-00-00-oipbz.mongodb.net:27017,cluster0-shard-00-01-oipbz.mongodb.net:27017,cluster0-shard-00-02-oipbz.mongodb.net:27017/zcecomm?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
  secret : 'ZCCCashMoney',
  tokenExpiration : 7,
  port : 80,
  secureAPI : true,
  testCCNum : '4242424242424242',
  testCCCVC : '4T59',
  authorizeNetLogin : '948pwpSGQ6r4',
  authorizeNetTransactionKey : '9zDgwwXK7K9e572g',
  checkExpiredLicenseDays : 10,
  useAuthorizeNetProduction : true,
  payPalSuccessURL : 'https://admin.drm.zencolor.com:3001/paypal',
  payPalCancelURL : 'https://admin.drm.zencolor.com:3001/paypal'
};
