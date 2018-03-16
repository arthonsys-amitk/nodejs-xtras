"use strict";
var _         = require('lodash'),
    {purchase} = require('../models'),
    product = require('./product'),
    mail = require('./mail'),
    config = require('../../config'),
    jwt = require('jwt-simple'),
    exportFuns = {},
    fs = require('fs'),
    moment = require('moment'),
    creditCardType = require('credit-card-type'),
    web = {},
    orderNumberMasterFile = '../../config/order-number.txt';

// create purchase
exportFuns.createPurchase = (objPurchase)=>{
  let useCC = objPurchase.ccNum;

  let newPurchase = {
    firstName : objPurchase.firstName,
    lastName : objPurchase.lastName,
    email : objPurchase.email,
    company : objPurchase.company || null,
    street1 : objPurchase.street1,
    city : objPurchase.city,
    state : objPurchase.state,
    postalCode : objPurchase.postalCode,
    country : objPurchase.country,
    paymentType : objPurchase.paymentType,
    ccNum : cleanCC(objPurchase.ccNum),
    ccExpMonth : objPurchase.ccExpMonth,
    ccExpYear : objPurchase.ccExpYear,
    ccType : objPurchase.ccType
  };
  newPurchase.cart = [];

  _.forEach(objPurchase.cart, (lineItem)=>{
    let newItem = {};
    newItem.productID = lineItem.productID;
    newItem.quantity = lineItem.quantity;
    newItem.activations = lineItem.activations || 0;
    newItem.productKey = lineItem.productKey || null;
    newItem.productKeyExpiration = lineItem.productKeyExpiration || null;
    newItem.transactionID = lineItem.transactionID || null;
    newItem.productName = lineItem.productName || null;
    newPurchase.cart.push(_.clone(newItem));
  });
  // TODO can we guarantee that all the product names got populated before this runs?
  return purchase.createPurchase(newPurchase);

};

// get a purchase
exportFuns.getPurchase = (purchaseID)=>{
  return purchase.getPurchase(purchaseID);
};

// get multiple purchases
exportFuns.search = (pattern, sort)=>{
  return purchase.search(pattern, sort);
};

// delete purchase
exportFuns.deletePurchase = (purchaseID)=>{
  return purchase.deletePurchase(purchaseID);
};

// update purchase
exportFuns.updatePurchase = (purchaseID, objPurchase)=>{
  return purchase.updatePurchase(purchaseID, objPurchase);
};

exportFuns.updateCustomerInfo = (purchaseID, objPurchase)=>{
  return purchase.updateCustomerInfo(purchaseID, objPurchase);
};

// get activation
exportFuns.getActivation = (productKey, machineCode)=>{
  return purchase.getActivation(productKey, machineCode);
};

// activate purchase
exportFuns.activate = (productKey, machineCode)=>{
  var purch = null;

  return exportFuns.search({productKey : productKey})
  .then(function(purches){
    if (purches == null){
      return {message : "Product Key not found"};
    } else {
      purch = purches[0];
    }

    let cartItem = null;
    // loop over products purchased and find the one we need
    for (let i = 0; i < purch.cart.length; i++){
      if (purch.cart[i]['productKey'] === productKey){
        cartItem = i;
        break;
      }
    }

    if (purch.cart[cartItem]['productKeyExpiration'] != null && moment(purch.cart[cartItem]['productKeyExpiration']).isBefore(moment())){
      return {message : "Product Key has expired"};
    }
    if (purch.cart[cartItem]['quantity'] - purch.cart[cartItem]['activations'] < 1){
      if (purch.cart[cartItem]['quantity'] > 1){
        return {message : "No available activations remaining"};
      } else {
        return {message : "Software is already activated"};
      }
    }

    return exportFuns.getActivation(productKey, machineCode)
    .then(function(activation){
      if (activation == null){
        purch.cart[cartItem]['activations'] = purch.cart[cartItem]['activations'] + 1;
        return exportFuns.updatePurchase(purch._id, purch)
        .then(function(){
          return purchase.activate(productKey, machineCode);
        })
      } else {
        return {message : "Product already activated for this machine"};
      }
    })
  })
};

// activate purchase
exportFuns.deActivate = (productKey, machineCode)=>{
  return purchase.getActivation(productKey, machineCode)
  .then (function(activation){
    if (activation){
      return exportFuns.search({productKey : productKey})
      .then(function(purch){

        let cartItem = null;
        // loop over products purchased and find the one we need
        for (let i = 0; i < purch[0].cart.length; i++){
          if (purch[0].cart[i]['productKey'] === productKey){
            cartItem = i;
            break;
          }
        }

        if (purch[0].cart[cartItem].activations > 0){
          purch[0].cart[cartItem].activations = purch[0].cart[cartItem].activations - 1;
          return exportFuns.updatePurchase(purch[0]._id, purch[0])
          .then(function(){
            return purchase.deActivate(productKey, machineCode);
          })
        }
      })
    } else {
      return {message : "Product could not be deactivated for this machine"};
    }
  })
};

// verify an email address has a valid, current purchase associated with it
exportFuns.verifyPurchaser = (email)=>{
  let retVal = false;

  let searchTerm = {
    email : email
  };
  return exportFuns.search(searchTerm)
  .then(function(res){
    if(res && res.length > 0){
      for (let i = 0; i < res.length; i++){
        for (let j = 0; j < res[i]['cart'].length; j++){
          let exp = moment(res[i]['cart'][j]['productKeyExpiration']);
          if (exp.isAfter(moment())){
            retVal = true;
            break;
          }
        }
        if (retVal){
          break;
        }
      }
    }

    return retVal;
  });
};

// retrieve the serial number associated with a license and send an email
exportFuns.retrieveLicense = (email)=>{
  let retVal = [];

  let searchTerm = {
    email : email
  };
  return exportFuns.search(searchTerm)
  .then(function(res){
    if (res && res.length > 0){
      for (let i = 0; i < res.length; i++){
        for (let j = 0; j < res[i]['cart'].length; j++){
          let exp = moment(res[i]['cart'][j]['productKeyExpiration']);
          if (exp.isAfter(moment())){
            let person = {
              productKey : res[i]['cart'][j]['productKey'],
              firstName : res[i]['firstName'],
              lastName : res[i]['lastName'],
              productName : res[i]['cart'][j]['productName']
            };

            retVal.push(_.clone(person));
          }
        }


      }
    }

    return retVal;
  });
};

// cancel subscription
exportFuns.cancelSub = (transactionID)=>{
  let cancelled = false;
  return exportFuns.search({"cart.transactionID" : transactionID})
  .then(function(purch){
    if(purch && purch.length > 0){

      let subID = transactionID;

      let ApiContracts = require('authorizenet').APIContracts;
      let ApiControllers = require('authorizenet').APIControllers;
      let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();

      merchantAuthenticationType.setName(config.authorizeNetLogin);
  	  merchantAuthenticationType.setTransactionKey(config.authorizeNetTransactionKey);

      let cancelRequest = new ApiContracts.ARBCancelSubscriptionRequest();
	    cancelRequest.setMerchantAuthentication(merchantAuthenticationType);
	    cancelRequest.setSubscriptionId(subID);

      let ctrl = new ApiControllers.ARBCancelSubscriptionController(cancelRequest.getJSON());
      if (config.useAuthorizeNetProduction){
        // set to production
        ctrl.setEnvironment(SDKConstants.endpoint.production);
      }

      return ctrl.execute(function(){

    		let apiResponse = ctrl.getResponse();
    		let response = new ApiContracts.ARBCancelSubscriptionResponse(apiResponse);

    		console.log(JSON.stringify(response, null, 2));

    		if(response != null){
    			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
    				console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
    				console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
            cancelled = true;
    			} else{
    				console.log('Result Code: ' + response.getMessages().getResultCode());
    				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
    				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
    			}
    		} else{
    			console.log('Null Response.');
    		}
    		resolve(cancelled);
    	});
    }
  });
};

// get subscription status
// TODO - support cart
exportFuns.getSubStatus = (purchaseID)=>{
  let status = 'Status not available';
  return exportFuns.getPurchase(purchaseID)
  .then(function(purch){
    if(purch){
      let subID = purch.transactionID;

      let ApiContracts = require('authorizenet').APIContracts;
      let ApiControllers = require('authorizenet').APIControllers;
      let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();

      merchantAuthenticationType.setName(config.authorizeNetLogin);
  	  merchantAuthenticationType.setTransactionKey(config.authorizeNetTransactionKey);

      let getRequest = new ApiContracts.ARBGetSubscriptionStatusRequest();
	    getRequest.setMerchantAuthentication(merchantAuthenticationType);
	    getRequest.setSubscriptionId(subID);

      let ctrl = new ApiControllers.ARBGetSubscriptionStatusController(getRequest.getJSON());
      if (config.useAuthorizeNetProduction){
        // set to production
        ctrl.setEnvironment(SDKConstants.endpoint.production);
      }

      return ctrl.execute(function(){

    		let apiResponse = ctrl.getResponse();
    		let response = new ApiContracts.ARBGetSubscriptionStatusResponse(apiResponse);

    		console.log(JSON.stringify(response, null, 2));

    		if(response != null){
    			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
            console.log('Status : ' + response.getStatus());
				    console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
				    console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
            status = response.getStatus();
    			} else{
    				console.log('Result Code: ' + response.getMessages().getResultCode());
    				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
    				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
    			}
    		} else{
    			console.log('Null Response.');
    		}
    		resolve(status);
    	});
    }
  });
};

// get subscription transactions
// TODO - support cart
exportFuns.getSubTransactions = (purchaseID)=>{
  let transactions = [];
  return exportFuns.getPurchase(purchaseID)
  .then(function(purch){
    if(purch){
      let subID = purch.transactionID;

      let ApiContracts = require('authorizenet').APIContracts;
      let ApiControllers = require('authorizenet').APIControllers;
      let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();

      merchantAuthenticationType.setName(config.authorizeNetLogin);
  	  merchantAuthenticationType.setTransactionKey(config.authorizeNetTransactionKey);

      let getRequest = new ApiContracts.ARBGetSubscriptionRequest();
	    getRequest.setMerchantAuthentication(merchantAuthenticationType);
	    getRequest.setSubscriptionId(subID);
      getRequest.setIncludeTransactions(true);

      let ctrl = new ApiControllers.ARBGetSubscriptionController(getRequest.getJSON());
      if (config.useAuthorizeNetProduction){
        // set to production
        ctrl.setEnvironment(SDKConstants.endpoint.production);
      }

      return ctrl.execute(function(){

    		let apiResponse = ctrl.getResponse();
    		let response = new ApiContracts.ARBGetSubscriptionResponse(apiResponse);

    		console.log(JSON.stringify(response, null, 2));

    		if(response != null){
    			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
            console.log('Subscription Name : ' + response.getSubscription().getName());
				    console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
				    console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
            transactions = response.getArbTransactions();
    			} else{
    				console.log('Result Code: ' + response.getMessages().getResultCode());
    				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
    				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
    			}
    		} else{
    			console.log('Null Response.');
    		}
    		resolve(transactions);
    	});
    }
  });
};

// get all expired licenses
exportFuns.getExpiredLicenses = ()=>{
  let today = moment().toDate();
  let startDate = moment().subtract(config.checkExpiredLicenseDays, 'days').toDate();
  return purchase.search({"cart.productKeyExpiration" : {"$lte" : today, "$gt" : startDate}});
};

// update all expired licenses that should be updated
// TODO - support cart
exportFuns.fixLicenses = ()=>{
  exportFuns.getExpiredLicenses()
  .then (function(licenses){
    _.forEach(licenses, function (license){
      exportFuns.getSubStatus(license.transactionID)
      .then(function(status){
        if (status == 'active'){
          // TODO update expiration date of subscription
        }
      })
    });
  });

};

// generate key
var genKey = ()=>{
  let keys = [];
  let chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',0,1,2,3,4,5,6,7,8,9,'@','!','*']
  for (var i = 0; i < 7; i++){
    keys.push(_.sampleSize(chars, 4).join(''));
  }
  return keys.join('-');
};

var validateCCOnce = (ccNum, ccExpMonth, ccExpYear, ccCVC, req, prod)=>{
  let validated = false;
  let now = moment();
  if (ccExpYear < now.year() || (ccExpYear == now.year() && ccExpMonth < now.month() + 1)){
    return validated;
  }
  // date valid, now validate card
  if (ccNum == config.testCCNum && ccCVC == config.testCCCVC && (req.hostname.indexOf('test') !== -1 || req.url.indexOf('test') !== -1 || req.headers.referer.indexOf('test') !== -1)){
    // test card being used in test store
    validated = true;
  } else {
    // process card
    let ApiContracts = require('authorizenet').APIContracts;
    let ApiControllers = require('authorizenet').APIControllers;
    let SDKConstants = require('authorizenet').Constants;
    let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();

    merchantAuthenticationType.setName(config.authorizeNetLogin);
	  merchantAuthenticationType.setTransactionKey(config.authorizeNetTransactionKey);

    let creditCard = new ApiContracts.CreditCardType();
	  creditCard.setCardNumber(ccNum);
	  creditCard.setExpirationDate(`${ccExpMonth}${ccExpYear}`);
	  creditCard.setCardCode(ccCVC);

    let paymentType = new ApiContracts.PaymentType();
	  paymentType.setCreditCard(creditCard);

    let orderDetails = new ApiContracts.OrderType();
    fs.readFile(orderNumberMasterFile, 'utf8', function (err, data) {
        if (err) throw err;
        let newOrderNumber = parseInt(data) + 1;
        orderDetails.setInvoiceNumber(newOrderNumber);
        //Do your processing, MD5, send a satellite to the moon, etc.
        fs.writeFile (orderNumberMasterFile, newOrderNumber, function(err) {
            if (err) throw err;
        });
    });

	  orderDetails.setDescription(prod.description);

    let tax = new ApiContracts.ExtendedAmountType();
	  tax.setAmount('0');
	  tax.setName('tax');
	  tax.setDescription('Tax');

    let shipping = new ApiContracts.ExtendedAmountType();
	  shipping.setAmount('0');
	  shipping.setName('shipping');
	  shipping.setDescription('no shipping');

    let billTo = new ApiContracts.CustomerAddressType();
	  billTo.setFirstName(req.body.firstName);
	  billTo.setLastName(req.body.lastName);
	  billTo.setCompany(req.body.company);
	  billTo.setAddress(req.body.street1);
	  billTo.setCity(req.body.city);
	  billTo.setState(req.body.state);
	  billTo.setZip(req.body.postalCode);
	  billTo.setCountry(req.body.country);

    let shipTo = new ApiContracts.CustomerAddressType();
	  shipTo.setFirstName(req.body.firstName);
	  shipTo.setLastName(req.body.lastName);
	  shipTo.setCompany('TO DO');
	  shipTo.setAddress(req.body.street1);
	  shipTo.setCity(req.body.city);
	  shipTo.setState(req.body.state);
	  shipTo.setZip(req.body.postalCode);
	  shipTo.setCountry(req.body.country);

    let lineItem_id1 = new ApiContracts.LineItemType();
	  lineItem_id1.setItemId(req.body.productID);
	  lineItem_id1.setName(prod.name);
	  lineItem_id1.setDescription(prod.description);
	  lineItem_id1.setQuantity(req.body.quantity);
	  lineItem_id1.setUnitPrice(prod.price);

    let lineItemList = [];
	  lineItemList.push(lineItem_id1);

    let lineItems = new ApiContracts.ArrayOfLineItem();
	  lineItems.setLineItem(lineItemList);

    let transactionSetting1 = new ApiContracts.SettingType();
	  transactionSetting1.setSettingName('duplicateWindow');
	  transactionSetting1.setSettingValue('120');

	  let transactionSetting2 = new ApiContracts.SettingType();
	  transactionSetting2.setSettingName('recurringBilling');
	  transactionSetting2.setSettingValue('false');

	  let transactionSettingList = [];
	  transactionSettingList.push(transactionSetting1);
	  transactionSettingList.push(transactionSetting2);

	  let transactionSettings = new ApiContracts.ArrayOfSetting();
	  transactionSettings.setSetting(transactionSettingList);

    let transactionRequestType = new ApiContracts.TransactionRequestType();
	  transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
	  transactionRequestType.setPayment(paymentType);
	  transactionRequestType.setAmount(prod.price * req.body.quantity);
	  transactionRequestType.setLineItems(lineItems);
	  transactionRequestType.setOrder(orderDetails);
	  transactionRequestType.setTax(tax);
	  transactionRequestType.setShipping(shipping);
	  transactionRequestType.setBillTo(billTo);
	  transactionRequestType.setShipTo(shipTo);
	  transactionRequestType.setTransactionSettings(transactionSettings);

    let createRequest = new ApiContracts.CreateTransactionRequest();
	  createRequest.setMerchantAuthentication(merchantAuthenticationType);
	  createRequest.setTransactionRequest(transactionRequestType);

    let ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
    if (config.useAuthorizeNetProduction){
      // set to production
      ctrl.setEnvironment(SDKConstants.endpoint.production);
    }

    return ctrl.execute(function(){
      let apiResponse = ctrl.getResponse();
		  let response = new ApiContracts.CreateTransactionResponse(apiResponse);

		  //pretty print response
		  console.log(JSON.stringify(response, null, 2));

      if(response != null){
  			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
  				if(response.getTransactionResponse().getMessages() != null){
  					console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
  					console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
  					console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
  					console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
            validated = response.getTransactionResponse().getTransId();

  				} else {
  					console.log('Failed Transaction.');
  					if(response.getTransactionResponse().getErrors() != null){
  						console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
  						console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
  					}
  				}
  			} else {
  				console.log('Failed Transaction. ');
  				if(response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null){
  					console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
  					console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
  				} else {
  					console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
  					console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
  				}
  			}
  		} else {
  			console.log('Null Response.');
  		}

      return validated;

    });
  }


};

var validateCCSub = (ccNum, ccExpMonth, ccExpYear, ccCVC, req, res, prod, item, purch, newPurchase)=>{

  let validated = false;
  let now = moment();
  if (ccExpYear < now.year() || (ccExpYear == now.year() && ccExpMonth < now.month() + 1)){
    return validated;
  }

  // date valid, now validate card
  if (ccNum == config.testCCNum && ccCVC == config.testCCCVC && (req.hostname.indexOf('test') !== -1 || req.url.indexOf('test') !== -1 )){
  // removed from conditional check: req.headers.referer.indexOf('test') !== -1
    // test card being used in test store

    validated = true;
    completeCCPurchase(item, prod, validated, purch, newPurchase, req, res);
    return validated;
  } else {

    // process card
    let ApiContracts = require('authorizenet').APIContracts;
    let ApiControllers = require('authorizenet').APIControllers;
    let SDKConstants = require('authorizenet').Constants;
    let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();

    merchantAuthenticationType.setName(config.authorizeNetLogin);
	  merchantAuthenticationType.setTransactionKey(config.authorizeNetTransactionKey);

    let interval = new ApiContracts.PaymentScheduleType.Interval();
    interval.setLength(prod.frequency);
    interval.setUnit(ApiContracts.ARBSubscriptionUnitEnum.MONTHS);

    let paymentScheduleType = new ApiContracts.PaymentScheduleType();
    paymentScheduleType.setInterval(interval);
    paymentScheduleType.setStartDate(new Date().toISOString().substring(0, 10));
    paymentScheduleType.setTotalOccurrences(9999);
    // one month trial
    paymentScheduleType.setTrialOccurrences(1);


    let creditCard = new ApiContracts.CreditCardType();
	  creditCard.setCardNumber(ccNum);
	  creditCard.setExpirationDate(`${ccExpMonth}${ccExpYear}`);
	  creditCard.setCardCode(ccCVC);

    let paymentType = new ApiContracts.PaymentType();
	  paymentType.setCreditCard(creditCard);

    let orderDetails = new ApiContracts.OrderType();
    fs.readFile(orderNumberMasterFile, 'utf8', function (err, data) {
        if (err) throw err;
        let newOrderNumber = parseInt(data) + 1;
        orderDetails.setInvoiceNumber(newOrderNumber);
        //Do your processing, MD5, send a satellite to the moon, etc.
        fs.writeFile (orderNumberMasterFile, newOrderNumber, function(err) {
            if (err) throw err;
        });
    });

	  orderDetails.setDescription(prod.description);

    let customer = new ApiContracts.CustomerType();
	  customer.setType(ApiContracts.CustomerTypeEnum.INDIVIDUAL);
	  //customer.setId(utils.getRandomString('Id'));
	  customer.setEmail(req.body.email);
	  //customer.setPhoneNumber('1232122122');
	  //customer.setFaxNumber('1232122122');
	  //customer.setTaxId('911011011');

    let nameAndAddressType = new ApiContracts.NameAndAddressType();
	  nameAndAddressType.setFirstName(req.body.firstName);
	  nameAndAddressType.setLastName(req.body.lastName);
	  nameAndAddressType.setCompany(req.body.company);
	  nameAndAddressType.setAddress(req.body.street1);
	  nameAndAddressType.setCity(req.body.city);
	  nameAndAddressType.setState(req.body.state);
	  nameAndAddressType.setZip(req.body.postalCode);
	  nameAndAddressType.setCountry(req.body.country);

    let arbSubscription = new ApiContracts.ARBSubscriptionType();
	  //arbSubscription.setName(utils.getRandomString('Name'));
	  arbSubscription.setPaymentSchedule(paymentScheduleType);
	  arbSubscription.setAmount(req.body.quantity * prod.price);
	 // arbSubscription.setTrialAmount(utils.getRandomAmount());
	  arbSubscription.setPayment(paymentType);
	  arbSubscription.setOrder(orderDetails);
	  arbSubscription.setCustomer(customer);
	  arbSubscription.setBillTo(nameAndAddressType);
	  arbSubscription.setShipTo(nameAndAddressType);


    let createRequest = new ApiContracts.ARBCreateSubscriptionRequest();
	  createRequest.setMerchantAuthentication(merchantAuthenticationType);
	  createRequest.setSubscription(arbSubscription);

    let ctrl = new ApiControllers.ARBCreateSubscriptionController(createRequest.getJSON());
    if (config.useAuthorizeNetProduction){
      // set to production
      ctrl.setEnvironment(SDKConstants.endpoint.production);
    }

    return ctrl.execute(function(){
      let apiResponse = ctrl.getResponse();
		  let response = new ApiContracts.ARBCreateSubscriptionResponse(apiResponse);

		  //pretty print response
		  console.log(JSON.stringify(response, null, 2));

      if(response != null){
  			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
  				console.log('Subscription Id : ' + response.getSubscriptionId());
  				console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
  				console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
          validated = response.getSubscriptionId();

          completeCCPurchase(item, prod, validated, purch, newPurchase, req, res);
          return validated;
  			} else {
  				console.log('Result Code: ' + response.getMessages().getResultCode());
  				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
  				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
  			}
  		} else {
  			console.log('Null Response.');
  		}

      return validated;

    });
  }
};

var cleanCC = (ccNum)=>{
  let newCC = `XXXX-XXXX-XXXX-${ccNum.slice(-4)}`;

  return newCC;
};

var completeCCPurchase = (item, prod, validatedCC, purch, newPurchase, req, res)=>{
  let newKey = genKey();
  let expDate = moment();

  item.productKey = newKey;
  // TODO - should this be the 30 day trial date and get updated via automated task?
  expDate.add(prod.licenseYears, 'years');
  expDate.add(prod.licenseMonths, 'months');
  expDate.add(prod.licenseWeeks, 'weeks');
  expDate.add(prod.licenseDays, 'days');
  item.productKeyExpiration = expDate.toDate();
  // add transaction ID to purchase
  item.transactionID = validatedCC;

  // replace purchase item with passed item
  for (let i = 0; i < purch.cart.length; i++){
    if (purch.cart[i]['productID'] == prod._id){
      purch.cart[i] = item;
      break;
    }
  }
  purchase.updatePurchase(purch._id, purch);

  if (req.body.sendClientEmail){
    mail.sendReceipt(newPurchase, item, prod);
  }

  if(prod.notificationEmail && prod.notificationEmail.length > 0){
    mail.sendNotificationEmail(newPurchase, prod);
  }

  //res.json(purch);
};

// web methods
web.createPurchase = (req, res)=>{

  if (! req.body.paymentType || _.trim(req.body.paymentType) == ''){
    req.body.paymentType = 'cc';
  }
  if (_.isNull(req.body.sendClientEmail) || _.isUndefined(req.body.sendClientEmail)){
    req.body.sendClientEmail = false;
  }

  let errors = [];
  if (! req.body.firstName || _.trim(req.body.firstName) == ''){
    errors.push("First name is Required");
  }
  if (! req.body.lastName || _.trim(req.body.lastName) == ''){
    errors.push("Last name is Required");
  }
  if (! req.body.email || _.trim(req.body.email) == ''){
    errors.push("Email is Required");
  }
  if (! req.body.street1 || _.trim(req.body.street1) == ''){
    errors.push("Street is Required");
  }
  if (! req.body.city || _.trim(req.body.city) == ''){
    errors.push("City is Required");
  }
  if (! req.body.state || _.trim(req.body.state) == ''){
    errors.push("State is Required");
  }
  if (! req.body.postalCode || _.trim(req.body.postalCode) == ''){
    errors.push("Postal Code is Required");
  }
  if (! req.body.country || _.trim(req.body.country) == ''){
    errors.push("Country is Required");
  }

  if (req.body.paymentType === 'cc'){
    if (! req.body.ccNum || _.trim(req.body.ccNum) == ''){
      errors.push("Credit Card Number is Required");
    }
    if (! req.body.ccExpMonth || _.trim(req.body.ccExpMonth) == ''){
      errors.push("Credit Card Month Expiration is Required");
    }
    if (! req.body.ccExpYear || _.trim(req.body.ccExpYear) == ''){
      errors.push("Credit Card Expiration Year is Required");
    }
    if (! req.body.ccCVC || _.trim(req.body.ccCVC) == ''){
      errors.push("Credit Card CVC Code is Required");
    }
  }

  if (! req.body.cart || req.body.cart.length == 0){
    errors.push("Shopping Cart is Required");
  }
/*
  if (! req.body.productID || _.trim(req.body.productID) == ''){
    errors.push("Product ID is Required");
  }
  if (! req.body.quantity || _.trim(req.body.quantity) == ''){
    errors.push("Quantity is Required");
  }
  */

  if(errors.length > 0){
    res.json({"message" : errors});
  }

  if (! req.body.company || _.trim(req.body.company) == ''){
    req.body.company = null;
  }

  let useCC = req.body.ccNum;
  let rightNow = moment();

  let newPurchase = {
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    company : req.body.company,
    email : req.body.email,
    street1 : req.body.street1,
    street2 : req.body.street2 || null,
    city : req.body.city,
    state : req.body.state,
    postalCode : req.body.postalCode,
    country : req.body.country,
    paymentType : req.body.paymentType,
    ccNum : cleanCC(req.body.ccNum),
    ccExpMonth : parseInt(req.body.ccExpMonth),
    ccExpYear : parseInt(req.body.ccExpYear),
    ccType : null,
    cart : []
  };

  _.forEach(req.body.cart, (item)=>{
      let prod = {};
      prod.productID = item.productID;
      prod.quantity = parseInt(item.quantity);
      prod.productName = item.productName || null;
      prod.activations = 0;
      prod.productKey = null;
      prod.productKeyExpiration = rightNow.toDate();
      newPurchase.cart.push(_.clone(prod));
  });

  exportFuns.createPurchase(newPurchase)
  .then(function(purch){
    switch(req.body.paymentType){
      case 'cc':
        let cardTypes = creditCardType(useCC);
        if(cardTypes.length > 0){
          purch.ccType = cardTypes[0].niceType;
        }
      break;
    }

    _.forEach(purch.cart, (item)=>{
      product.getProduct(item.productID)
      .then(function(prod){
        let expDate = moment();
        let newKey = null;

        if (prod){
          switch(req.body.paymentType){
            case 'cc':
              return validateCCSub(useCC, purch.ccExpMonth, purch.ccExpYear, req.body.ccCVC, req, res, prod, item, purch, newPurchase);
              //let validatedCC = validateCCSub(useCC, purch.ccExpMonth, purch.ccExpYear, req.body.ccCVC, req, prod, item, purch, newPurchase);

              //if (validatedCC){
                /*
                newKey = genKey();
                item.productKey = newKey;
                // TODO - should this be the 30 day trial date and get updated via automated task?
                expDate.add(prod.licenseYears, 'years');
                expDate.add(prod.licenseMonths, 'months');
                expDate.add(prod.licenseWeeks, 'weeks');
                expDate.add(prod.licenseDays, 'days');
                item.productKeyExpiration = expDate.toDate();
                // add transaction ID to purchase
                item.transactionID = validatedCC;

                // TODO should I move this line outside the for-each loop
                purchase.updatePurchase(purch._id, purch);

                if (req.body.sendClientEmail){
                  mail.sendReceipt(newPurchase, item, prod);
                }

                if(prod.notificationEmail && prod.notificationEmail.length > 0){
                  mail.sendNotificationEmail(newPurchase, prod);
                }
                //res.json(purch);
                */
            //  } else {
            //    res.json({"message" : ['Failure to validate credit card']});
            //  }
            //  res.json(purch);
            break;

            case 'comp1':
              newKey = genKey();
              item.productKey = newKey;
              expDate.add(1, 'years');
              item.productKeyExpiration = expDate.toDate();
              item.transactionID = 'complimentary 1 year';

              purchase.updatePurchase(purch._id, purch);
              if (req.body.sendClientEmail){
                mail.sendReceipt(newPurchase, prod);
              }
              if(prod.notificationEmail && prod.notificationEmail.length > 0){
                mail.sendNotificationEmail(newPurchase, prod);
              }
            break;

            case 'comp5':
              newKey = genKey();
              item.productKey = newKey;
              expDate.add(5, 'years');
              item.productKeyExpiration = expDate.toDate();
              item.transactionID = 'complimentary 5 years';

              purchase.updatePurchase(purch._id, purch);
              if (req.body.sendClientEmail){
                mail.sendReceipt(newPurchase, prod);
              }
              if(prod.notificationEmail && prod.notificationEmail.length > 0){
                mail.sendNotificationEmail(newPurchase, prod);
              }
            break;

            case 'tester':
              newKey = genKey();
              item.productKey = newKey;
              expDate.add(2, 'months');
              item.productKeyExpiration = expDate.toDate();
              item.transactionID = 'tester';

              purchase.updatePurchase(purch._id, purch);
              if (req.body.sendClientEmail){
                mail.sendReceipt(newPurchase, prod);
              }
              if(prod.notificationEmail && prod.notificationEmail.length > 0){
                mail.sendNotificationEmail(newPurchase, prod);
              }
            break;
          } // end switch
        } // end if
      }); // end then
    }); // end for-each

    res.json(purch);
  }); // end create purchase then
}; // end function

web.getPurchase = (req, res)=>{
  if (! req.params.purchaseID || _.trim(req.params.purchaseID) == ''){
    res.json({
      "message": "Purchase ID Required"
    });
  }

  exportFuns.getPurchase(req.params.purchaseID)
  .then(function(purch){
    res.json(purch);
  });
};

web.verifyPurchaser = (req, res)=>{
  if (! req.body.email || _.trim(req.body.email) == ''){
    res.json({
      "message": "Email Required"
    });
  }

  exportFuns.verifyPurchaser(_.trim(req.body.email))
  .then(function(isOK){
    res.json(isOK);
  });
};

web.retrieveLicense = (req, res)=>{
  if (! req.body.email || _.trim(req.body.email) == ''){
    res.json({
      "message": "Email Required"
    });
  }

  exportFuns.retrieveLicense(_.trim(req.body.email))
  .then(function(licenses){
    for (let i = 0; i < licenses.length; i++){
      // send mail for this license
      // TODO get lost license help text from product
      product.getProduct(licenses[i]['productID'])
      .then((prod)=>{
        mail.sendLostLicense(req.body.email, licenses[i]['productKey'], licenses[i]['firstName'] + ' ' + licenses[i]['lastName'], licenses[i]['productName'], prod.lostLicenseHelp);
      })
    }
  });
};

web.deletePurchase = (req, res)=>{
  if (! req.body._id || _.trim(req.body._id) == ''){
    res.json({
      "message": "Purchase ID Required"
    });
  }

  exportFuns.deletePurchase(req.body._id)
  .then(function(purch){
    res.json(purch);
  })
};

web.cancelSub = (req, res)=>{
  if (! req.body.transactionID || _.trim(req.body.transactionID) == ''){
    res.json({
      "message": "Transaction ID Required"
    });
  }

  exportFuns.cancelSub(_.trim(req.body.transactionID))
  .then(function(cancelled){
    res.json(cancelled);
  });
};

web.getSubStatus = (req, res)=>{
  if (! req.params.purchaseID || _.trim(req.params.purchaseID) == ''){
    res.json({
      "message": "Purchase ID Required"
    });
  }

  exportFuns.getSubStatus(_.trim(req.params.purchaseID))
  .then(function(status){
    res.json(status);
  });
};

web.updatePurchase = (req, res)=>{
  if (! req.body.paymentType || _.trim(req.body.paymentType) == ''){
    req.body.paymentType = 'cc';
  }

  let errors = [];
  if (! req.body._id || _.trim(req.body._id) == ''){
    errors.push("Purchase ID is Required");
  }
  if (! req.body.firstName || _.trim(req.body.firstName) == ''){
    errors.push("First name is Required");
  }
  if (! req.body.lastName || _.trim(req.body.lastName) == ''){
    errors.push("Last name is Required");
  }
  if (! req.body.email || _.trim(req.body.email) == ''){
    errors.push("Email is Required");
  }
  if (! req.body.street1 || _.trim(req.body.street1) == ''){
    errors.push("Street is Required");
  }
  if (! req.body.city || _.trim(req.body.city) == ''){
    errors.push("City is Required");
  }
  if (! req.body.state || _.trim(req.body.state) == ''){
    errors.push("State is Required");
  }
  if (! req.body.postalCode || _.trim(req.body.postalCode) == ''){
    errors.push("Postal Code is Required");
  }
  if (! req.body.country || _.trim(req.body.country) == ''){
    errors.push("Country is Required");
  }
  if (req.body.paymentType === 'cc'){
    if (! req.body.ccNum || _.trim(req.body.ccNum) == ''){
      errors.push("Credit Card Number is Required");
    }
    if (! req.body.ccExpMonth || _.trim(req.body.ccExpMonth) == ''){
      errors.push("Credit Card Month Expiration is Required");
    }
    if (! req.body.ccExpYear || _.trim(req.body.ccExpYear) == ''){
      errors.push("Credit Card Expiration Year is Required");
    }

  }
  if (! req.body.cart || req.body.cart.length == 0){
    errors.push("Cart is Required");
  }
  /*
  if (! req.body.productID || _.trim(req.body.productID) == ''){
    errors.push("Product ID is Required");
  }
  if (! req.body.quantity || _.trim(req.body.quantity) == ''){
    errors.push("Quantity is Required");
  }
  */
  if(errors.length > 0){
    res.json({"message" : errors});
  }

  let newPurchase = {
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    company : req.body.company || null,
    email : req.body.email,
    street1 : req.body.street1,
    street2 : req.body.street2 || null,
    city : req.body.city,
    state : req.body.state,
    postalCode : req.body.postalCode,
    country : req.body.country,
    ccNum : cleanCC(req.body.ccNum),
    ccExpMonth : parseInt(req.body.ccExpMonth),
    ccExpYear : parseInt(req.body.ccExpYear),
    ccType : req.body.ccType || null,
    cart : req.body.cart
  };

  exportFuns.updatePurchase(req.body._id, newPurchase)
  .then(function(purch){
    res.json(purch);
  })
};

web.updateCustomerInfo = (req, res)=>{
  console.log("jfdhjgfhs");
  let errors = [];
  if (! req.body._id || _.trim(req.body._id) == ''){
    errors.push("Purchase ID is Required");
  }
  if (! req.body.firstName || _.trim(req.body.firstName) == ''){
    errors.push("First name is Required");
  }
  if (! req.body.lastName || _.trim(req.body.lastName) == ''){
    errors.push("Last name is Required");
  }
  if (! req.body.email || _.trim(req.body.email) == ''){
    errors.push("Email is Required");
  }
  if (! req.body.street1 || _.trim(req.body.street1) == ''){
    errors.push("Street is Required");
  }
  if (! req.body.city || _.trim(req.body.city) == ''){
    errors.push("City is Required");
  }
  if (! req.body.state || _.trim(req.body.state) == ''){
    errors.push("State is Required");
  }
  if (! req.body.postalCode || _.trim(req.body.postalCode) == ''){
    errors.push("Postal Code is Required");
  }
  if (! req.body.country || _.trim(req.body.country) == ''){
    errors.push("Country is Required");
  }

  /*
  if (! req.body.productID || _.trim(req.body.productID) == ''){
    errors.push("Product ID is Required");
  }
  if (! req.body.quantity || _.trim(req.body.quantity) == ''){
    errors.push("Quantity is Required");
  }
  */
  if(errors.length > 0){
    res.json({"message" : errors});
  }

  let newPurchase = {
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    company : req.body.company || null,
    email : req.body.email,
    street1 : req.body.street1,
    street2 : req.body.street2 || null,
    city : req.body.city,
    state : req.body.state,
    postalCode : req.body.postalCode,
    country : req.body.country,

  };



  exportFuns.updateCustomerInfo(req.body._id, newPurchase)
  .then(function(purch){
    res.json(purch);
  })

};

web.search = (req, res)=>{
  exportFuns.search(req.body)
  .then(function(purchases){
    res.json(purchases);
  })
};

web.activate = (req, res)=>{
  let errors = [];
  if (! req.body.productKey || _.trim(req.body.productKey) == ''){
    errors.push("Product Key is Required");
  }
  if (! req.body.machineCode || _.trim(req.body.machineCode) == ''){
    errors.push("Machine Code is Required");
  }

  if(errors.length > 0){
    res.json({"message" : errors});
  }

  exportFuns.activate(req.body.productKey, req.body.machineCode)
  .then(function(act){
    res.json(act);
  });
};

web.deActivate = (req, res)=>{
  let errors = [];
  if (! req.body.productKey || _.trim(req.body.productKey) == ''){
    errors.push("Product Key is Required");
  }
  if (! req.body.machineCode || _.trim(req.body.machineCode) == ''){
    errors.push("Machine Code is Required");
  }

  if(errors.length > 0){
    res.json({"message" : errors});
  }
  exportFuns.deActivate(req.body.productKey, req.body.machineCode)
  .then(function(act){
    res.json(act);
  });
};

web.getStatus = (req, res)=>{
  let errors = [];
  if (! req.body.productKey || _.trim(req.body.productKey) == ''){
    errors.push("Product Key is Required");
  }
  if (! req.body.machineCode || _.trim(req.body.machineCode) == ''){
    errors.push("Machine Code is Required");
  }
  if(errors.length > 0){
    res.json({"message" : errors});
  }

  exportFuns.search({productKey : req.body.productKey})
  .then(function(purch){
    if (purch == null || purch.length == 0){
      res.json({message : "Product Key is invalid"});
    } else {
      // get item from cart
      let theItem = null;

      for (let i = 0; i < purch[0].cart.length; i++){
        if (purch[0].cart[i]['productKey'] = req.body.productKey){
          theItem = purch[0].cart[i];
          break;
        }
      }
      if (theItem.productKeyExpiration != null && moment(theItem.productKeyExpiration).isBefore(moment())){
        res.json({message : "Product Key has expired"});
      }

      exportFuns.getActivation(theItem.productKey, req.body.machineCode)
      .then(function(activation){
        if (activation == null){
          if (theItem.activations === theItem.quantity){
            res.json({message : "Product Key not activated - no activations available"});
          }
          res.json({message : "Product Key not activated yet"});
        } else {
          res.json({message : "Product key is activated for this machine"});
        }
      })
    }
  })
};

web.getCompanyAndName = (req, res)=>{
  let errors = [];
  let registrant = {name:null, company:null};
  if (! req.body.productKey || _.trim(req.body.productKey) == ''){
    errors.push("Product Key is Required");
  }
  if(errors.length > 0){
    res.json({"message" : errors});
  }

  exportFuns.search({productKey : req.body.productKey})
  .then(function(purch){
    if (purch && purch.length > 0){
      registrant.name = purch[0]['firstName'] + ' ' + purch[0]['lastName'];
      registrant.company = purch[0]['company'];
    }
    res.json(registrant);
  })
};

web.getExpiration = (req, res)=>{
  let errors = [];
  let expDate = null;

  if (! req.body.productKey || _.trim(req.body.productKey) == ''){
    errors.push("Product Key is Required");
  }
  if(errors.length > 0){
    res.json({"message" : errors});
  }

  exportFuns.search({productKey : req.body.productKey})
  .then(function(purch){
    if (purch && purch.length > 0){
      for (let i = 0; i < purch[0]['cart'].length; i++){
        if (purch[0]['cart'][i]['productKey'] === req.body.productKey){
          expDate = purch[0]['cart'][i]['productKeyExpiration'];
          break;
        }
      }
    }
    res.json(expDate);
  })

};

web.xOfy = (req, res)=>{

  let errors = [];
  if (! req.body.productKey || _.trim(req.body.productKey) == ''){
    errors.push("Product Key is Required");
  }
  if (! req.body.value || _.trim(req.body.value) == ''){
    errors.push("Value to Retrieve is Required");
  }

  if(errors.length > 0){
    res.json({"message" : errors});
  }

  exportFuns.search({productKey : productKey})
  .then(function(purchases){
    if (! purchases || purchases.length === 0){
      res.json({"message" : ["License Key not Found"]});
    }
    for (let i = 0; i < purchases[0]['cart'].length; i++){
      if (purchases[0]['cart'][i]['productKey'] === req.body.productKey){
        let z = purchases[0]['cart'][i]['quantity'] - purchases[0]['cart'][i]['activations'];
        let y = purchases[0]['cart'][i]['quantity'];
        let x = purchases[0]['cart'][i]['activations'];
        let retVal = null;
        switch(req.body.value){
          case 'remaining':
            retVal = x;
          break;
          case 'used':
            retVal = z;
          break;
          case 'total':
            retVal = y;
          break;
          default:
            retVal = 'Please pass remaining, used, or total as the value to retrieve';
          break;
        }
        res.json(retVal);
        break;
      }
    }
  })
}

exportFuns.web = web;
module.exports = exportFuns;
