"use strict";
var _      = require('lodash'),
    jwt    = require('jwt-simple'),
    fs     = require('fs'),
	nodemailer = require("nodemailer"),
    config = require('../../config'),
    {userquery} = require('../models'),
    {crypto} = require('../helpers'),
    {sendmail} = require('../helpers');
var NodeGeocoder = require('node-geocoder');
var dateFormat = require('dateformat');
var options = {
                provider: 'google',
                httpAdapter: 'https',
                apiKey: 'AIzaSyCnHXmtGqz7eOZg2rW9U20KDit1tRF6rhU',
                formatter: null
              };
var geocoder = NodeGeocoder(options);	
var exportFuns = {},
    web = {};

// Display all services
web.list_queries=(req,res)=>{
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
        userquery.get_all_queries().then(function(queries_result) {
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			for(var i = 0; i < queries_result.length; i++) {
				var dt = dateFormat(queries_result[i].created_at, "d mmmm yyyy hh:MM TT");
				queries_result[i].created_at = dt;
				if(queries_result[i].query.length > 35)
					queries_result[i].query = queries_result[i].query.substr(0, 35) + " ...";
			}
			
			res.render('admin/users/query/list',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "queries_list" : queries_result});
		});
		
   	}
};

//view faq
web.edit_faq = (req,res) => {
	var hostname = req.session.hostname || req.headers.host;
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true)
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
	    {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else {
		res.locals.flashmessages = req.session.alert_data;
        req.session.alert_data = null;
        
		userquery.get_all_queries().then(function(queries_result) {
			if(typeof req.session.resqueries == "undefined" || (req.session.resqueries == null)) {
				var qrycount = 0;
				var resqueries = null;
			} else {
				var qrycount = req.session.resqueries.length;
				var resqueries = req.session.resqueries;
			}
			userquery.get_faq_by_id(req.params.faq_id)
			.then(function(faq_detail){
				if(faq_detail != null && faq_detail != undefined) {
					res.locals.flashmessages = req.session.alert_data;
					req.session.alert_data = null;
				
					var qry_date = dateFormat(new Date(faq_detail.created_at), "dd-mm-yyyy H:MM TT");
					res.render('admin/users/query/edit_faq',{"user_data":req.session.user_data, "num_queries" : qrycount, "resqueries" : resqueries, "member_since" : req.session.member_since, "hostname" : hostname, "query" : faq_detail, "qry_date" : qry_date});
				} else {
					req.session.alert_data = { alert_type: "danger", alert_msg: "Query record not found." };
					res.locals.flashmessages = req.session.alert_data;
					res.redirect('admin/list_queries');
				}
			});
			
		});
	}
};

//delete faq/query
web.delete_faq = (req,res) => {
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true)
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
	    {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else {
		var faq_id = req.params.faq_id;
		if(faq_id == null || faq_id == undefined || faq_id == "") {
			req.session.alert_data = { alert_type: "danger", alert_msg: "Query record not found." };
			res.locals.flashmessages = req.session.alert_data;
			res.redirect('admin/list_queries');
		} else {
			userquery.delete(faq_id)
			.then(function(res_delete){
				if(res_delete) {
					req.session.alert_data = { alert_type: "success", alert_msg: "Query deleted successfully." };
					res.locals.flashmessages = req.session.alert_data;
					res.redirect('/admin/list_queries');
				} else {
					req.session.alert_data = { alert_type: "danger", alert_msg: "Query could not be deleted." };
					res.locals.flashmessages = req.session.alert_data;
					res.redirect('/admin/list_queries');
				}
			});
		}
	}
};
	
//reply for query
web.reply = (req,res) => {
	if(typeof req.session.user_data == "undefined" || req.session.user_data === true)
	{
	    if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true)
	    {
	        res.locals.flashmessages = req.session.alert_data;
	        req.session.alert_data = null;
	    }
		res.redirect('/admin');
	} else {
		var faq_id = req.body.query_id;
		var sender_email = _.trim(req.body.sender_email);
		var reply = _.trim(req.body.reply);
		if(reply == null || reply == undefined || reply == "") {
			req.session.alert_data = { alert_type: "danger", alert_msg: "Reply message is empty" };
			res.locals.flashmessages = req.session.alert_data;
		}
		if(reply && sender_email) {
			userquery.send_reply(sender_email, reply, faq_id)
			.then(function(result){
				console.log("res");
				console.log(result);
				if(result) {
					req.session.alert_data = { alert_type: "success", alert_msg: "Reply email sent successfully" };
					res.locals.flashmessages = req.session.alert_data;
				} else {
					req.session.alert_data = { alert_type: "danger", alert_msg: "Reply could not be sent" };
					res.locals.flashmessages = req.session.alert_data;
				}
				res.redirect('/admin/list_queries');
			});
		}		
	}
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

exportFuns.web = web;
module.exports = exportFuns;
