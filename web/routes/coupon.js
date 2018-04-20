"use strict";

var express = require('express'),
    {coupon} = require('../controllers'),
    router = module.exports = express.Router();

router.get('/',coupon.web.get_coupon);
router.get('/edit/:coupon_id',coupon.web.edit);