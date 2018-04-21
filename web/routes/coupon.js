"use strict";

var express = require('express'),
    {coupon} = require('../controllers'),
    router = module.exports = express.Router();

router.get('/',coupon.web.get_coupon);
router.get('/edit/:coupon_id',coupon.web.edit);
router.get('/delete/:coupon_id',coupon.web.delete);
router.get('/create',coupon.web.create);
router.post('/add_coupon',coupon.web.add_coupon);
router.post('/update_coupon',coupon.web.update_coupon);
