"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');


const Promise = require("bluebird");

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
    return db.find('coupon', {});
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

module.exports = exportFuns;
