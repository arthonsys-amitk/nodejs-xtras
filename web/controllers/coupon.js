"use strict";
var _      = require('lodash'),
    jwt    = require('jwt-simple'),
    fs     = require('fs'),
	nodemailer = require("nodemailer"),
    config = require('../../config'),
    {coupon} = require('../models'),
    {services} = require('../models'),
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
var dateFormat = require('dateformat');

var exportFuns = {},
    web = {};

// Display all coupons
web.get_coupon=(req,res)=>{
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
		coupon.get_coupons().then(function(coupon_result) {
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			if(coupon_result != null && coupon_result != undefined) {
				for(var i = 0; i < coupon_result.length; i++) {
					coupon_result[i].expiry_date = dateFormat(new Date(coupon_result[i].expiry_date), "dd mmmm yyyy");					
				}
			}
			res.render('admin/coupon/coupon_list',{"user_data":req.session.user_data,'coupon':coupon_result, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since});

		});
   	}
};

//edit coupon
web.edit = (req,res) => {
	var hostname = req.session.hostname || req.headers.host;
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true)
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else	{
		res.locals.flashmessages = req.session.alert_data;
		req.session.alert_data = null;

		var coupon_id = req.params.coupon_id;		
		coupon.get_coupon_by_coupon_id(coupon_id).then(function(coupon_details){
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			
			if(coupon_details.expiry_date != null && coupon_details.expiry_date != undefined && coupon_details.expiry_date != "") {
				coupon_details.expiry_date = dateFormat(new Date(coupon_details.expiry_date), "yyyy-mm-dd");
			}
			
			services.list_services()
			.then(function(services_recs){
				var service_ids = [];
				var service_names = [];
				for(var i = 0; i < services_recs.length; i++) {
					service_ids.push(services_recs[i]._id);
					service_names.push(services_recs[i].service_name);
				}
				res.render('admin/coupon/edit_coupon',{"user_data":req.session.user_data, "coupon": coupon_details, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "hostname" : hostname, "id_services" : service_ids, "service_names" : service_names });
			});			
		});
	}
};

//delete coupon
web.delete = (req,res) => {
	var hostname = req.session.hostname || req.headers.host;
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true)
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else	{
		if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
			var qrycount = 0;
			var resqueries = null;
		} else {
			var qrycount = req.session.resqueries.length;
			var resqueries = req.session.resqueries;
		}
		
		coupon.delete_coupon(req.params.coupon_id)
		.then(function(result_delete) {
			if(result_delete) {
				req.session.flash_msg = {"msg": "Coupon deleted successfully","type":"success"};
				req.session.alert_data = { alert_type: "success", alert_msg: req.session.flash_msg.msg };
				res.locals.flashmessages = req.session.alert_data;
			} else {
				req.session.flash_msg = {"msg": "Coupon could not be deleted","type":"danger"};
				req.session.alert_data = { alert_type: "danger", alert_msg: req.session.flash_msg.msg };
				res.locals.flashmessages = req.session.alert_data;				
			}
			res.redirect('/admin/coupon');
		});
	}
};

//display form for creating coupon
web.create = (req,res) => {
	var hostname = req.session.hostname || req.headers.host;
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true)
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else	{
		if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
			var qrycount = 0;
			var resqueries = null;
		} else {
			var qrycount = req.session.resqueries.length;
			var resqueries = req.session.resqueries;
		}
		services.list_services()
		.then(function(services_recs){
			var service_ids = [];
			var service_names = []
			for(var i = 0; i < services_recs.length; i++) {
				service_ids.push(services_recs[i]._id);
				service_names.push(services_recs[i].service_name);
			}
			res.render('admin/coupon/create',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "hostname" : hostname, "id_services" : service_ids, "service_names" : service_names });
		});		
	}
};

//add coupon
web.add_coupon = (req,res) => {
	var hostname = req.session.hostname || req.headers.host;
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true)
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else	{
		if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
			var qrycount = 0;
			var resqueries = null;
		} else {
			var qrycount = req.session.resqueries.length;
			var resqueries = req.session.resqueries;
		}
		coupon.add_coupon(req.body)
		.then(function(rescoupon){
			req.session.flash_msg = {"msg": "Coupon created successfully","type":"success"};
			req.session.alert_data = { alert_type: "success", alert_msg: req.session.flash_msg.msg };
			res.locals.flashmessages = req.session.alert_data;
			res.redirect('/admin/coupon');
		});
	}
};


//update coupon
web.update_coupon = (req,res) => {
	var hostname = req.session.hostname || req.headers.host;
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true)
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else	{
		if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
			var qrycount = 0;
			var resqueries = null;
		} else {
			var qrycount = req.session.resqueries.length;
			var resqueries = req.session.resqueries;
		}
		var service_ids = [];
		if(typeof req.body.service_ids == "string") {
			service_ids.push(req.body.service_ids);
		} else if((typeof req.body.service_ids == "object") && req.body.service_ids.length > 0) {
			for(var i = 0; i < req.body.service_ids.length; i++) {
				service_ids.push(req.body.service_ids[i]);
			}
		}
		req.body.service_ids = service_ids;
		coupon.update_coupon(req.body)
		.then(function(result_update) {
			if(result_update > 0) {
				req.session.flash_msg = {"msg": "Coupon updated successfully", "type":"success"};
				req.session.alert_data = { alert_type: "success", alert_msg: req.session.flash_msg.msg };
				res.locals.flashmessages = req.session.alert_data;
			} else {
				req.session.flash_msg = {"msg": "Coupon could not be updated", "type":"danger"};
				req.session.alert_data = { alert_type: "danger", alert_msg: req.session.flash_msg.msg };
				res.locals.flashmessages = req.session.alert_data;
			}
			res.redirect('/admin/coupon');
		});
	}
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

exportFuns.web = web;
module.exports = exportFuns;
