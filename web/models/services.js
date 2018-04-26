"use strict";

var exportFuns = {},
    config     = require('../../config'),
	user_web_model = require('./user'),
    Mongo      = require('../../mongo');


const Promise = require("bluebird");
var dateFormat = require('dateformat');
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
    return db.find('services', {$or : [{"is_deleted" : 0, }, {"is_deleted" : "0", }]});
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
			console.log(result);
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
		return user_web_model.get_user_by_user_id(servicedata.user_id)
		.then(function(userdata){
			servicedata.userdata = userdata;
			return db.insert('services', servicedata);
		})
		.then(function(res){
			return res;
		});
	})
	.then(function(result){
		db.close();
		return result;
	});
};

//update service
exportFuns.update_service = (service_id, servicedata) => {
	let db = new Mongo;
	let searchPattern = {_id : db.makeID("" + service_id)};
	return db.connect(config.mongoURI)
	.then(function(){
		return user_web_model.get_user_by_user_id(servicedata.user_id)
		.then(function(userdata){
			servicedata.userdata = userdata;
			return db.findOne('services', searchPattern)
			.then(function(rec_service){
				var svc_uploads = [];
				if(rec_service != null && rec_service.service_uploads != null  && rec_service.service_uploads.length > 0){
					for(var i = 0; i < 4; i++) {
						switch(i) {
							case 0: if(rec_service.service_uploads.length >= 1) {
										if(rec_service.service_uploads[i] && (servicedata.uploadedFile1 == "" || servicedata.uploadedFile1 == undefined )) {
											svc_uploads.push(rec_service.service_uploads[i]);
										} else if(servicedata.uploadedFile1) {
											svc_uploads.push(servicedata.uploadedFile1);
										}
									}
									break;
							case 1: if(rec_service.service_uploads.length >= 2) {
										if(rec_service.service_uploads[i] && (servicedata.uploadedFile2 == "" || servicedata.uploadedFile2 == undefined )) {
											svc_uploads.push(rec_service.service_uploads[i]);
										} else if(servicedata.uploadedFile2) {
											svc_uploads.push(servicedata.uploadedFile2);
										}
									}
									break;
							case 2: if(rec_service.service_uploads.length >= 3) {
										if(rec_service.service_uploads[i] && (servicedata.uploadedFile3 == "" || servicedata.uploadedFile3 == undefined )) {
											svc_uploads.push(rec_service.service_uploads[i]);
										} else if(servicedata.uploadedFile3) {
											svc_uploads.push(servicedata.uploadedFile3);
										}
									}
									break;
							case 3: if(rec_service.service_uploads.length >= 4) {
										if(rec_service.service_uploads[i] && (servicedata.uploadedFile4 == "" || servicedata.uploadedFile4 == undefined )) {
											svc_uploads.push(rec_service.service_uploads[i]);
										} else if(servicedata.uploadedFile4) {
											svc_uploads.push(servicedata.uploadedFile4);
										}
									}
									break;
						}
					}
					servicedata.service_uploads = svc_uploads;
				} else {
					svc_uploads.push(servicedata.uploadedFile1);
					svc_uploads.push(servicedata.uploadedFile2);
					svc_uploads.push(servicedata.uploadedFile3);
					svc_uploads.push(servicedata.uploadedFile4);
					servicedata.service_uploads = svc_uploads;
				}
				delete servicedata.uploadedFile1;
				delete servicedata.uploadedFile2;
				delete servicedata.uploadedFile3;
				delete servicedata.uploadedFile4;
				return db.update('services', searchPattern, servicedata);
			});			
		})
		.then(function(res){
			return res;
		});
	})
	.then(function(result){
		db.close();
		return result;
	});
};

//delete service
exportFuns.delete_service = (service_id) => {
	let db = new Mongo;
	let searchPattern = {_id: db.makeID("" + service_id)};
	let updatePattern = {"is_deleted" : 1}
	return db.connect(config.mongoURI)
	.then(function(){
		return db.update("services", searchPattern, updatePattern);
	})
	.then(function(result){
		db.close();
		return result;
	});
};

// Date filter for payment
exportFuns.filter_payment = (data) => {

	let searchPattern = {
		created_at:  { $gte: new Date(data.from_date), $lt: new Date(data.to_date)},
	   };
	let db = new Mongo;
	return db.connect(config.mongoURI)
	.then(function(){
		return db.find('payments', searchPattern).then(function(result){
			return result;
		});
	})
	.then(function(result){
		db.close();
		return result;
	});
};

module.exports = exportFuns;
