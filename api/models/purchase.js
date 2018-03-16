"use strict";

var exportFuns = {},
    config     = require('../../config'),
    Mongo      = require('../../mongo');

// returns purchase that was created
exportFuns.createPurchase = (purchase)=>{
  let db = new Mongo;

  purchase.productID = db.makeID(purchase.productID);

  return db.connect(config.mongoURI)
  .then(function(){
    return db.insert('purchases', purchase);
  })
  .then(function(purch){
    db.close();
    return purch.ops[0];
  });
};

// returns number of purchases updated (should always be one)
exportFuns.updatePurchase = (purchaseID, update)=>{
  let db = new Mongo;
  let oid = db.makeID(purchaseID);
  let updatePattern = {_id : oid};
  update._id = oid;
  for (let i = 0; i < update.cart.length; i++){
    update.cart[i]['productID'] = db.makeID(update.cart[i]['productID']);
  }

  return db.connect(config.mongoURI)
  .then(function(){
    return db.update('purchases', updatePattern, update);
  })
  .then(function(numUpdated){
    db.close();
    return numUpdated;
  });
};

exportFuns.updateCustomerInfo = (purchaseID, update)=>{
  let db = new Mongo;
  let oid = db.makeID(purchaseID);
  let updatePattern = {_id : oid};
  update._id = oid;

  return db.connect(config.mongoURI)
  .then(function(){
    return db.update('purchases', updatePattern, update);
  })
  .then(function(numUpdated){
    db.close();
    return numUpdated;
  });
};

// returns purchase
exportFuns.getPurchase = (purchaseID)=>{
  let db = new Mongo;
  let oid = db.makeID(purchaseID);
  let searchPattern = {_id : oid};

  return db.connect(config.mongoURI)
  .then(function(){
    return db.findOne('purchases', searchPattern);
  })
  .then(function(purch){
    db.close();
    return purch;
  });
};

// returns array of purchases
exportFuns.search = (pattern, sort)=>{
  let db = new Mongo;
  if(pattern._id){
    pattern._id = db.makeID(pattern._id);
  }
  if(pattern.productID){
    pattern.productID = db.makeID(pattern.productID);
  }
  if(pattern.productKey){
    pattern = {"cart.productKey": pattern.productKey};
  }
  if(pattern.productName){
    pattern = {"cart.productName": pattern.productName};
  }

  return db.connect(config.mongoURI)
  .then(function(){
    return db.search('purchases', pattern, sort);
  })
  .then(function(purchases){
    db.close();
    return purchases;
  });
};

// returns number of purchases deleted
exportFuns.deletePurchase = (purchaseID)=>{
  let db = new Mongo;
  let oid = db.makeID(purchaseID);
  let deletePattern = {_id : oid};
  return db.connect(config.mongoURI)
  .then(function(){
    return exportFuns.getPurchase(purchaseID)
    .then(function(purch){
      if (purch){
        db.delete('activations', {productKey:purch.productKey});
      }

      return db.delete('purchases', deletePattern);
    })
  })
  .then(function(results){
    db.close();
    return results.ok;
  });
};

// returns activation
exportFuns.getActivation = (productKey, machineCode)=>{

  let db = new Mongo;
  let searchPattern = {productKey : productKey, machineCode : machineCode};

  return db.connect(config.mongoURI)
  .then(function(){
    return db.findOne('activations', searchPattern);
  })
  .then(function(act){
    db.close();
    return act;
  });
};

// returns activation that was created
exportFuns.activate = (productKey, machineCode)=>{
  let db = new Mongo;
  let activation = {
    productKey : productKey,
    machineCode : machineCode
  };
  return db.connect(config.mongoURI)
  .then(function(){
    return db.insert('activations', activation);
  })
  .then(function(act){
    db.close();
    return act.ops[0];
  });
};

// returns number of activations deleted
exportFuns.deActivate = (productKey, machineCode)=>{
  let db = new Mongo;

  let deletePattern = {
    productKey : productKey,
    machineCode : machineCode
  };
  return db.connect(config.mongoURI)
  .then(function(){
    return db.delete('activations', deletePattern);
  })
  .then(function(results){
    db.close();
    return results.ok;
  });
};

module.exports = exportFuns;
