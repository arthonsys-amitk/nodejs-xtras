"use strict";
var _      = require('lodash'),
    jwt    = require('jwt-simple'),
    fs     = require('fs'),
	nodemailer = require("nodemailer"),
    config = require('../../config'),
    {user} = require('../models'),
    {crypto} = require('../helpers'),
    userquery_model = require('../models/userquery'),
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
web.all_user=(req,res)=>{
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
		res.locals.flashmessages = req.session.alert_data;
		req.session.alert_data = null;
		
		user.all_user().then(function(user_result) {
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			res.render('admin/users/user_list',{"user_data":req.session.user_data,'users':user_result, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since});
		});
   	}
}

// Delete user
web.delete=(req,res)=>{
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
		var user_id=req.params.user_id;
		user.delete_user(user_id).then(function(delete_result) {
			req.session.alert_data = { alert_type: "success", alert_msg: "User record successfully deleted." };
			res.locals.flashmessages = req.session.alert_data;
			res.redirect('/admin/user');
		});
   	}
}
// Edit user
web.edit=(req,res)=>{
	var hostname = req.session.hostname || "";
		
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
		res.locals.flashmessages = req.session.alert_data;
		req.session.alert_data = null;

		var user_id=req.params.user_id;		
		user.get_user_by_user_id(user_id).then(function(user_details){
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			console.log("hostname");
			console.log(hostname);
			res.render('admin/users/edit_user',{"user_data":req.session.user_data,'user':user_details, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "hostname" : hostname });
		})
   	}
}

/***************************Update profile***********************************/

web.update_profile = (req, res)=>{
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true){
		res.redirect('/admin');
	}else
	{
		geocoder.geocode(req.body.address + req.body.city +  req.body.state + req.body.country, function(err, result){
		var latitude = result[0].latitude;
		var longitude = result[0].longitude;
		var zipcode= result[0].zipcode;
		req.session.alert_data = { alert_type: "success", alert_msg: "Successfully Updated." };
		user.update_profile(req.body,req.files,latitude,longitude,zipcode).then(function(update_result){
			if(update_result==1)
			{
				req.session.flash_msg={"msg":"Profile updated Successfully","type":"success"};
				req.session.alert_data = { alert_type: "success", alert_msg: "Profile updated Successfully" };
				res.locals.flashmessages = req.session.alert_data;
				user.get_user_by_user_id(req.session.user_data._id).then(function(result){
					res.redirect('/admin/user');
				});
			} else {
				if(update_result==2){
					req.session.alert_data = { alert_type: "danger", alert_msg: "Invaild Address" };
					req.session.flash_msg={"msg":"Invaild Address","type":"danger"};				
				} else {
					req.session.alert_data = { alert_type: "danger", alert_msg: "Profile could not be updated." };
					req.session.flash_msg={"msg":"Profile could not be updated","type":"danger"};
				}
				res.locals.flashmessages = req.session.alert_data;
				user.get_user_by_user_id(req.session.user_data._id).then(function(result){
					res.redirect('/admin/user');
				});
			}
		});
	});
	}
};

/***************************End Update profile**************************** */

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

exportFuns.web = web;
module.exports = exportFuns;
