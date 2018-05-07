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
web.configuration_settings=(req,res)=>{
	req.session.hostname = req.headers.host;
	var hostname = req.session.hostname;
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
		settings.get_configuration_settings().then(function(settings_result) {
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			//set config variables/settings
			var config_keyId = "";
			if(config.keyId != undefined && config.keyId != null) {
				config_keyId = config.keyId;
			}
			var config_teamId = "";
			if(config.teamId != undefined && config.teamId != null) {
				config_teamId = config.teamId;
			}
			var config_appBundleId = "";
			if( config.appBundleId != undefined &&  config.appBundleId != null) {
				  config_appBundleId = config.appBundleId;
			}
			var config_developer_mail = "";
			if(config.developer_mail != undefined && config.developer_mail !=null) {
				config_developer_mail = config.developer_mail;
			}
			var config_email_auth_user = "";
			if(config.email_auth_user != undefined && config.email_auth_user != null) {
				config_email_auth_user = config.email_auth_user;
			}
			var config_email_auth_password = "";
			if(config.email_auth_password != undefined && config.email_auth_password != null) {
				config_email_auth_password = config.email_auth_password;
			}
			var config_email_auth_service = "";
			if(config.email_auth_service != undefined && config.email_auth_service != null) {
				config_email_auth_service = config.email_auth_service;
			}
			var config_admin_contact_email = "";
			if(config.admin_contact_email != undefined && config.admin_contact_email != null) {
				config_admin_contact_email = config.admin_contact_email;
			}
			var cfg_android_fcm_key = "";
			if(config.fcmServerKey != null &&  config.fcmServerKey != undefined) {
				cfg_android_fcm_key = config.fcmServerKey;
			}
			res.render('admin/settings/configuration_settings',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "hostname": hostname, "settings" : settings_result, "cfg_ios_key_id": config_keyId, "cfg_ios_teamid" : config_teamId, "cfg_ios_app_bundleid": config_appBundleId, "cfg_developer_mail": config_developer_mail, "cfg_email_auth_user" : config_email_auth_user, "cfg_email_auth_password" : config_email_auth_password, "cfg_email_auth_service": config_email_auth_service, "cfg_admin_contact_email" : config_admin_contact_email, "cfg_android_fcm_key" : cfg_android_fcm_key});

		});
   	}
}
	
// Display all users
web.notification_settings=(req,res)=>{
	req.session.hostname = req.headers.host;
	var hostname = req.session.hostname;
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
			res.render('admin/settings/notification_settings',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "notifications_enabled" : enabled, "notifications_id" : key_id, "hostname": hostname});

		});
   	}
}

//update_email_settings
web.update_email_settings=(req,res)=>{
	req.session.hostname = req.headers.host;
	var hostname = req.session.hostname;
	settings.update_email_settings(req.body)
	.then(function(settings_result){
		if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
			var qrycount = 0;
			var resqueries = null;
		} else {
			var qrycount = req.session.resqueries.length;
			var resqueries = req.session.resqueries;
		}
		if(settings_result)
			req.session.alert_data = { alert_type: "success", alert_msg: "Email settings successfully updated." };
		else
			req.session.alert_data = { alert_type: "danger", alert_msg: "Email settings were not updated." };
		res.locals.flashmessages = req.session.alert_data;
		res.redirect("/admin/configuration_settings");
	});
};
	
//update setting for push notification
web.notification_update=(req,res)=>{
	req.session.hostname = req.headers.host;
	var hostname = req.session.hostname;
	var enable_notifications = "0";
	settings.update_notification_setting(req.body)
	.then(function(settings_result){
		if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
			var qrycount = 0;
			var resqueries = null;
		} else {
			var qrycount = req.session.resqueries.length;
			var resqueries = req.session.resqueries;
		}
		if(settings_result) {
			req.session.alert_data = { alert_type: "success", alert_msg: "Push notification settings successfully updated." };
		} else {
			req.session.alert_data = { alert_type: "danger", alert_msg: "Push notification settings were not updated." };
		}
		res.locals.flashmessages = req.session.alert_data;
		res.redirect("/admin/configuration_settings");
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
			res.render('admin/settings/privacy_policy',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since,'privacy_policy_data':result, "hostname": hostname});
		});
	}
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

exportFuns.web = web;
module.exports = exportFuns;
