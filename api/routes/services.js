"use strict";

var express = require('express'),
    {auth} = require('../controllers'),
    {user} = require('../controllers'),
    {services} = require('../controllers'),
    router = module.exports = express.Router();

router.post('/post_service', services.api.post_service);
router.post('/add_appointments', services.api.add_appointments);
router.post('/get_appointments', services.api.get_appointments);
router.post('/add_review', services.api.add_review);

