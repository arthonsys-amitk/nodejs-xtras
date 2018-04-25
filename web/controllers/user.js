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
        user.check_phone_exist(req.body.user_id,req.body.phone).then(function(single_user){
			if(single_user!=null)
			{
				req.session.alert_data = { alert_type: "danger", alert_msg: "Phone number already exist" };
				req.session.flash_msg={"msg":"Phone number already exist","type":"danger"};			
				user.get_user_by_user_id(req.session.user_data._id).then(function(result){
					res.redirect('/admin/user/edit/'+req.body.user_id);
					
				});
			}
			else{
		
			geocoder.geocode(req.body.address + req.body.city +  req.body.state + req.body.country, function(err, result){
				var latitude = 0;
				var longitude = 0;
				var zipcode= req.body.zip_code;
				if(result != [] && result.length > 0 && result) {
					latitude = result[0].latitude;
					longitude = result[0].longitude;
					if(req.body.zip_code) {
						zipcode= req.body.zip_code;
					} else {
						zipcode= result[0].zipcode;
					}
				}
				req.session.alert_data = { alert_type: "success", alert_msg: "Successfully Updated." };
				user.update_profile(req.body,req.files,latitude,longitude,zipcode).then(function(update_result){
					if(update_result == 1) {
						req.session.flash_msg={"msg":"Profile updated Successfully","type":"success"};
						req.session.alert_data = { alert_type: "success", alert_msg: "Profile updated Successfully" };
						res.locals.flashmessages = req.session.alert_data;
						user.get_user_by_user_id(req.session.user_data._id).then(function(result){
							res.redirect('/admin/user/edit/'+req.body.user_id);
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
							res.redirect('/admin/user/edit/'+req.body.user_id);
						});
					}
				});
			});
            }
		
    });
	}
};

/***************************End Update profile**************************** */

//update admin password
web.update_admin_password = (req, res) => {
	var hostname = req.session.hostname || req.headers.host;
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true){
		res.redirect('/admin');
	} else {
		res.locals.flashmessages = req.session.alert_data;
		req.session.alert_data = null;

		if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
			var qrycount = 0;
			var resqueries = null;
		} else {
			var qrycount = req.session.resqueries.length;
			var resqueries = req.session.resqueries;
		}
		var old_password = req.body.old_password;
		var new_password = req.body.new_password;
		var confirm_password = req.body.confirm_password;
		if(old_password == new_password) {
			req.session.alert_data = { alert_type: "danger", alert_msg: "New password cannot be same as the old password" };
			res.locals.flashmessages = req.session.alert_data;
			res.redirect('/admin/profile');
		}
		if(new_password != confirm_password) {
			req.session.alert_data = { alert_type: "danger", alert_msg: "New password does not match re-typed password" };
			res.locals.flashmessages = req.session.alert_data;
			res.redirect('/admin/profile');
		}
		user.check_old_password(req.session.user_data._id, crypto.encrypt(_.trim(old_password)))
		.then(function(auth_user){
			if(auth_user == null || auth_user == '') {
				req.session.alert_data = { alert_type: "danger", alert_msg: "Incorrect Password." };
				res.locals.flashmessages = req.session.alert_data;
				res.redirect('/admin/profile');
			} else {
				user.update_admin_password(req.session.user_data._id, new_password).then(function(response) {
					if(response == null) {
						req.session.alert_data = { alert_type: "danger", alert_msg: "Password could not be changed" };
						res.locals.flashmessages = req.session.alert_data;
						res.redirect('/admin/profile');

					} else {
						req.session.alert_data = { alert_type: "success", alert_msg: "Password changed successfully." };
						res.locals.flashmessages = req.session.alert_data;
						res.redirect('/admin/profile');
					}
				});
			}
		});		
	}
};

//update admin password
web.update_password = (req, res) => {
	var hostname = req.session.hostname || req.headers.host;
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true){
		res.redirect('/admin');
	} else {
		res.locals.flashmessages = req.session.alert_data;
		req.session.alert_data = null;

		if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
			var qrycount = 0;
			var resqueries = null;
		} else {
			var qrycount = req.session.resqueries.length;
			var resqueries = req.session.resqueries;
		}
		var new_password = req.body.new_password;
		console.log(req.body.user_id);
		user.update_admin_password(req.body.user_id, new_password).then(function(response) {
			   console.log(response);
					if(response == null) {
						req.session.alert_data = { alert_type: "danger", alert_msg: "Password could not be changed" };
						res.locals.flashmessages = req.session.alert_data;
						res.redirect('/admin/user/edit/'+req.body.user_id);
						
					} else {
						
						req.session.alert_data = { alert_type: "success", alert_msg: "Password changed successfully." };
						res.locals.flashmessages = req.session.alert_data;
						res.redirect('/admin/user/edit/'+req.body.user_id);
					}
		});
			
	}
};
web.create_user = (req, res)=>{
	var hostname = req.session.hostname || req.headers.host;
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true){
		res.redirect('/admin');
	} else {
		res.locals.flashmessages = req.session.alert_data;
		req.session.alert_data = null;

		if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
			var qrycount = 0;
			var resqueries = null;
		} else {
			var qrycount = req.session.resqueries.length;
			var resqueries = req.session.resqueries;
		}
		res.render('admin/users/add_user',{ "user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "hostname" : hostname });
	}
};


web.add_user = (req, res)=>{
	var hostname = req.session.hostname || req.headers.host;
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true){
		res.redirect('/admin');
	} else {
		if(req.body.password != req.body.confirm_password) {
			req.session.flash_msg = {"msg":"Password mismatch", "type":"success"};
			req.session.alert_data = { alert_type: "success", alert_msg: req.session.flash_msg.msg };
			res.locals.flashmessages = req.session.alert_data;
			res.redirect('/admin/user');
		}
		
		geocoder.geocode(req.body.address + req.body.city +  req.body.state + req.body.country, function(err, result){
			var latitude = 0;
			var longitude = 0;
			var zipcode= req.body.zip_code;				
			if(result != [] && result && result.length > 0) {
				latitude = result[0].latitude;
				longitude = result[0].longitude;
				if(req.body.zip_code) {
					zipcode= req.body.zip_code;
				} else {
					zipcode= result[0].zipcode;
				}
			}
			user.add_user(req.body, req.files, latitude, longitude, zipcode)
			.then(function(result){
				req.session.flash_msg={"msg":"User added successfully","type":"success"};
				req.session.alert_data = { alert_type: "success", alert_msg: "User added successfully" };
				res.locals.flashmessages = req.session.alert_data;
				res.redirect('/admin/user');
			});
		});
	}
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

exportFuns.web = web;
module.exports = exportFuns;
