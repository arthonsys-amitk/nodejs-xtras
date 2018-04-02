module.exports = {
    mongoURI : 'mongodb://35.168.99.29:27017/xtras',
    base_url :  'http://35.168.99.29:3001',
    secret : 'ZCCCashMoney',
    expressPort : 3001,
    tokenExpiration : 1,
    
    emailFrom: 'rahul.soni@arthonsys.com',
    emailUser : 'rahul.soni@arthonsys.com',
    emailPass : 'Rahulsoni@120245',
    emailPort : 465,
    emailURL : 'smtp.gmail.com',

    passwordResetURL : 'http://localhost:3001/resetPassword/',
    secureAPI : false,

    payPalSuccessURL : 'http://localhost:3001/paypal',
    payPalCancelURL : 'http://localhost:3001/paypal',

};
