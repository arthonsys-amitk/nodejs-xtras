"use strict";

var exportFuns = {},
    config     = require('../../config'),
    {sendmail} = require('../helpers'),
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


// save a single service image upload
exportFuns.save_image_uploads = (service_id, uploadedimage) => {

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
        return db.insert('appointments', data)
    })
    .then(function(userdata) {
        db.close();
        return userdata;
    });
};
// Get appointments by user_id
exportFuns.get_appointments = (user_id) => {
    
    let db = new Mongo;
    let searchPattern = {
        consumer_id: user_id, 
    };
    return db.connect(config.mongoURI)
    .then(function() {
        return db.find('appointments', searchPattern);
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
		rate:data.rate,
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
module.exports = exportFuns;
