"use strict";
var _      = require('lodash'),
    jwt    = require('jwt-simple'),
    fs     = require('fs'),
    config = require('../../config'),
    {services} = require('../models'),
    {crypto} = require('../helpers'),
    {sendmail} = require('../helpers');

var exportFuns = {},
    api = {},
    web = {};

 const Promise = require("bluebird");

// nodejs geocoder for latitude, longitude
var NodeGeocoder = require('node-geocoder');
var options = {
                provider: 'google',
                httpAdapter: 'https',
                apiKey: 'AIzaSyCnHXmtGqz7eOZg2rW9U20KDit1tRF6rhU',
                formatter: null
              };
var geocoder = NodeGeocoder(options);

// generate jwt token after login
var genToken = (services)=>{
  let expires = expiresIn(config.tokenExpiration);
  let token = jwt.encode({
    expires: expires,
    servicesID: services._id
  }, config.secret);

  return {
    token: token,
    expires: expires,
    services: services
  };
}

var expiresIn = (numDays)=>{
  let dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}


//++++++++++++++++++++++++++++++++++++++++++ CODE FOR APIs +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * @api {post} /search_by_keyword Post Service
 * @apiGroup Search
 * @apiparam {String} search_keyword Keyword for search

 * @apiSuccessExample {json} Success
 *    {
    "status": 200,
    "api_name": "search_by_keyword",
    "message": "You have Search Service successfully.",
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVzIjoxNTIyODUyOTQzNjI0LCJzZXJ2aWNlc0lEIjoiNWFjMzkyY2YzODY4OGMxMjFjMDM2YmFiIn0.7jfEHnUfj4Df5-F5KduUztM4AK3_pn4_F-cfMD6K5qM",
        "expires": 1522852943624,
        "services": [ {
            "_id": "5ac4699e0d4b66316d0ee736",
            "service_category_id": "ObjectId('5ac1e4fcd74b0f03981a5e70')",
            "service_name": "Lawn Cleaning",
            "service_type": "individual",
            "additional_details": "dtls...",
            "service_radius": "5.0",
            "service_radius_units": "Km",
            "weekday_start_time": "10:00",
            "weekday_stop_time": "18:00",
            "weekend_start_time": "10.00",
            "weekend_stop_time": "17:00",
            "available_monday": "1",
            "available_tuesday": "1",
            "available_wednesday": "1",
            "available_thursday": "1",
            "available_friday": "1",
            "available_saturday": "0",
            "available_sunday": "0",
            "is_active": "0",
            "cancel_hours": "24",
            "cancel_fee": "50",
            "reschedule_hours": "24",
            "reschedule_fee": "50",
            "cancel_rsh_policy": "",
            "legal_policy": "",
            "address": "21/30 Kaveri Path",
            "city": "Jaipur",
            "province": "Rajasthan",
            "zipcode": "302017",
            "country": "India",
            "rating": "0",
            "image": "http://35.168.99.29:3001/uploads/services/service_1522821734344139.jpg"
        }]
    }
}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "search_by_keyword",
          "message": "Invalid request parameters.",
          "data": {}
      }
*/

api.search_by_keyword = (req, res)=>{
	
  let search_keyword = _.trim(req.body.search_keyword);
 	
 	if(Object.keys(req.body).length > 0) {
		services.search_by_keyword(req.body.search_keyword)
	.then(function(services_data) {
		if(services_data != null) {

		
				return Promise.map(services_data, service => {
		                return services.get_service_image(service._id)
		                .then(result => {
		                    service.image = result;
		                    return service;
		                })

		        }).then(finalList => {

		            res.json({
					  "status": 200,
					  "api_name": "search_by_keyword",
					  "message": "You have posted Service successfully.",
					  "data": finalList
					});
					return;
		        });

		}
	});
  } else {
        res.json({
          "status": 400,
          "api_name": "search_by_keyword",
          "message": "Some request parameters are missing.",
          "data": {}
        });
        return;
    }
};


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


exportFuns.api = api;
exportFuns.web = web;
module.exports = exportFuns;
