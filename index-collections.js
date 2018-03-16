"use strict";

var config = require('./config'),
    Mongo  = require('./mongo');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var db = new Mongo;
db.connect(config.mongoURI)
  .then(function(){

	db.db.collection("contact_queries", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
		collection.createIndex({sender_email:1}, {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing sender_email in the contact_queries collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });

    db.db.collection("contact_queries", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex({is_deleted:1}, {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing is_deleted in the contact_queries collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	db.db.collection("faq_queries", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex({faq_sender_email:1}, {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing faq_sender_email in the contact_queries collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });

    db.db.collection("faq_queries", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex({is_deleted:1}, {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing is_deleted in the contact_queries collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("users", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex({email:1}, {unique:true, background:true, dropDups:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing email in the users collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });

    db.db.collection("users", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex({type:1}, {unique:true, background:true, dropDups:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing type in the users collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("users", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex({svc_active:1}, {w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing svc_active in the users collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	db.db.collection("users", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex({is_active:1}, {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing is_active in the users collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	db.db.collection("users", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex({is_deleted:1}, {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_deleted type in the users collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("appointments", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("parent_appointment_id", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error parent_appointment_id in the appointments collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	db.db.collection("appointments", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("consumer_id", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error consumer_id in the appointments collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	db.db.collection("appointments", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("provider_id", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error provider_id in the appointments collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	db.db.collection("appointments", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("service_id", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error service_id in the appointments collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	db.db.collection("appointments", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("is_confirmed", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_confirmed in the appointments collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	db.db.collection("appointments", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("is_active", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_active in the appointments collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
		
	
	db.db.collection("coupons", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("coupon_code", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error coupon_code in the coupons collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
		
	db.db.collection("coupons", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("is_active", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_active in the coupons collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("service_categories", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("service_name", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error service_name in the service_categories collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
		
	db.db.collection("service_categories", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("is_active", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_active in the service_categories collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
			
	db.db.collection("service_categories", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("is_deleted", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_deleted in the service_categories collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("services", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("service_category_id", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error service_category_id in the services collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
		
	db.db.collection("services", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("service_name", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error service_name in the services collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	db.db.collection("services", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("is_active", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_active in the services collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("services", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("is_deleted", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_deleted in the services collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("service_options", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("service_id", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error service_id in the service_options collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("service_options", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("service_option_name", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error service_option_name in the service_options collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("service_options", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("is_active", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_active in the service_options collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("service_options", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("is_deleted", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_deleted in the service_options collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("service_addons", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("service_id", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error service_id in the service_addons collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("service_addons", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("service_addon_name", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error service_addon_name in the service_options collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("service_addons", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("is_active", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_active in the service_addons collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("service_addons", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("is_deleted", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_deleted in the service_addons collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("service_uploads", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("service_id", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error service_id in the service_uploads collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("service_uploads", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("image", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error image in the service_uploads collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("service_uploads", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("is_active", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_active in the service_uploads collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
	
	
	db.db.collection("service_uploads", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("is_deleted", {background:true, w:1}, function(err, indexName){
          if (err){
            console.log("Error is_deleted in the service_uploads collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });
		
	
	
	db.db.collection("payments", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("consumer_id", {w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing consumer_id in the payments collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });

    db.db.collection("payments", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("provider_id", {w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing provider_id in the payments collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });

    db.db.collection("payments", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("service_id", {w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing service_id in the payments collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });

    db.db.collection("payments", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("transaction_id", {w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing transaction_id in the payments collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });

    db.db.collection("payments", {strict:true}, function(error, collection){
      if (error) {
        console.log("Could not access collection for indexing: " + error.message);
      } else {
        // index the collection
        collection.createIndex("payment_status", {w:1}, function(err, indexName){
          if (err){
            console.log("Error indexing payment_status in the payments collection");
          } else {
            console.log(`${indexName} index created`);
          }
        });
      }
    });

  

  })

sleep(3000).then(function(){db.close();console.log("Done");})
