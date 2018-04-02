"use strict";

var express = require('express'),
    {auth} = require('../controllers'),
    {user} = require('../controllers'),
    router = module.exports = express.Router();

router.post('/user_login', user.api.user_login);
router.post('/user_register', user.api.user_register);
router.post('/update_profile', user.api.update_profile);
router.post('/change_password', user.api.change_password);
router.post('/resend_otp', user.api.resend_otp);
router.post('/verify_otp', user.api.verify_otp);
router.post('/update_forgot_password', user.api.update_forgot_password);
router.post('/user_logout', user.api.user_logout);
router.post('/get_coupon', user.api.get_coupon);
router.post('/get_category', user.api.get_category);
router.post('/social_login', user.api.social_login);