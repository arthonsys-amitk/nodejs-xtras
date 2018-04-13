"use strict";

var exportFuns = {},
    config     = require('../../config'),
    {sendmail} = require('../helpers'),
	{user} = require('../models'),
	user_model = require('./user'),
    Mongo      = require('../../mongo');


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
								is_deleted:0
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
					return result.ops[0];
				});
			} else {
				return "";
			}
		});
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
        db.close();
		var arr_providers = {};
		var arr_consumers = {};
		
		var arr_providers_current = [];
		var arr_providers_previous = [];
		var arr_consumers_current = [];
		var arr_consumers_previous = [];
		
		var today = new Date();
		var resultset = {};
		result.forEach(function(record){
			var apptmt_date = record.appointment_date.split("-").reverse().join("-");
			record.appointment_time = sendmail.convertToSmallTime(record.appointment_time);
			if(record.consumer_id == user_id) { //providers	
				if((new Date(apptmt_date) >= today) && record.is_active) {
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
				if((new Date(apptmt_date) >= today) && record.is_active) {
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
  
module.exports = exportFuns;
