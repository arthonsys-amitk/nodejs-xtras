"use strict";

var express = require('express'),
    web = require('../controllers').purchase.web,
    router = module.exports = express.Router();

router.post('/', web.createPurchase);
router.get('/:purchaseID', web.getPurchase);
router.post('/search', web.search);
router.put('/', web.updatePurchase);
router.delete('/', web.deletePurchase);
router.post('/test', web.createPurchase);
router.post('/activate', web.activate);
router.post('/deactivate', web.deActivate);
router.post('/status', web.getStatus);
router.post('/verifyPurchaser', web.verifyPurchaser);
router.post('/retrieveLicense', web.retrieveLicense);
router.post('/cancelSubscription', web.cancelSub);
router.get('/subscriptionStatus/:purchaseID', web.getSubStatus);
router.put('/customer', web.updateCustomerInfo);
router.post('/xOfy', web.xOfy);
router.post('/getCompanyAndName', web.getCompanyAndName);
router.post('/getExpiration', web.getExpiration);
