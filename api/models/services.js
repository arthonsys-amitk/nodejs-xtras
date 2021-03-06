"use strict";

var exportFuns = {},
    config     = require('../../config'),
    {sendmail} = require('../helpers'),
	{user} = require('../models'),
	user_model = require('./user'),
	_      = require('lodash'),
    Mongo      = require('../../mongo');

const Promise = require("bluebird");
	
// create service/post
exportFuns.postService = (services)=>{
  let db = new Mongo;

  return db.connect(config.mongoURI)
  .then(function(){
    return db.insert('services', services);
  })
  .then(function(services){
    db.close();
    return services.ops[0];
  });
};

// getPosts
exportFuns.getPosts = (service_category_id, type, limit, page)=>{
  let db = new Mongo;

  return db.connect(config.mongoURI)
  .then(function(){
    var searchPattern = {};
	if(type == "individual" || type == "business") {
		searchPattern = {
			$and : [
				{ $or : [ {"service_category_id" : "" + service_category_id},{"parent_category_id" : "" + service_category_id} ] },
				{ "service_type": "" + type }
			]
		};
	} else if(type == "price") {
		searchPattern = {
			"service_category_id" : "" + service_category_id
		};
	}
		
	if(page) {
		return db.findPage('services', searchPattern, {'_id': -1}, limit, page);
	} else {
		return db.find('services', searchPattern, {'_id': -1});
	}
  });
};

// gets ParentId of given category
exportFuns.getParentId = (service_category_id)=>{
  let db = new Mongo;

  return db.connect(config.mongoURI)
  .then(function(){
	 var searchPattern = {
		'_id' : db.makeID(service_category_id)
	  };
	 return db.findOne('category', searchPattern);
  })
  .then(function(result){
    db.close();
	if(result != null && result != undefined && result.parent_id != '0')
		return result.parent_id;
	else
		return "";
  });  
};

// gets name of given category
exportFuns.getCategoryName = (service_category_id)=>{
  let db = new Mongo;

  return db.connect(config.mongoURI)
  .then(function(){
	 var searchPattern = {
		'_id' : db.makeID(service_category_id)
	  };
	 return db.findOne('category', searchPattern);
  })
  .then(function(result){
	db.close();
	if(result != null || result != undefined)
		return result.category_name;
	else
		return "";
  });
  ;
};

// save a single service image upload
exportFuns.save_image_uploads = (service_id, uploadedimage) => {

    //let db = new Mongo;
	uploaded_img_url = "";
	if(uploadedimage != null) {
		var fs     = require('fs')
		var image = uploadedimage;
		var upload_path = "service_" + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
		var bitmap = new Buffer(image, 'base64');
		fs.writeFileSync("public/uploads/services/" + upload_path, bitmap);
		var uploaded_img_url = config.base_url + '/uploads/services/' + upload_path;		
	}
    return uploaded_img_url;
}

exportFuns.save_image_uploads_old = (service_id, uploadedimage) => {

    let db = new Mongo;

	if(uploadedimage != null) {
		var fs     = require('fs')
		var image = uploadedimage;
		var upload_path = "service_" + Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
		var bitmap = new Buffer(image, 'base64');
		fs.writeFileSync("public/uploads/services/" + upload_path, bitmap);
		var uploaded_img_url = config.base_url + '/uploads/services/' + upload_path;
		
		let insertPattern = {
			service_id: db.makeID(service_id),
			image: uploaded_img_url,
			created_at: new Date(),
			updated_at: new Date()
		};

		return db.connect(config.mongoURI)
		.then(function() {

			return db.insert('service_uploads', insertPattern)
			.then(function(result) {
				return result.ops[0];
			});
		});
	}
    	
}


// save service area pricing info
exportFuns.save_service_area_and_pricing = (service_id, area_from_sqft, area_to_sqft, price) => {

    let db = new Mongo;

	let insertPattern = {
		service_id: db.makeID(service_id),
		area_from_sqft: area_from_sqft,
		area_to_sqft: area_to_sqft,
		price: price,
		created_at: new Date(),
		updated_at: new Date()
	};

	return db.connect(config.mongoURI)
	.then(function() {

		return db.insert('service_area_and_pricing', insertPattern)
		.then(function(result) {
			return result.ops[0];
		});
	});	
}

// save service grass/snow area
exportFuns.save_service_grass_snow_height = (service_id, area_from_sqft, area_to_sqft, price) => {

    let db = new Mongo;

	let insertPattern = {
		service_id: db.makeID(service_id),
		height_from_sqft: area_from_sqft,
		height_to_sqft: area_to_sqft,
		price: price,
		created_at: new Date(),
		updated_at: new Date()
	};

	return db.connect(config.mongoURI)
	.then(function() {

		return db.insert('service_grass_snow_height', insertPattern)
		.then(function(result) {
			return result.ops[0];
		});
	});	
}

//get all subcategories of given category id
exportFuns.get_subcategories = (parent_category_id) => {
    
    let db = new Mongo;
        return db.connect(config.mongoURI)
    .then(function() {
		let searchPattern = {
			parent_id : "" + parent_category_id
	    };
		return db.find('category', searchPattern)
		
    });
}

// save service addons
exportFuns.save_service_addons = (service_id, name, price) => {

    let db = new Mongo;

	let insertPattern = {
		service_id: db.makeID(service_id),
		svc_addon_name: name,
		svc_addon_price: price,
		created_at: new Date(),
		updated_at: new Date()
	};

	return db.connect(config.mongoURI)
	.then(function() {

		return db.insert('service_addons', insertPattern)
		.then(function(result) {
			return result.ops[0];
		});
	});	
}


// save service options
exportFuns.save_service_options = (service_id, name, price) => {

    let db = new Mongo;

	let insertPattern = {
		service_id: db.makeID(service_id),
		svc_option_name: name,
		svc_option_price: price,
		created_at: new Date(),
		updated_at: new Date()
	};

	return db.connect(config.mongoURI)
	.then(function() {

		return db.insert('service_addons', insertPattern)
		.then(function(result) {
			return result.ops[0];
		});
	});	
}

// Insert Appointment
exportFuns.insert_appointment = (data) => {
    
    let db = new Mongo;
    /*let searchPattern = {
        expiry_date: { $gte: String(new Date()) }, 
    };*/
    return db.connect(config.mongoURI)
    .then(function() {
		if(data.provider_id != null) {
			return user_model.getUser(data.provider_id)
			.then(function(userresult){
				if(userresult != null) {
					var firstName = userresult.fullname.split(' ').slice(0, -1).join(' ');
					var lastName = userresult.fullname.split(' ').slice(-1).join(' ');
					data.provider_firstname = firstName;
					data.provider_lastname = lastName;
					data.provider_company = "";
				}
				return db.insert('appointments', data);
			});		
        } else {
			return db.insert('appointments', data);
		}
    })
    .then(function(userdata) {
        db.close();
        return userdata;
    });
};

//get appointment by id
exportFuns.get_appointment_by_id = (appointment_id) => {
	let db = new Mongo;
        return db.connect(config.mongoURI)
    .then(function() {
		let searchPattern = {
			_id : db.makeID(appointment_id)
	    };
		return db.findOne('appointments', searchPattern);		
    });
};

// Reschedule Appointment
exportFuns.reschedule_appointment = (appointment_id, appointment_date, appointment_time) => {
    
    let db = new Mongo;
    return db.connect(config.mongoURI)
    .then(function() {
		
		return exportFuns.get_appointment_by_id(appointment_id)
		.then(function(resrecord){
			if(resrecord != null && resrecord != "" && resrecord != []) {
				var appointment_data = {
								parent_appointment_id : appointment_id, //associating with old appointment
								consumer_id : resrecord.consumer_id,
								provider_id: resrecord.provider_id,
								service_id: resrecord.service_id,
								appointment_date: appointment_date,
								appointment_time:appointment_time,
								service_addons:resrecord.service_addons,
								service_options:resrecord.service_options,
								service_area_and_pricing:resrecord.service_area_and_pricing,
								service_grass_snow_height:resrecord.service_grass_snow_height,
								notes:resrecord.notes,
								svc_option_ids: resrecord.svc_option_ids,
								svc_addon_ids: resrecord.svc_addon_ids,
								coupon_id:resrecord.coupon_id,
								is_confirmed:0, //keeping appointment unconfirmed till payment is made
								created_at:new Date(),
								updated_at:new Date(),
								is_active:1,
								is_deleted:0,
								service_name: resrecord.service_name,
								user_name: resrecord.user_name,
								consumerdata : resrecord.consumerdata,
								providerdata : resrecord.providerdata 
							};					
				return user_model.getUser(resrecord.provider_id)
				.then(function(userresult){
					if(userresult != null) {						
						var firstName = userresult.fullname.split(' ').slice(0, -1).join(' ');
						var lastName = userresult.fullname.split(' ').slice(-1).join(' ');
						appointment_data.provider_firstname = firstName;
						appointment_data.provider_lastname = lastName;
						appointment_data.provider_company = "";
					}
					return db.insert('appointments', appointment_data);
				})
				.then(function(result){
					return exportFuns.delete_appointment(appointment_id)
					.then(function(del_result){					
						return result.ops[0];
					});					
				});
			} else {
				return "";
			}
		});
    });
};

//delete appointment
exportFuns.delete_appointment = (appointment_id) => {
	let db = new Mongo;
    let searchPattern = {
		_id: db.makeID("" + appointment_id)
    };
	let updatePattern = {
		is_deleted : 1,
		is_active: 0
	};
	return db.connect(config.mongoURI)
    .then(function() {
        return db.update('appointments', searchPattern, updatePattern);
    })
	.then(function(rec_deleted){
		return rec_deleted;
	});
};

// Get appointments by user_id
exportFuns.get_appointments = (user_id) => {
    
    let db = new Mongo;
    let searchPattern = {
		$or : [ {"consumer_id" : "" + user_id},{"provider_id" : "" + user_id} ] 
    };
	return db.connect(config.mongoURI)
    .then(function() {
        return db.find('appointments', searchPattern);
    })
    .then(function(result) {
        var arr_providers = {};
		var arr_consumers = {};
		
		var arr_providers_current = [];
		var arr_providers_previous = [];
		var arr_consumers_current = [];
		var arr_consumers_previous = [];
		
		var today = new Date();
		today.setHours(0, 0, 0, 0);
		var resultset = {};
					
		return exportFuns.addRatingtoAppointments(result, user_id)
		.then(function(procresult){
			procresult.forEach(function(record){
				var apptmt_date = record.appointment_date.split("-").reverse().join("-");
				record.appointment_time = sendmail.convertToSmallTime(record.appointment_time);
				if(record.consumer_id == user_id) { //providers	
					if((new Date(apptmt_date) >= today) && (record.is_active > 0)) {
						arr_providers_current.push(record);
					} else {
						arr_providers_previous.push(record);
					}
				} else { //consumers
					if(record.user_name) {
						var firstName = record.user_name.split(' ').slice(0, -1).join(' ');
						var lastName = record.user_name.split(' ').slice(-1).join(' ');
						record.provider_firstname = firstName;
						record.provider_lastname = lastName;
					}
					if((new Date(apptmt_date) >= today) && (record.is_active > 0)) {
						arr_consumers_current.push(record);
					} else {
						arr_consumers_previous.push(record);
					}
				}			
			});
			arr_providers = {"previous" : arr_providers_previous, "current" : arr_providers_current};
			arr_consumers = {"previous" : arr_consumers_previous, "current" : arr_consumers_current};
			resultset = {"providers" : arr_providers, "customers" : arr_consumers};
			return resultset;
		});			
		
    });
};

// Get appointments by user_id
exportFuns.get_appointments_old = (user_id) => {
    
    let db = new Mongo;
    let searchPattern = {
		$or : [ {"consumer_id" : "" + user_id},{"provider_id" : "" + user_id} ] 
    };
	return db.connect(config.mongoURI)
    .then(function() {
        return db.find('appointments', searchPattern);
    })
    .then(function(result) {
        db.close();
		var arr_providers = {};
		var arr_consumers = {};
		
		var arr_providers_current = [];
		var arr_providers_previous = [];
		var arr_consumers_current = [];
		var arr_consumers_previous = [];
		
		var today = new Date();
		today.setHours(0, 0, 0, 0);
		var resultset = {};
		console.log("result:" + result.length);
			
		result.forEach(function(record){
			var apptmt_date = record.appointment_date.split("-").reverse().join("-");
			record.appointment_time = sendmail.convertToSmallTime(record.appointment_time);
			if(record.consumer_id == user_id) { //providers	
				record.userdata = record.providerdata;
				delete record.providerdata;
				delete record.consumerdata;
				if((new Date(apptmt_date) >= today) && (record.is_active > 0)) {
					arr_providers_current.push(record);
				} else {
					arr_providers_previous.push(record);
				}
			} else { //consumers
				record.userdata = record.consumerdata;
				delete record.providerdata;
				delete record.consumerdata;
				if(record.user_name) {
					var firstName = record.user_name.split(' ').slice(0, -1).join(' ');
					var lastName = record.user_name.split(' ').slice(-1).join(' ');
					record.provider_firstname = firstName;
					record.provider_lastname = lastName;
				}
				if((new Date(apptmt_date) >= today) && (record.is_active > 0)) {
					arr_consumers_current.push(record);
				} else {
					arr_consumers_previous.push(record);
				}
			}			
		});
		arr_providers = {"previous" : arr_providers_previous, "current" : arr_providers_current};
		arr_consumers = {"previous" : arr_consumers_previous, "current" : arr_consumers_current};
		resultset = {"providers" : arr_providers, "customers" : arr_consumers};
        return resultset;
    });
};

//adds rating and userdata to supplied appointment records
exportFuns.addRatingtoAppointments = (result, user_id) => {
	
	return Promise.map(result, record => {
						return exportFuns.getRatingByServiceId(record.service_id)
						.then(function(svcrecord){
							return exportFuns.getCouponById(record.coupon_id)
							.then(function(coupondata){
								if(coupondata != null && coupondata != undefined) {
									record.coupon_code = coupondata.coupon_code;
								} else {
									record.coupon_code = "";
								}
								if(svcrecord == null) {
									record.rating = "0.00";
									record.cancel_rsh_policy = "";
									record.cancel_fee = "";
									record.reschedule_fee = "";
									record.legal_policy = "";
									record.cancel_hours = "";
									record.reschedule_hours = "";
								} else {
									if(svcrecord.rating !=null && svcrecord.rating != undefined )
										record.rating = parseFloat(svcrecord.rating).toFixed(2);
									else
										record.rating = "0.00";
									
									if(svcrecord.cancel_rsh_policy !=null && svcrecord.cancel_rsh_policy != undefined )
										record.cancel_rsh_policy = svcrecord.cancel_rsh_policy;
									else
										record.cancel_rsh_policy = "";
									
									if(svcrecord.cancel_fee !=null && svcrecord.cancel_fee != undefined )
										record.cancel_fee = svcrecord.cancel_fee;
									else
										record.cancel_fee = "";
									
									if(svcrecord.reschedule_fee !=null && svcrecord.reschedule_fee != undefined )
										record.reschedule_fee = svcrecord.reschedule_fee;
									else
										record.reschedule_fee = "";
									
									if(svcrecord.legal_policy !=null && svcrecord.legal_policy != undefined )
										record.legal_policy = svcrecord.legal_policy;
									else
										record.legal_policy = "";
									
									
									if(svcrecord.cancel_hours !=null && svcrecord.cancel_hours != undefined )
										record.cancel_hours = svcrecord.cancel_hours;
									else
										record.cancel_hours = "";
									
									if(svcrecord.reschedule_hours !=null && svcrecord.reschedule_hours != undefined )
										record.reschedule_hours = svcrecord.reschedule_hours;
									else
										record.reschedule_hours = "";										
								}
																
								var apptmt_date = record.appointment_date.split("-").reverse().join("-");
								record.appointment_time = sendmail.convertToSmallTime(record.appointment_time);
								
								if(record.service_addons != "") {	
									if(typeof record.service_addons != "string")
										record.service_addons = JSON.parse(JSON.stringify(record.service_addons));
									else
										record.service_addons = JSON.parse(record.service_addons);
								} else {
									record.service_addons = [];
								}
								
								if(record.service_options != "") { 
									if(typeof record.service_options != "string")
										record.service_options = JSON.parse(JSON.stringify(record.service_options));
									else
										record.service_options = JSON.parse(record.service_options);
								} else {
									record.service_options = [];
								}
								
								
								if(record.service_area_and_pricing != "") {
									if(typeof record.service_area_and_pricing != "string")
										record.service_area_and_pricing = JSON.parse(JSON.stringify(record.service_area_and_pricing));
									else
										record.service_area_and_pricing = JSON.parse(record.service_area_and_pricing);
								} else {
									record.service_area_and_pricing = [];
								}
								
								
								if(record.service_grass_snow_height != "") {
									if(typeof record.service_grass_snow_height != "string")
										record.service_grass_snow_height = JSON.parse(JSON.stringify(record.service_grass_snow_height));
									else
										record.service_grass_snow_height = JSON.parse(record.service_grass_snow_height);
								} else {
									record.service_grass_snow_height = [];
								}
								
								var currency = "$";
								if(record.consumer_id == user_id) { //providers	
									if(record.providerdata != null) {
										if(record.providerdata.country != null && record.providerdata.country != undefined && record.providerdata.country == "Canada") {
											currency = "C$";
										}
									}
									record.currency = currency;
								
									record.userdata = record.providerdata;
									delete record.providerdata;
									delete record.consumerdata;								
								} else { //consumers
									if(record.consumerdata != null) {
										if(record.consumerdata.country != null && record.consumerdata.country != undefined && record.consumerdata.country == "Canada") {
											currency = "C$";
										}
									}
									record.currency = currency;
									
									record.userdata = record.consumerdata;
									delete record.providerdata;
									delete record.consumerdata;
									if(record.user_name) {
										var firstName = record.user_name.split(' ').slice(0, -1).join(' ');
										var lastName = record.user_name.split(' ').slice(-1).join(' ');
										record.provider_firstname = firstName;
										record.provider_lastname = lastName;
									}								
								}							
								return record;
							});							
		                })
		}).then(finalList => {
			return finalList;
		});
};

//get service by id
exportFuns.getRatingByServiceId = (serviceId) => {
	let db = new Mongo;
	let oid = db.makeID(serviceId);
	let searchPattern = {_id : oid};

	return db.connect(config.mongoURI)
	.then(function(){
		return db.findOne('services', searchPattern);
	})
	.then(function(service){
		db.close();
		return service;
	});
};

//cancel given appointment
exportFuns.cancel_appointment = (appointment_id) => {
	
    let db = new Mongo;
    let searchPattern = {
		_id: "" + appointment_id,
    };
	return db.connect(config.mongoURI)
    .then(function() {
        let searchUserPattern = {
			_id: db.makeID(appointment_id)
		};

		var updatedData = {
			is_active: String(0)
		};

	  return db.update('appointments', searchUserPattern, updatedData);
    })
    .then(function(result) {
		db.close();
		return result;
    });
};

//confirm given appointment
exportFuns.confirm_appointment = (appointment_id) => {
	
    let db = new Mongo;
    let searchPattern = {
		_id: "" + appointment_id,
    };
	return db.connect(config.mongoURI)
    .then(function() {
        let searchUserPattern = {
			_id: db.makeID(appointment_id)
		};

		var updatedData = {
			is_confirmed: String(1)
		};

	  return db.update('appointments', searchUserPattern, updatedData);
    })
    .then(function(result) {
		db.close();
		return result;
    });
};

// Check review is exist or not
exportFuns.check_review_exist = (data) => {
    
    let db = new Mongo;
    let searchPattern = {
		user_id: data.user_id, 
		service_id:data.service_id
    };
    return db.connect(config.mongoURI)
    .then(function() {
        return db.find('service_review', searchPattern);
    })
    .then(function(result) {
        db.close();
        return result;
    });
};
// Add new review
exportFuns.add_review = (data)=>{
	let db = new Mongo;
    let insertPattern = {
		service_id: data.service_id,
		user_id: data.user_id,
		rate:Number(data.rate),
		comment:data.comment,
		created_at: new Date(),
		updated_at: new Date()
	};
	return db.connect(config.mongoURI)
	.then(function(){
	  return db.insert('service_review', insertPattern);
	})
	.then(function(data){
	  db.close();
	  return data.ops[0];
	});
  };
// Get Review average
exportFuns.get_average_review = (service_id)=>{
    
	let db = new Mongo;
	return db.connect(config.mongoURI)
	.then(function(){
	return db.get_average('service_review',service_id);
	})
	.then(function(data){
	  db.close();
	  return data;
	});
};
// Update review
exportFuns.update_review = (service_id,avg_value)=>{
    
	let db = new Mongo;
	return db.connect(config.mongoURI)
	.then(function(){
		
		let searchUserPattern = {
			_id: db.makeID(service_id)
		};

		var updatedData = {
			rating: String(avg_value)
		};

	  return db.update('services', searchUserPattern, updatedData);
	})
	.then(function(data){
	  db.close();
	  return data;
	});
  };
  
exportFuns.getMinServicePrice = (recpost)=>{
	var min_price = 999999999;
	if(recpost.service_area_and_pricing != null && recpost.service_area_and_pricing != undefined && recpost.service_area_and_pricing != "") {
		var svc_area = recpost.service_area_and_pricing;
		svc_area.forEach(function (rec_svc_area){
			if(rec_svc_area.price != null && rec_svc_area.price != undefined && rec_svc_area.price != "" && rec_svc_area.price < min_price) {
				min_price = rec_svc_area.price;
			}
		});
	}
	
	if(recpost.service_grass_snow_height != null && recpost.service_grass_snow_height != undefined && recpost.service_grass_snow_height != "") {
		var svc_grass = recpost.service_grass_snow_height;
		svc_grass.forEach(function (rec_svc_grass){
			if(rec_svc_grass.price != null && rec_svc_grass.price != undefined && rec_svc_grass.price != "" && rec_svc_grass.price < min_price) {
				min_price = rec_svc_grass.price;
			}
		});
	}
	
	if(recpost.service_addons != null && recpost.service_addons != undefined && recpost.service_addons != "") {
		var svc_addon = recpost.service_addons;
		svc_addon.forEach(function (rec_svc_addon){
			if(rec_svc_addon.price != null && rec_svc_addon.price != undefined && rec_svc_addon.price != "" && rec_svc_addon.price < min_price) {
				min_price = rec_svc_addon.price;
			}
		});
	}
	
	if(recpost.service_options != null && recpost.service_options != undefined && recpost.service_options != "") {
		var svc_option = recpost.service_options;
		svc_option.forEach(function (rec_svc_option){
			if(rec_svc_option.price != null && rec_svc_option.price != undefined && rec_svc_option.price != "" && rec_svc_option.price < min_price) {
				min_price = rec_svc_option.price;
			}
		});
	}
	
	if(min_price == 999999999) {
		min_price = 0;
	}
	
	return min_price;
};

//get coupon by id
exportFuns.getCouponById = (coupon_id)=>{
  let db = new Mongo;
  //let oid = db.makeID(coupon_id);
  let oid = "" + coupon_id;
  let searchPattern = {_id : oid};

  return db.connect(config.mongoURI)
  .then(function(){
    return db.findOne('coupon', searchPattern);
  })
  .then(function(coupondata){
    return coupondata;
  });
};


//get coupon by code
exportFuns.getCouponByCode = (coupon_code)=>{
  let db = new Mongo;
  //let oid = db.makeID(coupon_id);
  let oid = "" + coupon_code;
  let searchPattern = {
    "coupon_code": {$regex : oid, $options: "i"},
  };

  return db.connect(config.mongoURI)
  .then(function(){
    return db.findOne('coupon', searchPattern);
  })
  .then(function(coupondata){
    return coupondata;
  });
};

//get payment details
exportFuns.get_payment_details = (appointment_id, user_id) => {
	return exportFuns.get_appointment_by_id(appointment_id)
	.then(function(appointment_data){
		if(appointment_data.coupon_id == null || appointment_data.coupon_id == undefined || appointment_data.coupon_id == "") {
			appointment_data.coupon_id = "#####";
		}
		//return exportFuns.getCouponById(appointment_data.coupon_id) //changed to below on 24Apr18 as suggested
		return exportFuns.getCouponByCode(appointment_data.coupon_id)
		.then(function(coupondata){
			var pdataresult = {};
			if(coupondata == null) {
				var percent_discount = 0;
			} else {
				var percent_discount = (coupondata.percent != null) ? coupondata.percent: 0;
			}
			var pdata = exportFuns.get_total_payment_amount(appointment_data, percent_discount);
			pdataresult.total_price = "" + pdata[0];
			pdataresult.discount = pdata[1];
			
			pdataresult.provider_name = (user_id == appointment_data.consumer_id)? appointment_data.providerdata.fullname : appointment_data.consumerdata.fullname;
			pdataresult.consumer_name = (user_id == appointment_data.consumer_id)? appointment_data.consumerdata.fullname : appointment_data.providerdata.fullname;
			
			return pdataresult;
		});
	});
};

//get total payment data as array
exportFuns.get_total_payment_amount = (appointment_data, percent) => {
	var payment_data = [];
	var total_price = 0;
	if(appointment_data.service_area_and_pricing != null && appointment_data.service_area_and_pricing != undefined && appointment_data.service_area_and_pricing != "") {
		//if(typeof appointment_data.service_area_and_pricing === 'string') {
			if(typeof appointment_data.service_area_and_pricing == "string") {
				var svc_area = JSON.parse(appointment_data.service_area_and_pricing);
			} else {
				var svc_area = JSON.parse(JSON.stringify(appointment_data.service_area_and_pricing));
			}
			for(var i = 0; i < svc_area.length; i++) {
				if(svc_area[i].price != null && svc_area[i].price != undefined && svc_area[i].price != "" && svc_area[i].price) {
					total_price = parseFloat(total_price) + parseFloat(svc_area[i].price);
				}
			}
		//}
	}
	
	if(appointment_data.service_grass_snow_height != null && appointment_data.service_grass_snow_height != undefined && appointment_data.service_grass_snow_height != "") {
		//if(typeof appointment_data.service_grass_snow_height === 'string') {
			if(typeof appointment_data.service_grass_snow_height == "string") {
				var svc_grass = JSON.parse(appointment_data.service_grass_snow_height);
			} else {
				var svc_grass = JSON.parse(JSON.stringify(appointment_data.service_grass_snow_height));
			}
			for(var i = 0; i < svc_grass.length; i++) {
				if(svc_grass[i].price != null && svc_grass[i].price != undefined && svc_grass[i].price != "" && svc_grass[i].price) {
					total_price = parseFloat(total_price) + parseFloat(svc_grass[i].price);
				}
			}
		//}
	}
	
	if(appointment_data.service_addons != null && appointment_data.service_addons != undefined && appointment_data.service_addons != "") {		
		if(typeof appointment_data.service_addons == "string") {
			appointment_data.service_addons = _.trim(appointment_data.service_addons);
			var svc_addon = JSON.parse(appointment_data.service_addons)
		} else {
			var svc_addon = JSON.parse(JSON.stringify(appointment_data.service_addons));
		}		
		//if(typeof appointment_data.service_addons === 'string') {
			
			for(var i = 0; i < svc_addon.length; i++) {
				if(svc_addon[i].price != null && svc_addon[i].price != undefined && svc_addon[i].price != "" && svc_addon[i].price) {
					total_price = parseFloat(total_price) + parseFloat(svc_addon[i].price);
				}
			}
		//}
	}
	
	if(appointment_data.service_options != null && appointment_data.service_options != undefined && appointment_data.service_options != "") {
		//if(typeof appointment_data.service_options === 'object') {
			if(typeof appointment_data.service_options == "string") {
				var svc_option = JSON.parse(appointment_data.service_options);
			} else {
				var svc_option = JSON.parse(JSON.stringify(appointment_data.service_options));
			}
			console.log("svc_option");
			console.log(svc_option);
			for(var i = 0; i < svc_option.length; i++) {
				if(svc_option[i].price != null && svc_option[i].price != undefined && svc_option[i].price != "" && svc_option[i].price) {
					total_price = parseFloat(total_price) + parseFloat(svc_option[i].price);
				}
			}
		//}
	}
	
	var discount = 0;
	if(percent > 0) {
		discount = parseFloat((total_price * percent) /100).toFixed(2);
		total_price = parseFloat(total_price - discount).toFixed(2);
	}
	payment_data.push(parseFloat(total_price).toFixed(2));
	payment_data.push(parseFloat(discount).toFixed(2));
	return payment_data;
};
exportFuns.get_payment_data=()=>{
	let db = new Mongo;
   
    return db.connect(config.mongoURI)
    .then(function() {
        return db.find('settings');
    })
    .then(function(settings) {
        db.close();
        return settings;
    });
};

//stripe payment
exportFuns.make_stripe_payment = (token, amount, currency, user_id, appointment_id) => {
	let db = new Mongo;
    let searchPattern = {
		key : "stripe_secret_key"
	};
	
    return db.connect(config.mongoURI)
    .then(function() {
        return db.findOne('settings', searchPattern)
		.then(function(res_key){
			var secret_key = res_key.value;
			if(secret_key) {
				var stramount = "" + amount;
				if(stramount.indexOf(".") > -1) {
					amount = amount * 100; //removing decimals as required by stripe 
				}
				var stripe = require("stripe")("" + secret_key);
				var currency_code = (currency == "C$")? "cad" : "usd";
				return stripe.charges.create({
					amount: amount, // amount in cents, again
					currency: currency_code,
					card: token,
					description: "Payment from userid:" + user_id
				});
			}
		})
		.then(function(charge){
			return exportFuns.record_payment_details(token, amount, currency, user_id, appointment_id, charge)
			.then(function(res_record){
				var resp_obj = {};
				resp_obj.responsecode = 1;
				resp_obj.message = "Payment was successful";
				return resp_obj;
			});
		}).catch(function(err){
			console.log(JSON.stringify(err, null, 2));
			return exportFuns.record_payment_details(token, amount, currency, user_id, appointment_id, err)
			.then(function(res_record){
				var resp_obj = {};
				resp_obj.responsecode = 0;
				resp_obj.message = "" + err.message;
				return resp_obj;
			});
		});		
    })
    .then(function(res_payment) {
		db.close();
        return res_payment;
    });
};

//record payment details
exportFuns.record_payment_details = (token, amount, currency, user_id, appointment_id, payment_info) => {
	let db = new Mongo;
   
    let payment_details = {
		user_id: user_id,
		currency : currency,
		amount: amount,
		token: token,
		payment_details: payment_info,
		appointment_id: appointment_id,
		created_at: new Date()
	};
    return db.connect(config.mongoURI)
    .then(function() {
        return db.insert('payments', payment_details);
    })
    .then(function(respayments) {
        db.close();
        return respayments;
    });
};

//get all coupons
exportFuns.get_all_coupons = () => {
	let db = new Mongo;
   
    let searchPattern = {
		$or : [ {"is_deleted" : 0},{"is_deleted" : "0"} ]
	};
    return db.connect(config.mongoURI)
    .then(function() {
        return db.find('coupon', searchPattern);
    })
    .then(function(coupons) {
        db.close();
        return coupons;
    });
};

module.exports = exportFuns;
