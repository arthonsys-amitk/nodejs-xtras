"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');

// returns product that was created
exportFuns.createProduct = (product)=>{
  let db = new Mongo;

  return db.connect(config.mongoURI)
  .then(function(){
    return db.insert('products', product);
  })
  .then(function(prod){
    db.close();
    return prod.ops[0];
  });
};

// returns number of products updated (should always be one)
exportFuns.updateProduct = (productID, update)=>{
  let db = new Mongo;
  let oid = db.makeID(productID);
  let updatePattern = {_id : oid};
  update._id = oid;

  return db.connect(config.mongoURI)
  .then(function(){
    return db.update('products', updatePattern, update);
  })
  .then(function(numUpdated){
    db.close();
    return numUpdated;
  });
};

// returns product
exportFuns.getProduct = (productID)=>{
  let db = new Mongo;
  let oid = db.makeID(productID);
  let searchPattern = {_id : oid};
  return db.connect(config.mongoURI)
  .then(function(){
    return db.findOne('products', searchPattern);
  })
  .then(function(product){
    db.close();
    return product;
  });
};

// returns array of inventory lineitems
exportFuns.search = (pattern, sort)=>{
  let db = new Mongo;
  if(pattern._id){
    pattern._id = db.makeID(pattern._id);
  }

  return db.connect(config.mongoURI)
  .then(function(){
    return db.search('products', pattern, sort);
  })
  .then(function(prods){
    db.close();
    return prods;
  });
};

// returns number of products deleted
exportFuns.deleteProduct = (productID)=>{
  let db = new Mongo;
  let deletePattern = {_id : db.makeID(productID)};
  return db.connect(config.mongoURI)
  .then(function(){
    return db.delete('products', deletePattern);
  })
  .then(function(results){
    db.close();
    return results.ok;
  });
};

module.exports = exportFuns;
