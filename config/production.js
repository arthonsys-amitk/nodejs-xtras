"use strict";
// NOTE - once code is in production, never change the value of secret, otherwise decryption will break for existing data

module.exports = {
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
  payPalSuccessURL : 'http://localhost:3001/paypal',
  payPalCancelURL : 'http://localhost:3001/paypal'
};
