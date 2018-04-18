"use strict";
var _      = require('lodash'),
    jwt    = require('jwt-simple'),
    fs     = require('fs'),
	nodemailer = require("nodemailer"),
    config = require('../../config'),
    {coupon} = require('../models'),
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
		coupon.get_coupons().then(function(coupon_result) {

			res.render('admin/coupon/coupon_list',{"user_data":req.session.user_data,'coupon':coupon_result});

		});
   	}
}



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

exportFuns.web = web;
module.exports = exportFuns;
