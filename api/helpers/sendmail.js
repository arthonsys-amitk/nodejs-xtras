"use strict";

var exportFuns = {};

var config = require('../../config');
const sendmail = require('sendmail')();

exportFuns.sendEmail = (to_email, subject, message) => {
    sendmail({
            from: config.emailFrom,
            to: to_email,
            subject: subject,
            html: message,
          }, function(err, response) {
            //console.log(response);
        });
};

module.exports = exportFuns;
