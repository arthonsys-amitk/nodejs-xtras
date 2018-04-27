"use strict";

var exportFuns = {},
    config     = require('../../config'),
    {sendmail} = require('../helpers'),
	{services} = require('../models'),
    Mongo      = require('../../mongo');
    const Promise = require("bluebird");
    const push_notifications=require('./../helpers/push_notifications');

// get user object from database using email
exportFuns.getUserByEmail = (email)=>{
  let searchPattern = {
    email : email
  };

  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.findOne('users', searchPattern);
  })
  .then(function(user){
    db.close();
    return user;
  });
};

// check user id is exist
exportFuns.check_userid_exist = (user_id) => {

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

// check username is exist
exportFuns.check_username_exist = (username) => {
    
    let db = new Mongo;

    let searchPattern = {
        username: username,
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

// check phone number is exist
exportFuns.check_phone_exist = (phone) => {

    let db = new Mongo;

    let searchPattern = {
        phone: phone,
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
// check phone number is exist with update
exportFuns.check_phone_exist_when_update = (phone,userID) => {

    let db = new Mongo;
  let oid = db.makeID(userID);
  let updatePattern = {_id : oid};
    let searchPattern = {
        phone:  phone,
        user_role: 2,
        is_deleted: 0,
        _id:{ "$ne":  oid}

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

function generate_otp() {
    var text = "";
    var possible = "0123456789";

    for (var i = 0; i < 4; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// check otp is exist
exportFuns.check_otp_exist = (user_id, user_email) => {

    let db = new Mongo;

    let searchPattern = {
        user_id: db.makeID(user_id),
        user_email: user_email,
    };

    return db.connect(config.mongoURI)
    .then(function() {

        return db.findOne('user_otp_verification', searchPattern)
        .then(function(otp_data) {
            return otp_data;
        });
    });
};

exportFuns.save_and_send_otp = (user_id, user_email) => {

    let db = new Mongo;

    let searchPattern = {
        user_id: db.makeID(user_id),
        user_email: user_email,
    };

    return db.connect(config.mongoURI)
    .then(function() {

        return db.findOne('user_otp_verification', searchPattern).then(function(otp_data) {

            var otp_number = generate_otp();
            var insertPattern = { user_id: user_id, user_email: user_email, otp_number: otp_number };

            if (otp_data == null) {

                return db.insert('user_otp_verification', insertPattern)
                .then(function(result) {

                  return result.ops[0];
                });

            } else {
                return otp_data;
            }

            var to_email = user_email;
            var subject = 'OTP Confirmation';
            var message = "Hello, Your OTP is : "+otp_number+".";

            sendmail.sendEmail(to_email, subject, message)
        });
    });
}
// check device token is exist
exportFuns.check_device_token_exist = (user_id, device_token, device_type) => {

    let db = new Mongo;

    let searchPattern = {
        user_id: db.makeID(user_id),
        device_token: device_token,
        device_type: device_type,
    };

    return db.connect(config.mongoURI)
    .then(function() {
        return db.findOne('user_device_tokens', searchPattern);
    })
    .then(function(token_data) {
        db.close();
        return token_data;
    });
};
// remove a single device token
exportFuns.remove_device_token = (user_id, device_token, device_type) => {

    let db = new Mongo;

    let searchPattern = {
        user_id: db.makeID(user_id),
        device_token: device_token,
        device_type: device_type,
    };

    return db.connect(config.mongoURI)
    .then(function() {

        // delete token on logout
        db.delete('user_device_tokens', searchPattern);
    });
}

// save a single device token
exportFuns.save_device_token = (user_id, device_token, device_type) => {

    let db = new Mongo;

    let insertPattern = {
        user_id: db.makeID(user_id),
        device_token: device_token,
        device_type: device_type,
    };

    return db.connect(config.mongoURI)
    .then(function() {
		return db.findOne('user_device_tokens', insertPattern).then(function(device_result) {
		if(device_result==null){
			return db.insert('user_device_tokens', insertPattern)
			.then(function(result) {
				return result.ops[0];
			});
		}
    });
});
}
exportFuns.verify_and_remove_otp = (user_id, user_email) => {

    let db = new Mongo;

    let searchPattern = {
        user_id: db.makeID(user_id),
        user_email: user_email,
    };

    return db.connect(config.mongoURI)
    .then(function() {
        return db.findOne('user_otp_verification', searchPattern).then(function(otp_data) {

            if(otp_data != null) {

                let searchUserPattern = {
                    _id: db.makeID(user_id),
                    email: user_email,
                };

                var updatedData = {
                    otp_status: 1,
                    is_active: 1,
                };

                db.update('users', searchUserPattern, updatedData);
                db.delete('user_otp_verification', searchPattern);
            }
        });
    });
};

// set new password for user
exportFuns.updatePassword = (user_id, updated_password)=>{

    let db = new Mongo;
    let updatePattern = {_id : db.makeID(user_id)};

    return db.connect(config.mongoURI)
    .then(function(){
      return db.update('users', updatePattern, {"password": updated_password});
    })
    .then(function(numUpdated){
      db.close();
      return numUpdated;
    });
};

// create user
exportFuns.createUser = (user)=>{
  let db = new Mongo;

  return db.connect(config.mongoURI)
  .then(function(){
    return db.insert('users', user);
  })
  .then(function(user){
    db.close();
    return user.ops[0];
  });
};

// update user
exportFuns.updateUser = (user,userID)=>{
  let db = new Mongo;
  let oid = db.makeID(userID);
  let updatePattern = {_id : oid};
  user._id = oid;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.update('users', updatePattern, user);
  })
  .then(function(numUpdated){
    db.close();
    return numUpdated;
  });
};

// returns user
exportFuns.getUser = (userID)=>{
  let db = new Mongo;
  let oid = db.makeID(userID);
  let searchPattern = {_id : oid};

  return db.connect(config.mongoURI)
  .then(function(){
    return db.findOne('users', searchPattern);
  })
  .then(function(user){
    db.close();
    return user;
  });
};

// returns array of results
exportFuns.search = (pattern, sort)=>{
  let db = new Mongo;

  if(pattern._id){
    pattern._id = db.makeID(pattern._id);
  }

  if(pattern.accountID){
    pattern.accountID = db.makeID(pattern.accountID);
  }

  return db.connect(config.mongoURI)
  .then(function(){
    return db.search('users', pattern, sort);
  })
  .then(function(users){
    db.close();
    return users;
  });
};

// returns number of users deleted
exportFuns.deleteUser = (userID)=>{
  let db = new Mongo;
  let deletePattern = {_id : db.makeID(userID)};
  return db.connect(config.mongoURI)
  .then(function(){
    return db.delete('users', deletePattern);
  })
  .then(function(results){
    db.close();
    return results.ok;
  });
};
// check coupon is exist
exportFuns.check_coupon = () => {
    
    let db = new Mongo;
    let searchPattern = {
        expiry_date: { $gte: new Date() }, 
    };
    return db.connect(config.mongoURI)
    .then(function() {
        return db.find('coupon', searchPattern);
    })
    .then(function(coupon) {
        db.close();
        return coupon;
    });
};


// get all category detail
exportFuns.get_category = () => {
    
    let db = new Mongo;
    /*let searchPattern = {
        expiry_date: { $gte: String(new Date()) }, 
    };*/
    return db.connect(config.mongoURI)
    .then(function() {      
		let searchPattern = {
			parent_id : "0"
	    };
		return db.find('category', searchPattern);
    })
    .then(function(categories) {
		var services = require('./services.js');
		return Promise.map(categories, rowcategory => {
						return services.get_subcategories(rowcategory._id)
						.then(function(result){ 
							rowcategory.subcategories = result;
		                    return rowcategory;
		                })
		}).then(finalList => {		            
					db.close();
					return finalList;
		});
    });
};

exportFuns.get_category_old = () => {
    
    let db = new Mongo;
    /*let searchPattern = {
        expiry_date: { $gte: String(new Date()) }, 
    };*/
    return db.connect(config.mongoURI)
    .then(function() {		
        return db.find('category');
    })
    .then(function(category) {
        db.close();
        return category;
    });
};

// Insert user query
exportFuns.add_faq = (email,query) => {
    
    let db = new Mongo;
    /*let searchPattern = {
        expiry_date: { $gte: String(new Date()) }, 
    };*/
    return db.connect(config.mongoURI)
    .then(function() {
        var insertPattern = { email: email, query: query,created_at:new Date(),is_deleted:0 };

            

                return db.insert('user_query', insertPattern)
    })
    .then(function(category) {
        db.close();
        return category;
    });
};
// Get coupon by service id
exportFuns.get_coupon_by_service_id = (service_id) => {
    console.log(service_id);
    let db = new Mongo;
	/*
    let searchPattern = {
        service_ids:service_id,
        expiry_date: { $gte: new Date() }         
    }; */
	let searchPattern = {
        expiry_date: { $gte: new Date() }
    };
	return db.connect(config.mongoURI)
    .then(function() {
		console.log(searchPattern);
         return db.find('coupon', {})
    })
	.then(function(res){
		console.log(res);
		if(res == null) { return res; }
		var coupons = [];
		var svc_ids = [];
		for(var i = 0; i < res.length; i++) {
			if(res[i].service_ids != null && res[i].service_ids.length > 0 && res[i].service_ids.indexOf("" + service_id) > -1) {
				coupons.push(res[i]);
			}
		}
		return coupons;
	});

};

// get user profile using User id
exportFuns.get_profile=(user_id)=>{
    re
}
module.exports = exportFuns;
