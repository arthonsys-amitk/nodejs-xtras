"use strict";

var exportFuns = {},
    config     = require('../../config');


//+++++++++++++++++++++++++++++++++++++++ FOR ANDRIOD ++++++++++++++++++++++++++++++++++++++

var FCM = require('fcm-push');

var fcm = new FCM(config.fcmServerKey);

exportFuns.sendForAndroid = (messagePattern) => {

    //callback style
    fcm.send(messagePattern, function(err, response){
        if (err) {
            console.log("Android push notifications sending failed.");
        } else {
            //console.log("Successfully sent with response: ", response);
        }
    });
}

//+++++++++++++++++++++++++++++++++++++++ FOR IOS ++++++++++++++++++++++++++++++++++++++

var apn = require('apn');

var options = {
  token: {
    key: config.keyFilePath,
    keyId: config.keyId,
    teamId: config.teamId
  },
  production: true
};

var apnProvider = new apn.Provider(options);

exportFuns.sendForIOS = (deviceToken, alert_message, payload_data={}) => {

	var note = new apn.Notification();
	note.expiry = Math.floor(Date.now() / 1000) + 3600;
	note.topic = config.appBundleId;
	note.sound = "ping.aiff";
	note.alert = alert_message;
	note.payload = payload_data;

    apnProvider.send(note, deviceToken)
    .then( (result) => {
	  	// see documentation for an explanation of result
	  	console.log(result)
	});
}

module.exports = exportFuns;