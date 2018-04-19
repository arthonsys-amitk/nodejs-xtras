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
		if(typeof req.session.alert_data != "undefined" || req.session.alert_data === true) {
            res.locals.flashmessages = req.session.alert_data;
            req.session.alert_data = null;
        }
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
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

exportFuns.web = web;
module.exports = exportFuns;
