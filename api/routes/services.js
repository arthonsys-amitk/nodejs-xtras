"use strict";

var express = require('express'),
    {auth} = require('../controllers'),
    {user} = require('../controllers'),
    {services} = require('../controllers'),
    router = module.exports = express.Router();

router.post('/post_service', services.api.post_service);
router.post('/add_appointments', services.api.add_appointments);
router.post('/get_appointments', services.api.get_appointments);
router.post('/cancel_appointment', services.api.cancel_appointment);
router.post('/confirm_appointment', services.api.confirm_appointment);
router.post('/get_payment_details', services.api.get_payment_details);
router.post('/reschedule_appointment', services.api.reschedule_appointment);
router.post('/add_review', services.api.add_review);
router.post('/get_posts', services.api.get_posts);
router.post('/get_payment_data', services.api.get_payment_data);

