"use strict";

var exportFuns = {},
    config     = require('../../config'),
    {sendmail} = require('../helpers'),
	{user} = require('../models'),
	user_model = require('./user'),
    Mongo      = require('../../mongo');

var distance = require('google-distance');
var promise = require('bluebird');

exportFuns.zipcodesearch = (search_keyword, fulladdress, type)=>{
  let db = new Mongo;

  return db.connect(config.mongoURI)
  .then(function(){
    var searchPattern = "";
	if(type == "individual" || type == "business") {
		searchPattern = {
			$and : [
					{service_type : "" + type},
					{$text: {$search: "" + search_keyword}}
				]
			
		};
	} else {
			searchPattern = {
				$text: {$search: "" + search_keyword}
			};
	}
	
	return db.find('services', searchPattern, {'_id': -1});	
  });
};

//check distance of service from given address
exportFuns.checkServiceDistance = (record, fulladdress) => {
	 var p = new promise(function(resolve, reject) {
		 var dist = "";
		 var map_units = "metric"; // for Km
		 if(record.service_radius_units == "Miles") {
			  map_units = "imperial";
		  }
		  var record_address = "" + record.address + " , " + record.city + " , " + record.province + " " + record.zipcode + " , " + record.country;
		  distance.apiKey = "AIzaSyBZ0XtFvWk4kJqlMMTNZmYIrWOnmtnIb1Y";
		  distance.get(
			  {
				origin: fulladdress,
				destination: record_address,
				units: map_units
			  },
			  function(err, data) {
				if (err) return console.log(err);
				//console.log(data);
				var actual_distance = "";
				if(map_units == "imperial")
					actual_distance = data.distance.replace(' mi', '');
				else
					actual_distance = data.distance.replace(' km', '');
				if(actual_distance <= record.service_radius){				
					resolve(1);					
				} else {				
					resolve(0);					
				}
				
			});
	});
	return p.then(function(result) {
		return result;
	}).catch(function(err) {
		console.log(err);
	});
};

//search using lat, long location
exportFuns.locationsearch = (search_keyword, search_lat, search_long) => {
	return "";
};

//search using address fields
exportFuns.addresssearch = (search_keyword, address, city, province, zipcode, country) => {
	return "";
};

module.exports = exportFuns;
