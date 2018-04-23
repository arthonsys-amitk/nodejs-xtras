"use strict";
var _      = require('lodash'),
    jwt    = require('jwt-simple'),
    fs     = require('fs'),
	nodemailer = require("nodemailer"),
    config = require('../../config'),
    {settings} = require('../models'),
    {crypto} = require('../helpers'),
    {sendmail} = require('../helpers');
var NodeGeocoder = require('node-geocoder');
var options = {
                provider: 'google',
                httpAdapter: 'https',
                apiKey: 'AIzaSyCnHXmtGqz7eOZg2rW9U20KDit1tRF6rhU',
                formatter: null
              };
var geocoder = NodeGeocoder(options);	
var exportFuns = {},
    web = {};

// Display all users
web.notification_settings=(req,res)=>{
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true)
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
	    {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	}else
	{
		if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
            res.locals.flashmessages = req.session.alert_data;
            req.session.alert_data = null;
        }
		settings.get_notification_settings().then(function(settings_result) {
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			var enabled = "0";
			if(settings_result != null && settings_result != undefined) {
				enabled = settings_result.value;				
			}
			var key_id = "";
			if(settings_result._id != null && settings_result._id != undefined)
				key_id = settings_result._id;
			res.render('admin/settings/notification_settings',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "notifications_enabled" : enabled, "notifications_id" : key_id});

		});
   	}
}

//update setting for push notification
web.notification_update=(req,res)=>{
	var enable_notifications = "0";
	if(req.body.chk_notifications != null && req.body.chk_notifications != "undefined")
		enable_notifications = "1";
	var settings_id = "";
	if(req.body.settings_id != null && req.body.settings_id != "undefined")
		settings_id = req.body.settings_id;
	settings.update_notification_setting(settings_id, enable_notifications)
	.then(function(settings_result){
		if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
			var qrycount = 0;
			var resqueries = null;
		} else {
			var qrycount = req.session.resqueries.length;
			var resqueries = req.session.resqueries;
		}
		var enabled = "0";
		if(settings_result != null && settings_result != "undefined") {
			enabled = settings_result.value;
		}
		var key_id = "";
		if(settings_result._id != null && settings_result._id != undefined)
			key_id = settings_result._id;
		req.session.alert_data = { alert_type: "success", alert_msg: "Successfully Updated." };
		res.locals.flashmessages = req.session.alert_data;
		res.render('admin/settings/notification_settings',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "notifications_enabled" : enabled, "notifications_id" : key_id});
	});
};

//payment_settings
web.payment_settings = (req,res) => {
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true )
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
	    {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else {
		var hostname = req.session.hostname || req.headers.host;
		res.locals.flashmessages = req.session.alert_data;
		req.session.alert_data = null;
		settings.get_payment_settings()
		.then(function(payment_config){
			var stripe_email = "merchant@mailinator.com";
			var stripe_secret_key = "sk_test_xxxxxxxxxxxxxxxxx";
			var stripe_publishable_key = "pk_test_xxxxxxxxxxxxxxxxx";
			var stripe_mode = "sandbox"; //sandbox/production
			if(payment_config != null && payment_config.length > 0) {
				for(var i = 0; i < payment_config.length; i++) {
					if(payment_config[i].key == "stripe_email") {	stripe_email = payment_config[i].value;		}
					if(payment_config[i].key == "stripe_secret_key") {	stripe_secret_key = payment_config[i].value;		}
					if(payment_config[i].key == "stripe_publishable_key") {	stripe_publishable_key = payment_config[i].value;		}
					if(payment_config[i].key == "stripe_mode") {	stripe_mode = payment_config[i].value;		}
				}
			}
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			res.render('admin/settings/payment_settings',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "stripe_email" : stripe_email, "stripe_secret_key" : stripe_secret_key, "stripe_publishable_key" : stripe_publishable_key, "stripe_mode" : stripe_mode, "hostname" : hostname });
		});
	}
};

//update payment settings
web.update_payment_settings = (req,res) => {
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true )
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
	    {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else {
		settings.update_payment_settings(req.body)
		.then(function(update_result){
			if(update_result) {
				req.session.flash_msg = {"msg": "Payment settings updated successfully", "type":"success"};
				req.session.alert_data = { alert_type: "success", alert_msg: req.session.flash_msg.msg };
			} else {
				req.session.flash_msg = {"msg": "Payment settings were not updated", "type":"danger"};
				req.session.alert_data = { alert_type: "danger", alert_msg: req.session.flash_msg.msg };
			}
			res.redirect('/admin/payment_settings');
		});		
	}
};
//update privacy policy
web.privacy_policy = (req,res) => {
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true )
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
	    {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else {
		settings.privacy_policy(req.body)
		.then(function(update_result){
			if(update_result) {
				req.session.flash_msg = {"msg": "Privacy policy updated successfully", "type":"success"};
				req.session.alert_data = { alert_type: "success", alert_msg: req.session.flash_msg.msg };
			} else {
				req.session.flash_msg = {"msg": "Privacy policy were not updated", "type":"danger"};
				req.session.alert_data = { alert_type: "danger", alert_msg: req.session.flash_msg.msg };
			}
			res.redirect('/admin/privacy_policy');
		});		
	}
};
web.get_privacy_policy= (req,res) => {
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true )
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
	    {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else {
		var hostname = req.session.hostname || req.headers.host;
		res.locals.flashmessages = req.session.alert_data;
		req.session.alert_data = null;
		settings.get_privacy_policy()
		.then(function(result){
			
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			console.log(result);
			res.render('admin/settings/privacy_policy',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since,'privacy_policy_data':result});
		});
	}
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

exportFuns.web = web;
module.exports = exportFuns;
