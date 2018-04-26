"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo'),
	{crypto} = require('../../api/helpers');


const Promise = require("bluebird");

//All user
exportFuns.all_user = ()=>{
  let searchPattern = {
    $and : [
				{ $or : [ {"user_role" : "2"},{"user_role" : 2 } ] },
				{ $or : [ {"is_deleted" : "0"},{"is_deleted" : 0 } ] },
				{ $or : [ {"is_active" : "1"},{"is_active" : 1 } ] },
			]
  };

  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.find('users', searchPattern);
  })
  .then(function(user){
    db.close();
    return user;
  });
};
//Delete User

exportFuns.delete_user = (user_id)=>{
  let db = new Mongo;
  let searchPattern = {
     					_id:  db.makeID(user_id),
  					  };

  let updatedData =   {
	                    is_deleted: 1,
	                    is_active: 0,
                	  };
  return db.connect(config.mongoURI)
  .then(function(){
    return  db.update('users', searchPattern, updatedData);
  })
  .then(function(numUpdated){
      db.close();
      return numUpdated;
  });
};

// check user id is exist
exportFuns.get_user_by_user_id = (user_id) => {

    let db = new Mongo;

    let searchPattern = {
        _id:  db.makeID(user_id),
        user_role: 2,
        is_deleted: 0
    };

    return db.connect(config.mongoURI)
    .then(function() {
        return db.findOne('users', searchPattern);
    })
    .then(function(user) {
        db.close();
        return user;
    });
};
// check phone is exist
exportFuns.get_user_by_phone_no = (phone) => {

	let db = new Mongo;

	let searchPattern = {
			phone:  phone,
			user_role: 2
	};

	return db.connect(config.mongoURI)
	.then(function() {
			return db.findOne('users', searchPattern);
	})
	.then(function(user) {
			db.close();
			return user;
	});
};
// get data user not particular user
exportFuns.check_phone_exist = (user_id,phone) => {

	let db = new Mongo;

	let searchPattern = {
			_id: { $ne: db.makeID(user_id) },
			phone:phone,
			user_role: 2,
			is_deleted: 0
	};

	return db.connect(config.mongoURI)
	.then(function() {
			return db.findOne('users', searchPattern);
	})
	.then(function(user) {
			db.close();
			return user;
	});
};
// update profile
exportFuns.update_profile = (user_data,file,latitude,longitude,zipcode)=>{
    let db = new Mongo;
	if(user_data.is_active != null && user_data.is_active != "undefined" && user_data.is_active == "on")
		user_data.is_active = "1";
	else
		user_data.is_active = "0";
  	// nodejs geocoder for latitude, longitude
    let update_data={
    				  'address':user_data.address,
    				  'fullname':user_data.fullname,
    				  'phone':user_data.phone,
    				  'city':user_data.city,
    				  'state':user_data.state,
    				  'country':user_data.country,
    				  'latitude':latitude,
    				  'longitude':longitude,
    				  'zip_code':zipcode,
					  'is_active' : user_data.is_active,
					  'modified_time' : new Date()
    				}; 	
 	 
	    console.log("profiletype:" + typeof file.profile);
		if (typeof file.profile != "undefined") {
		    let imageFile = file.profile;
		    var file_name = user_data.fullname+Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
		    imageFile.mv('public/uploads/users/'+file_name, function(err) {
		    if (err){
		      console.log(err);
			  update_data.user_image = "";
		    }else{
		        update_data.user_image = config.base_url+'/uploads/users/'+file_name;
		    }
		    });
		    
	    }
	    let condition = {_id : db.makeID(user_data.user_id)};
	    

	    return db.connect(config.mongoURI)
	    .then(function(){
			console.log("img:" + update_data.user_image);
	      return db.update('users', condition, update_data);
	    })
	    .then(function(numUpdated){
	      db.close();
	      return numUpdated;
	    });
	
};

//update admin password

exportFuns.update_admin_password = (user_id, new_password) => {
	  let db = new Mongo;
	  let searchPattern = {
		  _id: db.makeID(user_id)
	  };
	  let update_data = {
    				  'password': crypto.encrypt(new_password),
					  'modified_time' : new Date()
    				};
	  return db.connect(config.mongoURI)
	  .then(function(){
		return db.update('users', searchPattern, update_data);
	  })
	  .then(function(result){
		db.close();
		return result;
	  });
};

//get_user_count
exportFuns.get_user_count = ()=>{
  
  let db = new Mongo;
  
  let searchPattern = {
	  $and : [
				{ $or : [ {"user_role" : "2"},{"user_role" : 2 } ] },
				{ $or : [ {"is_deleted" : "0"},{"is_deleted" : 0 } ] },
				{ $or : [ {"is_active" : "1"},{"is_active" : 1 } ] },
			]
  };
  return db.connect(config.mongoURI)
  .then(function(){
    return db.find('users', searchPattern);
  })
  .then(function(user){
    db.close();
	return user.length;
  });
};

//check old password
exportFuns.check_old_password = (user_id, old_password) => {
	let db = new Mongo;
    let searchPattern = {_id : db.makeID(user_id),password:old_password};
    return db.connect(config.mongoURI)
    .then(function(){		
      return db.find('users',searchPattern);
    })
    .then(function(result){
      db.close();
      return result;
    });
};

// update profile
exportFuns.add_user = (user_data,file, latitude, longitude, zipcode)=>{
	let db = new Mongo;
	if(user_data.is_active != null && user_data.is_active != "undefined" && user_data.is_active == "on")
		user_data.is_active = "1";
	
  	// nodejs geocoder for latitude, longitude
    let insert_data={   				  
    				  'fullname':user_data.fullname,
    				  'email':user_data.email,
    				  'phone':user_data.phone,
    				  'phone_1':"",
    				  'phone_2':"",
					  'address':user_data.address,
					  'address_1':"",
					  'address_2':"",
    				  'city':user_data.city,
    				  'state':user_data.state,
    				  'country':user_data.country,
    				  'latitude':latitude,
    				  'longitude':longitude,
    				  'zip_code':zipcode,
					  'is_active' : user_data.is_active,
					  'password' : crypto.encrypt(user_data.password),
					  'user_role' : 2,
					  'alternate_email' : "",
					  'facebook_login_id' : "",
					  'google_login_id' : "",
					  'social_login_data_status' : 0,
					  'otp_status' : 0,
					  'is_deleted' : 0,
					  'created_time' : new Date(),
					  'modified_time' : new Date()
    				};
 	 
		if(typeof file.profile!="undefined") {
			let imageFile = file.profile;
			var file_name = user_data.fullname+Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
			imageFile.mv('public/uploads/users/'+file_name, function(err) {
				if (err){
				  console.log(err);
				} else {
					insert_data.user_image = config.base_url+'/uploads/users/'+file_name;						
				}
			});			
		} else {
			insert_data.user_image = "";
		}
	    return db.connect(config.mongoURI)
		.then(function(){
			return db.insert('users', insert_data);
		})
	    .then(function(user){
			db.close();
			return user.ops[0];
	    });
};
// check email address is exist
exportFuns.check_email_exist = (email) => {

	let db = new Mongo;

	let searchPattern = {
			email: email,
			user_role: 2,
			is_deleted: 0
	};

	return db.connect(config.mongoURI)
	.then(function() {
			return db.findOne('users', searchPattern);
	})
	.then(function(user) {
			db.close();
			return user;
	});
};
module.exports = exportFuns;
