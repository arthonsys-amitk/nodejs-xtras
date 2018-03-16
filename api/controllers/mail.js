"use strict";

var _      = require('lodash'),
    config = require('../../config'),
    {mailHelper} = require('../models'),
    emailer = require('nodejs-nodemailer-outlook'),
    {mailHelper} = require('../models'),
    exportFuns = {};


exportFuns.sendPasswordReset = (email, link, name)=>{
  let msg = mailHelper.resetPassword(name, link);

  return sendMail(email, 'Your zenColor password reset', msg);
};

exportFuns.sendLostLicense = (email, productKey, name, productName, lostLicenseHelp)=>{
  let msg = mailHelper.retrieveLostLicense(name, productKey, productName, lostLicenseHelp);

  return sendMail(email, 'Your zenColor license information', msg);
};

exportFuns.sendReceipt = (purch, item, prod)=>{
  let msg = mailHelper.orderConfirmation(purch, item, prod);

  return sendMail(email, 'Your zenColor purchase information', msg);
};

exportFuns.sendNotificationEmail = (purch, prod)=>{

};

var sendMail = (email, subject, msg)=>{

  let mailOpts = {
    auth : {
        user: config.emailUser, // generated ethereal user
        pass: config.emailPass  // generated ethereal password
    },
    from : config.emailFrom, // sender address
    to : email, // list of receivers
    subject : subject, // Subject line
    text : msg, // plain text body
    html : msg
  };

  emailer.sendEmail(mailOpts);
  return true;
};


module.exports = exportFuns;
