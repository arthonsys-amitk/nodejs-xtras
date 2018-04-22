"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');


const Promise = require("bluebird");

//get_services_count
exportFuns.get_services_count = ()=>{
  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.find('services', {});
  })
  .then(function(resservices){
    db.close();
    return resservices.length;
  });
};

//get list of services
exportFuns.list_services = () => {
  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.find('services', {});
  })
  .then(function(resservices){
    db.close();
    return resservices;
  });
};

//get service details by service_id
exportFuns.get_service_details = (service_id) => {
	  let db = new Mongo;
	  let searchPattern = { _id : db.makeID("" + service_id) };
	  return db.connect(config.mongoURI)
	  .then(function(){
		return db.findOne('services', {});
	  })
	  .then(function(resservice){
		  return exportFuns.get_category_list()
		  .then(function(res_categories){
			  return exportFuns.get_user_list()
			  .then(function(res_users){
				  if(resservice != null && resservice != undefined && resservice != "") {
					  resservice.all_categories = res_categories;
					  resservice.all_users = res_users;
				  }
				  return resservice;
			  });
		  })
		  .then(function(resultset){
				db.close();
				return resultset;
		  });		
	  });
};

//get all categories
exportFuns.get_category_list = () => {
	let db = new Mongo;
	return db.connect(config.mongoURI)
	.then(function(){
		return db.find('category', {});
	})
	.then(function(resservices){
		db.close();
		return resservices;
	});
};

//get all users
exportFuns.get_user_list = () => {
	let db = new Mongo;
	return db.connect(config.mongoURI)
	.then(function(){
		return db.find('users', {});
	})
	.then(function(resservices){
		db.close();
		return resservices;
	});
};

module.exports = exportFuns;
