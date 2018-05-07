"use strict";
var _      = require('lodash'),
    jwt    = require('jwt-simple'),
    fs     = require('fs'),
	nodemailer = require("nodemailer"),
    config = require('../../config'),
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
const mongo = require('mongodb');
var exportFuns = {},
    web = {};

// Display all services
web.list_services=(req,res)=>{
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
		services.list_services().then(function(services_result) {
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			res.render('admin/services/list',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "services_list" : services_result, "hostname" : hostname});
		});
   	}
};

// Edit service
web.edit = (req, res) => {
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
	} else {
		if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
            res.locals.flashmessages = req.session.alert_data;
            req.session.alert_data = null;
        }
	}
	services.get_service_details(req.params.service_id)
	.then(function(res_service){
		if(res_service == null || res_service == undefined || res_service == "") {
			req.session.flash_msg = {"msg": "Service details could not be fetched", "type": "danger"};
			req.session.alert_data = { alert_type: "danger", alert_msg: req.session.flash_msg.msg };
			res.redirect('/admin/list_services');
		} else {
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			res.render('admin/services/edit_services',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "service" : res_service, "hostname" : hostname});
		}
	});
};

// View Service
web.view = (req, res) => {
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
	} else {
		if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
            res.locals.flashmessages = req.session.alert_data;
            req.session.alert_data = null;
        }
	}
	services.get_service_details(req.params.service_id)
	.then(function(res_service){
		if(res_service == null || res_service == undefined || res_service == "") {
			req.session.flash_msg = {"msg": "Service details could not be fetched", "type": "danger"};
			req.session.alert_data = { alert_type: "danger", alert_msg: req.session.flash_msg.msg };
			res.redirect('/admin/list_services');
		} else {
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			res.render('admin/services/view_services',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "service" : res_service, "hostname" : hostname});
		}
	});
};


//transaction list
web.transaction_list = (req, res) => {
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
	} else {
		if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
            res.locals.flashmessages = req.session.alert_data;
            req.session.alert_data = null;
        }
		services.get_transaction_list()
		.then(function(res_transactions){
			var transaction_recs = res_transactions[0];
			var user_recs = res_transactions[1];
			var user_id_recs = res_transactions[2];
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			for(var i = 0; i < transaction_recs.length; i++) {
				transaction_recs[i].created_at = dateFormat(new Date(transaction_recs[i].created_at), "dd-mm-yyyy hh:MM:ss TT");
			}
			res.render('admin/services/transaction_list',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "transactions" : transaction_recs, "users" : user_recs, "arr_user_ids" : user_id_recs, "hostname" : hostname});
		});
	}
};

//view transaction details
web.view_transaction = (req, res) => {
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
	} else {
		var payment_id = req.params.payment_id;
		if(payment_id == null || payment_id == undefined || payment_id == "") {
			//req.session.flash_msg={"msg":"Invalid Request","type":"danger"};
			req.session.alert_data = { alert_type: "danger", alert_msg: "Invalid Request" };
			//res.locals.flashmessages = req.session.alert_data;
			res.redirect('/admin/transaction_list');
		}
		if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
            res.locals.flashmessages = req.session.alert_data;
            req.session.alert_data = null;
        }
		services.get_transaction_details(payment_id)
		.then(function(res_transaction){
		   var tran_appmt_id = 0;
			if(res_transaction != null && res_transaction != undefined && res_transaction != [] && res_transaction.length > 0) {
				tran_appmt_id = res_transaction[0].appointment_id;
			}
			services.get_appointment_details(tran_appmt_id)
			.then(function(res_appmt){
				if(res_appmt == null || res_appmt == undefined || res_appmt.provider_firstname == null || res_appmt.provider_firstname == undefined || res_appmt.provider_lastname == null || res_appmt.provider_lastname == undefined) {
					req.session.alert_data = { alert_type: "danger", alert_msg: "Appointment Details could not be fetched" };
					res.redirect('/admin/transaction_list');
				}
				var provider_name = res_appmt.provider_firstname + " " + res_appmt.provider_lastname;
				
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			if(res_transaction != null && res_transaction != undefined && res_transaction != [] && res_transaction.length > 0) {
				var rec_transaction = res_transaction[0];
				var rec_user = res_transaction[1];
				rec_transaction.created_at = dateFormat(new Date(rec_transaction.created_at), "dd-mm-yyyy hh:MM:ss TT");
					var appointment_date = dateFormat(new Date(res_appmt.created_at), "dd-mm-yyyy hh:MM TT");
					res.render('admin/services/transaction_details',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "transaction" : rec_transaction, "user" : rec_user, "hostname" : hostname, "provider_name" : provider_name, "appointment_date": appointment_date});
			} else {
				req.session.alert_data = { alert_type: "danger", alert_msg: "Details could not be fetched" };
				res.redirect('/admin/transaction_list');
			}
         });
		});
	}
};
//filter date for payment
web.filter_payment=(req,res)=>{
	req.session.hostname = req.headers.host;
	var hostname = req.session.hostname;
	services.filter_payment(req.body).then(function(res_transaction){
		console.log(res_transaction);
		if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
			var qrycount = 0;
			var resqueries = null;
		} else {
			var qrycount = req.session.resqueries.length;
			var resqueries = req.session.resqueries;
		}
		if(res_transaction != null && res_transaction != undefined && res_transaction != [] && res_transaction.length > 0) {
			var rec_transaction = res_transaction[0];
			var rec_user = res_transaction[1];
			res.render('admin/services/filter_date',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "transactions" : res_transaction, "user" : rec_user, "hostname": hostname});
		}else{
			req.session.alert_data = { alert_type: "danger", alert_msg: "Details could not be fetched" };
			res.redirect('/admin/transaction_list');
		} 
	});
}
//show add service/post form
web.create_service = (req, res) => {
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
	} else {
		if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
            res.locals.flashmessages = req.session.alert_data;
            req.session.alert_data = null;
        }
		services.create_service()
		.then(function(res_service){
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			if(res_service != null && res_service != undefined && res_service != {} ) {
				res.render('admin/services/add_service',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "service" : res_service, "hostname" : hostname});
			}
		});
	}
};

//add service/post 
web.update_service = (req, res) => {
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true)
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
	    {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else { 
		if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
            res.locals.flashmessages = req.session.alert_data;
            req.session.alert_data = null;
        }
		
		
		var arr_area_pricing = [];
		if(typeof req.body.area_from_sqft == "object") {
			//array			
			if(typeof req.body.area_id == "object") {
				var num_prev_elts = req.body.area_id.length;
			} else {
				var num_prev_elts = 1;
			}
			
			for(var i = 0; i < num_prev_elts; i++) {
				var obj_service_area = {};
				obj_service_area._id = req.body.area_id[i];
				obj_service_area.area_from_sqft = req.body.area_from_sqft[i];
				obj_service_area.area_to_sqft = req.body.area_to_sqft[i];
				obj_service_area.price = req.body.area_price[i];
				arr_area_pricing.push(obj_service_area);
			}
			for(i = num_prev_elts; i < req.body.area_from_sqft.length; i++) {
				var obj_service_area = {};
				obj_service_area._id = new mongo.ObjectID();
				obj_service_area.area_from_sqft = req.body.area_from_sqft[i];
				obj_service_area.area_to_sqft = req.body.area_to_sqft[i];
				obj_service_area.price = req.body.area_price[i];
				arr_area_pricing.push(obj_service_area);
			}
			
		} else {
			//string
			var obj_service_area = {};
			obj_service_area._id = req.body.area_id;
			obj_service_area.area_from_sqft = req.body.area_from_sqft;
			obj_service_area.area_to_sqft = req.body.area_to_sqft;
			obj_service_area.price = req.body.area_price;
			arr_area_pricing.push(obj_service_area);
		}
		
		var arr_grass_pricing = [];
		if(typeof req.body.grass_from_sqft == "object") {
			//array
			if(typeof req.body.grass_id == "object") {
				var num_prev_elts = req.body.grass_id.length;
			} else {
				var num_prev_elts = 1;
			}
			
			for(var i = 0; i < num_prev_elts; i++) {
				var obj_grass_area = {};
				obj_grass_area._id = req.body.grass_id[i];
				obj_grass_area.area_from_sqft = req.body.grass_from_sqft[i];
				obj_grass_area.area_to_sqft = req.body.grass_to_sqft[i];
				obj_grass_area.price = req.body.grass_price[i];
				arr_grass_pricing.push(obj_grass_area);
			}
			for(var i = num_prev_elts; i < req.body.grass_from_sqft.length; i++) {
				var obj_grass_area = {};
				obj_grass_area._id = new mongo.ObjectID();
				obj_grass_area.area_from_sqft = req.body.grass_from_sqft[i];
				obj_grass_area.area_to_sqft = req.body.grass_to_sqft[i];
				obj_grass_area.price = req.body.grass_price[i];
				arr_grass_pricing.push(obj_grass_area);
			}
			
		} else {
			//string
			var obj_grass_area = {};
			obj_grass_area._id = req.body.grass_id;
			obj_grass_area.area_from_sqft = req.body.grass_from_sqft;
			obj_grass_area.area_to_sqft = req.body.grass_to_sqft;
			obj_grass_area.price = req.body.grass_price;
			arr_grass_pricing.push(obj_grass_area);
		}
		
		
		var arr_addon_pricing = [];
		if(typeof req.body.addon_name == "object") {
			//array
			if(typeof req.body.addon_id == "object") {
				var num_prev_elts = req.body.addon_id.length;
			} else {
				var num_prev_elts = 1;
			}
			
			for(var i = 0; i < num_prev_elts; i++) {
				var obj_addon = {};
				obj_addon._id = req.body.addon_id[i];
				obj_addon.name = req.body.addon_name[i];
				obj_addon.price = req.body.addon_price[i];
				arr_addon_pricing.push(obj_addon);
			}
			
			for(var i = num_prev_elts; i < req.body.addon_name.length; i++) {
				var obj_addon = {};
				obj_addon._id = new mongo.ObjectID();
				obj_addon.name = req.body.addon_name[i];
				obj_addon.price = req.body.addon_price[i];
				arr_addon_pricing.push(obj_addon);
			}
			
		} else {
			//string
			var obj_addon = {};
			obj_addon._id = req.body.addon_id;
			obj_addon.name = req.body.addon_name;
			obj_addon.price = req.body.addon_price;
			arr_addon_pricing.push(obj_addon);
		}
		
		let servicedata = {
			service_category_id : req.body.service_category_id,
			service_name : _.trim(req.body.service_name),
			service_type : req.body.service_type,
			additional_details : _.trim(req.body.additional_details),
			service_radius: req.body.service_radius,
			service_radius_units: req.body.service_radius_units,
			weekday_start_time: req.body.weekday_start_time,
			weekday_stop_time: req.body.weekday_stop_time,
			weekend_start_time: req.body.weekend_start_time,
			weekend_stop_time: req.body.weekend_stop_time,
			cancel_hours: req.body.cancel_hours,
			cancel_fee: req.body.cancel_fee,
			reschedule_hours: req.body.reschedule_hours,
			reschedule_fee: req.body.reschedule_fee,
			address: _.trim(req.body.address),
			city: _.trim(req.body.city),
			province: _.trim(req.body.province),
			country: req.body.country,
			zipcode: req.body.zipcode,
			rating: ""+ req.body.rating,
			currency: req.body.currency,
			is_deleted: 0,
			user_id: req.body.user_id,
			parent_category_id: req.body.parent_category_id,
			parent_category_name: req.body.parent_category_name,
			service_area_and_pricing: arr_area_pricing,
			service_grass_snow_height: arr_grass_pricing,
			service_addons: arr_addon_pricing,
			service_options: [],
		};
		
		
		if(req.body.is_active == null || req.body.is_active == undefined || req.body.is_active == "") {
			servicedata.is_active = 0;
		} else {
			servicedata.is_active = 1;
		}
		
		var availability = req.body.service_availability;
		servicedata.available_monday = 0;
		servicedata.available_tuesday = 0;
		servicedata.available_wednesday = 0;
		servicedata.available_thursday = 0;
		servicedata.available_friday = 0;
		servicedata.available_saturday = 0;
		servicedata.available_sunday = 0;
		if(typeof availability == "object") {
			//array
			for(var i = 0; i < availability.length; i++) {
				if(availability[i] == "available_monday")  { servicedata.available_monday = 1;}
				if(availability[i] == "available_tuesday")  { servicedata.available_tuesday = 1;}
				if(availability[i] == "available_wednesday")  { servicedata.available_wednesday = 1;}
				if(availability[i] == "available_thursday")  { servicedata.available_thursday = 1;}
				if(availability[i] == "available_friday")  { servicedata.available_friday = 1;}
				if(availability[i] == "available_saturday")  { servicedata.available_saturday = 1;}
				if(availability[i] == "available_sunday")  { servicedata.available_sunday = 1;}
			}
		} else {
			switch(availability) {
				case "available_monday" : servicedata.available_monday = 1; break;
				case "available_tuesday" : servicedata.available_tuesday = 1; break;
				case "available_wednesday" : servicedata.available_wednesday = 1; break;
				case "available_thursday" : servicedata.available_thursday = 1; break;
				case "available_friday" : servicedata.available_friday = 1; break;
				case "available_saturday" : servicedata.available_saturday = 1; break;
				case "available_sunday" : servicedata.available_sunday = 1; break;				
			}
		}
		
		//reschedule policy
		if(req.files.cancel_rsh_policy != '' && req.files.cancel_rsh_policy != undefined) {
			let cancelFile = req.files.cancel_rsh_policy;
			var file_name = "cancelpolicy_"  + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
			servicedata.cancel_rsh_policy = config.base_url + '/uploads/policies/' + file_name;
			cancelFile.mv('public/uploads/policies/' + file_name, function(err) {
				if (err){
				  console.log(err);
				}
			});
		}
		
		//legal policy
		if(req.files.legal_policy != '' && req.files.legal_policy != undefined) {
			let legalFile = req.files.legal_policy;
			var file_name = "legalpolicy_"  + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
			servicedata.legal_policy = config.base_url + '/uploads/policies/' + file_name;
			legalFile.mv('public/uploads/policies/' + file_name, function(err) {
				if (err){
				  console.log(err);
				}
			});
		}
		
		//fileupload
		var  svc_uploads = [];
		
		let uploadedFile1 = req.files.fileupload1;
		servicedata.uploadedFile1 = "";
		if(uploadedFile1 != undefined && uploadedFile1 != null) {
			var file_name = "service_"  + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
			svc_uploads.push(config.base_url + '/uploads/services/' + file_name);
			servicedata.uploadedFile1 = config.base_url + '/uploads/services/' + file_name;
			uploadedFile1.mv('public/uploads/services/' + file_name, function(err) {
				if (err){
				  console.log(err);
				}
			});
		}
		
		let uploadedFile2 = req.files.fileupload2;
		servicedata.uploadedFile2 = "";
		if(uploadedFile2 != undefined && uploadedFile2 != null) {
			var file_name = "service_"  + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
			svc_uploads.push(config.base_url + '/uploads/services/' + file_name);
			servicedata.uploadedFile2 = config.base_url + '/uploads/services/' + file_name;
			uploadedFile2.mv('public/uploads/services/' + file_name, function(err) {
				if (err){
				  console.log(err);
				}
			});
		}
		
		
		let uploadedFile3 = req.files.fileupload3;
		servicedata.uploadedFile3 = "";
		if(uploadedFile3 != undefined && uploadedFile3 != null) {
			var file_name = "service_"  + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
			svc_uploads.push(config.base_url + '/uploads/services/' + file_name);
			servicedata.uploadedFile3 = config.base_url + '/uploads/services/' + file_name;
			uploadedFile3.mv('public/uploads/services/' + file_name, function(err) {
				if (err){
				  console.log(err);
				}
			});
		}
		
		let uploadedFile4 = req.files.fileupload4;
		servicedata.uploadedFile4 = "";
		if(uploadedFile4 != undefined && uploadedFile4 != null) {
			var file_name = "service_"  + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
			svc_uploads.push(config.base_url + '/uploads/services/' + file_name);
			servicedata.uploadedFile4 = config.base_url + '/uploads/services/' + file_name;
			uploadedFile4.mv('public/uploads/services/' + file_name, function(err) {
				if (err){
				  console.log(err);
				}
			});
		}
		
		/*
		if(svc_uploads != [] && svc_uploads.length > 0) {
			servicedata.service_uploads = svc_uploads;
		}
		*/
		
		var service_id = req.body.service_id;
		if(service_id == null || service_id == undefined  || service_id == "") {
			req.session.alert_data = { alert_type: "danger", alert_msg: "Invalid request" };
			res.redirect('/admin/list_services');
		}
				
		services.update_service(service_id, servicedata)
		.then(function(res_service){
			if(res_service) {
				req.session.alert_data = { alert_type: "success", alert_msg: "Service updated successfully" };
			} else {
				req.session.alert_data = { alert_type: "danger", alert_msg: "Service was not updated" };
			}
			res.redirect('/admin/list_services');
		});
	}
};


//add service/post 
web.post_service = (req, res) => {
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true)
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
	    {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else { 
		if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
            res.locals.flashmessages = req.session.alert_data;
            req.session.alert_data = null;
        }
		
		
		var arr_area_pricing = [];
		if(typeof req.body.area_from_sqft == "object") {
			//array
			if(req.body.area_from_sqft.length != req.body.area_to_sqft.length || req.body.area_from_sqft.length != req.body.area_price.length) {
				req.session.alert_data = { alert_type: "danger", alert_msg: "Invalid service area pricing values" };
				res.redirect('/admin/list_services');
			}
			for(var i = 0; i < req.body.area_from_sqft.length; i++) {
				var obj_service_area = {};
				if(req.body.area_from_sqft[i] != null && req.body.area_from_sqft[i] != undefined && req.body.area_from_sqft[i] != "") {
					obj_service_area._id = new mongo.ObjectID();
					obj_service_area.area_from_sqft = req.body.area_from_sqft[i];
					obj_service_area.area_to_sqft = req.body.area_to_sqft[i];
					obj_service_area.price = req.body.area_price[i];
					arr_area_pricing.push(obj_service_area);
				}
			}
			
		} else {
			//string
			var obj_service_area = {};
			obj_service_area._id = new mongo.ObjectID();
			if(req.body.area_from_sqft != null && req.body.area_from_sqft != undefined && req.body.area_from_sqft != "") {
				obj_service_area.area_from_sqft = req.body.area_from_sqft;
				obj_service_area.area_to_sqft = req.body.area_to_sqft;
				obj_service_area.price = req.body.area_price;
				arr_area_pricing.push(obj_service_area);
			}
		}
		
		var arr_grass_pricing = [];
		if(typeof req.body.grass_from_sqft == "object") {
			//array
			if(req.body.grass_from_sqft.length != req.body.grass_to_sqft.length || req.body.grass_from_sqft.length != req.body.grass_price.length) {
				req.session.alert_data = { alert_type: "danger", alert_msg: "Invalid grass area pricing values" };
				res.redirect('/admin/list_services');
			}
			for(var i = 0; i < req.body.grass_from_sqft.length; i++) {
				var obj_grass_area = {};
				obj_grass_area._id = new mongo.ObjectID();
				if(req.body.grass_from_sqft[i] != null && req.body.grass_from_sqft[i] != undefined && req.body.grass_from_sqft[i] != "") {
					obj_grass_area.area_from_sqft = req.body.grass_from_sqft[i];
					obj_grass_area.area_to_sqft = req.body.grass_to_sqft[i];
					obj_grass_area.price = req.body.grass_price[i];
					arr_grass_pricing.push(obj_grass_area);
				}
			}
			
		} else {
			//string
			var obj_grass_area = {};
			obj_grass_area._id = new mongo.ObjectID();
			if(req.body.grass_from_sqft != null && req.body.grass_from_sqft != undefined && req.body.grass_from_sqft != "") {
				obj_grass_area.area_from_sqft = req.body.grass_from_sqft;
				obj_grass_area.area_to_sqft = req.body.grass_to_sqft;
				obj_grass_area.price = req.body.grass_price;
				arr_grass_pricing.push(obj_grass_area);
			}
		}
		
		
		var arr_addon_pricing = [];
		if(typeof req.body.addon_name == "object") {
			//array
			if(req.body.addon_name.length != req.body.addon_name.price) {
				req.session.alert_data = { alert_type: "danger", alert_msg: "Invalid addon pricing values" };
				res.redirect('/admin/list_services');
			}
			for(var i = 0; i < req.body.addon_name.length; i++) {
				var obj_addon = {};
				if(req.body.addon_name[i] != null && req.body.addon_name[i] != undefined && req.body.addon_name[i] != "") {
					obj_addon._id = new mongo.ObjectID();
					obj_addon.name = req.body.addon_name[i];
					obj_addon.price = req.body.addon_price[i];
					arr_addon_pricing.push(obj_addon);
				}
			}
			
		} else {
			//string
			var obj_addon = {};
			if(req.body.addon_name != null && req.body.addon_name != undefined && req.body.addon_name != "") {
			obj_addon._id = new mongo.ObjectID();
			obj_addon.name = req.body.addon_name;
			obj_addon.price = req.body.addon_price;
			arr_addon_pricing.push(obj_addon);
			}
		}
				
		
		var arr_option_pricing = [];
		if(typeof req.body.option_name == "object") {
			//array
			if(req.body.option_name.length != req.body.option_name.price) {
				req.session.alert_data = { alert_type: "danger", alert_msg: "Invalid option pricing values" };
				res.redirect('/admin/list_services');
			}
			for(var i = 0; i < req.body.option_name.length; i++) {
				var obj_option = {};
				obj_option._id = new mongo.ObjectID();
				obj_option.name = req.body.option_name[i];
				obj_option.price = req.body.option_price[i];
				arr_option_pricing.push(obj_option);
			}
			
		} else {
			//string
			var obj_option = {};
			obj_option._id = new mongo.ObjectID();
			obj_option.name = req.body.option_name;
			obj_option.price = req.body.option_price;
			arr_option_pricing.push(obj_option);
		}
		
		let servicedata = {
			service_category_id : req.body.service_category_id,
			service_name : _.trim(req.body.service_name),
			service_type : req.body.service_type,
			additional_details : _.trim(req.body.additional_details),
			service_radius: req.body.service_radius,
			service_radius_units: req.body.service_radius_units,
			weekday_start_time: req.body.weekday_start_time,
			weekday_stop_time: req.body.weekday_stop_time,
			weekend_start_time: req.body.weekend_start_time,
			weekend_stop_time: req.body.weekend_stop_time,
			cancel_hours: req.body.cancel_hours,
			cancel_fee: req.body.cancel_fee,
			reschedule_hours: req.body.reschedule_hours,
			reschedule_fee: req.body.reschedule_fee,
			address: _.trim(req.body.address),
			city: _.trim(req.body.city),
			province: _.trim(req.body.province),
			country: req.body.country,
			zipcode: req.body.zipcode,
			rating: ""+ req.body.rating,
			currency: req.body.currency,
			is_deleted: 0,
			user_id: req.body.user_id,
			parent_category_id: req.body.parent_category_id,
			parent_category_name: req.body.parent_category_name,
			service_area_and_pricing: arr_area_pricing,
			service_grass_snow_height: arr_grass_pricing,
			service_addons: arr_addon_pricing,
			service_options: arr_option_pricing,
		};
		
		
		if(req.body.is_active == null || req.body.is_active == undefined || req.body.is_active == "") {
			servicedata.is_active = 0;
		} else {
			servicedata.is_active = 1;
		}
		
		var availability = req.body.service_availability;
		servicedata.available_monday = 0;
		servicedata.available_tuesday = 0;
		servicedata.available_wednesday = 0;
		servicedata.available_thursday = 0;
		servicedata.available_friday = 0;
		servicedata.available_saturday = 0;
		servicedata.available_sunday = 0;		
		if(typeof availability == "object") {
			//array
			for(var i = 0; i < availability.length; i++) {
				if(availability[i] == "available_monday")  { servicedata.available_monday = 1;}
				if(availability[i] == "available_tuesday")  { servicedata.available_tuesday = 1;}
				if(availability[i] == "available_wednesday")  { servicedata.available_wednesday = 1;}
				if(availability[i] == "available_thursday")  { servicedata.available_thursday = 1;}
				if(availability[i] == "available_friday")  { servicedata.available_friday = 1;}
				if(availability[i] == "available_saturday")  { servicedata.available_saturday = 1;}
				if(availability[i] == "available_sunday")  { servicedata.available_sunday = 1;}
			}
		} else {
			switch(availability) {
				case "available_monday" : servicedata.available_monday = 1; break;
				case "available_tuesday" : servicedata.available_tuesday = 1; break;
				case "available_wednesday" : servicedata.available_wednesday = 1; break;
				case "available_thursday" : servicedata.available_thursday = 1; break;
				case "available_friday" : servicedata.available_friday = 1; break;
				case "available_saturday" : servicedata.available_saturday = 1; break;
				case "available_sunday" : servicedata.available_sunday = 1; break;				
			}
		}
				
		//reschedule policy
		servicedata.cancel_rsh_policy = "";
		if(req.files.cancel_rsh_policy != '' && req.files.cancel_rsh_policy != undefined) {
			let cancelFile = req.files.cancel_rsh_policy;
			var file_name = "cancelpolicy_"  + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
			servicedata.cancel_rsh_policy = config.base_url + '/uploads/policies/' + file_name;
			cancelFile.mv('public/uploads/policies/' + file_name, function(err) {
				if (err){
				  console.log(err);
				}
			});
		}
		
		//legal policy
		servicedata.legal_policy = "";
		if(req.files.legal_policy != '' && req.files.legal_policy != "undefined") {
			let legalFile = req.files.legal_policy;
			var file_name = "legalpolicy_"  + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
			servicedata.legal_policy = config.base_url + '/uploads/policies/' + file_name;
			legalFile.mv('public/uploads/policies/' + file_name, function(err) {
				if (err){
				  console.log(err);
				}
			});
		}
		
		//fileupload
		var  svc_uploads = [];
		
		let uploadedFile1 = req.files.fileupload1;
		if(uploadedFile1 != undefined && uploadedFile1 != null) {
			var file_name = "service_"  + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
			svc_uploads.push(config.base_url + '/uploads/services/' + file_name);
			uploadedFile1.mv('public/uploads/services/' + file_name, function(err) {
				if (err){
				  console.log(err);
				}
			});
		}
		
		let uploadedFile2 = req.files.fileupload2;
		if(uploadedFile2 != undefined && uploadedFile2 != null) {
			var file_name = "service_"  + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
			svc_uploads.push(config.base_url + '/uploads/services/' + file_name);
			uploadedFile2.mv('public/uploads/services/' + file_name, function(err) {
				if (err){
				  console.log(err);
				}
			});
		}
		
		
		let uploadedFile3 = req.files.fileupload3;
		if(uploadedFile3 != undefined && uploadedFile3 != null) {
			var file_name = "service_"  + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
			svc_uploads.push(config.base_url + '/uploads/services/' + file_name);
			uploadedFile3.mv('public/uploads/services/' + file_name, function(err) {
				if (err){
				  console.log(err);
				}
			});
		}
		
		let uploadedFile4 = req.files.fileupload4;
		if(uploadedFile4 != undefined && uploadedFile4 != null) {
			var file_name = "service_"  + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
			svc_uploads.push(config.base_url + '/uploads/services/' + file_name);
			uploadedFile4.mv('public/uploads/services/' + file_name, function(err) {
				if (err){
				  console.log(err);
				}
			});
		}
		
		servicedata.service_uploads = svc_uploads;
		
		services.post_service(servicedata)
		.then(function(res_service){
			req.session.alert_data = { alert_type: "success", alert_msg: "Service added successfully" };
			res.redirect('/admin/list_services');
		});
	}
};


//add service/post 
web.delete = (req, res) => {
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true)
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
	    {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else {
		if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
            res.locals.flashmessages = req.session.alert_data;
            req.session.alert_data = null;
        }
		if(req.params.service_id == null || req.params.service_id == undefined) {
			req.session.alert_data = { alert_type: "danger", alert_msg: "Invalid request. Service Id not provided" };
			res.redirect('/admin/list_services');
		}
		services.delete_service(req.params.service_id)
		.then(function(res_service){
			if(res_service) {
				req.session.alert_data = { alert_type: "success", alert_msg: "Service deleted successfully" };
				res.redirect('/admin/list_services');
			} else {
				req.session.alert_data = { alert_type: "danger", alert_msg: "Service could not be deleted" };
				res.redirect('/admin/list_services');
			}
		});
	}
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

exportFuns.web = web;
module.exports = exportFuns;
