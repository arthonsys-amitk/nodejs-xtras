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
 * @api {post} /post_service Post Service
 * @apiGroup Post
 * @apiparam {String} service_category_id ID of the referred category
 * @apiparam {String} service_name Service name
 * @apiparam {String} service_type Service Type(individual/ business)
 * @apiparam {String} additional_details Additional Details
 * @apiparam {String} service_radius Service Radius
 * @apiparam {String} service_radius_units Service Radius Units (Miles/Km)
 * @apiparam {String} weekday_start_time weekday_start_time(10:00)
 * @apiparam {String} weekday_stop_time weekday_stop_time(18:00)
 * @apiparam {String} weekend_start_time weekend_start_time(10:00)
 * @apiparam {String} weekend_stop_time weekend_stop_time(17:00)
 * @apiparam {String} available_monday available_monday(1/0)
 * @apiparam {String} available_tuesday available_tuesday(1/0)
 * @apiparam {String} available_wednesday available_wednesday(1/0)
 * @apiparam {String} available_thursday available_thursday(1/0)
 * @apiparam {String} available_friday available_friday(1/0)
 * @apiparam {String} available_saturday available_saturday(1/0)
 * @apiparam {String} available_sunday available_sunday(1/0)
 * @apiparam {String} cancel_hours cancel_hours(24)
 * @apiparam {String} cancel_fee cancel_fee(50)
 * @apiparam {String} reschedule_hours reschedule_hours(24)
 * @apiparam {String} reschedule_fee reschedule_fee(40)
 * @apiparam {String} cancel_rsh_policy Cancel/reschedule Policy
 * @apiparam {String} legal_policy Legal Policy
 * @apiparam {String} address Address 
 * @apiparam {String} city City 
 * @apiparam {String} province Province 
 * @apiparam {String} zipcode Zipcode 
 * @apiparam {String} country Country 
 * @apiparam {String} service_area Service Area Details ("{ \"area\": [ { \"area_from_sqft\": \"11\" , \"area_to_sqft\": \"11\",  \"price\": \"11\" } ] }") 
 * @apiparam {String} grass_snow_height Grass/Snow Height Details ("{ \"grasssnowheight\": [ { \"area_from_sqft\": \"11\",      \"area_to_sqft\": \"11\",      \"price\": \"11\" } ] }") 
 * @apiparam {String} service_adons Service Addon Details ("{ \"addon\": [ { \"name\": \"abc\",    \"price\": \"11\" } ] }") 
 * @apiparam {String} service_options Service Options Details ("{ \"option\": [ { \"name\": \"abc\",    \"price\": \"11\" } ] }") 
 * @apiparam {String} uploads Images in JS array 
 * @apiSuccessExample {json} Success
 *    {
    "status": 200,
    "api_name": "post_service",
    "message": "You have posted Service successfully.",
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVzIjoxNTIyODUyOTQzNjI0LCJzZXJ2aWNlc0lEIjoiNWFjMzkyY2YzODY4OGMxMjFjMDM2YmFiIn0.7jfEHnUfj4Df5-F5KduUztM4AK3_pn4_F-cfMD6K5qM",
        "expires": 1522852943624,
        "services": {
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
            "_id": "5ac392cf38688c121c036bab"
        }
    }
}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "post_service",
          "message": "Invalid request parameters.",
          "data": {}
      }
*/

api.post_service = (req, res)=>{
	
  let service_category_id = _.trim(req.body.service_category_id) || '';
  let service_name = _.trim(req.body.service_name) || '';
  let service_type = _.trim(req.body.service_type) || ''; //individual/business
  let additional_details = _.trim(req.body.additional_details) || '';
  let service_radius = _.trim(req.body.service_radius) || '';
  let service_radius_units = _.trim(req.body.service_radius_units) || ''; //Miles/Km
  let weekday_start_time = _.trim(req.body.weekday_start_time) || '';
  let weekday_stop_time = _.trim(req.body.weekday_stop_time) || '';
  let weekend_start_time = _.trim(req.body.weekend_start_time) || '';
  let weekend_stop_time = _.trim(req.body.weekend_stop_time) || '';
  let available_monday = _.trim(req.body.available_monday) || '0';
  let available_tuesday = _.trim(req.body.available_tuesday) || '0';
  let available_wednesday = _.trim(req.body.available_wednesday) || '0';
  let available_thursday = _.trim(req.body.available_thursday) || '0';
  let available_friday = _.trim(req.body.available_friday) || '0';
  let available_saturday = _.trim(req.body.available_saturday) || '0';
  let available_sunday = _.trim(req.body.available_sunday) || '0';
  let is_active = _.trim(req.body.is_active) || '0';
  let cancel_hours = _.trim(req.body.cancel_hours) || '';
  let cancel_fee = _.trim(req.body.cancel_fee) || '';
  let reschedule_hours = _.trim(req.body.reschedule_hours) || '';
  let reschedule_fee = _.trim(req.body.reschedule_fee) || '';
  let cancel_rsh_policy = _.trim(req.body.cancel_rsh_policy) || '';
  let legal_policy = _.trim(req.body.legal_policy) || '';
  let address = _.trim(req.body.address) || '';
  let city = _.trim(req.body.city) || '';
  let province = _.trim(req.body.province) || '';
  let zipcode = _.trim(req.body.zipcode) || '';
  let country = _.trim(req.body.country) || '';
  
  
  if(Object.keys(req.body).length >= 1) {
	
	var servicedata = {
						service_category_id : service_category_id,
						service_name : service_name,
						service_type: service_type,
						additional_details: additional_details,
						service_radius: service_radius,
						service_radius_units: service_radius_units,
						weekday_start_time: weekday_start_time,
						weekday_stop_time: weekday_stop_time,
						weekend_start_time: weekend_start_time,
						weekend_stop_time: weekend_stop_time,
						available_monday: available_monday, 
						available_tuesday : available_tuesday,
						available_wednesday : available_wednesday,
						available_thursday : available_thursday,
						available_friday : available_friday,
						available_saturday : available_saturday,
						available_sunday : available_sunday,
						is_active : is_active,
						cancel_hours : cancel_hours,
						cancel_fee : cancel_fee,
						reschedule_hours : reschedule_hours,
						reschedule_fee : reschedule_fee,
						cancel_rsh_policy : cancel_rsh_policy,
						legal_policy : legal_policy,
						address : address, 
						city : city,
						province : province,
						zipcode : zipcode,
						country : country,
						rating: '0'
					 };
	
	if(req.body.cancel_rsh_policy != ''){
		var fs     = require('fs')
		var image = req.body.cancel_rsh_policy;
		var policy_path = "cancelpolicy_" + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
		var bitmap = new Buffer(image, 'base64');
		fs.writeFileSync("public/uploads/policies/" + policy_path, bitmap);
		servicedata.cancel_rsh_policy = config.base_url + '/uploads/policies/' + policy_path;
	}
	if(req.body.legal_policy != ''){
		var fs     = require('fs')
		var image = req.body.legal_policy;
		var policy_path = "legalpolicy_" + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
		var bitmap = new Buffer(image, 'base64');
		fs.writeFileSync("public/uploads/policies/" + policy_path, bitmap);
		servicedata.legal_policy = config.base_url + '/uploads/policies/' + policy_path;
	}
	services.postService(servicedata)
	.then(function(result) {
		if(result != null) {
			var service_id = servicedata._id;
			console.log("service_id:" + service_id);
			
			var util = require('util');
			
			//service area & pricing
			//format: { area: [ { area_from_sqft: 11,       area_to_sqft: 11,       price: 11 } ] }
			
			if(req.body.service_area != null && req.body.service_area != '') {
				var svc_area_obj = JSON.parse(req.body.service_area);
				var svc_area = svc_area_obj.area;
				if(util.isArray(svc_area)) {
					svc_area.forEach(function(item) {
						services.save_service_area_and_pricing(service_id, item.area_from_sqft, item.area_to_sqft, item.price);
					});
				}
			}
			
			//service grass/snow height
			//format: { grasssnowheight: [ { area_from_sqft: 11,       area_to_sqft: 11,       price: 11 } ] }
			if(req.body.grass_snow_height != null && req.body.grass_snow_height != '') {
				var svc_grass_ht_obj = JSON.parse(req.body.grass_snow_height);
				var svc_grass_ht = svc_grass_ht_obj.grasssnowheight;
				if(util.isArray(svc_grass_ht)) {
					svc_grass_ht.forEach(function(item) {
					  console.log(item.area_from_sqft);
					  services.save_service_grass_snow_height(service_id, item.area_from_sqft, item.area_to_sqft, item.price);
					});
				}
			}
			
			//service addons
			//format: { addon: [ { name: 'abc',    price: 11 } ] }
			if(req.body.service_addons != null && req.body.service_addons != '') {
				var svc_addons_obj = JSON.parse(req.body.service_addons);
				var svc_addons = svc_addons_obj.addon;
				if(util.isArray(svc_addons)) {
					svc_addons.forEach(function(item) {
					  console.log(item.name);
					  services.save_service_addons(service_id, item.name, item.price);
					});
				}
			}
			
			//service options
			//format: { option: [ { name: 'abc',    price: 11 } ] }
			if(req.body.service_options != null && req.body.service_options != '') {
				var svc_options_obj = JSON.parse(req.body.service_options);
				var svc_options = svc_options_obj.option;
				if(util.isArray(svc_options)) {
					svc_options.forEach(function(item) {
					  console.log(item.name);
					  services.save_service_options(service_id, item.name, item.price);
					});
				}
			}
			
			//multiple image uploads with service
			if(req.body.uploads != null && req.body.uploads != '') {
				var iuploads = JSON.parse(req.body.uploads);
				if(util.isArray(iuploads)){
					iuploads.forEach(function(upload) {
						services.save_image_uploads(service_id, upload);
					});
				}
			}
			
			res.json({
				  "status": 200,
				  "api_name": "post_service",
				  "message": "You have posted Service successfully.",
				  "data": genToken(servicedata)
				});
				return;
		}
	});
  } else {
        res.json({
          "status": 400,
          "api_name": "post_service",
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