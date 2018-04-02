"use strict";
/*
ANNOYING - Mongo doesn't persist any of this unless you touch data
*/
var config = require('./config'),
    Mongo  = require('./mongo'),
    _      = require('lodash'),
    {user} = require('./api/controllers'),
    resetCollections = ['users','user_device_tokens', 'user_otp_verification'];

var db = new Mongo;

db.connect(config.mongoURI)
  .then(function(){return db.db.admin().listDatabases()})
  .then(function(dbArray){
   console.log(dbArray)
    var loc = _.findIndex(dbArray, function(o){return o.name == 'xtras';});

    if (loc == -1){
      // database doesn't exist yet so create it
      //var {Server, Db} = require('mongodb');

      console.log('xtras database has been created successfully.');
    } else {
      console.log('xtras database is already exist.');
    }
  })
  .then(function(){
      // drop collections
      for (var i = 0; i < resetCollections.length; i++){
        db.db.dropCollection(resetCollections[i], function(){});
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
    
    let admin_data = {
                        
                        fullname : 'Admin Kumar',
                        user_role : 1,
                        email : 'admin@gmail.com',
                        phone: "7877949375",
                        address: "Sector 21, Mansarovar, Jaipur, Rajasthan",
                        latitude: "26.876467",
                        longitude: "75.7459744",
                        password: "123456",
                        user_image: config.base_url,
                        facebook_login_id: "",
                        google_login_id: "",
                        social_login_data_status: 0,
                        otp_status: 1,
                        is_active: 1,
                        is_deleted: 0,
                        created_time: new Date(),
                        modified_time: new Date()
                      };
      // put one record in users
      return user.createAdmin(admin_data);
  })
  .then(function(){
    db.close();
    console.log('Finished');
  })

                      