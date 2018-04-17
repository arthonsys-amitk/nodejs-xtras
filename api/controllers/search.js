"use strict";
var _      = require('lodash'),
    jwt    = require('jwt-simple'),
    fs     = require('fs'),
    config = require('../../config'),
    {services} = require('../models'),
    {search} = require('../models'),
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
 * @api {post} /search_services Search
 * @apiGroup Search
 * @apiparam {String} search_keyword Keyword for search
 * @apiparam {String} type Service Type (individual/ business/ price)
 * @apiparam {String} [fulladdress] Full Address string (for zipcode search)
 * @apiparam {String} [lat] Latitude (for location search)
 * @apiparam {String} [lng] Longitude (for location search)
 * @apiparam {String} [address] Street Address (for address search)
 * @apiparam {String} [city] City (for address search)
 * @apiparam {String} [province] Province (for address search)
 * @apiparam {String} [zipcode] Zipcode (for address search)
 * @apiparam {String} [country] Country (for address search)
 * @apiparam {String} [limit] Pagesize of records to fetch at one time (e.g. 20)
 * @apiparam {String} [page] Page Number

 * @apiSuccessExample {json} Success
 * {
		"status": 200,
		"api_name": "search_services",
		"message": "Search results fetched successfully",
		"data": [
			{
				"_id": "5acb0aec7c8fb519ec0fee6a",
				"service_category_id": "5ac70bf8e0c24c56d148b6c4",
				"service_name": "Lawn Mowing Service",
				"service_type": "individual",
				"additional_details": "",
				"service_radius": "552",
				"service_radius_units": "Km",
				"weekday_start_time": "9:00AM",
				"weekday_stop_time": "6:00PM",
				"weekend_start_time": "10:00AM",
				"weekend_stop_time": "5:00PM",
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
				"cancel_rsh_policy": "http://127.0.0.1:3001/uploads/policies/cancelpolicy_1523256044547270.jpg",
				"legal_policy": "http://127.0.0.1:3001/uploads/policies/legalpolicy_1523256044551324.jpg",
				"address": "21/30 Kaveri Path",
				"city": "Jaipur",
				"province": "Rajasthan",
				"zipcode": "302017",
				"country": "India",
				"rating": "0.00",
				"currency": "$",
				"userdata": {
					"_id": "5ac2249386ecbf5d545fe898",
					"fullname": "Mike Adams",
					"user_role": 2,
					"email": "mike.adams@mailinator.com",
					"alternate_email": "",
					"phone": "",
					"phone_1": "",
					"phone_2": "",
					"address": "",
					"address_1": "",
					"address_2": "",
					"city": "",
					"state": "",
					"zip_code": "",
					"country": "",
					"latitude": "",
					"longitude": "",
					"password": "333f44ba2976b0",
					"user_image": "http://35.168.99.29:3001/image/automobile-svc.png",
					"facebook_login_id": "348574680756857680",
					"google_login_id": "",
					"social_login_data_status": 1,
					"otp_status": 0,
					"is_active": 0,
					"is_deleted": 0,
					"created_time": "2018-04-02T12:39:47.289Z",
					"modified_time": "2018-04-02T12:39:47.289Z",
					"profile_complete": 0
				},
				"service_area_and_pricing": [
					{
						"_id": "5acb0aec7c8fb519ec0fee67",
						"area_from_sqft": "11",
						"area_to_sqft": "11",
						"price": "11"
					}
				],
				"service_grass_snow_height": [
					{
						"_id": "5acb0aec7c8fb519ec0fee68",
						"area_from_sqft": "11",
						"area_to_sqft": "11",
						"price": "11"
					}
				],
				"service_addons": [],
				"service_options": [
					{
						"_id": "5acb0aec7c8fb519ec0fee69",
						"name": "svcd",
						"price": "21"
					}
				],
				"service_uploads": [],
				"parent_category_id": "",
				"parent_category_name": "",
				"min_price": "11.00"
			}
		],
		"num_pages": "1"
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
api.search_services = (req, res)=>{
  let search_keyword = _.trim(req.body.search_keyword);
  let fulladdress = _.trim(req.body.fulladdress);
  let search_lat = _.trim(req.body.lat);
  let search_long = _.trim(req.body.lng);
  let address = _.trim(req.body.address);
  let city = _.trim(req.body.city);
  let province = _.trim(req.body.province);
  let zipcode = _.trim(req.body.zipcode);
  let country = _.trim(req.body.country);
  let type = _.trim(req.body.type);
  let limit = req.body.limit || 0;
  let page = req.body.page || 0;
  
  if(Object.keys(req.body).length >= 2 ) {
	  var num_pages = 0;
	  var page_size = limit; //number of records per page
	  var result = "";
	  if(fulladdress && search_keyword) {
		  search.zipcodesearch(search_keyword, fulladdress, type, limit, page)
		  .then(function(result){
			  var arr_services = [];
			  var ctr = 0;
			  for(ctr = 0; ctr < result.length; ctr++) {
				var valid = search.checkServiceDistance(result[ctr], fulladdress);
				if(valid) {
					result[ctr].rating = parseFloat(result[ctr].rating).toFixed(2);
					result[ctr].min_price = parseFloat(services.getMinServicePrice(result[ctr])).toFixed(2);
					result[ctr].service_addons = sendmail.getAsJsonObject(result[ctr].service_addons);
					result[ctr].service_options = sendmail.getAsJsonObject(result[ctr].service_options);
					result[ctr].service_area_and_pricing = sendmail.getAsJsonObject(result[ctr].service_area_and_pricing);
					result[ctr].service_grass_snow_height = sendmail.getAsJsonObject(result[ctr].service_grass_snow_height);
					arr_services.push(result[ctr]);
				}
			  }
			var num_records = arr_services.length;
			if(num_records && page_size) {
				num_pages = Math.ceil(num_records / page_size);
			} else {
				if(!num_pages) num_pages = 1;
			}
			res.json({
			  "status": 200,
			  "api_name": "search_services",
			  "message": "Search results fetched successfully",
			  "data": arr_services,
			  "num_pages" : "" + num_pages 
			});
			return;
		  });
	  } else if(search_lat && search_long && search_keyword) {		  
		  search.locationsearch(search_keyword, search_lat, search_long, type, limit, page)
		  .then(function(result){
			  var arr_services = [];
			  var ctr = 0;
			  for(ctr = 0; ctr < result.length; ctr++) {
				var valid = search.checkServiceDistanceByLocation(result[ctr], search_lat, search_long);
				if(valid) {
					result[ctr].rating = parseFloat(result[ctr].rating).toFixed(2);
					result[ctr].min_price = parseFloat(services.getMinServicePrice(result[ctr])).toFixed(2);
					result[ctr].service_addons = sendmail.getAsJsonObject(result[ctr].service_addons);
					result[ctr].service_options = sendmail.getAsJsonObject(result[ctr].service_options);
					result[ctr].service_area_and_pricing = sendmail.getAsJsonObject(result[ctr].service_area_and_pricing);
					result[ctr].service_grass_snow_height = sendmail.getAsJsonObject(result[ctr].service_grass_snow_height);
					arr_services.push(result[ctr]);
				}
			  }
			var num_records = arr_services.length;
			if(num_records && page_size) {
				num_pages = Math.ceil(num_records / page_size);
			} else {
				if(!num_pages) num_pages = 1;
			}
			res.json({
			  "status": 200,
			  "api_name": "search_services",
			  "message": "Search results fetched successfully",
			  "data": arr_services,
			  "num_pages" : "" + num_pages 
			});
			return;
		  });
	  } else if(city && country && search_keyword) {
		  search.addresssearch(search_keyword, address, city, province, zipcode, country, type, limit, page)
		  .then(function(result){
			  var arr_services = [];
			  for(var ctr = 0; ctr < result.length; ctr++) {
				var valid = search.checkServiceDistanceByAddress(result[ctr], address, city, province, zipcode, country);
				if(valid) {
					result[ctr].rating = parseFloat(result[ctr].rating).toFixed(2);
					result[ctr].min_price = parseFloat(services.getMinServicePrice(result[ctr])).toFixed(2);
					result[ctr].service_addons = sendmail.getAsJsonObject(result[ctr].service_addons);
					result[ctr].service_options = sendmail.getAsJsonObject(result[ctr].service_options);
					result[ctr].service_area_and_pricing = sendmail.getAsJsonObject(result[ctr].service_area_and_pricing);
					result[ctr].service_grass_snow_height = sendmail.getAsJsonObject(result[ctr].service_grass_snow_height);
					arr_services.push(result[ctr]);
				}
			  }
			  var num_records = arr_services.length;
			  if(num_records && page_size) {
					num_pages = Math.ceil(num_records / page_size);
			  } else {
				if(!num_pages) num_pages = 1;
			  }
			  res.json({
				  "status": 200,
				  "api_name": "search_services",
				  "message": "Search results fetched successfully",
				  "data": arr_services,
				  "num_pages" : "" + num_pages 
			  });
			  return;
		  });
	  }
  } else {
	res.json({
		  "status": 400,
		  "api_name": "search_services",
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
