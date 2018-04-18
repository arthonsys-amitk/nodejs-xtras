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

module.exports = exportFuns;
