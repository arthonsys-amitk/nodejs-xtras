"use strict";
var _      = require('lodash'),
    jwt    = require('jwt-simple'),
    fs     = require('fs'),
	nodemailer = require("nodemailer"),
    config = require('../../config'),
    {user} = require('../models'),
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
		user.all_user().then(function(user_result) {

			res.render('admin/users/user_list',{"user_data":req.session.user_data,'users':user_result});

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
			res.redirect('/admin/user');

		});
   	}
}
// Edit user
web.edit=(req,res)=>{
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
		user.get_user_by_user_id(user_id).then(function(user_details){
			res.render('admin/users/edit_user',{"user_data":req.session.user_data,'user':user_details});
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
			console.log(update_result);
			if(update_result==1)
			{
				req.session.flash_msg={"msg":"Profile updated Successfully","type":"success"};
				user.get_user_by_user_id(req.session.user_data._id).then(function(result){
				res.redirect('/admin/user');
				});
			}else
			{
				if(update_result==2){
					req.session.flash_msg={"msg":"invaild address","type":"danger"};
				
				}else{
						req.session.flash_msg={"msg":"Profile not updated","type":"danger"};
				}
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
