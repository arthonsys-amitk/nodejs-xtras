"use strict";

var exportFuns = {};

var config = require('../../config');
var nodemailer = require("nodemailer");
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


exportFuns.convertToSmallTime = (time) => {
	time = time.replace(' ', '');
	time = time.replace(/[PM|AM|am|pm]/g, '');
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

	if (time.length > 1) { // If time format correct
		time = time.slice (1);  // Remove full string match value
		time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
		time[0] = +time[0] % 12 || 12; // Adjust hours
	}
	return time.join (''); // return adjusted time or original string
};

exportFuns.getAsJsonObject = (jsvalue) => {
	if(typeof jsvalue != "string")
		return JSON.parse(JSON.stringify(jsvalue));
	else
		return JSON.parse(jsvalue);
};

exportFuns.sendNodeEmail = (from_email, to_email, subject, email_content) => {
		var transporter = nodemailer.createTransport({
			service: "" + config.email_auth_service,
			auth: {
			  user: "" + config.email_auth_user,
			  pass: "" + config.email_auth_password
			}
		});
  
		  var mailOptions = {
			from: "" + from_email,
			to: "" + to_email,
			subject: "" + subject,
			html: "Error Details(JSON):<br/>" + JSON.stringify(email_content, null, 4)
		  };
		transporter.sendMail(mailOptions);

};

module.exports = exportFuns;
