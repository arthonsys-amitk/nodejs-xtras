"use strict";
/*
ANNOYING - Mongo doesn't persist any of this unless you touch data
*/
var config = require('./config'),
    Mongo  = require('./mongo'),
    _      = require('lodash'),
    {user, product} = require('./api/controllers'),
    resetCollections = ['contact_queries','faq_queries','users', 'appointments', 'coupons', 'service_categories', 'services', 'service_options', 'service_addons', 'service_uploads', 'payments'];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


var db = new Mongo;
db.connect(config.mongoURI)
  .then(function(){return db.db.admin().listDatabases()})
  .then(function(dbArray){
	 console.log(dbArray)
    var loc = _.findIndex(dbArray, function(o){return o.name == 'xtras';});

    if (loc == -1){
      // database doesn't exist yet so create it
      //var {Server, Db} = require('mongodb');

      console.log('CREATED xtras database');
    } else {
      console.log('xtras database exists');	 
    }
  })

  .then(function(){
      // drop collections
      for (var i = 0; i < resetCollections.length; i++){
		//console.log(resetCollections[i] + ' -- dropping indexes .....');
		//db.db.collection(resetCollections[i]).dropIndexes();
		//console.log(resetCollections[i] + ' -- dropped indexes');
        //db.db.dropCollection(resetCollections[i], function(){});
        db.db.collection(resetCollections[i]).drop(); //also drops indexes
        console.log(resetCollections[i] + ' collection dropped');
      }
  })
  .then(function(){
      // create collections
      for (var i = 0; i < resetCollections.length; i++){
        db.db.createCollection(resetCollections[i], function(){});
        console.log(resetCollections[i] + ' collection created');
      }
  })
  .then(function(){
    let god = {
      email : 'admin_as@mailinator.com',
      password : 'Admin@123',
      user_role : 'admin',
      is_active : 1,
	  is_deleted: 0
    };

      // put one record in users
      return user.createUser(god);
  })

  .then(function(){
    db.close();
    console.log('Finished');
  })

 sleep(5000).then(function(){console.log("collections Done");})