/*
this module provides helper methods to allow the application to interact with a MongoDB database
*/

var mongo = require('mongodb'),
MongoClient = mongo.MongoClient;

function DB() {
	this.db = null;			// the MongoDB database connection
};

DB.prototype.connect = function(uri) {

	// connect to the database using the uri connection string

	// trick to cope with the fact that "this" will refer to a different
	// object once in the promise's function.
	var _this = this;

	// return a javascript promise (rather than having the caller supply a callback function).
	return new Promise(function(resolve, reject) {
		if (_this.db) {
			// Already connected
			resolve();
		} else {
			var __this = _this;

			// many methods in the MongoDB driver will return a promise
			// if the caller doesn't pass a callback function.
			MongoClient.connect(uri)
			.then(
				function(database) {
					// the first function provided as a parameter to "then"
					// is called if the promise is resolved successfuly. The
					// "connect" method returns the new database connection

					// store the database connection as part of the DB object so
					// that it can be used by subsequent method calls.
					__this.db = database;

					// indicate to the caller that the request was completed succesfully,
					// no parameters are passed back.
					resolve();
				},
				function(err) {
					// called if the promise is rejected. "err" is set to the error passed by the "connect" method.
					console.log("Error connecting: " + err.message);
					// indicate to the caller that the request failed and pass back the error that was returned from "connect"
					reject(err.message);
				}
			)
		}
	})
};

DB.prototype.close = function() {

	// close the database connection. This if the connection isn't open then just ignore
	// if closing a connection fails then log the fact but then move on.
	// this method returns nothing – the caller can fire and forget.

	if (this.db) {
		this.db.close()
		.then(
			function() {},
			function(error) {
				console.log("Failed to close the database: " + error.message)
			}
		)
	}
};

DB.prototype.count = function(coll) {

	// returns a promise which resolves to the number of documents in the specified collection.
	var _this = this;

	return new Promise(function (resolve, reject){
		// {strict:true} means that the count operation will fail if the collection doesn't yet exist
		_this.db.collection(coll, {strict:true}, function(error, collection){
			if (error) {
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			} else {
				collection.count()
				.then(
					function(count) {
						// resolve the promise with the count
						resolve(count);
					},
					function(err) {
						console.log("countDocuments failed: " + err.message);
						// reject the promise with the error passed back by the count function
						reject(err.message);
					}
				)
			}
		});
	})
};

DB.prototype.sample = function(coll, numberDocs) {

	// returns a promise which is either resolved with an array of
	// "numberDocs" from the "coll" collection or is rejected with the
	// error passed back from the database driver.

	var _this = this;

	return new Promise(function (resolve, reject){
		_this.db.collection(coll, {strict:true}, function(error, collection){
			if (error) {
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			} else {
				// create a cursor from the aggregation request
				let cursor = collection.aggregate([
					{
						$sample: {size: parseInt(numberDocs)}
					}],
					{ cursor: { batchSize: 10 } }
				);

				// iterate over the cursor to access each document in the sample result set
				// could use cursor.each() if we wanted to work with individual documents here.
				cursor.toArray(function(error, docArray) {
			    	if (error) {
						console.log("Error reading fron cursor: " + error.message);
						reject(error.message);
						} else {
							resolve(docArray);
						}
		    	});
			}
		})
	})
};


DB.prototype.update = function(coll, pattern, update) {

	// return a promise that either resolves (passing the number of documents that have been updated)
	// or rejected with the error received from the database.
	// the "pattern" is used to match the required documents from the collection – to which the "update" is applied.

	var _this=this;

	return new Promise(function (resolve, reject) {
		_this.db.collection(coll, {strict:true}, function(error, collection){
			if (error) {
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			} else {
				// setting the write concern to 1 ({w:1}) means that we don't wait for the changes to be replicated
				// to any of the secondaries –  OK for a tool like this as it speeds things up at the expense of
				// resiliency but most applications would use a "majority" write concern.
				collection.updateMany(pattern, {$set: update}, {w:1})
				.then(
					function(result) {
						resolve(result.result.nModified);
					},
					function(err) {
						console.log("updateMany failed: " + err.message);
						reject(err.message);
					}
				)
			}
		})
	})
};

DB.prototype.update_with_push = function(coll, pattern, update) {

	// return a promise that either resolves (passing the number of documents that have been updated)
	// or rejected with the error received from the database.
	// the "pattern" is used to match the required documents from the collection – to which the "update" is applied.

	var _this=this;

	return new Promise(function (resolve, reject) {
		_this.db.collection(coll, {strict:true}, function(error, collection){
			if (error) {
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			} else {
				// setting the write concern to 1 ({w:1}) means that we don't wait for the changes to be replicated
				// to any of the secondaries –  OK for a tool like this as it speeds things up at the expense of
				// resiliency but most applications would use a "majority" write concern.
				collection.updateMany(pattern, {$push: update}, {w:1})
				.then(
					function(result) {
						resolve(result.result.nModified);
					},
					function(err) {
						console.log("updateMany failed: " + err.message);
						reject(err.message);
					}
				)
			}
		})
	})
};

DB.prototype.findOne = function(coll, pattern) {

	// return a promise that either resolves with the result
	// or rejected with the error received from the database.
	// the "pattern" is used to match the required document from the collection

	var _this=this;

	return new Promise(function (resolve, reject) {
		_this.db.collection(coll, {strict:true}, function(error, collection){
			if (error) {
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			} else {
				// find one
				return collection.findOne(pattern)
				.then(
					function(result) {
						resolve(result);
					},
					function(err) {
						console.log("findOne failed: " + err.message);
						reject(err.message);
					}
				)
			}
		})
	})
};

DB.prototype.find = function(coll, findPattern, sortPattern={_id:1}, limit=0 ) {

	// return a promise that either resolves with the result
	// or rejected with the error received from the database.
	// the "findPattern" is used to match the required document from the collection and,
	// the 'findPattern' is used to sorting the resultant data. 1 for ascending and -1 for descending
	// the 'limit' is used to get limited number of documents: 0 for all.

	var _this=this;

	return new Promise(function (resolve, reject) {
		_this.db.collection(coll, {strict:true}, function(error, collection){
			if (error) {
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			} else {
				// find one
				return collection.find(findPattern).sort(sortPattern).limit(limit).toArray()
				.then(
					function(result) {
						resolve(result);
					},
					function(err) {
						console.log("findOne failed: " + err.message);
						reject(err.message);
					}
				)
			}
		})
	})
};

DB.prototype.search = function(coll, pattern, sort) {

	// return a promise that either resolves with the result
	// or rejected with the error received from the database.
	// the "pattern" is used to match the required documents from the collection, sort sorts

	var _this=this;

	return new Promise(function (resolve, reject) {
		_this.db.collection(coll, {strict:true}, function(error, collection){
			if (error) {
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			} else {
				// search
				let cursor = collection.find(pattern).sort(sort);
				cursor.toArray(function(error, docArray) {
			    	if (error) {
						console.log("Error reading fron cursor: " + error.message);
						reject(error.message);
						} else {
							resolve(docArray);
						}
		    	});
			}
		})
	})
};

DB.prototype.insertMany = function(coll, docs) {
	// takes the passed array of JSON documents and writes them to the specified collection
	// returns a promise that resolves with the number of documents added or is rejected with an error.

	var _this = this;
	return new Promise(function (resolve, reject){
		_this.db.collection(coll, {strict:false}, function(error, collection){
			if (error) {
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			} else {

				// verify that it's really an array
				if (!Array.isArray(docs)) {
					console.log("Data is not an array");

					// reject the promise with a new error object
					reject({"message": "Data is not an array"});
				} else {
					// insert the array of documents

					// insertMany updates the original array by adding _id's; we don't
					// want to change our original array so take a copy. "JSON.parse"
					// throws an exception rather than returning an error and so we need
					// to catch it.

					try {
						var _docs = JSON.parse(JSON.stringify(docs));
					} catch(trap) {
						reject("Array elements are not valid JSON");
					}

					collection.insertMany(_docs)
					.then(
						function(results) {
							resolve(results.insertedCount);
						},
						function(err) {
							console.log("Failed to insert Docs: " + err.message);
							reject(err.message);
						}
					)
				}
			}
		})
	})
};

DB.prototype.insert = function(coll, document) {
	// return a promise that either resolves or is rejected with the error received from the database
	var _this=this;

	return new Promise(function (resolve, reject) {
		_this.db.collection(coll, {strict:false}, function(error, collection){
			if (error) {
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			} else {
				collection.insert(document, {w: "majority"})
				.then(
					function(result) {
						resolve(result);
					},
					function(err) {
						console.log("Insert failed: " + err.message);
						reject(err.message);
					}
				)
			}
		})
	})
};

DB.prototype.delete = function(coll, pattern) {

	// return a promise that either resolves with the result
	// or rejected with the error received from the database.
	// the "pattern" is used to match the required document from the collection

	var _this=this;

	return new Promise(function (resolve, reject) {
		_this.db.collection(coll, {strict:true}, function(error, collection){
			if (error) {
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			} else {
				// delete
				collection.remove(pattern)
				.then(
					function(result) {
						resolve(result.result);
					},
					function(err) {
						console.log("delete failed: " + err.message);
						reject(err.message);
					}
				)
			}
		})
	})
};

DB.prototype.makeID = function(theID){
	return new mongo.ObjectID(theID);
};

DB.prototype.mostRecent = function(coll) {

	// return a promise that either resolves with the most recent docucment from the collection
	// (based on a reverse sort on `_id` or is rejected with the error received from the database.

	var _this=this;

	return new Promise(function (resolve, reject) {
		_this.db.collection(coll, {strict:false}, function(error, collection){
			if (error) {
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			} else {
				var cursor = collection.find({}).sort({_id: -1}).limit(1);
				cursor.toArray(function(error, docArray) {
			    	if (error) {
						console.log("Error reading fron cursor: " + error.message);
						reject(error.message);
					} else {
						resolve(docArray[0]);
					}
		    	})
			}
		})
	})
};


DB.prototype.findPage = function(coll, findPattern, sortPattern={_id:1}, limit=0, page=0 ) {

	// return a promise that either resolves with the result
	// or rejected with the error received from the database.
	// the "findPattern" is used to match the required document from the collection and,
	// the 'findPattern' is used to sorting the resultant data. 1 for ascending and -1 for descending
	// the 'limit' is used to get limited number of documents: 0 for all.
	// the 'page' is used for pagination

	var _this=this;

	return new Promise(function (resolve, reject) {
		_this.db.collection(coll, {strict:true}, function(error, collection){
			if (error) {
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			} else {
				if(page) {
					var page_size = limit? limit : 20;
					var skips = page_size * (page - 1);
					return collection.find(findPattern).sort(sortPattern).skip(parseInt(skips)).limit(parseInt(limit)).toArray()
					.then(
						function(result) {
							resolve(result);
						},
						function(err) {
							console.log("findOne failed: " + err.message);
							reject(err.message);
						}
					)
				} else { 
					return collection.find(findPattern).sort(sortPattern).limit(limit).toArray()
					.then(
						function(result) {
							resolve(result);
						},
						function(err) {
							console.log("findOne failed: " + err.message);
							reject(err.message);
						}
					)
				}
			}
		})
	})
};

DB.prototype.get_average = function(coll,service_id ) {

	var _this=this;
	return new Promise(function (resolve, reject) {
		_this.db.collection(coll, {strict:false}, function(error, collection){
			if (error) {
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			} else {
				var cursor = collection.aggregate([  
					{ $match: { service_id: service_id } },
   					{ $unwind: '$rate' },
					{ $group: { _id: null, avg: { $avg: '$rate' } } }
						], function(err, result) {
							resolve(result);
							
						});
					
			}
		})
	})
};

// export the module
module.exports = DB;
