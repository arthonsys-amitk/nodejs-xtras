// TODO - set passwordResetURL to real url
module.exports = {
  mongoURI : 'mongodb://localhost:27017/xtras',
  //mongoURI : 'mongodb://simon:Simon123@cluster0-shard-00-00-oipbz.mongodb.net:27017,cluster0-shard-00-01-oipbz.mongodb.net:27017,cluster0-shard-00-02-oipbz.mongodb.net:27017/zcecomm?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
  secret : 'ZCCCashMoney',
  tokenExpiration : 1,
  expressPort : 3010,
  emailUser : 'no-reply@zencolor.com',
  emailFrom: 'no-reply@zencolor.com',
  emailPass : 'N0R3ply',
  emailPort : 465,
  emailURL : 'smtpout.secureserver.net',
  passwordResetURL : 'https://admin.drm.zencolor.com/resetPassword/',
  secureAPI : false,
  testCCNum : '4242424242424242',
  testCCCVC : '4T59',
  authorizeNetLogin : '948pwpSGQ6r4',
  authorizeNetTransactionKey : '9zDgwwXK7K9e572g',
  checkExpiredLicenseDays : 10,
  useAuthorizeNetProduction : false,
  payPalSuccessURL : 'https://admin.drm.zencolor.com:3001/paypal',
  payPalCancelURL : 'https://admin.drm.zencolor.com:3001/paypal'
};
