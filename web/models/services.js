"use strict";

var exportFuns = {},
    config     = require('../../config'),
	user_web_model = require('./user'),
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
		return db.findOne('services', searchPattern);
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

//create post/service
exportFuns.create_service = () => {
	  let db = new Mongo;
	  return db.connect(config.mongoURI)
	  .then(function(){
		return exportFuns.get_category_list();		
	  })
	  .then(function(res_categories){
		return exportFuns.get_user_list()
		  .then(function(res_users){
			  var resservice = {};
			  resservice.all_categories = res_categories;
			  resservice.all_users = res_users;
			  return resservice;
		  });
	  })
	  .then(function(resultset){
			db.close();
			return resultset;
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

//get all transactions
exportFuns.get_transaction_list = () => {
	let db = new Mongo;
	return db.connect(config.mongoURI)
	.then(function(){
		return db.find('payments', {}, {_id : -1});
	})
	.then(function(res_transactions){
		var arr_user_ids = [];
		for(var i = 0; i < res_transactions.length; i++) {
			if(arr_user_ids.indexOf(res_transactions[i].user_id) == -1) {
				arr_user_ids.push(db.makeID(res_transactions[i].user_id));
			}
		}
		let searchPattern = { "_id" : { $in : arr_user_ids}};
		return db.find("users", searchPattern)
		.then(function(res_users) {
			var user_ids = [];
			for(var i = 0; i < res_users.length; i++) {
				user_ids.push("" + res_users[i]._id);
			}
			var result = [];
			result.push(res_transactions);
			result.push(res_users);
			result.push(user_ids);
			return result;
		});
	})
	.then(function(response){
		db.close();
		return response;
	})
	.then(function(res){
		return res;
	});
};

//get transaction details
exportFuns.get_transaction_details = (payment_id) => {
	let db = new Mongo;
	return db.connect(config.mongoURI)
	.then(function(){
		return db.findOne('payments', {_id : db.makeID(""+ payment_id)});
	})
	.then(function(res_transaction){
		return user_web_model.get_user_by_user_id(res_transaction.user_id)
		.then(function(rec_user){
			var result = [];
			result.push(res_transaction);
			result.push(rec_user);
			return result;
		});		
	})
	.then(function(res_transaction){
		db.close();
		return res_transaction;
	});
};

//post service
exportFuns.post_service = (servicedata) => {
	let db = new Mongo;
	return db.connect(config.mongoURI)
	.then(function(){
		return db.insert('services', servicedata);
	})
	.then(function(result){
		db.close();
		return result;
	});
};

module.exports = exportFuns;
