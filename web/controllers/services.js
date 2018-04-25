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
var exportFuns = {},
    web = {};

// Display all services
web.list_services=(req,res)=>{
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
			res.render('admin/services/list',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "services_list" : services_result});
		});
   	}
};

// Edit service
web.edit = (req, res) => {
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
			res.render('admin/services/edit_services',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "service" : res_service});
		}
	});
};

//transaction list
web.transaction_list = (req, res) => {
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
			res.render('admin/services/transaction_list',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "transactions" : transaction_recs, "users" : user_recs, "arr_user_ids" : user_id_recs});
		});
	}
};

//view transaction details
web.view_transaction = (req, res) => {
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
				res.render('admin/services/transaction_details',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "transaction" : rec_transaction, "user" : rec_user});
			} else {
				req.session.alert_data = { alert_type: "danger", alert_msg: "Details could not be fetched" };
				res.redirect('/admin/transaction_list');
			}
		});
	}
};
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

exportFuns.web = web;
module.exports = exportFuns;
