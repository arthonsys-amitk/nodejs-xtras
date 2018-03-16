"use strict";
var _         = require('lodash'),
    config = require('../../config'),
    {product} = require('../models'),
    exportFuns = {},
    web = {};

// create product
exportFuns.createProduct = (objProduct)=>{
  let newProduct = {
    name : objProduct.name,
    description : objProduct.description || null,
    image : objProduct.image || null,
    downloadable : objProduct.downloadable || false,
    url : objProduct.url || null,
    price : objProduct.price || 0,
    version : objProduct.version || null,
    licenseDays : objProduct.licenseDays || 0,
    licenseWeeks : objProduct.licenseWeeks || 0,
    licenseMonths : objProduct.licenseMonths || 0,
    licenseYears : objProduct.licenseYears || 0,
    frequency : objProduct.frequency || 0,
    notificationEmail : objProduct.notificationEmail || null,

    lostLicenseHelp : objProduct.lostLicenseHelp || null,

    installationText : objProduct.installationText || null

  };

  return product.createProduct(newProduct);
};

// get a product
exportFuns.getProduct = (productID)=>{
  return product.getProduct(productID);
};

// get multiple products
exportFuns.search = (pattern, sort)=>{
  return product.search(pattern, sort);
};

// delete product
exportFuns.deleteProduct = (productID)=>{
  return product.deleteProduct(productID);
};

// update product
exportFuns.updateProduct = (productID, objProduct)=>{
  return product.updateProduct(productID, objProduct);
};

// get current version for a product by name
exportFuns.getCurrentVersion = (prodName)=>{
  return product.search({name:prodName})
  .then(function(prod){
    if (prod.length > 0){
      return prod[0]['version'];
    }
    return 0;
  });
};

// web methods
web.createProduct = (req, res)=>{

  let newProduct = {
    name : _.trim(req.body.name),
    description : _.trim(req.body.description) || null,
    downloadable : req.body.downloadable || false,
    image : req.body.image || null,
    url : _.trim(req.body.url) || null,
    price : req.body.price || 0,
    version : _.trim(req.body.version) || null,
    licenseDays : req.body.licenseDays || 0,
    licenseWeeks : req.body.licenseWeeks || 0,
    licenseMonths : req.body.licenseMonths || 0,
    licenseYears : req.body.licenseYears || 0,
    frequency : req.body.frequency || 0,
    notificationEmail : req.body.notificationEmail || null,
    lostLicenseHelp : req.body.lostLicenseHelp || null,
    installationText : req.body.installationText || null
  };

  exportFuns.createProduct(newProduct)
  .then(function(prod){
    res.json(prod);
  });

};

web.getProduct = (req, res)=>{
  if (! req.params.productID || _.trim(req.params.productID) == ''){
    res.json({
      "message": "Product ID Required"
    });
  }
  exportFuns.getProduct(req.params.productID)
  .then(function(prod){
    res.json(prod);
  });
};

web.deleteProduct = (req, res)=>{
  if (! req.body._id || _.trim(req.body._id) == ''){
    res.json({
      "message": "Product ID Required"
    });
  }

  exportFuns.deleteProduct(req.body._id)
  .then(function(prod){
    res.json(prod);
  })
};

web.updateProduct = (req, res)=>{

  let errors = [];
  if (! req.body._id || _.trim(req.body._id) == ''){
    errors.push("Product ID Required");
  }
  if (! req.body.name || _.trim(req.body.name) == ''){
    errors.push("Product Name Required");
  }
  if(errors.length > 0)
  {
    res.json({"message" : errors});
    return false;
  }

  let newProduct = {
    name : _.trim(req.body.name),
    description : _.trim(req.body.description) || null,
    downloadable : req.body.downloadable || false,
    image : req.body.image || null,
    url : _.trim(req.body.url) || null,
    price : req.body.price || 0,
    version : _.trim(req.body.version) || null,
    licenseDays : req.body.licenseDays || 0,
    licenseWeeks : req.body.licenseWeeks || 0,
    licenseMonths : req.body.licenseMonths || 0,
    licenseYears : req.body.licenseYears || 0,
    frequency : req.body.frequency || 0,
    notificationEmail : req.body.notificationEmail || null,
    lostLicenseHelp : req.body.lostLicenseHelp || null,
    installationText : req.body.installationText || null

  };

  exportFuns.updateProduct(req.body._id, newProduct)
  .then(function(prod){
    res.json(prod);
  });
};

web.search = (req, res)=>{
  exportFuns.search(req.body)
  .then(function(products){
    res.json(products);
  })
};

web.getCurrentVersion = (req, res)=>{
  exportFuns.getCurrentVersion(req.params.prod)
  .then(function(version){
    res.json(version);
  })
};

exportFuns.web = web;
module.exports = exportFuns;
