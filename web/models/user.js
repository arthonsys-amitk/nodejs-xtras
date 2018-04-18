"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');


const Promise = require("bluebird");

//All user
exportFuns.all_user = ()=>{
  let searchPattern = {
    is_deleted : 0
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
console.log(user_id);
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
// update profile
exportFuns.update_profile = (user_data,file,latitude,longitude,zipcode)=>{
    let db = new Mongo;
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
    				  'zip_code':zipcode
    				}
 	
 	 console.log(update_data);
	    if (typeof file.profile!="undefined")
	    {
		    let sampleFile = file.profile;
		    var file_name=user_data.fullname+Date.now() + Math.floor(Math.random() * (500 - 20 + 1) + 20) + ".jpg";
		    sampleFile.mv('public/uploads/users/'+file_name, function(err) {
		    if (err){
		      console.log(err);
		    }else{
		        update_data.user_image=config.base_url+'/uploads/users/'+file_name;
		    }
		    });
		    
	    }
	    let condition = {_id : db.makeID(user_data.user_id)};
	    

	    return db.connect(config.mongoURI)
	    .then(function(){
	      return db.update('users', condition, update_data);
	    })
	    .then(function(numUpdated){
	      db.close();
	      return numUpdated;
	    });
	
};

//get_user_count
exportFuns.get_user_count = ()=>{
  
  let db = new Mongo;
  return db.connect(config.mongoURI)
  .then(function(){
    return db.find('users', {});
  })
  .then(function(user){
    db.close();
	return user.length;
  });
};


module.exports = exportFuns;
