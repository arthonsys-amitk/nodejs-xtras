"use strict";

var exportFuns = {},
    config     = require('../../config'),
    {sendmail} = require('../helpers'),
	{user} = require('../models'),
	user_model = require('./user'),
    Mongo      = require('../../mongo');

var distance = require('google-distance');
var promise = require('bluebird');

var google_api_key = "AIzaSyBZ0XtFvWk4kJqlMMTNZmYIrWOnmtnIb1Y";

//zipcode search with keyword using address fetched by zipcode
exportFuns.zipcodesearch = (search_keyword, fulladdress, type, limit, page)=>{
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
	
	if(limit && page)
		return db.findPage('services', searchPattern, {'_id': -1}, limit, page);
	else
		return db.find('services', searchPattern, {'_id': -1});
  });
};

//location search with keyword and lat,lng position
exportFuns.locationsearch = (search_keyword, search_lat, search_long, type, limit, page) => {
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
	if(limit && page)
		return db.findPage('services', searchPattern, {'_id': -1}, limit, page);
	else
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
				else {
					actual_distance = data.distance.replace(' km', '');
					actual_distance = data.distance.replace(' m', '');
				}
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

//check distance of service from given lat,lng position
exportFuns.checkServiceDistanceByLocation = (record, search_lat, search_long) => {
	 var p = new promise(function(resolve, reject) {
		 var dist = "";
		 var map_units = "metric"; // for Km
		 if(record.service_radius_units == "Miles") {
			  map_units = "imperial";
		  }
		  var record_address = "" + record.address + " , " + record.city + " , " + record.province + " " + record.zipcode + " , " + record.country;
		  distance.apiKey = google_api_key;
		  distance.get(
			  {
				origin: "" + search_lat + "," + search_long,
				destination: record_address,
				units: map_units
			  },
			  function(err, data) {
				if (err) return console.log(err);
				//console.log(data);
				var actual_distance = "";
				console.log(data);
				if(map_units == "imperial")
					actual_distance = data.distance.replace(' mi', '');
				else {
					actual_distance = data.distance.replace(' km', '');
					actual_distance = data.distance.replace(' m', '');
				}
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

//search using address fields
exportFuns.addresssearch = (search_keyword, address, city, province, zipcode, country) => {
	return "";
};

module.exports = exportFuns;
