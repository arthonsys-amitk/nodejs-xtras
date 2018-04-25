"use strict";

var express = require('express'),
    {services} = require('../controllers'),
    router = module.exports = express.Router();

router.get('/list_services', services.web.list_services);
router.get('/services/edit/:service_id', services.web.edit);
router.get('/transaction_list', services.web.transaction_list);
router.get('/view_transaction/:payment_id', services.web.view_transaction);
router.get('/create_service', services.web.create_service);
router.post('/services/post_service', services.web.post_service);
