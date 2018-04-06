"use strict";
var _      = require('lodash'),
    jwt    = require('jwt-simple'),
    fs     = require('fs'),
    config = require('../../config'),
    {services} = require('../models'),
    {user} = require('../models'),
    {crypto} = require('../helpers'),
    {sendmail} = require('../helpers');

var exportFuns = {},
    api = {},
    web = {};

const mongo = require('mongodb');
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
 * @apiparam {String} user_id ID of the User submitting the post
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
			"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVzIjoxNTIzMDgwMTYxOTQzfQ.313bmWMZnm2blSOK1TqN9xGbw9JOqO8TxJhvCdQBQwk",
			"expires": 1523080161943,
			"services": {
				"service_category_id": "5ac1e4fcd74b0f03981a5e70",
				"service_name": "Lawn Mowing Service",
				"service_type": "individual",
				"additional_details": "",
				"service_radius": "552",
				"service_radius_units": "Km",
				"weekday_start_time": "",
				"weekday_stop_time": "",
				"weekend_start_time": "",
				"weekend_stop_time": "",
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
				"userdata": {
					"_id": "5ac2235feab4d71710a0521c",
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
					"created_time": "2018-04-02T12:34:39.500Z",
					"modified_time": "2018-04-02T12:34:39.501Z",
					"profile_complete": 0
				},
				"service_area_and_pricing": [
					{
						"_id": "5ac70a6144b1f41aa0ee4558",
						"area_from_sqft": "11",
						"area_to_sqft": "11",
						"price": "11"
					}
				],
				"service_grass_snow_height": [
					{
						"_id": "5ac70a6144b1f41aa0ee4559",
						"area_from_sqft": "11",
						"area_to_sqft": "11",
						"price": "11"
					}
				],
				"service_addons": "",
				"service_options": [
					{
						"_id": "5ac70a6144b1f41aa0ee455a",
						"name": "sdd",
						"price": "21"
					}
				],
				"service_uploads": [
					"http://127.0.0.1:3001/uploads/services/service_1522993761935488.jpg",
					"http://127.0.0.1:3001/uploads/services/service_1522993761940246.jpg"
				]
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

api.post_service = (req, res)=> {
	
	
  let user_id = _.trim(req.body.user_id) || '';
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
  
  var currency = "$";
  if(country != null && country != "undefined" && country == "Canada") {
	 currency = "C$";
  }
  if(weekday_start_time) { weekday_start_time = sendmail.convertToSmallTime(weekday_start_time); }
  if(weekday_stop_time) { weekday_stop_time = sendmail.convertToSmallTime(weekday_stop_time); }
  if(weekend_start_time) { weekend_start_time = sendmail.convertToSmallTime(weekend_start_time); }
  if(weekend_stop_time) { weekend_stop_time = sendmail.convertToSmallTime(weekend_stop_time); }
  
  if(Object.keys(req.body).length >= 1 ) {
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
						rating: '0',
						currency: currency
					 };
	
	if(req.body.cancel_rsh_policy != '' && req.body.cancel_rsh_policy != undefined){
		var fs     = require('fs')
		var image = req.body.cancel_rsh_policy;
		var policy_path = "cancelpolicy_" + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
		var bitmap = new Buffer(image, 'base64');
		fs.writeFileSync("public/uploads/policies/" + policy_path, bitmap);
		servicedata.cancel_rsh_policy = config.base_url + '/uploads/policies/' + policy_path;
	}
	if(req.body.legal_policy != '' && req.body.legal_policy != undefined){
		var fs     = require('fs')
		var image = req.body.legal_policy;
		var policy_path = "legalpolicy_" + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
		var bitmap = new Buffer(image, 'base64');
		fs.writeFileSync("public/uploads/policies/" + policy_path, bitmap);
		servicedata.legal_policy = config.base_url + '/uploads/policies/' + policy_path;
	}
	if(req.body.user_id) {
		user.getUser(req.body.user_id).then(function(userresult){
				if(userresult != null) {
					if(userresult.email != "" && userresult.phone != "") {
						userresult.profile_complete = 1;
					} else {
						userresult.profile_complete = 0;
					}
				} 
				servicedata.userdata = userresult;
				
				var service_id = servicedata._id;
							
				var util = require('util');
				
				if(req.body.service_area != null && req.body.service_area != '') {
					var arr_svc_area = [];
					var svc_area_obj = JSON.parse(req.body.service_area);
					var svc_area = svc_area_obj.area;
					if(util.isArray(svc_area)) {
						svc_area.forEach(function(item) {
							var svc_area_id = new mongo.ObjectID();
							arr_svc_area.push({_id: svc_area_id, area_from_sqft : item.area_from_sqft, area_to_sqft : item.area_to_sqft, price: item.price });
						});
					}						
					servicedata.service_area_and_pricing = arr_svc_area;
				} else {
					servicedata.service_area_and_pricing = [];
				}
				//service area & pricing
				//format: { area: [ { area_from_sqft: 11,       area_to_sqft: 11,       price: 11 } ] }
				/*
				//parse and store service_area_and_pricing data
				if(req.body.service_area != null && req.body.service_area != '') {
					var svc_area_obj = JSON.parse(req.body.service_area);
					var svc_area = svc_area_obj.area;
					if(util.isArray(svc_area)) {
						svc_area.forEach(function(item) {
							services.save_service_area_and_pricing(service_id, item.area_from_sqft, item.area_to_sqft, item.price);
						});
					}
				}
				*/
				if(req.body.grass_snow_height != null && req.body.grass_snow_height != '') {
					var arr_grass_area = [];
					var svc_grass_ht_obj = JSON.parse(req.body.grass_snow_height);
					var svc_grass_ht = svc_grass_ht_obj.grasssnowheight;
					if(util.isArray(svc_grass_ht)) {							
						svc_grass_ht.forEach(function(item) {
							var svc_grass_id = new mongo.ObjectID();
							arr_grass_area.push({_id: svc_grass_id, area_from_sqft : item.area_from_sqft, area_to_sqft : item.area_to_sqft, price: item.price });
						});
					}
					servicedata.service_grass_snow_height = arr_grass_area;
				} else {
					servicedata.service_grass_snow_height = [];
				}
				//service grass/snow height
				//format: { grasssnowheight: [ { area_from_sqft: 11,       area_to_sqft: 11,       price: 11 } ] }
				/*
				if(req.body.grass_snow_height != null && req.body.grass_snow_height != '') {
					var svc_grass_ht_obj = JSON.parse(req.body.grass_snow_height);
					var svc_grass_ht = svc_grass_ht_obj.grasssnowheight;
					if(util.isArray(svc_grass_ht)) {
						svc_grass_ht.forEach(function(item) {
						  services.save_service_grass_snow_height(service_id, item.area_from_sqft, item.area_to_sqft, item.price);
						});
					}
				}
				*/
				if(req.body.service_addons != null && req.body.service_addons != '') {
					var arr_addons = [];
					var svc_grass_ht_obj = JSON.parse(req.body.grass_snow_height);
					var svc_grass_ht = svc_grass_ht_obj.grasssnowheight;
					if(util.isArray(svc_grass_ht)) {							
						svc_grass_ht.forEach(function(item) {
							var svc_addon_id = new mongo.ObjectID();
							arr_addons.push({_id: svc_addon_id, name : item.name, price: item.price });
						});
					}
					servicedata.service_addons = arr_addons;
				} else {
					servicedata.service_addons = [];
				}
				//service addons
				//format: { addon: [ { name: 'abc',    price: 11 } ] }
				/*
				if(req.body.service_addons != null && req.body.service_addons != '') {
					var svc_addons_obj = JSON.parse(req.body.service_addons);
					var svc_addons = svc_addons_obj.addon;
					if(util.isArray(svc_addons)) {
						svc_addons.forEach(function(item) {
						  services.save_service_addons(service_id, item.name, item.price);
						});
					}
				}
				*/
				
				if(req.body.service_options != null && req.body.service_options != '') {
					var arr_svc_options = [];
					var svc_options_obj = JSON.parse(req.body.service_options);
					var svc_options = svc_options_obj.option;
					if(util.isArray(svc_options)) {
						svc_options.forEach(function(item) {
							var svc_option_id = new mongo.ObjectID();
							arr_svc_options.push({_id: svc_option_id, name : item.name, price: item.price });
						});
					}
					servicedata.service_options = arr_svc_options;
				} else {
					servicedata.service_options = [];
				}
				//service options
				//format: { option: [ { name: 'abc',    price: 11 } ] }
				/*
				if(req.body.service_options != null && req.body.service_options != '') {
					var svc_options_obj = JSON.parse(req.body.service_options);
					var svc_options = svc_options_obj.option;
					if(util.isArray(svc_options)) {
						svc_options.forEach(function(item) {
						  services.save_service_options(service_id, item.name, item.price);
						});
					}
				}
				*/
				
				if(req.body.uploads != null && req.body.uploads != '') {
					var arr_svc_uploads = [];
					var iuploads = JSON.parse(req.body.uploads);
					if(util.isArray(iuploads)){
						iuploads.forEach(function(upload) {
							var svc_upload_id = new mongo.ObjectID();
							var imgupload = services.save_image_uploads(service_id, upload);
							arr_svc_uploads.push(imgupload);
						});
					}
					servicedata.service_uploads = arr_svc_uploads;
				} else {
					servicedata.service_uploads = [];
				}
				//multiple image uploads with service
				/*
				if(req.body.uploads != null && req.body.uploads != '') {
					var iuploads = JSON.parse(req.body.uploads);
					if(util.isArray(iuploads)){
						iuploads.forEach(function(upload) {
							services.save_image_uploads(service_id, upload);
						});
					}
				}
				*/

				//////////////////////////////////////////////
				  var parent_category_id = "";
				  var parent_category_name = "";
				  if(service_category_id != null && service_category_id != undefined) {
					  services.getParentId(service_category_id)
					  .then(function(result){
						  if(result != null && result) {
							parent_category_id = result;
							servicedata.parent_category_id = result;
							if(parent_category_id != null && parent_category_id != undefined && parent_category_id) {
								services.getCategoryName(parent_category_id)
								.then(function(categname){
									servicedata.parent_category_name = categname;
									services.postService(servicedata);
									res.json({
										  "status": 200,
										  "api_name": "post_service",
										  "message": "You have posted Service successfully.",
										  "data": genToken(servicedata)
										});
									return;
								});
							}			
						 } else {
							servicedata.parent_category_id = "";
							servicedata.parent_category_name = "";
							services.postService(servicedata);
							res.json({
								  "status": 200,
								  "api_name": "post_service",
								  "message": "You have posted Service successfully.",
								  "data": genToken(servicedata)
								});
							return;
						 }
					  });
				  }

				//////////////////////////////////////////////
				/*
				services.postService(servicedata);
				res.json({
					  "status": 200,
					  "api_name": "post_service",
					  "message": "You have posted Service successfully.",
					  "data": genToken(servicedata)
					});
				return;
				*/
		});
	} else {
		res.json({
          "status": 400,
          "api_name": "post_service",
          "message": "User ID not provided in request.",
          "data": {}
        });
        return;
	}	
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
/**
 * @api {post} /add_appointments Add appointments
 * @apiGroup Post
 * @apiparam {String} parent_appointment_id Parent appointment Id
 * @apiparam {String} consumer_id Cousumer ID
 * @apiparam {String} provider_id Provider ID
 * @apiparam {String} service_id  Service Id
 * @apiparam {Array} service_addons  Service Addons
 * @apiparam {Array} service_options  Service options
 * @apiparam {Array} service_area_and_pricing  Service Area And Pricing
 * @apiparam {Array} service_grass_snow_height  Service Grass Snow Height
 * @apiparam {String} appointment_date Appointment Date
 * @apiparam {String} appointment_time Appointment Time
 * @apiparam {String} provider_firstname Provider Firstname
 * @apiparam {String} provider_lastname Provider Lastname
 * @apiparam {String} provider_company Provider Company
 * @apiparam {String} notes Notes
 * @apiparam {String} coupon_id ID Coupon Id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
		"status": 200,
		"api_name": "add_appointments",
		"message": "Appointment added successfully.",
		"data": {
			"parent_appointment_id": "1",
			"consumer_id": "5ac36f3bfa85e0150c53cf34",
			"provider_id": "5ac36f3bfa85e0150c53cf34",
            "service_id": "3",
            "service_addons":["5ac36f3bfa8sdfsd0150c53cf34","5ac36f3bfa8sdfsd0150c53cf34"],
            "service_options":["5ac36f3bfids9sdnsd50c53cf34","5ac36f3bfids9sdnsd50c53cf34"],
            "service_area_and_pricing": "",
            "service_grass_snow_height": "",
			"appointment_date": "04-04-2018",
			"appointment_time": "09:50 PM",
			"provider_firstname": "Rahul",
			"provider_lastname": "soni",
			"provider_company": "sale news",
			"notes": "testing",
			"svc_option_ids": "",
			"svc_addon_ids": "",
			"coupon_id": "120245",
			"is_confirmed": 1,
			"created_at": "2018-04-04T07:47:04.763Z",
			"updated_at": "2018-04-04T07:47:04.763Z",
			"is_active": 1,
			"is_deleted": 0,
			"_id": "5ac482f80683cb0dc4f5d796"
		}
}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
			"status": 400,
			"api_name": "add_appointments",
			"message": "Some request parameters are missing.",
			"data": {}
	  }
*/
api.add_appointments = (req, res)=>{
    
    if(Object.keys(req.body).length == 15) {

        var appointment_data = {
                            parent_appointment_id : req.body.parent_appointment_id,
                            consumer_id : req.body.consumer_id,
                            provider_id: req.body.provider_id,
                            service_id: req.body.service_id,
                            appointment_date: req.body.appointment_date,
                            appointment_time:req.body.appointment_time,
                            provider_firstname:req.body.provider_firstname,
                            provider_lastname:req.body.provider_lastname,
                            provider_company:req.body.provider_company,
                            service_addons:req.body.service_addons,
                            service_options:req.body.service_options,
                            service_area_and_pricing:req.body.service_area_and_pricing,
                            service_grass_snow_height:req.body.service_grass_snow_height,
                            notes:req.body.notes,
                            svc_option_ids:"",
                            svc_addon_ids:"",
                            coupon_id:req.body.coupon_id,
                            is_confirmed:1,
                            created_at:new Date(),
                            updated_at:new Date(),
                            is_active:1,
                            is_deleted:0
                        };
					
		services.insert_appointment(appointment_data)
        .then(function(response) {
            if(response!=null){
                res.json({
                    "status": 200,
                    "api_name": "add_appointments",
                    "message": "Appointment added successfully.",
                    "data": appointment_data
                });
            }else{
                res.json({
                    "status": 200,
                    "api_name": "add_appointments",
                    "message": "Appointment not added.",
                    "data": {}
                });
            }
        });
    }else
    {
        res.json({
            "status": 400,
            "api_name": "add_appointments",
            "message": "Some request parameters are missing.",
            "data": {}
          });
        return;
    }    

}
/**
 * @api {post} /get_appointments Get appointments
 * @apiGroup Post
 * @apiparam {String} user_id User Id

 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
    "status": 400,
    "api_name": "get_appointments",
    "message": "All appointments found.",
    "data": [
        {
            "_id": "5ac48215c4af2b14a047ad5d",
            "parent_appointment_id": "1",
            "consumer_id": "5ac36f3bfa85e0150c53cf34",
            "provider_id": "5ac36f3bfa85e0150c53cf34",
            "service_id": "3",
            "appointment_date": "04-04-2018",
            "appointment_time": "09:50 PM",
            "provider_firstname": "Rahul",
            "provider_lastname": "soni",
            "provider_company": "sale news",
            "notes": "testing",
            "svc_option_ids": "",
            "svc_addon_ids": "",
            "coupon_id": "120245",
            "is_confirmed": 1,
            "created_at": "2018-04-04T07:43:17.700Z",
            "updated_at": "2018-04-04T07:43:17.700Z",
            "is_active": 1,
            "is_deleted": 0
        },
        {
            "_id": "5ac4afa639118d061ce596ad",
            "parent_appointment_id": "1",
            "consumer_id": "5ac36f3bfa85e0150c53cf34",
            "provider_id": "5ac36f3bfa85e0150c53cf34",
            "service_id": "3",
            "appointment_date": "04-04-2018",
            "appointment_time": "09:50 PM",
            "provider_firstname": "Rahul",
            "provider_lastname": "soni",
            "provider_company": "sale news",
            "notes": "testing",
            "svc_option_ids": "",
            "svc_addon_ids": "",
            "coupon_id": "120245",
            "is_confirmed": 1,
            "created_at": "2018-04-04T07:43:17.700Z",
            "updated_at": "2018-04-04T07:43:17.700Z",
            "is_active": 1,
            "is_deleted": 0
        }
    ]
}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
			"status": 400,
			"api_name": "get_appointments",
			"message": "Some request parameters are missing.",
			"data": {}
	  }
*/
api.get_appointments = (req, res)=>{
   if(Object.keys(req.body).length == 1) {

		services.get_appointments(req.body.user_id)
		.then(function(result){
				res.json({
					"status": 400,
					"api_name": "get_appointments",
					"message": "All appointments found.",
					"data": result
				});
				return;
		})

	}else
	{
		res.json({
			"status": 400,
			"api_name": "get_appointments",
			"message": "Some request parameters are missing.",
			"data": {}
		});
		return;
	}    
}
/**
 * @api {post} /add_review Add review for service
 * @apiGroup Post
 * @apiparam {String} user_id User Id
 * @apiparam {String} service_id Service Id
 * @apiparam {Integer} rate Rate
 * @apiparam {String} comment Comment


 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
    "status": 400,
    "api_name": "add_review",
    "message": "Review add successfully.",
    "data": {
        "service_id": "5ac46a660d4b66316d0ee73a",
        "user_id": "5ac32682bc4d0f29ad7a7a7f",
        "rate": "5",
        "comment": "good service",
        "created_at": "2018-04-05T14:35:38.125Z",
        "updated_at": "2018-04-05T14:35:38.125Z",
        "_id": "5ac6343aaeb11a1494adbe2e"
    }
}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
     {
        "status": 400,
        "api_name": "add_review",
        "message": "Review already exist.",
        "data": {}
    }
*/
api.add_review = (req, res)=>{
    if(Object.keys(req.body).length == 4) {
        services.check_review_exist(req.body).then(function(review_data){
            console.log(review_data);
            if(review_data==null || review_data=='')
            {
                services.add_review(req.body)
                .then(function(result){
                    
                    res.json({
                        "status": 400,
                        "api_name": "add_review",
                        "message": "Review add successfully.",
                        "data": result
                    });
                    return;
                })
            }else
            {
                res.json({
                    "status": 400,
                    "api_name": "add_review",
                    "message": "Review already exist.",
                    "data": {}
                });
                return;
            }
        })
 
     }else
     {
         res.json({
             "status": 400,
             "api_name": "add_review",
             "message": "Some request parameters are missing.",
             "data": {}
         });
         return;
     }    
 }
 
/**
 * @api {post} /average_review Get average review
 * @apiGroup Post
 * @apiparam {String} service_id Service Id

 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
        "status": 200,
        "api_name": "average_review",
        "message": "Review successfully found.",
        "data": 2.5
      }
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
        {
        "status": 400,
        "api_name": "average_review",
        "message": "Review not found.",
        "data": {}
      }
*/
 api.average_review = (req, res)=>{
    if(Object.keys(req.body).length == 1) {
        services.get_average_review(req.body.service_id).then(function(average_review){
            if(average_review!=null)
            {
                  var avg_value=average_review[0].avg;
                    avg_value = Math.round( avg_value * 10 ) / 10;
                     res.json({
                        "status": 200,
                        "api_name": "average_review",
                        "message": "Review successfully found.",
                        "data": avg_value
                    });
                    return; 
               
            }else
            {
                 res.json({
                    "status": 400,
                    "api_name": "average_review",
                    "message": "Average review not found.",
                    "data": {}
                });
                return; 
            }
        })
 
     }else
     {
         res.json({
             "status": 400,
             "api_name": "average_review",
             "message": "Some request parameters are missing.",
             "data": {}
         });
         return;
     }    
 }

/**
 * @api {post} /get_posts Get Posts
 * @apiGroup Post
 * @apiparam {String} service_category_id ID of the Service Category for which posts need to be fetched
 * @apiparam {String} type Service Type(individual/ business), or, Price (price)
 * @apiparam {Integer} [limit] Number of records to be fetched at a time (e.g 20)
 * @apiparam {Integer} [page] Page number (e.g 1)
 * @apiSuccessExample {json} Success
 *    {
		"status": 200,
		"api_name": "get_posts",
		"message": "Posts records retrieved successfully",
		"data": [
			{
				"_id": "5ac70a6144b1f41aa0ee455d",
				"service_category_id": "5ac1e4fcd74b0f03981a5e70",
				"service_name": "Lawn Mowing Service",
				"service_type": "individual",
				"additional_details": "",
				"service_radius": "552",
				"service_radius_units": "Km",
				"weekday_start_time": "",
				"weekday_stop_time": "",
				"weekend_start_time": "",
				"weekend_stop_time": "",
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
				"userdata": {
					"_id": "5ac2235feab4d71710a0521c",
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
					"created_time": "2018-04-02T12:34:39.500Z",
					"modified_time": "2018-04-02T12:34:39.501Z",
					"profile_complete": 0
				},
				"service_area_and_pricing": [
					{
						"_id": "5ac70a6144b1f41aa0ee4558",
						"area_from_sqft": "11",
						"area_to_sqft": "11",
						"price": "11"
					}
				],
				"service_grass_snow_height": [
					{
						"_id": "5ac70a6144b1f41aa0ee4559",
						"area_from_sqft": "11",
						"area_to_sqft": "11",
						"price": "11"
					}
				],
				"service_addons": "",
				"service_options": [
					{
						"_id": "5ac70a6144b1f41aa0ee455a",
						"name": "sdd",
						"price": "21"
					}
				],
				"service_uploads": [
					"http://127.0.0.1:3001/uploads/services/service_1522993761935488.jpg",
					"http://127.0.0.1:3001/uploads/services/service_1522993761940246.jpg"
				]
			}
		]
	}
 * @apiErrorExample {json} Failed
 *    HTTP/1.1 400 Failed
      {
          "status": 400,
          "api_name": "get_posts",
          "message": "Invalid request parameters.",
          "data": {}
      }
*/

api.get_posts = (req, res)=> {
	let service_category_id = _.trim(req.body.service_category_id) || '';  
	let type = _.trim(req.body.type) || ''; //individual/business/price
	let limit = req.body.limit || 0; //number of records
	let page = req.body.page || 0; //page
	if(Object.keys(req.body).length >= 2 ) {
		services.getPosts(service_category_id, type, limit, page)
		.then(function(posts){
			res.json({
				  "status": 200,
				  "api_name": "get_posts",
				  "message": "Posts records retrieved successfully",
				  "data": posts
				});
			return;
		});
	} else {
		res.json({
             "status": 400,
             "api_name": "get_posts",
             "message": "Some request parameters are missing.",
             "data": {}
         });
         return;
	}
}
 //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


exportFuns.api = api;
exportFuns.web = web;
module.exports = exportFuns;
