"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');


const Promise = require("bluebird");

var dateFormat = require('dateformat');

//All user
exportFuns.get_coupons = ()=>{
  let searchPattern = {
    is_deleted : 0
  };

  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.find('coupon', searchPattern);
  })
  .then(function(coupon){
    db.close();
    return coupon;
  });
};

//get coupon count
exportFuns.get_coupon_count = ()=>{
  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.find('coupon', {is_deleted : 0});
  })
  .then(function(coupon){
    db.close();
    return coupon.length;
  });
};

//get coupon by coupon id
exportFuns.get_coupon_by_coupon_id = (coupon_id)=> {
	let db = new Mongo;
	let searchPattern = { _id : db.makeID("" + coupon_id)};
  return db.connect(config.mongoURI)
  .then(function(){
	  return db.findOne('coupon', searchPattern);
  })
  .then(function(coupon){
    db.close();
    return coupon;
  });
};

//insert coupon
exportFuns.add_coupon = (coupon_data)=> {
	let db = new Mongo;
	
	if(coupon_data.multiple_use != null && coupon_data.multiple_use != "undefined" && coupon_data.multiple_use == "on")
		coupon_data.multiple_use = 1;
	else
		coupon_data.multiple_use = 0;
	
	coupon_data.expiry_date = dateFormat(coupon_data.expiry_date, "dd-mm-yyyy");
		
	coupon_data.created_at = new Date();
	coupon_data.is_deleted = 0;
	if(coupon_data.service_ids == null || coupon_data.service_ids.length == 0) {
		coupon_data.service_ids = [];
	}
	
	delete coupon_data.btnsubmit;
	return db.connect(config.mongoURI)
	.then(function(){
		return db.insert('coupon', coupon_data);
	})
	.then(function(coupon){
		db.close();
		return coupon;
	});
};

//delete coupon
exportFuns.delete_coupon = (coupon_id)=> {
	let db = new Mongo;
	
	let searchPattern = {
		_id : db.makeID("" + coupon_id)
	};
	
	let updateData = {
		is_deleted: 1
	};
	
	return db.connect(config.mongoURI)
	.then(function(){
		return db.update('coupon', searchPattern, updateData);
	})
	.then(function(result){
		db.close();
		return result;
	});
};

//update coupon
exportFuns.update_coupon = (coupon_data)=> {
	let db = new Mongo;
	
	if(coupon_data.multiple_use != null && coupon_data.multiple_use != "undefined" && coupon_data.multiple_use == "on")
		coupon_data.multiple_use = 1;
	else
		coupon_data.multiple_use = 0;
	
	coupon_data.expiry_date = dateFormat(coupon_data.expiry_date, "dd-mm-yyyy");
	coupon_data.updated_at = new Date();
	
	let searchPattern = {
		_id : db.makeID("" + coupon_data.coupon_id)
	};
	delete coupon_data.coupon_id;
	return db.connect(config.mongoURI)
	.then(function(){
		return db.update('coupon', searchPattern, coupon_data);
	})
	.then(function(coupon){
		db.close();
		return coupon;
	});
};

module.exports = exportFuns;
